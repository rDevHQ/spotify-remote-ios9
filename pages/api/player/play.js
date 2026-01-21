const { spotifyApi } = require("../../../lib/spotify");
export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).send("Method not allowed");

  const body = req.body || {};
  const payload = {};

  if (body.context_uri) {
    payload.context_uri = body.context_uri;
  } else if (body.uris) {
    payload.uris = body.uris;
  }

  const r = await spotifyApi("PUT", "/me/player/play", null, Object.keys(payload).length ? payload : undefined);
  res.status(r.status || 200).json(r);
}