import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../style/LandPage.css';
import darkLogo from '../assests/SS_Robotic_Logo_2_dark_background.png';
import lightLogo from '../assests/SS_Robotics_Logo_3_light_background.png';
import Footer from '../components/Footer';

export default function Land() {
  const { user } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const logo = darkMode ? darkLogo : lightLogo;
  const backgroundColor = darkMode ? '#0B0F1A' : '#FFFFFF';
  const textColor = darkMode ? '#00A9FF' : '#222';

  const handleShopNow = () => {
    navigate(user ? '/products' : '/register');
  };

  return (
    <div
      className="land-page"
      style={{
        backgroundColor,
        color: textColor,
        transition: 'all 0.4s ease-in-out',
      }}
    >
      <div className="overlay">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Welcome to SS Robotics 🛍️</h1>
        <p>
          Where futuristic automation meets top-tier retail solutions. Build, Buy, Believe.
        </p>

        <button className="cta" onClick={handleShopNow}>
          🛒 Explore Our Products
        </button>

        {/* <button className="theme-toggle" onClick={toggleTheme}>
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button> */}
      </div>

      {/* YouTube Video */}
      <div className="video-section">
        <h2>🎥 Featured: Our Journey</h2>
        <div className="youtube-embed">
          <iframe
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="SS Robotics Promo"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Business Highlights */}
      <div className="card-section">
        <div className="card">
          <h3>🤖 Automation Engineering</h3>
          <p>We build real-time robotic systems tailored for tomorrow.</p>
        </div>
        <div className="card">
          <h3>📦 E-Commerce Excellence</h3>
          <p>Browse our high-quality curated electronics and IoT products.</p>
        </div>
        <div className="card">
          <h3>🧠 Innovation Hub</h3>
          <p>We innovate across hardware and software to power the next generation.</p>
        </div>
        <div className="card">
          <h3>💬 Global Support</h3>
          <p>Assistance & shipping across multiple countries. We go where ideas go.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
