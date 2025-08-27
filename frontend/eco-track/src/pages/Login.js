import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "Company Admin",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.detail || "Login failed");
      return;
    }

    const data = await response.json();

    // store token in localStorage
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("userEmail", form.email);

    alert("Login successful 🚀");
    console.log("Token saved:", data.access_token);

    // Redirect to dashboard (or any protected page)
    window.location.href = "/dashboard";
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Something went wrong");
  }
};


  return (
    <div className="flex h-screen">
      {/* Left Side - Image with Black Overlay */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="/formbg.jpg"
          alt="EcoTrack Illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-r from-green-800 to-green-400 p-6">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            EcoTrack Login
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Role */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option>Company Admin</option>
              <option>Department Admin</option>
            </select>

            {/* Remember Me + Reset */}
            <div className="flex items-center justify-between text-sm text-white">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                Remember me
              </label>
              <Link to="/reset-password" className="text-green-800 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-teal-400 text-white py-2 rounded-lg  hover:from-green-600 hover:to-teal-800 "
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-black">
            New to EcoTrack?{" "}
            <Link to="/signup" className="text-green-800 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}