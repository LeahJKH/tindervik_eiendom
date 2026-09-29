# FDV-systemet – testmiljø

Dette er et testmiljø for API-et til FDV-systemet (forvaltning, drift og vedlikehold)
hos Tindvik Eiendom AS. Det hører til øvingsfagprøven i IT-utviklerfaget, og lar deg
utvikle og teste integrasjonen mot FDV-systemet på din egen maskin.

## Innhold

| Fil              | Beskrivelse                                                   |
|------------------|---------------------------------------------------------------|
| `fdv-mock.js`    | Selve testmiljøet – en liten webserver uten avhengigheter      |
| `openapi.yaml`   | Den fullstendige API-spesifikasjonen (OpenAPI 3.0)             |
| `data/bygg.json` | Testdata: bygg                                                 |
| `data/rom.json`  | Testdata: rom                                                  |

## Start testmiljøet

Du trenger Node.js 18 eller nyere. Det er ingen pakker å installere.

```
node fdv-mock.js
```

Testmiljøet svarer da på `http://localhost:8080/api/v1`. Stopp det med Ctrl+C.

| Valg                | Beskrivelse                                                                    |
|---------------------|--------------------------------------------------------------------------------|
| `--port <nummer>`   | Bruk en annen port enn 8080                                                    |
| `--nokkel <nøkkel>` | Krev en annen API-nøkkel enn standardnøkkelen                                  |
| `--ustabil`         | Simulerer et ustabilt API: omtrent hvert fjerde kall får `503`, og svarene kommer med forsinkelse. Nyttig når du skal teste feilhåndteringen din. |

Har du Docker, men ikke Node.js, kan du starte testmiljøet slik fra denne mappen:

```
docker run --rm -p 8080:8080 -v "${PWD}:/app" -w /app node:22-alpine node fdv-mock.js
```

## Prøv API-et

Nøkkelen til testmiljøet er `tindvik-test-2026`. Den sendes i headeren `X-API-Key`.

Med curl:

```
curl -H "X-API-Key: tindvik-test-2026" http://localhost:8080/api/v1/bygg
curl -H "X-API-Key: tindvik-test-2026" "http://localhost:8080/api/v1/rom?side=2&antall=50"
```

Med PowerShell:

```
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/bygg" -Headers @{ "X-API-Key" = "tindvik-test-2026" }
```

Spesifikasjonen i `openapi.yaml` kan du åpne i for eksempel Swagger Editor, eller
importere i Postman, Insomnia eller Bruno.

## Godt å vite

- API-et er laget for kall fra server til server. Testmiljøet sender derfor ikke
  CORS-headere, og kall direkte fra JavaScript i nettleseren blir stoppet. Hent
  dataene fra backend-en din.
- Alle tidspunkt er i UTC. Husk å URL-kode tidspunkt med tidssone, for eksempel
  `+` som `%2B`.
- Testmiljøet leser datafilene på nytt ved hvert kall. Endrer du noe i `data/*.json`,
  gjelder endringen med en gang, uten omstart.
- Datafilene kan også brukes direkte, for eksempel som testdata i dine egne tester.
