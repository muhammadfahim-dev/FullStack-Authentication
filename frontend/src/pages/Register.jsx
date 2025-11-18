import React, { useState } from "react";
import { registerUser, start, authFail } from "../features/AuthSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(start());
    try {
      const res = await axios.post("/api/v1/user/register", form);
      dispatch(registerUser(res.data));
      navigate("/login");
    } catch (error) {
      dispatch(
        authFail(error.response?.data?.message || "Invalid credentials")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">Register</h1>

        {error && (
          <p className="text-red-600 bg-red-100 py-2 px-4 rounded text-center">
            {error}
          </p>
        )}

        <form onSubmit={submitHandler} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
            Register
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
