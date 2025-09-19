import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from "./components/Header.jsx"

export default function LandingPage() {
    console.log('LandingPage rendered')
    const [playlistLink, setPlaylistLink] = useState('')
    const navigate = useNavigate()

    async function startGame(event) {
        event.preventDefault()
        if (!playlistLink) return;
        
        try {
            const response = await fetch('http://localhost:5001/get-playlist-tracks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playlistUrl: playlistLink }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/game', { state: { tracks: data } });
                //console.log('fetched from playlist: ', data)
            } else {
                console.error('Error fetching tracks:', data.error);
            }
        } catch (err) {
            console.error('Network error:', err);
        }
    }
        
        /*
        try {
            const response = await fetch('http://localhost:5000/get-playlist-tracks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playlistUrl: playlistLink }),
            });

            const data = await response.json();
            if (response.ok) {
                //navigate('/game', { state: { tracks: data } });
                console.log('fetched from playlist: ', data)
            } else {
                console.error('Error fetching tracks:', data.error);
            }
        } catch (err) {
            console.error('Network error:', err);
        }*/

    function handlePlaylistLink(event) {
        event.preventDefault()
        const {value} = event.currentTarget;
        setPlaylistLink(value);
    }

    return (
    <>
        <Header />
        <h1 style={{textAlign: "center", marginTop: "9%"}}>Try your luck at guessing songs from your favourite playlists and albums.</h1>
        <form> 
            <h3>Paste your playlist or album link here: </h3>
            <input type="text" placeholder="https://open.spotify.com/playlist/your-playlist" onChange={handlePlaylistLink} />
            <button onClick={startGame}>Play</button>
        </form>
    </>
    )
} //onClick={handleStartGame} for button ^^