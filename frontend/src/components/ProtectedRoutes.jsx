import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const { error, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return <p>Loading ....</p>;
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
}

export default ProtectedRoutes;
