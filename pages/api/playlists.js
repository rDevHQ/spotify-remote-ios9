const { spotifyApi } = require("../../lib/spotify");

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method not allowed");

  const r = await spotifyApi("GET", "/me/playlists?limit=50");
  if (!r.ok) return res.status(r.status).json(r);

  // Förenkla datan för frontend
  const playlists = (r.data.items || []).map((p) => ({
    name: p.name,
    uri: p.uri,
    image: (p.images && p.images.length) ? p.images[0].url : null,
    tracks: p.tracks ? p.tracks.total : 0
  }));

  res.status(200).json({ ok: true, playlists });
}
