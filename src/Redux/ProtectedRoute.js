import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // This looks specifically for the "auth" key we added in rootReducer
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // If not logged in, go to login
    return <Navigate to="/login" />;
  }

  // If logged in, show the requested page (ViewPage or AddPage)
  return children;
};

export default ProtectedRoute;
