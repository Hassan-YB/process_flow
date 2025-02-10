import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from 'react-router-dom';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

import { userLogin } from "../../../actions/userActions";

import Nav from "../../../components/Nav/signupNav";

import { showErrorToast } from "../../../utils/toastUtils";
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
//import { initializeApp } from "firebase/app";

{/*}
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);*/}

// ==============================|| SIGN IN 1 ||============================== //

const Signin1 = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };


  {/*const requestFCMToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const fcmToken = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });

        console.log("FCM Token:", fcmToken);
        return fcmToken;
      } else {
        console.warn("Notification permission denied.");
        return null;
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  };*/}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    //const fcmToken = await requestFCMToken();

    console.log("", {
      ...loginData,
      //fcm_token: fcmToken,
      //device_name: "Web Device",
      //device_platform: "web",
    });

    //if (!fcmToken) {
    //  showErrorToast("Unable to get FCM Token. Please enable notifications.");
    //  return;
   // }

    dispatch(userLogin({
      ...loginData,
      //fcm_token: fcmToken,
      //device_name: "Web Device",
      //device_platform: "web",
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <React.Fragment>
      <Nav />
      <div className="container-fluid min-vh-100 d-flex justify-content-center justify-content-md-start align-items-center">
        <Row className="w-100">
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
                <div className="auth-bg">
                  <span className="r" />
                  <span className="r s" />
                  <span className="r s" />
                  <span className="r" />
                </div>
                <Card className="borderless ">
                  <Card.Body>
                    <div className="text-center">
                      <FaSignInAlt size={50} /></div>
                    <div className="text-center">
                      <h4 className="mb-3 mt-4 f-w-400">Log In</h4>
                      <p className="mb-4">
                        Welcome back! Please enter your details to log in.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <label>Email*</label>
                      <div className="input-group mb-3">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter Your Email address"
                          value={loginData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <label>Password*</label>
                      <div className="input-group mb-3">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control"
                          placeholder="Enter Your Password"
                          value={loginData.password}
                          onChange={handleChange}
                          required
                        />
                        <div
                          className="input-group-text"
                          style={{ cursor: "pointer", background: '#fff' }}
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                      </div>
                      <div className="d-flex justify-content-end mt-2">
                        <NavLink to="/auth/reset-password" className="text-muted">
                          Forgot password?
                        </NavLink>
                      </div>
                      <div className="text-center">
                        <button type="submit" className="btn btn-primary btn-block mt-4 auth-btn"
                          style={{
                            border: "none",
                            borderRadius: "20px",
                            padding: "10px 40px",
                            color: "#fff",
                          }}>
                          Log In
                        </button>
                        <p className="mb-0 text-muted mt-4">
                          Don’t have an account?{" "}
                          <NavLink to="/auth/signup" className="f-w-400 text-decoration-underline">
                            Signup
                          </NavLink>
                        </p>
                      </div>
                    </form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Signin1;