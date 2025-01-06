import React, { useState } from "react";
import Logo from "../assets/img/processflow_logo.png";
import User from "../assets/img/user_icon.png";
import Msg from "../assets/img/msg_icon.png";
import Eye from "../assets/img/eye-slash.svg";
import Google from "../assets/img/google_icon.png";
import Apple from "../assets/img/apple_icon.png";

import { useDispatch } from "react-redux";
import { userSignup } from "../actions/userActions";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch the signup action with formData
        dispatch(userSignup(formData, navigate));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: "120vh" }}>
            <div className="card p-4" style={{ width: "400px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <h3 className="text-center mb-4">Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group position-relative">
                        <label htmlFor="full_name">Name</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            className="form-control"
                            placeholder="John Doe"
                            style={{ paddingRight: "40px" }}
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                        <img
                            src={User}
                            alt="User Icon"
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
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="john.doe@gmail.com"
                            style={{ paddingRight: "40px" }}
                            value={formData.email}
                            onChange={handleChange}
                            required
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
                        <label htmlFor="phone_number">Phone Number</label>
                        <input
                            type="text"
                            id="phone_number"
                            name="phone_number"
                            className="form-control"
                            placeholder="+1234567890"
                            style={{ paddingRight: "40px" }}
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group position-relative">
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="******"
                            style={{ paddingRight: "40px" }}
                            value={formData.password}
                            onChange={handleChange}
                            required
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
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="text-center mt-3">
                    <div className="d-flex align-items-center my-4">
                        <div className="flex-grow-1 border-top"></div>
                        <span className="mx-3 text-muted">or sign up with</span>
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
                        Already have an account? <a href="/login">Log In</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
