//import { useState } from "react"

export default function Input() {
    //const [submitted, setSubmitted] = useState(false)
    
    return (
        <main>
            <h1 style={{textAlign: "center", marginTop: "9%"}}>Try your luck at guessing songs from your favourite playlists and albums.</h1>
            <form>
                <h3>Paste your playlist or album link here: </h3>
                <input type="text" placeholder="https://open.spotify.com/playlist/your-playlist"/>
                <button>Play</button>
            </form>
        </main>
    )
}