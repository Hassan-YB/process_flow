import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPasswordVerify } from "../../../actions/userActions";

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';
import Nav from "../../../components/Nav/signupNav"

import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";

import { FaKey, FaEye, FaEyeSlash} from 'react-icons/fa';


const ForgotPasswordVerify = () => {
  const [formData, setFormData] = useState({
    otp_code: "",
    phone_number: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { otp_code, phone_number, new_password, confirm_password } = formData;

    // Validate fields
    if (!otp_code || !phone_number || !new_password || !confirm_password) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    // Validate password match
    if (new_password !== confirm_password) {
      showErrorToast("Passwords do not match.");
      return;
    }

    const { confirm_password: _, ...submitData } = formData; // Exclude confirm_password before submission
    dispatch(forgotPasswordVerify(submitData));
    showSuccessToast("Password updated successfully!");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  return (
    <React.Fragment>
      <Nav />
      <div className="container-fluid min-vh-100 d-flex justify-content-center justify-content-md-start align-items-center">
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
                      <FaKey size={50}/></div>
                        <h4 className="mb-2 mt-4 f-w-400 text-center">Verify Password OTP</h4>
                        <p className="mb-4 text-center">
                        Enter the OTP and your new password to reset.</p>
                        <form onSubmit={handleSubmit}>
                        <label>OTP*</label>
                          <div className="input-group mb-4">
                            <input
                              type="text"
                              name="otp_code"
                              className="form-control"
                              placeholder="Enter 6 Digit Code"
                              value={formData.otp_code}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <label>Phone Number*</label>
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
                          <label>New Password*</label>
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
                          <label>Confirm Password*</label>
                          <div className="input-group mb-4 position-relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirm_password"
                              className="form-control"
                              placeholder="Confirm your new password"
                              value={formData.confirm_password}
                              onChange={handleChange}
                              required
                            />
                            <div
                              className="input-group-text"
                              style={{ cursor: "pointer", background: "#fff" }}
                              onClick={toggleConfirmPasswordVisibility}
                            >
                              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                          </div>
                          <div className="text-center">
                          <button type="submit" className="btn btn-primary btn-block mb-4 auth-btn"
                            style={{
                              border: "none",
                              borderRadius: "20px",
                              padding: "10px 40px",
                              color: "#fff",
                            }}>
                            Reset Password
                          </button>
                        <p className="mb-0 text-muted">
                          Remembered your password?{" "}
                          <a href="/auth/signin" className="f-w-400 text-decoration-underline">
                            Sign In
                          </a>
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

export default ForgotPasswordVerify;
