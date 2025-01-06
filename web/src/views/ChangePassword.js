import React from "react";
import Logo from "../assets/img/processflow_logo.png";
import User from "../assets/img/user_icon.png";
import Msg from "../assets/img/msg_icon.png";
import Eye from "../assets/img/eye-slash.svg";
import Google from "../assets/img/google_icon.png";
import Apple from "../assets/img/apple_icon.png";

const ChangePassword = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: "400px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <h3 className="text-center mb-4">Change Password</h3>
                <form>
                    <div className="form-group position-relative">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="john.doe@gmail.com"
                            style={{ paddingRight: "40px" }}
                        />
                        <img
                            src={Msg}
                            alt="Email Icon"
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
                            Send Reset Password Link
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
