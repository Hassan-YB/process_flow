import React from 'react';
import './Navbar.css'; 

// assets
import logoDark from '../../assets/img/processflow_logo.png';

const loginNav = () => {
  return (
    <nav className="custom-navbar">
      <div className="logo">
        <img src={logoDark} alt="Logo" />
      </div>
      <div className="auth-links">
        <a href="#">Already a member?</a>
        <a href="#" className="create-account">Login</a>
      </div>
    </nav>
  );
};

export default loginNav;
