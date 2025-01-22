import React from 'react';
import './Navbar.css'; 

// assets
import logoDark from '../../assets/img/processflow_logo.png';

const signupNav = () => {
  return (
    <nav className="custom-navbar">
      <div className="logo">
        <img src={logoDark} alt="Logo" />
      </div>
      <div className="auth-links">
        <a href="#">New User?</a>
        <a href="#" className="create-account">Create Account</a>
      </div>
    </nav>
  );
};

export default signupNav;
