export default async function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    res.status(500).send("Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI");
    return;
  }

  const scope = [
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-modify-playback-state"
  ].join(" ");

  const p = new URLSearchParams();
  p.set("response_type", "code");
  p.set("client_id", clientId);
  p.set("scope", scope);
  p.set("redirect_uri", redirectUri);

  res.redirect("https://accounts.spotify.com/authorize?" + p.toString());
}