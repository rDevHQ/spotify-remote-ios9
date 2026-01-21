import { spotifyApi } from "../../../lib/spotify";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).send("Method not allowed");

  const { volume_percent, device_id } = req.body;

  if (volume_percent === undefined || volume_percent < 0 || volume_percent > 100) {
    return res.status(400).json({ error: "Invalid volume_percent. Must be 0-100" });
  }

  const qs = { volume_percent };
  if (device_id) qs.device_id = device_id;

  const r = await spotifyApi("PUT", "/me/player/volume", qs);

  res.status(r.status || 200).json(r);
}