import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import './assets/css/style.css';

import AdminLayout from "./layouts/Admin.js";
import Dashboard from "./views/Dashboard.js";
import Signin from "./views/Signin.js";
import Signup from "./views/Signup.js";
import VerifyOtp from "./views/VerifyOtp.js";
import ResetPassword from "./views/ResetPassword.js";
import ForgotPassword from "./views/ForgotPassword.js";
import ForgotPasswordVerify from "./views/ForgotPasswordVerify.js";
import Profile from "./views/Profile.js";
import UpdateProfile from "./views/UpdateProfile.js";
import Pricing from "./payment/Pricing.js";
import Checkout from "./payment/Checkout.js";
import Success from "./payment/Success.js";
import SubscriptionList from "./payment/SubscriptionList.js";
import InvoicesList from "./payment/Invoices.js";

import { Provider } from "react-redux";
import store from "./store";
import Header from "./components/Navbars/AdminNavbar";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create the root for React 18
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Provide the Redux store to the application */}
    <Provider store={store}>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password-verify" element={<ForgotPasswordVerify />} />
          {/* Protected Routes */}
          <Route
            path="/change-password"
            element={<PrivateRoute element={<ResetPassword />} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route
            path="/update-profile"
            element={<PrivateRoute element={<UpdateProfile />} />}
          />
          <Route
            path="/pricing"
            element={<PrivateRoute element={<Pricing />} />}
          />
          <Route
            path="/checkout"
            element={<PrivateRoute element={<Checkout />} />}
          />
          <Route
            path="/success"
            element={<PrivateRoute element={<Success />} />}
          />
          <Route
            path="/subscriptions"
            element={<PrivateRoute element={<SubscriptionList />} />}
          />
          <Route
            path="/invoices"
            element={<PrivateRoute element={<InvoicesList />} />}
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Footer />

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
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
