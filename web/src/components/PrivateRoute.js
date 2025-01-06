import React from "react";
import { Navigate } from "react-router-dom";

// Utility function to check if the user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken"); // Returns true if an access token exists
};

// PrivateRoute component
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
