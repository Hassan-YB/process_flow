import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../actions/userActions";
import { useNavigate } from "react-router-dom";

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

// project import
import Breadcrumb from "../../../components/Breadcrumb/breadcrumb";

import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";

import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';


const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwords.old_password || !passwords.new_password || !passwords.confirm_password) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      showErrorToast("New Password and Confirm Password do not match.");
      return;
    }

    const { confirm_password, ...submitData } = passwords;
    dispatch(changePassword(submitData, navigate));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleOldPasswordVisibility = () => {
    setShowPasswordOld(!showPasswordOld);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <React.Fragment>
      <div className="container-fluid">
        <Breadcrumb pageName="Change Password" />
        <div className="">
          <div className="auth-content col-12 col-md-8 mx-auto">
            <Card className="borderless">
              <Row className="align-items-center">
                <Col>
                  <Card.Body className="card-body">
                    <div className="text-center">
                      <FaLock size={50} /></div>
                    <h4 className="mb-2 mt-4 text-center">Change Password</h4>
                    <p className="mb-4 text-center">
                      Update your password by filling in the fields below.</p>
                    <form onSubmit={handleSubmit}>
                      <label>Old Password*</label>
                      <div className="input-group mb-4">
                        <input
                          type={showPasswordOld ? "text" : "password"}
                          name="old_password"
                          className="form-control"
                          placeholder="Enter Your Old Password"
                          value={passwords.old_password}
                          onChange={handleChange}
                          required
                        />
                        <div
                          className="input-group-text"
                          style={{ cursor: "pointer", background: '#fff' }}
                          onClick={toggleOldPasswordVisibility}
                        >
                          {showPasswordOld ? <FaEye /> : <FaEyeSlash />}
                        </div>
                      </div>
                      <label>New Password*</label>
                      <div className="input-group mb-4 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="new_password"
                          className="form-control"
                          placeholder="Enter Your New Password"
                          value={passwords.new_password}
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
                          placeholder="Confirm Your New Password"
                          value={passwords.confirm_password}
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
                      </div>
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