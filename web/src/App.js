
import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from './views/dashboard/dashboard';
import Signin from './views/auth/signin/SignIn1';
import Signup from './views/auth/signup/SignUp1';
import VerifyOtp from './views/auth//signin/VerifyOtp';
import ResetPassword from './views/auth/reset-password/ResetPassword1';
import PasswordVerifyOtp from './views/auth/reset-password/forgot-password-verify';
import Invoicing from './views/payments/Invoicing';
import Pricing from './views/payments/Pricing';
import Checkout from './views/payments/Checkout';
import ChangePassword from "./views/auth/reset-password/ChangePassword"
import Profile from './views/profile/Profile';

import Sidebar from './components/Sidebar/sidebar';
import PrivateRoute from './config/privateroutes';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  const noSidebarRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/auth/verify",
    "/auth/reset-password",
    "/auth/password-otp-verify",
  ];

  return (
      <div>
      <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          {/* Wrap with MainLayout if route doesn't match noSidebarRoutes */}
          <Route
            path="*"
            element={
              !noSidebarRoutes.includes(location.pathname) ? (
                <PrivateRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/billing" element={<Invoicing />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                  </Routes>
                </MainLayout>
                </PrivateRoute>
              ) : (
                <AuthRoutes />
              )
            }
          />
        </Routes>
      </div>
  );
}

// Main Layout Component with Sidebar
function MainLayout({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);

      if (isMobileView) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} isMobile={isMobile} />

      {/* Main Content */}
      <div className={`main-content ${isMobile && !isSidebarVisible ? "adjust-for-hamburger" : ""}`}>
        {children}
      </div>
    </div>
  );
}

// Authentication Routes (Without Sidebar)
function AuthRoutes() {
  const location = useLocation();

  useEffect(() => {
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/auth/signin" element={<Signin />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/verify" element={<VerifyOtp />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/auth/password-otp-verify" element={<PasswordVerifyOtp />} />
      <Route path="*" element={<Signin />} />
    </Routes>
  );
}

export default App;
