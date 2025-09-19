import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { Buffer } from 'node:buffer';

dotenv.config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

let accessToken = null;

app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

app.get('/get-token', async (req, res) => {
    const authOptions = new URLSearchParams();
    authOptions.append('grant_type', 'client_credentials');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', authOptions, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(
                    process.env.VITE_SPOTIFY_CLIENT_ID + ':' + process.env.VITE_SPOTIFY_CLIENT_SECRET
                ).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        accessToken = response.data.access_token;
        res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get access token' });
    }
});

app.post('/get-playlist-tracks', async (req, res) => {
    const { playlistUrl } = req.body;

    if (!playlistUrl) {
        return res.status(400).json({ error: 'No playlist URL provided' });
    }
    const match = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (!match) {
        return res.status(400).json({ error: 'Invalid playlist URL' });
    }

    const playlistId = match[1].split('?')[0];
    
    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const tracks = response.data.items.map(item => ({
            name: item.track.name,
            artist: item.track.artists.map(artist => artist.name).join(', '),
            previewUrl: item.track.preview_url,
            id: item.track.id,
        }));

        res.json(tracks);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch playlist tracks' });
    }
});

app.get('/refresh-token', async (req, res) => {
    const refresh_token = req.query.refresh_token;

    if (!refresh_token) {
        return res.status(400).json({ error: "Missing refresh_token parameter" });
    }

    const authHeader = Buffer.from(`${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.VITE_SPOTIFY_CLIENT_SECRET}`).toString("base64");

    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", 
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refresh_token
            }),
            {
                headers: {
                    "Authorization": `Basic ${authHeader}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        res.json({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token || refresh_token,
        });

    } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to refresh token" });
    }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));