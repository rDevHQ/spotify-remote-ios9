import { spotifyApi } from "../../lib/spotify";

export default async function handler(req, res) {
    if (req.method !== "PUT") return res.status(405).send("Method not allowed");

    const { device_ids } = req.body || {};

    if (!device_ids || !Array.isArray(device_ids) || device_ids.length === 0) {
        return res.status(400).json({ error: "Missing device_ids array" });
    }

    // "play": true ensures playback starts immediately on the new device
    const r = await spotifyApi("PUT", "/me/player", null, { device_ids, play: true });

    res.status(r.status || 200).json(r);
}
