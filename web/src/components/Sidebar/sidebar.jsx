import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";
import './sidebar.css'
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
// assets
import logoDark from '../../assets/img/processflow_logo.png';
import {
  FaChartPie, FaProjectDiagram, FaInbox,
  FaBell, FaCommentDots, FaChevronDown, FaFileInvoiceDollar, FaUserCircle, FaSignOutAlt
} from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/users`;

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

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
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logoDark} alt="Logo" />
      </div>
      <ul className="sidebar-menu">
        <li className="dropdown-item">
          <Link to="/" className="text-decoration-none text-dark"><FaChartPie />
            <span className="mx-2">Dashboard</span></Link>
        </li>

        {/* Dropdown 1 */}
        <li onClick={() => toggleDropdown("profile")} className="dropdown-item">
          <FaUserCircle />  Profile
          <FaChevronDown
            className={`chevron ${openDropdown === "profile" ? "rotate" : ""}`}
          />
        </li>
        {openDropdown === "profile" && (
          <ul className="dropdown-list">
            <li><Link to="/profile" className="text-decoration-none text-dark">Update Profile</Link></li>
            <li><Link to="/change-password" className="text-decoration-none text-dark">Change Password</Link></li>
          </ul>
        )}

        {/* Dropdown 2 */}
        <li onClick={() => toggleDropdown("subscription")} className="dropdown-item">
          <FaFileInvoiceDollar /> Subscription <FaChevronDown className={`chevron ${openDropdown === "subscription" ? "rotate" : ""}`} />
        </li>
        {openDropdown === "subscription" && (
          <ul className="dropdown-list">
            <li><Link to="/pricing" className="text-decoration-none text-dark">Pricing</Link></li>
            <li><Link to="/billing" className="text-decoration-none text-dark">Billing</Link></li>
          </ul>
        )}

      </ul>


      <div className="sidebar-footer">
        <li onClick={handleLogout} className="logout-item">
          <FaSignOutAlt /> Logout
        </li>
      </div>
    </div>
  );
};

export default Sidebar;
