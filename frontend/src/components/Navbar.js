import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Banner from './Banner'
import logo from '../assets/ALX Logo.jpg'
const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Banner>
        <img src={logo} alt='Jungle House' className='jh-logo' />
        <h1 className='jh-title'>Movies House</h1>
      </Banner>
      <ul id='menu'>
        <li><Link to="/">Home</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;