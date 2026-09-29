#!/usr/bin/env node
/*
 * FDV-systemet – testmiljø for øvingsfagprøven i IT-utviklerfaget (Tindvik Eiendom AS).
 *
 * En liten webserver som etterligner API-et til FDV-systemet. Den har ingen avhengigheter
 * utover Node.js 18 eller nyere.
 *
 *   node fdv-mock.js [--port 8080] [--nokkel tindvik-test-2026] [--ustabil]
 *
 * Se README.md for bruk og openapi.yaml for den fullstendige API-spesifikasjonen.
 */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const VERSJON = '1.0.0';
const BASE = '/api/v1';
const STANDARD_ANTALL = 20;
const MAKS_ANTALL = 100;
const DATAMAPPE = path.join(__dirname, 'data');

// Andel kall som får 503 i ustabil modus, og hvor lenge klienten bes vente.
const USTABIL_FEILRATE = 0.25;
const RETRY_AFTER_SEKUNDER = 5;
const USTABIL_MAKS_FORSINKELSE_MS = 1200;

class ApiFeil extends Error {
  constructor(status, kode, melding, headere = {}) {
    super(melding);
    this.status = status;
    this.kode = kode;
    this.headere = headere;
  }
}

function skrivHjelp() {
  console.log(`FDV-systemet – testmiljø v${VERSJON}

Bruk: node fdv-mock.js [valg]

  --port <nummer>     Port å lytte på (standard 8080, eller miljøvariabelen PORT)
  --nokkel <nøkkel>   API-nøkkel som kreves (standard tindvik-test-2026, eller FDV_API_KEY)
  --ustabil           Simulerer et ustabilt API: omtrent hvert fjerde kall får 503
                      Service Unavailable, og svarene kommer med tilfeldig forsinkelse
  --hjelp             Viser denne teksten`);
}

function lesArgumenter(argv) {
  const valg = {
    port: Number(process.env.PORT) || 8080,
    nokkel: process.env.FDV_API_KEY || 'tindvik-test-2026',
    ustabil: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--port') valg.port = Number(argv[++i]);
    else if (arg === '--nokkel') valg.nokkel = argv[++i];
    else if (arg === '--ustabil') valg.ustabil = true;
    else if (arg === '--hjelp' || arg === '--help' || arg === '-h') {
      skrivHjelp();
      process.exit(0);
    } else {
      console.error(`Ukjent valg: ${arg}\n`);
      skrivHjelp();
      process.exit(1);
    }
  }
  if (!Number.isInteger(valg.port) || valg.port < 1 || valg.port > 65535) {
    console.error('Ugyldig port. Bruk et tall mellom 1 og 65535.');
    process.exit(1);
  }
  if (!valg.nokkel) {
    console.error('API-nøkkelen kan ikke være tom.');
    process.exit(1);
  }
  return valg;
}

// Datafilene leses ved hvert kall, slik at endringer i data/*.json gjelder uten omstart.
function lesData(filnavn) {
  try {
    const liste = JSON.parse(fs.readFileSync(path.join(DATAMAPPE, filnavn), 'utf8'));
    return liste.slice().sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  } catch (err) {
    throw new ApiFeil(500, 'INTERN_FEIL', `Kunne ikke lese testdata fra data/${filnavn}: ${err.message}`);
  }
}

function lesHeltall(query, navn, standard, min, maks) {
  const verdi = query.get(navn);
  if (verdi === null || verdi === '') return standard;
  if (!/^\d+$/.test(verdi) || Number(verdi) < min || Number(verdi) > maks) {
    const grense = maks === Infinity ? `fra og med ${min}` : `fra ${min} til ${maks}`;
    throw new ApiFeil(400, 'UGYLDIG_FORESPORSEL', `Parameteren ${navn} må være et heltall ${grense}.`);
  }
  return Number(verdi);
}

// Godtar ISO 8601 (f.eks. 2026-09-01T00:00:00Z eller 2026-09-01). Uten tidssone tolkes tidspunktet som UTC.
function lesTidspunkt(query, navn) {
  const verdi = query.get(navn);
  if (verdi === null || verdi === '') return null;
  if (/\d{2}:\d{2}(:\d{2}(\.\d+)?)? \d{2}:\d{2}$/.test(verdi)) {
    throw new ApiFeil(400, 'UGYLDIG_FORESPORSEL',
      `Ugyldig tidspunkt i ${navn}: «${verdi}». Tegnet + må URL-kodes som %2B.`);
  }
  const iso = /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/.exec(verdi);
  if (!iso) {
    throw new ApiFeil(400, 'UGYLDIG_FORESPORSEL',
      `Ugyldig tidspunkt i ${navn}: «${verdi}». Bruk ISO 8601, for eksempel 2026-09-01T00:00:00Z.`);
  }
  const harTid = Boolean(iso[2]);
  const harSone = Boolean(iso[5]);
  const ms = Date.parse(harTid && !harSone ? `${verdi}Z` : verdi);
  if (Number.isNaN(ms)) {
    throw new ApiFeil(400, 'UGYLDIG_FORESPORSEL', `Ugyldig tidspunkt i ${navn}: «${verdi}».`);
  }
  return ms;
}

function paginer(liste, query, sti) {
  const side = lesHeltall(query, 'side', 1, 1, Infinity);
  const antall = lesHeltall(query, 'antall', STANDARD_ANTALL, 1, MAKS_ANTALL);
  const totaltAntall = liste.length;
  const antallSider = Math.ceil(totaltAntall / antall);
  const lenke = (nySide) => {
    const q = new URLSearchParams(query);
    q.set('side', String(nySide));
    q.set('antall', String(antall));
    return `${sti}?${q.toString()}`;
  };
  return {
    data: liste.slice((side - 1) * antall, side * antall),
    paginering: {
      side,
      antallPerSide: antall,
      totaltAntall,
      antallSider,
      forrige: side > 1 ? lenke(side - 1) : null,
      neste: side < antallSider ? lenke(side + 1) : null,
    },
  };
}

function filtrerEndretEtter(liste, query) {
  const etter = lesTidspunkt(query, 'endretEtter');
  return etter === null ? liste : liste.filter((x) => Date.parse(x.sistEndret) > etter);
}

function finn(liste, id, hva) {
  const funnet = liste.find((x) => x.id === id);
  if (!funnet) throw new ApiFeil(404, 'IKKE_FUNNET', `Fant ikke ${hva} med id «${id}».`);
  return funnet;
}

function sjekkNokkel(req, riktigNokkel) {
  const mottatt = req.headers['x-api-key'];
  if (!mottatt) {
    throw new ApiFeil(401, 'MANGLER_NOKKEL', 'Mangler API-nøkkel. Send nøkkelen i headeren X-API-Key.');
  }
  const a = Buffer.from(String(mottatt));
  const b = Buffer.from(riktigNokkel);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new ApiFeil(401, 'UGYLDIG_NOKKEL', 'Ugyldig API-nøkkel.');
  }
}

function info() {
  return {
    navn: 'FDV-systemet – testmiljø',
    versjon: VERSJON,
    api: BASE,
    endepunkter: ['/bygg', '/bygg/{byggId}', '/bygg/{byggId}/rom', '/rom', '/rom/{romId}'],
    dokumentasjon: 'Se openapi.yaml og README.md',
  };
}

// Returnerer svaret for et API-kall, eller kaster ApiFeil.
function ruteApi(deler, query, sti) {
  if (deler[0] === 'bygg') {
    if (deler.length === 1) return paginer(filtrerEndretEtter(lesData('bygg.json'), query), query, sti);
    const bygg = finn(lesData('bygg.json'), deler[1], 'bygg');
    if (deler.length === 2) return bygg;
    if (deler.length === 3 && deler[2] === 'rom') {
      const rom = lesData('rom.json').filter((r) => r.byggId === bygg.id);
      return paginer(rom, query, sti);
    }
  } else if (deler[0] === 'rom') {
    if (deler.length === 1) {
      let rom = filtrerEndretEtter(lesData('rom.json'), query);
      const byggId = query.get('byggId');
      if (byggId) rom = rom.filter((r) => r.byggId === byggId);
      return paginer(rom, query, sti);
    }
    if (deler.length === 2) return finn(lesData('rom.json'), deler[1], 'rom');
  }
  throw new ApiFeil(404, 'IKKE_FUNNET', `Endepunktet ${sti} finnes ikke.`);
}

function send(res, status, kropp, headere = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headere,
  });
  res.end(JSON.stringify(kropp, null, 2));
}

function vent(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function lagServer(valg) {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const sti = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;
    let status = 500;
    try {
      if (req.method !== 'GET') {
        throw new ApiFeil(405, 'METODE_IKKE_TILLATT', 'API-et støtter bare GET.', { Allow: 'GET' });
      }
      if (sti === '/' || sti === BASE) {
        status = 200;
        return send(res, status, info());
      }
      if (!sti.startsWith(`${BASE}/`)) {
        throw new ApiFeil(404, 'IKKE_FUNNET', `Endepunktet ${sti} finnes ikke. API-et ligger under ${BASE}.`);
      }
      if (valg.ustabil) {
        await vent(Math.floor(Math.random() * USTABIL_MAKS_FORSINKELSE_MS));
        if (Math.random() < USTABIL_FEILRATE) {
          throw new ApiFeil(503, 'MIDLERTIDIG_UTILGJENGELIG',
            'FDV-systemet er midlertidig utilgjengelig. Prøv igjen senere.',
            { 'Retry-After': String(RETRY_AFTER_SEKUNDER) });
        }
      }
      sjekkNokkel(req, valg.nokkel);
      let deler;
      try {
        deler = sti.slice(BASE.length + 1).split('/').map((d) => decodeURIComponent(d));
      } catch {
        throw new ApiFeil(400, 'UGYLDIG_FORESPORSEL', 'Ugyldig URL-koding i adressen.');
      }
      const kropp = ruteApi(deler, url.searchParams, sti);
      status = 200;
      return send(res, status, kropp);
    } catch (err) {
      const feil = err instanceof ApiFeil
        ? err
        : new ApiFeil(500, 'INTERN_FEIL', 'Uventet feil i testmiljøet.');
      if (!(err instanceof ApiFeil)) console.error(err);
      status = feil.status;
      return send(res, status, { feil: { kode: feil.kode, melding: feil.message } }, feil.headere);
    } finally {
      console.log(`${new Date().toISOString()}  ${req.method} ${req.url}  ->  ${status}`);
    }
  });
}

if (require.main === module) {
  const valg = lesArgumenter(process.argv.slice(2));
  const server = lagServer(valg);
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${valg.port} er allerede i bruk. Start med for eksempel --port ${valg.port + 1}.`);
    } else {
      console.error(err);
    }
    process.exit(1);
  });
  server.listen(valg.port, () => {
    console.log(`FDV-systemet – testmiljø v${VERSJON}`);
    console.log(`Lytter på http://localhost:${valg.port}${BASE}`);
    console.log(`API-nøkkel: ${valg.nokkel} (sendes i headeren X-API-Key)`);
    console.log(`Ustabil modus: ${valg.ustabil ? 'PÅ – omtrent hvert fjerde kall får 503' : 'av'}`);
    console.log('Stopp med Ctrl+C\n');
  });
}

module.exports = { lagServer };
