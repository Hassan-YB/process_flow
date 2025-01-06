import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resendOtp } from "../actions/userActions";
import { useLocation } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const ResendOtp = () => {
  const location = useLocation();
  const [otpData, setOtpData] = useState({
    phone_number: location.state?.phone_number || "",
    verification_type: location.state?.verification_type || "signup",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOtpData({ ...otpData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpData.phone_number) {
      dispatch(resendOtp(otpData));
    } else {
      showErrorToast("Please enter your phone number.");
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
        <h3 className="text-center mb-4">Resend OTP</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              className="form-control"
              placeholder="Enter your phone number"
              value={otpData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="verification_type">Verification Type</label>
            <select
              name="verification_type"
              id="verification_type"
              className="form-control"
              value={otpData.verification_type}
              onChange={handleChange}
              disabled
            >
              <option value="signup">Signup</option>
              <option value="forgot_password">Forgot Password</option>
            </select>
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
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResendOtp;