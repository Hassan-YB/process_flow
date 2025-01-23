import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPasswordVerify } from "../../../actions/userActions";
import { NavLink, useNavigate } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';
import Nav from "../../../components/Nav/signupNav"

// project import
// import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";

// assets
import logoDark from '../../../assets/img/processflow_logo.png';

// import NavBar from '../../../layouts/AdminLayout/NavBar/navIndex';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const ForgotPasswordVerify = () => {
  const [formData, setFormData] = useState({
    otp_code: "",
    phone_number: "",
    new_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { otp_code, phone_number, new_password } = formData;

    if (!otp_code || !phone_number || !new_password) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    dispatch(forgotPasswordVerify(formData));
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
              <div className="auth-content text-center mx-auto">
                <Card className="borderless">
                  <Row className="align-items-center text-center">
                    <Col>
                      <Card.Body className="card-body">
                        <h4 className="mb-4 mt-2 f-w-400">Verify Password OTP</h4>
                        <form onSubmit={handleSubmit}>
                          <div className="input-group mb-4">
                            <input
                              type="text"
                              name="otp_code"
                              className="form-control"
                              placeholder="Enter your OTP code"
                              value={formData.otp_code}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="input-group mb-4">
                            <input
                              type="text"
                              name="phone_number"
                              className="form-control"
                              placeholder="Enter your phone number"
                              value={formData.phone_number}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="input-group mb-4 position-relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="new_password"
                              className="form-control"
                              placeholder="Enter your new password"
                              value={formData.new_password}
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
                          <button type="submit" className="btn btn-primary btn-block mb-4 auth-btn"
                            style={{
                              border: "none",
                              borderRadius: "20px",
                              padding: "10px 40px",
                              color: "#fff",
                            }}>
                            Reset Password
                          </button>
                        </form>
                        <p className="mb-0 text-muted">
                          Remembered your password?{" "}
                          <a href="/auth/signin-1" className="f-w-400 text-decoration-underline">
                            Sign In
                          </a>
                        </p>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default ForgotPasswordVerify;
