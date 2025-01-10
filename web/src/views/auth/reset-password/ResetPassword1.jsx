import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../../actions/userActions";
import { NavLink, useNavigate } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";

// assets
import logoDark from '../../../assets/img/processflow_logo.png';

import NavBar from '../../../layouts/AdminLayout/NavBar/navIndex';

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
      <NavBar/>
      <div className="auth-wrapper">
        <div className="auth-content text-center">
          <Card className="borderless">
            <Row className="align-items-center text-center">
              <Col>
                <Card.Body className="card-body">
                  <img src={logoDark} alt="Logo" className="img-fluid mb-4" />
                  <h4 className="mb-3 f-w-400">Forgot Password</h4>
                  <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-block btn-primary mb-4"
                    style={{
                      background: "linear-gradient(to right, #6f42c1, #a445b2)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      color: "#fff",
                    }}>
                      Send OTP
                    </button>
                  </form>
                  <p className="mb-0 text-muted">
                    Don’t have an account?{" "}
                    <NavLink to="/auth/signup" className="f-w-400 text-decoration-underline">
                      Signup
                    </NavLink>
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

export default ResetPassword1;
