import { spotifyApi } from "../../../lib/spotify";

export default async function handler(req, res) {
    if (req.method !== "PUT") return res.status(405).send("Method not allowed");

    const { state, device_id } = req.body; // true or false

    if (typeof state !== 'boolean') {
        return res.status(400).json({ error: "Missing state boolean" });
    }

    const qs = { state };
    if (device_id) qs.device_id = device_id;

    const r = await spotifyApi("PUT", "/me/player/shuffle", qs);

    res.status(r.status || 200).json(r);
}
