import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../style/Footer.css';

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer className={`footer ${darkMode ? 'dark' : 'light'}`}>
      <div className="footer-container">
        <div className="footer-section about">
          <h2>SS Robotics</h2>
          <p>
            Bridging innovation with automation. At SS Robotics, we deliver both online
            and offline excellence in hardware and automation solutions.
          </p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>📍 Sector 62, Noida, India</p>
          <p>📞 +91 9876543210</p>
          <p>✉️ ssrobotics@email.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SS Robotics. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
