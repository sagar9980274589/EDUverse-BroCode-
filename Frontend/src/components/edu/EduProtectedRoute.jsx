import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const EduProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.data.userdata);
  const isLoggedIn = user && user._id;

  if (!isLoggedIn) {
    // Redirect to the educational platform login page if not logged in
    return <Navigate to="/edu/login" replace />;
  }

  return children;
};

export default EduProtectedRoute;
