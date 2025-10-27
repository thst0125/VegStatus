Dette prosjektet ble utviklet som et praksis- og demonstrasjonsprosjekt for å vise kompetanse innen fullstack webutvikling, dataintegrasjon og bruk av åpne data fra Statens vegvesen.  
Løsningen henter trafikkhendelser fra Nasjonal vegdatabank (NVDB) og visualiserer dem i sanntid på et interaktivt kart.  
Prosjektet har som mål å vise forståelse for moderne webarkitektur, API-kommunikasjon og brukerrettet datavisualisering.

# VegStatus – Trafikkmeldinger i sanntid

Et fullstack-prosjekt utviklet for å demonstrere kompetanse innen webutvikling, dataintegrasjon og visualisering av trafikkdata.  
Prosjektet henter data fra Statens vegvesens Nasjonale vegdatabank (NVDB) og viser trafikkhendelser i sanntid på et interaktivt kart.

---

## Oversikt

**VegStatus** er en webapplikasjon som viser trafikkmeldinger som vegarbeid, stengninger og andre hendelser direkte på et kart.  
Løsningen benytter et mellomledd (Express API) for å hente data fra NVDB og levere dem til frontend bygget i Next.js.

---

## Funksjonalitet

- Henter trafikkdata fra NVDB API (vegobjekt 67 – vegstenging)
- Viser hendelser i både listeform og på interaktivt kart (Leaflet)
- Parser WKT-koordinater (POINT) til visning på kart
- Har fallback-data ved feil på ekstern API
- Moderne og responsivt design med Tailwind CSS
- Klientbasert kart (løser "window is not defined" via dynamisk import)
- Proxy-ruting for enkel kommunikasjon mellom frontend og backend

---

## Teknologistack

**Frontend**

- Next.js (React + TypeScript)
- Tailwind CSS
- React Leaflet + Leaflet (kartvisning)
- Dynamic import med `ssr: false` (for kun klient-side rendering)

**Backend**

- Node.js + Express
- Axios for API-kall
- CORS aktivert for lokal utvikling
- Fallback-data ved manglende tilkobling til NVDB

**Data**

- NVDB API v3 (Statens vegvesen)
- OpenStreetMap tile layer via Leaflet

---
