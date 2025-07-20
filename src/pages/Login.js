import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import '../style/login.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      login(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className={`login-page ${darkMode ? 'dark' : 'light'}`}>
      <div className="login-card">
        <h2>🔐 Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {/* footer spaced from content */}
      <div style={{ marginTop: '5rem' }}>
        <Footer />
      </div>
    </div>
  );
}
