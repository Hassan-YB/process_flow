import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Link } from 'react-router-dom';
import NavBar from '../../../layouts/AdminLayout/NavBar/navIndex';
import { FaEye, FaEyeSlash } from "react-icons/fa";

// react-bootstrap
import { Card, Button, Alert } from 'react-bootstrap';


import { userLogin } from "../../../actions/userActions";

// third party
import { CopyToClipboard } from 'react-copy-to-clipboard';

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
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
      <NavBar/>
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless ">
            <Card.Body>
            <div className="text-center">
              <img src={logoDark} alt="Logo" className="img-fluid mb-4" />
              <h4 className="mb-3 f-w-400">Log In</h4>
              </div>
              <form onSubmit={handleSubmit}>
              <label>Email</label>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email address"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <label>Password</label>
                <div className="input-group mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                  />
                  <div
                    className="input-group-text"
                    style={{ cursor: "pointer", background:'#fff' }}
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
                <button type="submit" className="btn btn-primary btn-block mt-4"
                style={{
                  background: "linear-gradient(to right, #6f42c1, #a445b2)",
                  border: "none",
                  borderRadius: "20px",
                  padding: "10px 20px",
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
    </React.Fragment>
  );
};

export default Signin1;