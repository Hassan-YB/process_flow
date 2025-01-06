import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../actions/userActions";
import Logo from "../assets/img/processflow_logo.png";
import Msg from "../assets/img/msg_icon.png";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4"
        style={{
          width: "400px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="text-center mb-4">
          <img src={Logo} alt="Logo" style={{ width: "120px" }} />
        </div>
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group position-relative">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              className="form-control"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              style={{ paddingRight: "40px" }}
            />
            <img
              src={Msg}
              alt="Phone Icon"
              style={{
                width: "20px",
                height: "20px",
                position: "absolute",
                right: "10px",
                top: "70%",
                transform: "translateY(-50%)",
              }}
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
              Send OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
