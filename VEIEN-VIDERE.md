# Kravsjekk og veien videre

> **Internt planleggingsnotat.** Denne filen er lagt til i `.gitignore` og
> skal ikke committes til `git.ntnu.no`-repoet — den er ment som et
> arbeidsverktøy for gruppa, ikke som del av leveransen. Vurderingen under
> er gjort ved å lese `prosjektbeskrivelse.txt` opp mot koden slik den er
> nå (branch `base-site`, commit `07fad0d` + endringene i denne økten).

## Kort oppsummering

Grunnmuren (Vite + React + TypeScript, søk mot PokéAPI, nå også
favoritter og et penere design) er på plass, men prosjektet mangler
fortsatt flere ting som er **eksplisitte, harde krav** i
prosjektbeskrivelsen — ikke bare finpuss. De viktigste hullene er:

1. Ingen bruk av **TanStack Query** (hardt teknisk krav).
2. **Ingen bruk av `sessionStorage`** i det hele tatt (krav er *begge*
   Web Storage-mekanismene, ikke bare `localStorage`).
3. Ingen **filter/sorterings**-funksjon (dette er et eget funksjonelt
   krav, atskilt fra fritekstsøket som allerede finnes).
4. Sidens navigasjonsmodell («én ressurs om gangen» + bla frem/tilbake +
   hoppe til en spesifikk ressurs) er **ikke det appen gjør i dag** — i
   dag vises en liste/grid av søketreff, ikke én Pokémon om gangen.
5. Hele Pokémon-lista (~10 000 rader) hentes og mellomlagres i minnet for
   å søke lokalt — dette kolliderer med kravet om å hente data «on the
   fly» og bør løses annerledes (se seksjonen under).
6. **Ingen tester** (Vitest, snapshot-test, komponenttester, mocking) —
   alt dette er eksplisitt krevd.
7. **Prettier** er ikke installert.
8. README dokumenterer bare VM-oppsett, ikke valg/løsninger, hva som er
   testet, eller **bruk av KI** (eksplisitt krevd å dokumentere).

Ingen grunn til bekymring i seg selv — dette er en tidlig fase av
prosjektet — men punktene over bør løses før første innlevering, siden
vurderingskriteriene sier løsningen skal svare på *alle* funksjonelle og
tekniske krav, og at det ikke skal være unødvendige API-kall eller
lint/test-advarsler.

## Krav-for-krav-gjennomgang

Status: ✅ på plass · 🟡 delvis / må endres · ❌ mangler helt

### Funksjonelle krav

| Krav | Status | Kommentar |
|---|---|---|
| Presenter én ressurs om gangen, med blafunksjon frem/tilbake og hopp til spesifikk ressurs via en liste | ❌ | I dag vises et *grid* av alle søketreff samtidig. Må bygges om til en enkelt-visning med «Forrige/Neste» og en velger (f.eks. nedtrekksliste eller søk-og-velg) for å hoppe direkte til en Pokémon. |
| Valg (filtrering/sortering) som endrer utvalg/presentasjon, og som huskes ved reload | ❌ | Finnes ikke i dag. Fritekstsøket er ikke det samme som filtrering/sortering. Naturlig kandidat: sorter etter navn/nummer, filtrer på type. Bør lagres i `sessionStorage` (se under). |
| Favoritter (stjerne/hjerte), huskes selv om nettleseren lukkes og åpnes igjen | ✅ | Implementert denne økten i `localStorage` (`pokedex-favorites`), se `CHANGES.md`. |
| Responsivt design (desktop + mobil, både portrett og landskap) | 🟡 | Sidebar/bunn-bar-løsningen for favoritter er testet i portrett-mobil og desktop. Bør også sjekkes i **landskap på mobil** (kort skjermhøyde) siden bunn-baren tar opptil 140px i høyden. |
| Estetisk og ryddig utforming | ✅ | Nytt Pokéball-tema, ryddigere kort, konsistent spacing (denne økten). Subjektivt krav, men det er lagt ned reelt arbeid. |

### Tekniske krav

| Krav | Status | Kommentar |
|---|---|---|
| God bruk av HTML mtp. tilgjengelighet | 🟡 | Semantisk HTML (`main`, `section`, `aside`, `form`, `button`) og `aria-label`/`aria-pressed` på favoritt-knappen er på plass. Bør gå én runde til med fargekontrast (rødt på hvitt/rødt på grått) og vurdere om bilder trenger bedre `alt`-tekst enn `alt=""` (i dag er navnet alltid synlig som tekst ved siden av, så det er trolig OK, men verdt en bevisst vurdering). |
| TypeScript + React | ✅ | På plass. |
| Bruk av React state og props | ✅ | På plass (`useState`, egne hooks, props mellom `App` og `FavoritesSidebar`). |
| Henter data fra REST API **og bruker TanStack Query** | ❌ | I dag brukes vanlig `fetch` direkte i `Api.tsx`. TanStack Query er ikke installert. Dette er et eksplisitt, navngitt krav — må på plass. |
| Web Storage API — **både** `localStorage` og `sessionStorage` (evt. IndexedDB) | 🟡 | Kun `localStorage` er tatt i bruk (favoritter). `sessionStorage` er foreløpig bare *foreslått* i `CHANGES.md`, ikke implementert. Filter/sorteringsvalget over er en naturlig kandidat for `sessionStorage`. |
| Responsivt design | ✅ | Se over. |
| Ingen tredjeparts UI-komponenter, kun plain CSS | ✅ | Ingen UI-bibliotek i bruk. Nunito-fonten som ble lagt til denne økten er en webfont, ikke en UI-komponent eller et CSS-rammeverk, så den bryter ikke kravet — men er verdt å nevne i dokumentasjonen som et bevisst valg. |

### Utvikling og testing

| Krav | Status | Kommentar |
|---|---|---|
| Node v24.6.X+ / npm v11+ | 🟡 | Ikke låst noe sted i prosjektet (f.eks. `engines` i `package.json`), så det er ikke sjekkbart/reproduserbart for andre. Bør legges til. |
| Vite + React + TypeScript-oppsett | ✅ | På plass. |
| Kildekode på **git.ntnu.no** | ✅ | `origin`-remote peker allerede til `git@git.ntnu.no:IT2810-H26/T18-Project-1.git`. `github`-remote ser ut til kun å være en privat speiling for GitHub Pages-demo på mobil — helt greit så lenge **innlevering** skjer via git.ntnu.no. |
| Branching + issues koblet til commits/PR-er | 🟡 | Kun to brancher så langt (`main`, `base-site`), ingen synlige issue-koblinger i commit-historikken enda. Naturlig siden prosjektet er tidlig i løpet, men bør etableres som vane fremover (se plan under). |
| Systematisk bruk av PR og kodegjennomgang | 🟡 | `CODEOWNERS` er satt opp (krever godkjenning fra gruppa), men historikken viser ingen PR-er enda — alt er committet rett på branch. |
| ESLint + Prettier | 🟡 | ESLint er satt opp og kjører rent (`npm run lint`). **Prettier er ikke installert.** |
| Vitest satt opp | ❌ | Ikke installert, ingen testfiler finnes. |
| Snapshot-test | ❌ | Mangler (avhenger av Vitest-oppsett). |
| Testing av egne komponenter (props, state, brukerinteraksjon) | ❌ | Mangler. |
| Mocking så tester ikke treffer ekte API | ❌ | Mangler (ingen tester enda i det hele tatt). |
| Testet på mainstream nettlesere/mobile enheter | 🟡 | Testet visuelt i Chrome (desktop + simulert mobilbredde) denne økten. Bør suppleres med faktisk test på minst én ekte mobilenhet og én annen nettleser (Firefox/Safari) før innlevering. |
| README dokumenterer valg, hva som er testet, og **KI-bruk** | ❌ | README inneholder i dag kun VM-tilkobling/deploy-instruksjoner. Må utvides betydelig. |

### Levering

| Krav | Status | Kommentar |
|---|---|---|
| Repo på git.ntnu.no under gruppas GitHub(NTNU)-gruppe, navn «Prosjekt 1» | 🟡 | Repoet ligger på git.ntnu.no i riktig gruppe (`IT2810-H26`), men selve repo-navnet er `T18-Project-1`, ikke «Prosjekt 1». Verdt å avklare med faglærer/TA om det faktiske navnet på repoet må matche eksakt, eller om det holder at det ligger i riktig gruppe. |
| Appen kjører under Apache på gruppas VM | ✅ | Dokumentert og satt opp i README/`deploy.sh`. |
| Kort notat om individuell arbeidsinnsats på Blackboard | ⏳ | Utenfor kodebasen — husk å gjøre dette som egen leveranse. |

## Den viktigste avveiingen: «ikke mellomlagre data» vs. dagens søk

Prosjektbeskrivelsen sier eksplisitt («NB!»): *hent data on the fly via
REST-APIet, ikke mellomlagre data.* Dagens `Api.tsx` henter derimot
**hele** Pokémon-lista (alle ~10 000 rader) én gang og lagrer den i en
modulvariabel (`cachedList`) som så filtreres lokalt for hvert søk. Dette
er i praksis å bygge en egen lokal kopi av datasettet — nøyaktig det
kravet ber oss unngå — selv om det finnes en praktisk grunn til det
(PokéAPI har ikke noe søke-endepunkt).

**Den gode nyheten:** å løse det manglende «én ressurs om gangen»-kravet
løser trolig dette problemet på kjøpet. Hvis appen bygges om til å vise
én Pokémon av gangen og hente den **på id/navn direkte fra API-et via
TanStack Query** når brukeren blar eller hopper til den, blir hvert
API-kall naturlig «on the fly» og knyttet til akkurat den ressursen som
vises — i tråd med både «ikke mellomlagre»-kravet og «ingen unødvendige
kall»-kravet.

For å fortsatt kunne tilby en «hopp til spesifikk ressurs»-liste/velger
uten å laste ned hele datasettet på forhånd, er et par alternativer:

- Pokémon har stort sett sammenhengende id-er (1–1010+), så en velger kan
  bygges på kjente id-er/navn uten noe eget API-kall i det hele tatt, og
  selve Pokémon-dataene hentes først når brukeren faktisk velger en.
- Alternativt: hent kun *navn + id* via PokéAPI sitt liste-endepunkt med
  paginering (`limit`/`offset`) for én side om gangen i stedet for alt på
  én gang, slik at det er en lett navigasjonsliste og ikke en full lokal
  kopi av ressursene.

Dette er verdt å ta opp med faglærer/TA hvis dere er usikre på tolkningen
— men uansett peker løsningen på funksjonskravet («én om gangen») og
løsningen på mellomlagringskravet i samme retning, så det er fornuftig å
løse dem sammen.

## Foreslått plan videre (prioritert rekkefølge)

**Prioritet 1 — hulll i harde krav, bør løses først:**

1. Innfør **TanStack Query** for all datahenting fra PokéAPI.
2. Bygg om hovedvisningen til **én Pokémon om gangen**, med
   Forrige/Neste-navigasjon og en velger for å hoppe direkte til en
   spesifikk Pokémon (se avveiingen over — løs dette sammen med punkt 3).
3. Fjern den lokale full-liste-cachen (`cachedList` i `Api.tsx`) til
   fordel for on-the-fly-henting per ressurs.
4. Legg til et **filter- og/eller sorteringsvalg** (f.eks. sorter
   alfabetisk/etter nummer, filtrer på type), og lagre valget i
   **`sessionStorage`** slik at det huskes ved reload (men ikke etter at
   fanen lukkes — i motsetning til favoritter).
5. Sett opp **Vitest** (+ ev. React Testing Library), med:
   - minst én **snapshot-test**,
   - komponenttester som dekker props/state/brukerinteraksjon (f.eks.
     favoritt-toggling, filter/sortering),
   - **mocking** av API-kall slik at testene ikke går mot ekte PokéAPI.
6. Installer og konfigurer **Prettier** (og gjerne kjør den over
   eksisterende kode).

**Prioritet 2 — dokumentasjon og prosess:**

7. Skriv om README slik at den dokumenterer: arkitektur-/designvalg,
   hva som er testet og hvordan, og **bruk av KI-assistanse** i
   prosjektet (eksplisitt krevd).
8. Begynn å bruke **issues på git.ntnu.no**, koblet til branches/commits
   og PR-er med kodegjennomgang, for resten av utviklingsarbeidet.
9. Legg til `engines`-felt i `package.json` for Node/npm-versjonene som
   er brukt, for bedre reproduserbarhet.
10. Ta stilling til `pokenode-ts`-avhengigheten: enten ta den faktisk i
    bruk (siden den ligger i `package.json` men ikke importeres noe sted
    i dag), eller fjern den som ubrukt avhengighet.

**Prioritet 3 — polish før innlevering:**

11. Tilgjengelighetsrunde: fargekontrast, `alt`-tekster, og gjerne et
    par minutter med skjermleser (VoiceOver/NVDA) på søk + favoritter.
12. Faktisk test på minst én ekte mobilenhet (portrett *og* landskap) og
    én ekstra nettleser utover Chrome.
13. Siste sjekk rett før innlevering: `npm run lint`, `npm run build` og
    testene kjører helt uten feil eller advarsler (eksplisitt
    vurderingskriterium).

## Åpne spørsmål å avklare med faglærer/TA

- Er PokéAPI sitt liste-endepunkt (som må hentes i sin helhet for at
  søk/filtrering skal fungere uten et dedikert søke-API) i strid med
  «ikke mellomlagre»-kravet, eller er det akseptert som en nødvendig
  navigasjonsliste så lenge selve *ressursdataene* alltid hentes on the
  fly? Løsningsforslaget over (id-basert velger + on-the-fly-henting per
  ressurs) er ment å unngå problemet helt, men verdt å bekrefte.
- Må repoet hete eksakt «Prosjekt 1», eller holder det at det ligger i
  riktig gruppe på git.ntnu.no under et annet navn (`T18-Project-1`)?
