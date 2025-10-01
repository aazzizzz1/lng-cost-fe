import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return user ? <Navigate to="/dashboard" /> : children; // Redirect ke dashboard jika sudah login
};

export default PublicRoute;
