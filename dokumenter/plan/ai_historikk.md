# Logg for bruk av Kunstig Intelligens (Gemini)


Dette dokumentet oppsummerer dialogen og den iterative prosessen med KI-assistenten for å kvalitetssikre prosjektplanen før utviklingsfasen.

---

## Fase 1: Kravinnsamling og struktur
**Meg:** 
> "Nå vil jeg at du skal tenke som en streng eksaminator for fagprøve. Si okay når du har forstått. Her er oppgaven min: [Limte inn oppgaveteksten for Tindvik Eiendom]."

**Gemini:** 
> Bekreftet forståelse av oppgaven. Påpekte at det forventes realistiske arkitekturvalg, sikker kode (GDPR/UU) og en robust integrasjon mot FDV-systemet. Ba om første utkast til plan.

**Meg:** 
> "Hva burde jeg ha med i planen? Gi meg en liste."

**Gemini:** 
> Ga en strukturert liste med 7 punkter: Mål, Kravspesifikasjon, Avgrensninger, Teknologivalg, Løsningsskisse, Fremgangsmåte og Tidsskjema/Budsjett.

---

## Fase 2: Iterativ forbedring av plandokumentet

**Meg:** 
> [Lastet opp første utkast av planen, "Plan.docx"] "Hva synes du så langt, og hva burde jeg gjøre for å nå meget bestått?"

**Gemini:** 
> Ga tilbakemelding på at GDPR, teknologivalg og målgruppeforståelse var bra. Påpekte kritiske mangler: Manglende tidsplan, manglende budsjett, og at integrasjonen mot FDV-systemet (API-et) ikke var beskrevet.

**Meg:** 
> "Kan du lage en liste med rød om jeg mangler, grønn om jeg har, gul om den må fikses, på alt en meget bestått fagprøve burde ha?"

**Gemini:** 
> Lagde en fargekodet oversikt. Rødt (kritisk) var budsjett, tidsplan og eget API-endepunkt. Gult var manglende krav (UU/statistikk) og muntlig språk. Grønt var gode arkitekturvalg og avgrensninger.

**Meg:** 
> [Lastet opp en gammel fagprøveplan, "Planlegging_ver2.docx"] "Er det noe jeg kan ta fra min gamle plan for å forbedre den nye?"

**Gemini:** 
> Identifiserte at budsjettmodellen, tidsplanstrukturen (dag-for-dag) og avsnittene om Universell Utforming (WCAG) fra den gamle planen var utmerkede og burde gjenbrukes.

---

## Fase 3: Problemløsning og integrasjonsarkitektur

**Meg:** 
> [Lastet opp flere oppdaterte versjoner av planen] "Hvordan ser den ut nå?"

**Gemini:** 
> Gjennomførte korrektur, men oppdaget en kritisk feil der jeg (utvikler) hadde skrevet at jeg ville ta avstand fra å bruke FDV-systemets API. KI advarte om at dette ville føre til stryk, da integrasjonen er et obligatorisk krav.

**Meg:** 
> Fjernet avsnittet. Spurte om hjelp til å forstå statistikk-kravet og hvilke felt som måtte lagres i databasen.

**Gemini:** 
> Definerte hvilke data (rom-ID, saksnummer, frister, status) som måtte lagres for å oppfylle FDV-systemets krav og ledelsens ønske om statistikk.

**Meg:** 
> "Men API-et deres har kun to GET-endepunkter, hvordan kan jeg sende tilbake?"

**Gemini:** 
> Forklarte klient/server-dynamikken: Jeg skal ikke sende (POST) data til dem. Jeg må bygge et *eget* REST-endepunkt (f.eks. `GET /api/saker`) i min backend, slik at FDV-systemet kan hente sakene fra min database én gang i timen.

---

## Fase 4: Ferdigstilling av dokument

**Meg:** 
> [Lastet opp endelig plan, "Plan_11.docx" med integrasjon, budsjett, UU og testregime på plass].

**Gemini:** 
> Godkjente planen. Bekreftet at budsjettet var logisk, testregimet (Jest) var på plass, og at integrasjonsarkitekturen nå svarte på oppgaven. Ga et siste tips om forskjellen på ORM og REST-endepunkt.

**Meg:** 
> Spurte om kildehenvisning (APA 7) og om denne bruken av KI var tillatt på fagprøven.

**Gemini:** 
> Ga korrekt APA 7-kildehenvisning og bekreftet at bruken er høyst profesjonell og tillatt, så lenge det dokumenteres åpent i egenvurderingen at KI ble brukt som sparringspartner for kvalitetssikring.