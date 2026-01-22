# Spotify Web API References

This project relies heavily on the Spotify Web API. Below are the key documentation resources used for implementation, particularly for playback control and device management.

## Official Documentation

*   **Web API Home**: [Spotify Web API](https://developer.spotify.com/documentation/web-api)

## Scopes & Permissions

*   **User Modify Playback State**: [Scope Documentation](https://developer.spotify.com/documentation/web-api/concepts/scopes#user-modify-playback-state)
    *   Required for all control commands (Play, Pause, Next, Previous, Volume, Shuffle, Repeat).
    *   Also used for transferring playback to different devices.

## Playback Control

*   **Start/Resume Playback**: [Reference](https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback)
    *   Used in `/api/player/play`.
    *   **Note**: Requires `device_id` query parameter for reliable control of specific Connect devices (like Sonos).

*   **Transfer Playback**: [Reference](https://developer.spotify.com/documentation/web-api/reference/transfer-a-users-playback)
    *   Used in `/api/player/transfer`.
    *   Allows moving the active session to a different device ID.

## Device Management

*   **Get User's Available Devices**: [Reference](https://developer.spotify.com/documentation/web-api/reference/get-a-users-available-devices)
    *   Used in `/api/devices`.
    *   **Troubleshooting**: Devices often disappear from this list if they have been idle. Opening the native Spotify app "wakes" them up.
