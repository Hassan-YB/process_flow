import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPasswordVerify } from "../actions/userActions";
import Msg from "../assets/img/msg_icon.png";
import Eye from "../assets/img/eye-slash.svg";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const ForgotPasswordVerify = () => {
  const [formData, setFormData] = useState({
    otp_code: "",
    phone_number: "",
    new_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { otp_code, phone_number, new_password } = formData;

    if (!otp_code || !phone_number || !new_password) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    dispatch(forgotPasswordVerify(formData));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <h3 className="text-center mb-4">Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group position-relative">
            <label htmlFor="otp_code">OTP Code</label>
            <input
              type="text"
              name="otp_code"
              id="otp_code"
              className="form-control"
              placeholder="Enter your OTP code"
              value={formData.otp_code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group position-relative">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              className="form-control"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChange={handleChange}
              required
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
          <div className="form-group position-relative">
            <label htmlFor="new_password">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="new_password"
              id="new_password"
              className="form-control"
              placeholder="Enter your new password"
              value={formData.new_password}
              onChange={handleChange}
              required
              style={{ paddingRight: "40px" }}
            />
            <img
              src={Eye}
              alt="Eye Icon"
              onClick={togglePasswordVisibility}
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
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordVerify;
