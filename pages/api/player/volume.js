import { spotifyApi } from "../../../lib/spotify";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).send("Method not allowed");

  const { volume_percent } = req.body;

  if (volume_percent === undefined || volume_percent < 0 || volume_percent > 100) {
    return res.status(400).json({ error: "Invalid volume_percent. Must be 0-100" });
  }

  const r = await spotifyApi("PUT", "/me/player/volume", { volume_percent });

  res.status(r.status || 200).json(r);
}