
import React, { useState } from 'react';
import API from '../api/axios';

export default function AdminGate({ onAccessGranted }) {
  const [password, setPassword] = useState(''); //as only password is required
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await API.post('/auth/admin-access', { password });
      if (res.data.success) {
        localStorage.setItem('adminAccess', 'true');
        onAccessGranted();
      }
    } catch (err) {
      setError("❌ Invalid password. Try again.");
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🔐 Admin Access</h2>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
