import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Link } from 'react-router-dom';
// import NavBar from '../../../layouts/AdminLayout/NavBar/navIndex';
import { FaKey, FaMobileAlt, FaSignInAlt, FaLockOpen, FaLock, FaUserPlus, FaEye, FaEyeSlash} from 'react-icons/fa';

// react-bootstrap
import { Card, Button, Alert, Row, Col } from 'react-bootstrap';

import { userLogin } from "../../../actions/userActions";

import Nav from "../../../components/Nav/signupNav"

// project import
// import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import AuthLogin from './JWTLogin';

// assets
import logoDark from '../../../assets/img/processflow_logo.png';

import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";

// ==============================|| SIGN IN 1 ||============================== //

const Signin1 = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      dispatch(userLogin(loginData));
    } else {
      showErrorToast("Please fill in all fields.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <React.Fragment>
      <Nav />
      <div className="container-fluid min-vh-100 d-flex align-items-center">
        <Row className="w-100">
          {/* Left Column */}
          <Col md={6} className="d-none d-md-flex bg-gradient-nav text-white justify-content-center align-items-center">
            <div className="text-center px-5">
              <h1 className="fw-bold">Let’s create something amazing</h1>
              <p className="mt-3">Work with Us.</p>
            </div>
          </Col>
          {/* Right Column */}
          <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
            <div className="auth-wrapper">
              <div className="auth-content mx-auto">
                <div className="auth-bg">
                  <span className="r" />
                  <span className="r s" />
                  <span className="r s" />
                  <span className="r" />
                </div>
                <Card className="borderless ">
                  <Card.Body>
                  <div className="text-center"> 
                  <FaSignInAlt size={50}/></div>
                    <div className="text-center">
                      <h4 className="mb-3 mt-4 f-w-400">Log In</h4>
                      <p className="mb-4">
                      Welcome back! Please enter your details to log in.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <label>Email*</label>
                      <div className="input-group mb-3">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter Your Email address"
                          value={loginData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <label>Password*</label>
                      <div className="input-group mb-3">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control"
                          placeholder="Enter Your Password"
                          value={loginData.password}
                          onChange={handleChange}
                          required
                        />
                        <div
                          className="input-group-text"
                          style={{ cursor: "pointer", background: '#fff' }}
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                      </div>
                      <div className="d-flex justify-content-end mt-2">
                        <NavLink to="/auth/reset-password" className="text-muted">
                          Forgot password?
                        </NavLink>
                      </div>
                      <div className="text-center">
                        <button type="submit" className="btn btn-primary btn-block mt-4 auth-btn"
                          style={{
                            border: "none",
                            borderRadius: "20px",
                            padding: "10px 40px",
                            color: "#fff",
                          }}>
                          Log In
                        </button>
                        <p className="mb-0 text-muted mt-4">
                          Don’t have an account?{" "}
                          <NavLink to="/auth/signup" className="f-w-400 text-decoration-underline">
                            Signup
                          </NavLink>
                        </p>
                      </div>
                    </form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Signin1;