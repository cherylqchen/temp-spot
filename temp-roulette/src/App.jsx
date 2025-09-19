import { useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import LandingPage from './LandingPage.jsx'
import GamePage from './GamePage.jsx'

function App() {
  console.log('App rendered');
  const [token, setToken] = useState('')

    useEffect(() => {
      console.log('Ran useEffect()')

      fetch('http://localhost:5001/get-token')
        .then(res => res.json())
        .then(data => {
            setToken(data.access_token)
        })
        .catch(err => console.error('Error fetching token:', err))
    }, []); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  )
}

export default App
