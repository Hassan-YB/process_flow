import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../actions/userActions";
import Logo from "../assets/img/processflow_logo.png";
import User from "../assets/img/user_icon.png";
import Msg from "../assets/img/msg_icon.png";
import Eye from "../assets/img/eye-slash.svg";
import Google from "../assets/img/google_icon.png";
import Apple from "../assets/img/apple_icon.png";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const ResetPassword = () => {
    const [passwords, setPasswords] = useState({ old_password: "", new_password: "" });
    const [showPassword, setShowPassword] = useState(false);
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

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: "400px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <h3 className="text-center mb-4">Change Password</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group position-relative">
                        <label htmlFor="old_password">Old Password</label>
                        <input
                            type="password"
                            name="old_password"
                            id="old_password"
                            className="form-control"
                            placeholder="Enter your old password"
                            value={passwords.old_password}
                            onChange={handleChange}
                            required
                            style={{ paddingRight: "40px" }}
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
                            value={passwords.new_password}
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
