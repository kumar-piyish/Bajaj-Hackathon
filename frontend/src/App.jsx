import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import InsuranceQueryApp from './components/InsuranceQueryApp';
import Navbar from './components/Navbar';
import ProfilePage from './components/ProfilePage';
import { Auth } from './components/Auth';

const ProtectedRoute = ({ children, token }) => {
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('jwt') || null;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt', token);
    } else {
      localStorage.removeItem('jwt');
    }
  }, [token]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        token={token}
        setToken={setToken}
      />

      <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}>
        <Routes>
          <Route path="/login" element={!token ? <Auth mode="login" setToken={setToken} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!token ? <Auth mode="register" setToken={setToken} /> : <Navigate to="/" />} />
          
          <Route path="/" element={
            <ProtectedRoute token={token}>
              <InsuranceQueryApp token={token} darkMode={darkMode} />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute token={token}>
              <ProfilePage token={token} darkMode={darkMode} />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={
            token ? <Navigate to="/" /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;