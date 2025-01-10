import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    // Redirect to login if no token is found
    return <Navigate to="/auth/signin" />;
  }

  // Render children if authenticated
  return children;
};

export default AuthGuard;
