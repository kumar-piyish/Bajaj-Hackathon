import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import InsuranceQueryApp from './components/InsuranceQueryApp'
import Navbar from './components/Navbar'
import ProfilePage from './components/ProfilePage'

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true' ? true : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <Routes>
          <Route path="/" element={<InsuranceQueryApp darkMode={darkMode} />} />
          <Route path="/profile" element={<ProfilePage darkMode={darkMode} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App