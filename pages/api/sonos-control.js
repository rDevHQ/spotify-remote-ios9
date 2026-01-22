export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const webhookUrl = process.env.HA_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ ok: false, error: "Missing HA_WEBHOOK_URL" });
  }

  const payload = req.body || {};

  try {
    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    if (!r.ok) {
      return res.status(502).json({
        ok: false,
        error: "Home Assistant webhook failed",
        status: r.status,
        body: text,
      });
    }
    return res.status(200).send(text || "");
  } catch (e) {
    console.error("sonos-control proxy error:", e);
    return res.status(502).json({
      ok: false,
      error: "Home Assistant webhook unreachable",
      detail: String(e),
    });
  }
}
