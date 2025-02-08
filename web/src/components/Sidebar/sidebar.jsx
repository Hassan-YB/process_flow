import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";
import './sidebar.css'
import { showErrorToast } from "../../utils/toastUtils";
// assets
import logoDark from '../../assets/img/processflow_logo.png';
import {
  FaChartPie, FaChevronDown, FaFileInvoiceDollar,
  FaUserCircle, FaSignOutAlt, FaBars
} from "react-icons/fa";


const Sidebar = ({ isSidebarVisible, toggleSidebar, isMobile }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  

  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      dispatch(logout(refreshToken));
      // Clear the local storage and update state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
      navigate("/auth/signin");
      //showSuccessToast("Logged out successfully!");
    } else {
      showErrorToast("Already logged out.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };


  return (
    <>
      {/* Hamburger button for mobile screens */}
      {isMobile && (
        <div className="mobile-header">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="mobile-logo">
          <img src={logoDark} alt="Logo" />
        </div>
      </div>
      )}

      <div className={`sidebar ${isSidebarVisible ? "visible" : "hidden"}`}>
        <div className="sidebar-content">
        {!isMobile && (
            <div className="sidebar-logo">
              <img src={logoDark} alt="Logo" />
            </div>
          )}
          <ul className="sidebar-menu">
            <NavLink to="/" className="text-decoration-none">
              <li className={`dropdown-item ${window.location.pathname === '/' ? 'active' : ''}`}>
                <FaChartPie />Dashboard
              </li></NavLink>

            {/* Dropdown 1 */}
            <li onClick={() => toggleDropdown("profile")} className="dropdown-item">
              <FaUserCircle />  Profile
              <FaChevronDown
                className={`chevron ${openDropdown === "profile" ? "rotate" : ""}`}
              />
            </li>
            {openDropdown === "profile" && (
              <ul className="dropdown-list">
                <NavLink to="/profile" className="text-decoration-none text-dark">
                  <li className={`dropdown-item ${window.location.pathname === '/profile' ? 'active' : ''}`}>
                    Update Profile</li></NavLink>
                <NavLink to="/change-password" className="text-decoration-none text-dark">
                  <li className={`dropdown-item ${window.location.pathname === '/change-password' ? 'active' : ''}`}>
                    Change Password</li></NavLink>
              </ul>
            )}

            {/* Dropdown 2 */}
            <li onClick={() => toggleDropdown("subscription")} className="dropdown-item">
              <FaFileInvoiceDollar /> Subscription <FaChevronDown className={`chevron ${openDropdown === "subscription" ? "rotate" : ""}`} />
            </li>
            {openDropdown === "subscription" && (
              <ul className="dropdown-list">
                <NavLink to="/pricing" className="text-decoration-none">
                  <li className={`dropdown-item ${window.location.pathname === '/pricing' ? 'active' : ''}`}>
                    Pricing</li></NavLink>
                <NavLink to="/billing" className="text-decoration-none text-dark">
                  <li className={`dropdown-item ${window.location.pathname === '/billing' ? 'active' : ''}`}>
                    Billing</li></NavLink>
              </ul>
            )}

            {/* Dropdown 3 
            <li onClick={() => toggleDropdown("projects")} className="dropdown-item">
              <FaFileInvoiceDollar /> Projects <FaChevronDown className={`chevron ${openDropdown === "projects" ? "rotate" : ""}`} />
            </li>
            {openDropdown === "projects" && (
              <ul className="dropdown-list">
                <NavLink to="/projects" className="text-decoration-none">
                  <li className={`dropdown-item ${window.location.pathname === '/projects' ? 'active' : ''}`}>
                  Projects</li></NavLink>
              </ul>
            )}*/}

            <NavLink to="/notifications" className="text-decoration-none">
              <li className={`dropdown-item ${window.location.pathname === '/notifications' ? 'active' : ''}`}>
                <FaChartPie />Notifications
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span> // Show counter
                )}
              </li></NavLink>

          </ul>
        </div>
        <div className="sidebar-footer">
          <li onClick={handleLogout} className="logout-item">
            <FaSignOutAlt />
          </li>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
