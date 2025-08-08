// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { token } = useAuth();
  // Jika token ada, render komponen anak (misal: Dashboard) melalui <Outlet />
  // Jika tidak, arahkan ke halaman login
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
