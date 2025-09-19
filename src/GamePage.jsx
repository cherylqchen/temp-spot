import { useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import Header from "./components/Header.jsx"
import MusicPlayer from './MusicPlayer.jsx';

export default function GamePage() {
    console.log('Rerendered GamePage');
    const location = useLocation();
    const tracks = location.state?.tracks || [];
    const selected = tracks[Math.floor(Math.random() * tracks.length)];

    const [track, setTrack] = useState(selected);
    const [preview, setPreview] = useState(null);
    //let preview = 
    console.log('track: ', track);

    useEffect(() => {
        fetchSongFromAppleMusic(track.name, track.artist).then(data => {
            console.log('fetched from itunes: ', data);
            setPreview(data);
        }
        );
    }, [track]);

    const fetchSongFromAppleMusic = async (song, artist) => {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(song + " " + artist)}&media=music&limit=1`;
        console.log('itunes url: ', url);

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.results.length > 0) {
                return data.results[0].previewUrl; // 30-sec preview link
            } else {
                console.error("No song found.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching song:", error);
            return null;
        }
    };
    
    function getNewTrack() {
        console.log('getNewTrack() called')
        const song = tracks[Math.floor(Math.random() * tracks.length)];
        setTrack(song);
        console.log('got new track')
    }

    return (
    <>
        <Header />      

        {preview ?
            <MusicPlayer url={preview} title={track.name} artist={track.artist} correct={getNewTrack} />
            :
            <p>Getting playback...</p>
        }
        
    </>
    )
    
}

/*


<p>Your song is: {track.name} by {track.artist}</p>
        <iframe
            src={`https://open.spotify.com/embed/track/${track.id}`}
            width="300"
            height="380"
            frameBorder="0"
            allow="encrypted-media"
        ></iframe>


{preview ?
            <audio id="custom-audio-player" controls>
                <source src={preview} type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>
            :
            <p>Getting playback...</p>
        }




{preview && <MusicPlayer url={preview}/> } <--- separate thing that could also be good

<MusicPlayer trackID={track.id} />

<SpotifyPlayer token={token} onDeviceReady={setDeviceId} />
        <button onClick={playback}>Start Playback</button>


        <iframe
            src={`https://open.spotify.com/embed/track/${track.id}`}
            width="300"
            height="380"
            frameBorder="0"
            allow="encrypted-media"
        ></iframe>

<button data-testid="play-pause-button" class="PlayButton_buttonWrapper___CMG4" aria-label="Pause" tabindex="0"><svg data-encore-id="icon" role="img" aria-hidden="false" class="Svg-sc-ytk21e-0 eJsVCw e-9570-icon PlayButton_playPauseIcon__EBXpd" viewBox="0 0 24 24"><title>Pause</title><path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7.5-5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-2zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-2z"></path></svg></button>


        */