import { spotifyApi } from "../../lib/spotify";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).send("Method not allowed");

    const r = await spotifyApi("GET", "/me/player/devices");
    if (!r.ok) return res.status(r.status).json(r);

    const devices = (r.data.devices || []).map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        isActive: d.is_active,
    }));

    res.status(200).json({ ok: true, devices });
}
