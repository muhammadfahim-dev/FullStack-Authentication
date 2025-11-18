import React from "react";
import { logout, authFail, start } from "../features/AuthSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function Dashboard() {
  const { error, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    dispatch(start());
    try {
      await axios.get("/api/v1/user/logout");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      dispatch(
        authFail(error.response?.data?.message) ||
          "Something went wrong while logging out"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">
          Welcome {user?.name || "User"}! 🔒
        </h1>

        {error && (
          <p className="text-center text-red-600 bg-red-100 py-2 px-4 rounded">
            {error}
          </p>
        )}

        <button
          onClick={logoutHandler}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
