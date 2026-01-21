const { spotifyApi } = require("../../../lib/spotify");

export default async function handler(req, res) {
  const r = await spotifyApi("GET", "/me/player");
  if (!r.ok) return res.status(r.status).json({ ok: false, error: r.text });
  res.status(200).json({ ok: true, player: r.data });
}