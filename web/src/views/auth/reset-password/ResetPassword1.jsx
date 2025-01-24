import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../../actions/userActions";
import { NavLink, useNavigate } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';
import Nav from "../../../components/Nav/signupNav"
import { FaKey, FaMobileAlt, FaSignInAlt, FaLockOpen, FaLock, FaUserPlus } from 'react-icons/fa';

import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";

// assets
import logoDark from '../../../assets/img/processflow_logo.png';

// import NavBar from '../../../layouts/AdminLayout/NavBar/navIndex';

// ==============================|| RESET PASSWORD 1 ||============================== //

const ResetPassword1 = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      showErrorToast("Please enter your phone number.");
      return;
    }
    dispatch(forgotPassword({ phone_number: phoneNumber }, navigate));
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
                <Card className="borderless">
                  <Row className="align-items-center">
                    <Col>
                      <Card.Body className="card-body">
                      <div className="text-center"> 
                        <FaLockOpen size={50}/></div>
                        <h4 className="mb-2 mt-4 f-w-400 text-center">Forgot Password</h4>
                        <p className="mb-4 text-center">
                        Enter your phone number to reset password.</p>
                        <form onSubmit={handleSubmit}>
                        <label>Phone Number*</label>
                          <div className="input-group mb-4">
                            <input
                              type="text"
                              name="phone_number"
                              className="form-control"
                              placeholder="Enter your phone number"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                            />
                          </div>
                          <div className="text-center">
                          <button type="submit" 
                          className="btn btn-block btn-primary mb-4 auth-btn"
                            style={{
                              border: "none",
                              borderRadius: "20px",
                              padding: "10px 40px",
                              color: "#fff",
                            }}>
                            Send OTP
                          </button>
                        <p className="mb-0 text-muted">
                          Don’t have an account?{" "}
                          <NavLink to="/auth/signup" className="f-w-400 text-decoration-underline">
                            Signup
                          </NavLink>
                        </p>
                        </div>
                        </form>
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

export default ResetPassword1;
