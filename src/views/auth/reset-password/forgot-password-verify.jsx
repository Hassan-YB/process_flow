import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPasswordVerify } from "../../../actions/userActions";
import { NavLink, useNavigate } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";

// assets
import logoDark from '../../../assets/img/processflow_logo.png';

import NavBar from '../../../layouts/AdminLayout/NavBar/navIndex';
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
        <NavBar/>
        <div className="auth-wrapper">
          <div className="auth-content text-center">
            <Card className="borderless">
              <Row className="align-items-center text-center">
                <Col>
                  <Card.Body className="card-body">
                    <img src={logoDark} alt="Logo" className="img-fluid mb-4" />
                    <h4 className="mb-3 f-w-400">Forgot Password Otp</h4>
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
                        style={{ cursor: "pointer", background:'#fff' }}
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                      </div>
                      <button type="submit" className="btn btn-primary btn-block mb-4"
                      style={{
                        background: "linear-gradient(to right, #6f42c1, #a445b2)",
                        border: "none",
                        borderRadius: "20px",
                        padding: "10px 20px",
                        color: "#fff",
                      }}>
                        Reset Password
                      </button>
                    </form>
                    <p className="mb-0 text-muted">
                      Remembered your password?{" "}
                      <a href="/auth/signin-1" className="f-w-400">
                        Sign In
                      </a>
                    </p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  };
  
  export default ForgotPasswordVerify;
  