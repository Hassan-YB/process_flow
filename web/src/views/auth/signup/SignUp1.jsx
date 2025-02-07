import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

import { useDispatch } from "react-redux";
import { userSignup } from "../../../actions/userActions";

import { FaUserPlus, FaEye, FaEyeSlash} from 'react-icons/fa';

import Nav from "../../../components/Nav/loginNav"

import { showErrorToast } from "../../../utils/toastUtils";


// ==============================|| SIGN UP 1 ||============================== //

const SignUp1 = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend validation for password confirmation
    if (formData.password !== formData.confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    const { confirmPassword, ...submitData } = formData; // Exclude confirmPassword before submitting
    dispatch(userSignup(submitData, navigate));
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
              <div className="auth-content mx-auto" style={{ marginTop: '75px', marginBottom: '50px' }}>
                <Card className="w-100 order border-0">
                  <Row className="align-items-center">
                    <Col>
                      <Card.Body className="card-body">
                      <div className="text-center"> 
                      <FaUserPlus size={50}/></div>
                        <div className="">
                          {/*}
                  <img src={logoDark} alt="Logo" className="img-fluid mb-4" />*/}
                          <h4 className="mb-2 mt-4 f-w-400">Create your account</h4>
                          <p className="mb-4">
                            Please fill in the details below to get started.</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                          <label>Name*</label>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              name="full_name"
                              className="form-control"
                              placeholder="Enter Your Full Name"
                              value={formData.full_name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <label>Email*</label>
                          <div className="input-group mb-3">
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              placeholder="Enter Your Email address"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <label>Phone*</label>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              name="phone_number"
                              className="form-control"
                              placeholder="Enter Your Phone number"
                              value={formData.phone_number}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <label>Password*</label>
                          <div className="input-group mb-4">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className="form-control"
                              placeholder="Enter Password"
                              value={formData.password}
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
                          <div className="input-group mb-4">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              className="form-control"
                              placeholder="Confirm Password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                            <div
                              className="input-group-text"
                              style={{ cursor: "pointer", background: '#fff' }}
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
                              Sign up
                            </button>

                            <p className="mb-2">
                              Already have an account?{" "}
                              <NavLink to="/auth/signin" className="f-w-400 text-decoration-underline">
                                Signin
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

export default SignUp1;