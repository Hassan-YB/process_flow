import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Breadcrumb, Card, Row, Col } from "react-bootstrap";
import { verifyOtp, resendOtp } from "../../../actions/userActions";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import logoDark from '../../../assets/img/processflow_logo.png';
import Nav from "../../../components/Nav/loginNav"
import { FaKey, FaMobileAlt, FaSignInAlt, FaLockOpen, FaLock, FaUserPlus, FaEye, FaEyeSlash} from 'react-icons/fa';

const VerifyOtp = () => {
  const location = useLocation();
  const email = location.state?.email;
  const phone_number = location.state?.phone_number;

  const [otpData, setOtpData] = useState({ otp_code: "" });
  const [timer, setTimer] = useState(30);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOtpData({ ...otpData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpData.otp_code) {
      dispatch(verifyOtp({ email, otp_code: otpData.otp_code }, navigate));
    } else {
      showErrorToast("Please enter the OTP.");
    }
  };

  const handleResendOtp = () => {
    if (phone_number) {
      dispatch(resendOtp({ phone_number, verification_type: "signup" }));
      setTimer(30);
    } else {
      showErrorToast("Phone number is missing. Unable to resend OTP.");
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval); // Clear the interval on unmount
  }, [timer]);

  return (
    <React.Fragment>
      <Nav />
      <div className="container-fluid min-vh-100 d-flex justify-content-center justify-content-md-start align-items-center">
        <Row>
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
                      <FaMobileAlt size={50}/></div>
                        <h4 className="mb-2 mt-4 f-w-400 text-center">Verify OTP</h4>
                        <p className="mb-4 text-center">
                        Please enter the 6-digit code sent to your phone.</p>
                        <form onSubmit={handleSubmit}>
                        <label>OTP*</label>
                          <div className="input-group mb-4">
                            <input
                              type="text"
                              name="otp_code"
                              className="form-control"
                              placeholder="Enter 6 Digit Code"
                              value={otpData.otp_code}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="text-center">
                          <button type="submit" className="btn btn-primary btn-block mb-3 auth-btn"
                            style={{
                              border: "none",
                              borderRadius: "20px",
                              padding: "10px 40px",
                              color: "#fff",
                            }}>
                            Verify
                          </button>
                        <p className="mb-0 text-muted mt-4">
                          {timer > 0 ? (
                            <span className="f-w-400 text-muted">
                              Resend OTP in {timer} sec
                            </span>
                          ) : (
                            <span>
                              Didn’t receive an OTP?{" "}
                              <a
                                onClick={handleResendOtp}
                                className="f-w-400 text-decoration-underline"
                                style={{ cursor: "pointer" }}
                              >
                                Resend OTP
                              </a>
                            </span>
                          )}
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

export default VerifyOtp;
