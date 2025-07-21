import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Banner from './Banner'
import logo from '../assets/ALX Logo.jpg'
const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <Banner>
        <img src={logo} alt='Movies House' className='jh-logo' />
        <h1 className='jh-title'>Movies House</h1>
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776; {/* Hamburger Icon */}
        </button>
      </Banner>
      <ul id='menu' className={isMenuOpen ? "menu-open" : ""}>
        <li><Link to="/" className="btn">Home</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard" className="btn">Dashboard</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="btn">Login</Link></li>
            <li><Link to="/register" className='btn'>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;