const { spotifyApi } = require("../../../lib/spotify");

export default async function handler(req, res) {
  const v = Number(req.query.v);
  if (!(v >= 0 && v <= 100)) return res.status(400).json({ ok: false, error: "Use ?v=0..100" });

  const r = await spotifyApi("PUT", "/me/player/volume", { volume_percent: v });
  res.status(r.ok ? 200 : r.status).json({ ok: r.ok, error: r.text });
}