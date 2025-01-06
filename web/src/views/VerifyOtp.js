import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyOtp, resendOtp } from "../actions/userActions";
import Logo from "../assets/img/processflow_logo.png";
import User from "../assets/img/user_icon.png";
import Msg from "../assets/img/msg_icon.png";
import Eye from "../assets/img/eye-slash.svg";
import Google from "../assets/img/google_icon.png";
import Apple from "../assets/img/apple_icon.png";
import { useLocation, useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const VerifyOtp = () => {
    const location = useLocation();
    const email = location.state?.email; // Email from navigation state
    const phone_number = location.state?.phone_number; // Phone number from navigation state
  
    const [otpData, setOtpData] = useState({ otp_code: "" });
    const dispatch = useDispatch();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setOtpData({ ...otpData, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (otpData.otp_code) {
        dispatch(verifyOtp({ email, otp_code: otpData.otp_code }));
      } else {
        showErrorToast("Please enter the OTP.");
      }
    };
  
    const handleResendOtp = () => {
      if (phone_number) {
        dispatch(resendOtp({ phone_number, verification_type: "signup" }));
      } else {
        showErrorToast("Phone number is missing. Unable to resend OTP.");
      }
    };
  
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div
          className="card p-4"
          style={{
            width: "400px",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 className="text-center mb-4">Verify OTP</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group position-relative">
              <input
                type="text"
                name="otp_code"
                className="form-control"
                placeholder="Enter 6 digit code"
                value={otpData.otp_code}
                onChange={handleChange}
                required
                style={{ paddingRight: "40px" }}
              />
            </div>
            <div className="d-flex mt-4 justify-content-center">
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{
                  background: "linear-gradient(to right, #a445b2, #fa4299)",
                  border: "none",
                  width: "100%",
                }}
              >
                Verify
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <button
              onClick={handleResendOtp}
              className="btn btn-link text-muted"
              style={{ textDecoration: "none" }}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default VerifyOtp;