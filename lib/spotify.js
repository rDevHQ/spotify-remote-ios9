// lib/spotify.js
const { readToken, writeToken } = require("./tokenStore");

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

async function spotifyTokenExchange(code) {
  const clientId = getEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = getEnv("SPOTIFY_CLIENT_SECRET");
  const redirectUri = getEnv("SPOTIFY_REDIRECT_URI");

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", redirectUri);

  const auth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + auth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error("Token exchange failed: " + t);
  }
  return r.json();
}

async function spotifyTokenRefresh(refreshToken) {
  const clientId = getEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = getEnv("SPOTIFY_CLIENT_SECRET");

  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("refresh_token", refreshToken);

  const auth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + auth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error("Token refresh failed: " + t);
  }
  return r.json();
}

async function getAccessToken() {
  const data = readToken();
  if (!data || !data.refresh_token) return null;

  // access token fortfarande giltig?
  if (data.access_token && data.expires_at && data.expires_at > nowSec() + 10) {
    return data.access_token;
  }

  // refresh
  const refreshed = await spotifyTokenRefresh(data.refresh_token);
  const newAccess = refreshed.access_token;
  const expiresAt = nowSec() + (refreshed.expires_in || 3600);

  writeToken({
    refresh_token: data.refresh_token,
    access_token: newAccess,
    expires_at: expiresAt,
  });

  return newAccess;
}

async function spotifyApi(method, path, qs, jsonBody) {
  const token = await getAccessToken();
  if (!token) {
    return { ok: false, status: 401, text: "Not paired. Go to /api/login" };
  }

  let url = "https://api.spotify.com/v1" + path;
  if (qs) {
    const sp = new URLSearchParams();
    Object.keys(qs).forEach((k) => {
      if (qs[k] !== undefined && qs[k] !== null) sp.set(k, String(qs[k]));
    });
    const s = sp.toString();
    if (s) url += "?" + s;
  }

  const r = await fetch(url, {
    method,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: jsonBody ? JSON.stringify(jsonBody) : undefined,
  });

  const text = await r.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {}

  return { ok: r.ok, status: r.status, data, text };
}

module.exports = {
  spotifyTokenExchange,
  spotifyApi,
  nowSec,
};