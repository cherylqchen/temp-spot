import React, { useMemo, useEffect, useLayoutEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const MusicPlayer = ({ url, title, artist, correct }) => {
  console.log('Rerendered Music Player')
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [guess, setGuess] = useState("");
  const [guessed, setGuessed] = useState(false);
  const [quit, setQuit] = useState(false);
  const [playerReady, setPlayerReady] = useState(false)

  useMemo(() => {
    setGuess("");
    setGuessed(false);
    setQuit(false);
    setPlayerReady(false);
    // wavesurfer.current.destroy();
  }, [title])

  useMemo(() => {
    if (wavesurfer.current && !playerReady) wavesurfer.current.destroy()
  }, [playerReady])

  console.log('reset all states')

  useEffect(() => {
    console.log('running useeffect')
    /* setGuess("");
    setGuessed(false);
    setQuit(false); */

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ddd",
      progressColor: "#52b757",
      cursorColor: "#fafafa", //"#2b582e",
      cursorWidth: 3,
      barWidth: 4,
      barRadius: 5,
      barGap: 7,
      responsive: true,
      height: "12%",
      width: "95%"
    });

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", () => {
      console.log('wavesurfer loaded')
      setIsPlaying(false);
      setPlayerReady(true)
    });

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      //wavesurfer.current.destroy();
      wavesurfer.current.un("finish");
    }
  }, [url]);


  console.log('guess: ', guess, "title: ", title)
  if (guess && guess.toLowerCase() === title.toLowerCase()) {
    document.body.style.backgroundColor = "green";
    setGuess("");
    wavesurfer.current.pause();
    setIsPlaying(false);
    setGuessed(true);
    setQuit(false);
  }

  const togglePlay = () => {
    wavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  function handleGuess(event) {
    event.preventDefault()
    const {value} = event.currentTarget;
    console.log('val: ', value);
    setGuess(value);
  }

  function giveUp() {
    wavesurfer.current.pause();
    setIsPlaying(false);
    setGuessed(false);
    setQuit(true);
  }

  return (
    <div className="gamePlayer" style={{textAlign: "center"}}>


      <div className="wave-container">
        <div ref={waveformRef}></div>
      </div>
      
      <div className="controls">
        {console.log('player ready: ', playerReady)}
        {(!guessed && !quit && playerReady) && 
        <>
          <button onClick={togglePlay} className="playBtn"> {isPlaying ? "⏸️" : "▶️"} </button>
          <input type="text" placeholder="Guess song title" className="guesser gameBtn" onChange={handleGuess} value={guess} />
          <button className="quitter gameBtn" onClick={giveUp}>Give up</button>
        </>}
      </div>

      {console.log('quit = ', quit, ' guessed = ', guessed)}
      {(quit || guessed) && 
      <>
        <p className="reveal">{quit && "So close... "} {guessed && "Great job! "} the correct answer was <b>{title} by {artist}</b></p>
        <button className="replayBtn" onClick={correct}>Play again</button>
      </>}

      
    </div>
  );
};

export default MusicPlayer;


/* 

first div styles = flex flex-col items-center p-4 bg-gray-900 text-white rounded-lg shadow-lg
second div (waveformref) = w-full mb-4
button classes = px-4 py-2 bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 transition


{quit && <p>So close... the correct answer was <b>{title} by {artist}</b></p>}
{(guessed || quit) && <p>Correct! <button onClick={correct}>Play again</button></p>}

<button onClick={togglePlay} className="playBtn"> {isPlaying ? "⏸️" : "▶️"} </button>
*/