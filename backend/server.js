import express from "express";
import axios from "axios";
import cors from "cors";
import proj4 from "proj4";

const app = express();
app.use(cors());

proj4.defs("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs");

const fallbackData = {
  objekter: [
    {
      id: 1,
      type: "Vegarbeid",
      navn: "Vegarbeid",
      sted: "E6 Oslo (testdata)",
      lat: 59.91273,
      lng: 10.74609,
    },
    {
      id: 2,
      type: "Trafikkulykke",
      navn: "Trafikkulykke",
      sted: "E39 Bergen (testdata)",
      lat: 60.39299,
      lng: 5.32205,
    },
  ],
  source: "fallback",
};

const mapVegkategori = (v) => {
  if (!v) return "";
  const k = String(v).toUpperCase().trim();
  if (k === "E") return "E";
  if (k === "R" || k === "RV") return "Rv";
  if (k === "F" || k === "FV") return "Fv";
  if (k === "K" || k === "KV") return "Kv";
  return k;
};

const parseCoords = (wkt) => {
  if (!wkt) return null;
  const m = wkt.match(/-?\d+(\.\d+)?\s+-?\d+(\.\d+)?/);
  if (!m) return null;
  const [x, y] = m[0].split(" ").map(Number);
  const [lng, lat] = proj4("EPSG:25833", "EPSG:4326", [x, y]);
  return { lat, lng };
};

const buildSted = (obj) => {
  const eg = obj.egenskaper || [];
  const vkat = eg.find((e) => e.navn === "Vegkategori")?.verdi;
  const vnr = eg.find((e) => e.navn === "Vegnummer")?.verdi;
  const beskrivelse = eg.find((e) => e.navn === "Beskrivelse")?.verdi;
  const kommune =
    obj.metadata?.lokasjon?.kommune?.navn ||
    eg.find((e) => e.navn.toLowerCase().includes("kommune"))?.verdi ||
    "";
  const stedsnavn = obj.lokasjon?.stedsnavn?.[0]?.navn || "";

  const road = vnr
    ? `${mapVegkategori(vkat)} ${vnr}`.replace(/\s+/, " ").trim()
    : "";

  if (road && kommune) return `${road} ${kommune}`.trim();
  if (road) return road;
  if (beskrivelse && !/^(ukjent|nøyaktig)$/i.test(beskrivelse))
    return beskrivelse;
  if (stedsnavn) return stedsnavn;
  if (kommune) return kommune;
  return "Ukjent sted";
};

app.get("/api/traffic", async (_req, res) => {
  try {
    const response = await axios.get(
      "https://nvdbapiles-v3.atlas.vegvesen.no/vegobjekter/570",
      {
        params: { inkluder: "lokasjon,egenskaper,metadata", antall: 100 },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 VegStatus/1.0 (+kontakt: thst0125@mail.com)",
          Accept:
            "application/vnd.vegvesen.nvdb-v3-rev1+json, application/json;q=0.9, */*;q=0.8",
        },
        timeout: 12000,
      }
    );

    const objekter = (response.data?.objekter || [])
      .map((obj) => {
        const c = parseCoords(obj.lokasjon?.geometri?.wkt);
        const eg = obj.egenskaper || [];
        const navn =
          eg.find((e) => e.navn === "Hendelsestype")?.verdi ||
          obj.metadata?.type?.navn ||
          "Trafikkhendelse";
        return {
          id: obj.id,
          type: obj.metadata?.type?.navn || "Vegobjekt",
          navn,
          sted: buildSted(obj),
          lat: c?.lat ?? null,
          lng: c?.lng ?? null,
        };
      })
      .filter((o) => typeof o.lat === "number" && typeof o.lng === "number");

    if (!objekter.length) return res.json(fallbackData);
    res.json({ objekter, source: "nvdb" });
  } catch {
    res.json(fallbackData);
  }
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`✅ Backend kjører på port ${PORT} (NVDB Les v3 aktiv)`)
);
