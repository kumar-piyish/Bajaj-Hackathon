import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Auth = ({ mode, setToken }) => {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
// src/components/Auth.jsx
const handleSubmit = async e => {
  e.preventDefault();
  const url = mode === 'login' ? '/token' : '/register';
  const fullUrl = `http://localhost:8000${url}`;
  const headers = mode === 'login'
    ? { 'Content-Type': 'application/x-www-form-urlencoded' }
    : { 'Content-Type': 'application/json' };
  const body = mode === 'login'
    ? new URLSearchParams({ username, password })
    : JSON.stringify({ username, email, password });

  try {
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.error || res.statusText);
    }
    const data = await res.json();
    setToken(data.access_token);
    navigate('/');
  } catch (e) {
    alert(`Error: ${e.message}`);
  }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full mb-2 p-2 border" />
      {mode==='register' && (
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mb-2 p-2 border" />
      )}
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full mb-4 p-2 border" />
      <button type="submit" className="w-full py-2 bg-blue-600 text-white">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};
