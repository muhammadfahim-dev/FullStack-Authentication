import React, { useState } from "react";
import { authFail, loginUser, start } from "../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ email: "", password: "" });

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(start());
    try {
      await axios.post("/api/v1/user/login", form);
      const res = await axios.get("/api/v1/user/me");
      dispatch(loginUser(res.data));
      navigate("/");
    } catch (error) {
      dispatch(
        authFail(error.response?.data?.message || "Invalid credentials")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">Login</h1>

        {error && (
          <p className="text-red-600 bg-red-100 py-2 px-4 rounded text-center">
            {error}
          </p>
        )}

        <form onSubmit={submitHandler} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
