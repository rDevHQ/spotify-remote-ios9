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
    return res.status(r.status || 200).send(text || "");
  } catch (e) {
    return res.status(502).json({ ok: false, error: String(e) });
  }
}
