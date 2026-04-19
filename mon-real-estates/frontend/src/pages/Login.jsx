import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      const role = response.data?.user?.role;
      navigate(role === "admin" ? "/admin" : "/listings");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/listings"} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#2c2863]">Sign in to your account</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e81d2b] focus:outline-none focus:ring-2 focus:ring-[#e81d2b]/20"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e81d2b] focus:outline-none focus:ring-2 focus:ring-[#e81d2b]/20"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#e81d2b] px-4 py-3 text-white transition hover:bg-[#c01622] disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#e81d2b] hover:text-[#c01622]">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
