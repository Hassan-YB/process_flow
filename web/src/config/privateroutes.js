import React from "react";
import { Navigate } from "react-router-dom";

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  // If the user is not logged in, redirect to the Sign In page
  return accessToken ? children : <Navigate to="/auth/signin" />;
};

export default PrivateRoute;
