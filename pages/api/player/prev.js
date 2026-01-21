const { spotifyApi } = require("../../../lib/spotify");
export default async function handler(req, res) {
  const { device_id } = req.body || {};
  const r = await spotifyApi("POST", "/me/player/previous", device_id ? { device_id } : null);
  res.status(r.ok ? 200 : r.status).json({ ok: r.ok, error: r.text });
}