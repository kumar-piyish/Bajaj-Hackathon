// src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import InsuranceQueryApp from './components/InsuranceQueryApp'
import Navbar from './components/Navbar'
import ProfilePage from './components/ProfilePage'
import { Auth } from './components/Auth'

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('jwt') || null
  })

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Persist token when it changes
  useEffect(() => {
    if (token) localStorage.setItem('jwt', token)
    else      localStorage.removeItem('jwt')
  }, [token])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <Router>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        token={token}
        setToken={setToken}
      />

      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}>
        <Routes>
          {!token ? (
            <>
              <Route path="/login"  element={<Auth mode="login"  setToken={setToken} />} />
              <Route path="/signup" element={<Auth mode="register" setToken={setToken} />} />
              <Route path="*"        element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/"        element={<InsuranceQueryApp token={token} darkMode={darkMode} />} />
              <Route path="/profile" element={<ProfilePage token={token} darkMode={darkMode} />} />
              <Route path="*"        element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App
