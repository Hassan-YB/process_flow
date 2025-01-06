import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../actions/userActions";
import Logo from "../assets/img/processflow_logo.png";
import User from "../assets/img/user_icon.png";
import Msg from "../assets/img/msg_icon.png";
import Eye from "../assets/img/eye-slash.svg";
import Google from "../assets/img/google_icon.png";
import Apple from "../assets/img/apple_icon.png";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const Signin = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loginData.email && loginData.password) {
            dispatch(userLogin(loginData));
        } else {
            showErrorToast("Please fill in all fields.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: "400px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <h3 className="text-center mb-4">Log In</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group position-relative">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-control"
                            placeholder="john.doe@gmail.com"
                            value={loginData.email}
                            onChange={handleChange}
                            required
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
                    <div className="form-group position-relative">
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            className="form-control"
                            placeholder="******"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                            style={{ paddingRight: "40px" }}
                        />
                        <img
                            src={Eye}
                            alt="Eye"
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
                    <div className="d-flex justify-content-end mt-2">
                        <a href="/forgot-password" className="text-dark">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="d-flex mt-4 justify-content-center">
                        <button
                            type="submit"
                            className="btn btn-primary text-white"
                            style={{
                                background: "#9A61DC",
                                border: "none",
                                width: "100%",
                            }}
                        >
                            Log In
                        </button>
                    </div>
                </form>
                <div className="text-center mt-3">
                    <div className="d-flex align-items-center my-4">
                        <div className="flex-grow-1 border-top"></div>
                        <span className="mx-3 text-muted">or sign in with</span>
                        <div className="flex-grow-1 border-top"></div>
                    </div>
                    <div>
                        <a style={{ marginRight: "10px" }}>
                            <img src={Google} alt="Google Icon" style={{ width: "30px", height: "30px" }} />
                        </a>
                        <a className="">
                            <img src={Apple} alt="Apple Icon" style={{ width: "30px", height: "30px" }} />
                        </a>
                    </div>
                </div>
                <div className="text-center mt-3">
                    <p>
                        Don't have an account? <a href="/signup">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signin;
