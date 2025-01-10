import React, { useState } from "react";
import { NavLink, Link, useNavigate } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

import { useDispatch } from "react-redux";
import { userSignup } from "../../../actions/userActions";

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// assets
import logoDark from '../../../assets/img/processflow_logo.png';;

import NavBar from '../../../layouts/AdminLayout/NavBar/navIndex';
import { FaEye, FaEyeSlash } from "react-icons/fa";


// ==============================|| SIGN UP 1 ||============================== //

const SignUp1 = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setNewsletter(!newsletter);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userSignup(formData, navigate));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <React.Fragment>
      <NavBar/>
      <div className="auth-wrapper">
        <div className="auth-content" style={{marginTop:'75px', marginBottom:'50px'}}>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="card-body">
                  <div className="text-center">
                  <img src={logoDark} alt="Logo" className="img-fluid mb-4" />
                  <h4 className="mb-3 f-w-400">Sign up</h4>
                  </div>
                  <form onSubmit={handleSubmit}>
                  <label>Name</label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        placeholder="Full Name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <label>Email</label>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <label>Phone</label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="phone_number"
                        className="form-control"
                        placeholder="Phone number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <label>Password</label>
                    <div className="input-group mb-4">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        value={formData.password}
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
                    <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-block mb-4"
                    style={{
                      background: "linear-gradient(to right, #6f42c1, #a445b2)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "10px 20px",
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
    </React.Fragment>
  );
};

export default SignUp1;