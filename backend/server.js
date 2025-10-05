// backend/server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/weather", async (req, res) => {
  const { lat, lon, parameter, start, end } = req.query;
  if (!lat || !lon || !parameter || !start || !end) {
    return res.status(400).json({ error: "Missing lat, lon, parameter, start, end" });
  }
  const startStr = start.replace(/-/g,'');
  const endStr = end.replace(/-/g,'');
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${parameter}&community=RE&longitude=${lon}&latitude=${lat}&start=${startStr}&end=${endStr}&format=JSON`;
  try {
    const r = await fetch(url);
    const j = await r.json();
    return res.json(j);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
