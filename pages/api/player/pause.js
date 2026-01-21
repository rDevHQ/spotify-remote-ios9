const { spotifyApi } = require("../../../lib/spotify");
export default async function handler(req, res) {
  const r = await spotifyApi("PUT", "/me/player/pause");
  res.status(r.ok ? 200 : r.status).json({ ok: r.ok, error: r.text });
}