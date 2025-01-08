import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../actions/userActions";
import { NavLink, useNavigate } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";

// assets
import logoDark from '../../../assets/img/processflow_logo.png';

import NavBar from '../../../layouts/AdminLayout/NavBar/index';

import { FaEye, FaEyeSlash } from "react-icons/fa";


const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
      old_password: "",
      new_password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordOld, setShowPasswordOld] = useState(false);
  
    const dispatch = useDispatch();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setPasswords({ ...passwords, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (!passwords.old_password || !passwords.new_password) {
        showErrorToast("Please fill in all fields.");
        return;
      }
  
      dispatch(changePassword(passwords));
    };
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const toggleOldPasswordVisibility = () => {
      setShowPasswordOld(!showPasswordOld);
    };
  
    return (
      <React.Fragment>
        <div className="container">
        <Breadcrumb title={"Change Password"} main={"Dashboard"} item={"Change Password"}/>
        <div className="">
          <div className="auth-content text-center col-12 col-md-6 mx-auto">
            <Card className="borderless">
              <Row className="align-items-center text-center">
                <Col>
                  <Card.Body className="card-body">
                  <h3 className="text-center mb-5">Change Password</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="input-group mb-4">
                        <input
                          type={showPasswordOld ? "text" : "password"}
                          name="old_password"
                          className="form-control"
                          placeholder="old password"
                          value={passwords.old_password}
                          onChange={handleChange}
                          required
                        />
                        <div
                            className="input-group-text"
                            style={{ cursor: "pointer", background:'#fff' }}
                            onClick={toggleOldPasswordVisibility}
                          >
                            {showPasswordOld ? <FaEye /> : <FaEyeSlash />}
                        </div>
                      </div>
                      <div className="input-group mb-4 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="new_password"
                          className="form-control"
                          placeholder="new password"
                          value={passwords.new_password}
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
                      <button type="submit" className="btn btn-primary btn-block mb-4"
                        style={{
                          background: "linear-gradient(to right, #6f42c1, #a445b2)",
                          border: "none",
                          borderRadius: "20px",
                          padding: "10px 20px",
                          color: "#fff",
                        }}>
                        Update Password
                      </button>
                    </form>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
        </div>
      </React.Fragment>
    );
  };
  
  export default ChangePassword;