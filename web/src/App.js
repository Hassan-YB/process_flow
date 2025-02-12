
import React, { useState, useEffect, useRef } from "react";
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
import ProjectList from './views/projects/ProjectsList'
import Projects from './views/projects/Projects'
import CreateProject from './views/projects/CreateProject'
import ProjectDetail from './views/projects/ProjectDetail'
import UpdateProject from './views/projects/UpdateProject'
import DeleteProject from './views/projects/DeleteProject'
import TaskDetail from './views/tasks/TaskDetail'
import TaskEdit from './views/tasks/TaskEdit'
import CreateTask from './views/tasks/CreateTask'

import Sidebar from './components/Sidebar/sidebar';
import PrivateRoute from './config/privateroutes';

import { fetchNotifications, incrementUnread } from "./config/notificationsSlice";
import { requestNotificationPermission, onMessageListener } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch } from "react-redux";
import NotificationList from "./views/Notifications/NotificationList";


function App() {
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    requestNotificationPermission();

    dispatch(fetchNotifications());
    console.log("re-fetch")

    // Listen for Firebase messages in foreground
    onMessageListener()
      .then((payload) => {
        //toast.info(payload.notification.body);
        dispatch(fetchNotifications());
      })
      .catch((err) => console.log("Failed to receive message", err));
  }, [dispatch]);

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
                    <Route path="/notifications" element={<NotificationList />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/billing" element={<Invoicing />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/project/create" element={<CreateProject />} />
                    <Route path="/project/:id" element={<ProjectDetail />} />
                    <Route path="/project/:id/update" element={<UpdateProject />} />
                    <Route path="/project/:id/delete" element={<DeleteProject />} />
                    <Route path="/task/create/:projectId" element={<CreateTask />} />
                    <Route path="/task/:id" element={<TaskDetail />} />
                    <Route path="/task/edit/:id" element={<TaskEdit />} />
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
  const sidebarRef = useRef(null);

  const hamburgerRef = useRef(null);

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

    const handleClickOutside = (event) => {
      // Ensure the click is NOT inside the sidebar or hamburger button
      if (
        sidebarRef.current && !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current && !hamburgerRef.current.contains(event.target)
      ) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar}
        isMobile={isMobile} ref={sidebarRef} hamburgerRef={hamburgerRef} />

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
