import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 4000;

app.get("/api/traffic", async (req, res) => {
  try {
    const response = await axios.get(
      "https://nvdbapiles-v3.atlas.vegvesen.no/vegobjekter/67",
      {
        headers: {
          Accept: "application/vnd.vegvesen.nvdb-v3+json",
          "X-Client": "VegStatusApp",
        },
        params: {
          inkludert: "lokasjon,metadata",
          antall: 10,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Feil fra NVDB API:", error.message);

    res.status(200).json({
      objekter: [
        {
          id: 1,
          metadata: { type: { navn: "Vegstenging" } },
          lokasjon: {
            geometri: { wkt: "POINT(10.74609 59.91273)" },
          },
        },
        {
          id: 2,
          metadata: { type: { navn: "Vegarbeid" } },
          lokasjon: {
            geometri: { wkt: "POINT(5.32205 60.39299)" },
          },
        },
      ],
    });
  }
});

app.listen(PORT, () => console.log(`🚦 Server kjører på port ${PORT}`));
