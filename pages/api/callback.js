const { spotifyTokenExchange, nowSec } = require("../../lib/spotify");
const { writeToken } = require("../../lib/tokenStore");

export default async function handler(req, res) {
  const code = req.query.code;
  const err = req.query.error;

  if (err) return res.status(400).send("Spotify auth error: " + err);
  if (!code) return res.status(400).send("Missing code");

  try {
    const token = await spotifyTokenExchange(code);

    const refresh = token.refresh_token;
    const access = token.access_token;
    const expiresAt = nowSec() + (token.expires_in || 3600);

    writeToken({
      refresh_token: refresh,
      access_token: access,
      expires_at: expiresAt,
    });

    res.redirect("/");
  } catch (e) {
    res.status(500).send(String(e));
  }
}