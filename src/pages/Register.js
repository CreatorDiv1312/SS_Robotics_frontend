import React, { useContext, useState } from 'react';
import API from '../api/axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import '../style/Register.css';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const { user } = useContext(AuthContext);
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', form);
            alert('✅ Registered successfully!');
            navigate('/login');
        } catch (err) {
            alert('❌ Registration failed.');
            console.error(err);
        }
    };

    if (user) return <Navigate to="/" />;

    return (
        <div className={`register-page ${darkMode ? 'dark' : 'light'}`}>
            <div className="register-card">
                <h2>🔐 Create Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
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
                    <button type="submit">Register</button>
                </form>
                <p>
                    Already registered? <Link to="/login">Login here</Link>
                </p>
            </div>
            {/* footer spacing from content */}
            <div style={{ marginTop: '5rem' }}>
                <Footer />
            </div>
        </div>
    );
}
