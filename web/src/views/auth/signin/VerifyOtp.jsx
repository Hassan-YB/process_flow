import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Breadcrumb, Card, Row, Col } from "react-bootstrap";
import { verifyOtp, resendOtp } from "../../../actions/userActions";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import logoDark from '../../../assets/img/processflow_logo.png';
// import NavBar from '../../../layouts/AdminLayout/NavBar/navIndex';

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
      dispatch(verifyOtp({ email, otp_code: otpData.otp_code}, navigate ));
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
      <div className="auth-wrapper">
        <div className="auth-content text-center">
          <Card className="borderless">
            <Row className="align-items-center text-center">
              <Col>
                <Card.Body className="card-body">
                  <img src={logoDark} alt="Logo" className="img-fluid mb-4" />
                  <h4 className="mb-3 f-w-400">Verify OTP</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="input-group mb-4">
                      <input
                        type="text"
                        name="otp_code"
                        className="form-control"
                        placeholder="Enter 6 digit code"
                        value={otpData.otp_code}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mb-3"
                    style={{
                      background: "linear-gradient(to right, #6f42c1, #a445b2)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      color: "#fff",
                    }}>
                      Verify
                    </button>
                  </form>
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
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VerifyOtp;
