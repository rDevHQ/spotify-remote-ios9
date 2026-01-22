# Spotify Remote for iOS 9

A lightweight, legacy-friendly web interface to control Spotify Connect devices. Designed specifically to work on old iOS 9 devices (like the original iPad Mini) where the native Spotify app no longer works.

## Features
- 🎵 Control playback (Play, Pause, Next, Previous)
- 🔊 Volume control
- 📱 Optimized for Safari on iOS 9
- 💾 Persistent login (authorize once on server, use anywhere)

## Deployment (CasaOS / Docker)

The easiest way to run this is via Docker or CasaOS.

### 1. Import Docker Compose

Copy the content of `docker-compose.yml` and import it into CasaOS (or run `docker-compose up -d`).

### 2. Configuration

You **must** set the following environment variables.
*Get your Client ID/Secret from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).*

| Variable | Description |
| :--- | :--- |
| `SPOTIFY_CLIENT_ID` | Your Spotify App Client ID |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify App Client Secret |
| `SPOTIFY_REDIRECT_URI` | `https://<your-domain>/api/callback` |
| `COOKIE_SECRET` | A long random string for security |

### 3. Persistence (Important!)

To ensure you don't have to log in deeply every time the server restarts, map a volume to `/data`:

```yaml
volumes:
  - /DATA/AppData/spotify-remote/data:/data
```

### 4. How to Log In

1.  Start the container.
2.  Open the app on a **Modern Device** (PC/Mac/iPhone) at `http://<your-server-ip>:3010`.
3.  Click **Log in with Spotify**.
4.  Authorize the app.
5.  **Done!** The server has saved your access token to `/data/spotify_token.json`.
6.  Now open `http://<your-server-ip>:3010` on your **iOS 9 iPad**. It will work immediately!

## Optional: add a Spotifyd receiver

If you want a stable Connect endpoint beside Sonos (so the web remote can grab ownership before issuing commands), run Spotifyd on the same host. Spotifyd registers itself as a Spotify Connect device, so you can transfer playback to it from this app and control the music without hitting the `403 Restricted device` error. The steps are:

1.  Install/configure Spotifyd on ZimaOS. You can reuse the optional `spotifyd` service that we added to `docker-compose.yml`. Copy `spotifyd.conf.example` into your config folder (e.g. `/DATA/AppData/spotifyd/conf/spotifyd.conf`) and fill in your Spotify credentials plus a friendly `device_name`.
2.  Start the Spotifyd container in parallel with the remote. Make sure it has access to your sound hardware (bind `/dev/snd` if needed) so Spotifyd can actually render audio.
3.  Transfer playback to the Spotifyd device from the web app (the device picker shows its name). Once Spotifyd owns playback, all controls work again and you can return to Sonos by transferring playback back later.

Spotifyd documentation: https://github.com/Spotifyd/spotifyd

### Attribution

Source : [Spotify Logo](https://commons.wikimedia.org/wiki/File:Spotify_logo_without_text.svg) (Wikimedia Commons)
