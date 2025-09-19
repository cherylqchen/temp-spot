import { useEffect, useState } from "react";

export default function Player({ token, trackId }) {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    if (!window.Spotify) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: "Spotify Roulette Player",
        getOAuthToken: (cb) => { cb(token); }, 
        volume: 0.5,
      });

      newPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
      });

      newPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      newPlayer.addListener("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      newPlayer.connect();
      setPlayer(newPlayer);
    };

    return () => {
      if (player) player.disconnect();
    };
  }, [token]);

  // 🔹 Function to play the selected track
  const playTrack = async (trackId) => {
    if (!deviceId || !trackId) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [`spotify:track:${trackId}`], // Spotify track URI format
        }),
      });
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  // 🔹 Automatically play when trackId changes
  useEffect(() => {
    if (trackId) {
      playTrack(trackId);
    }
  }, [trackId]);

  return <></>; // No need to render anything
}
