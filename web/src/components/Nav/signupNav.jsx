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
        <a href="#" className='d-none d-md-block'>New User?</a>
        <a href="/auth/signup" className="create-account">Create Account</a>
      </div>
    </nav>
  );
};

export default signupNav;
