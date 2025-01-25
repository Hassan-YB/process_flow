import React from "react";
import { Navigate } from "react-router-dom";

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/auth/signin" replace />;
  }

  return children;
};

export default PrivateRoute;

