import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../style/Header.css';
import logoDark from '../assests/SS_Robotic_Logo_2_dark_background.png';
import logoLight from '../assests/SS_Robotics_Logo_3_light_background.png';

const Header = () => {
  const { cart } = useCart();
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const logo = darkMode ? logoDark : logoLight;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setAdminDropdownOpen(false);
  };

  return (
    <header className={`header ${darkMode ? 'dark' : 'light'}`}>
      <div className="header-content">
        <div className="left-section">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <div className="hamburger" onClick={toggleMenu}>
            ☰
          </div>
        </div>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeAllMenus}>Home</Link>

          {user?.role === 'admin' && (
            <div
              className="dropdown"
              onMouseEnter={() => setAdminDropdownOpen(true)}
              onMouseLeave={() => setAdminDropdownOpen(false)}
            >
              <span className="dropdown-toggle">Admin ⬇</span>
              {adminDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/admindashboard" onClick={closeAllMenus}>Dashboard</Link>
                  <Link to="/admin/orders" onClick={closeAllMenus}>Orders</Link>
                  <Link to="/admin/orderupdate" onClick={closeAllMenus}>Order Update Panel</Link>
                  <Link to="/admin/banners" onClick={closeAllMenus}>Banner Manager</Link>
                  <Link to="/admin/promo" onClick={closeAllMenus}>Promo Management</Link>
                </div>
              )}
            </div>
          )}

          <Link to="/cart" onClick={closeAllMenus}>🛒 Cart ({cart.length})</Link>

          <Link to="/myorders" onClick={closeAllMenus}> 📦 My Orders</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={closeAllMenus}>Login</Link>
              <Link to="/register" onClick={closeAllMenus}>Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}

          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
