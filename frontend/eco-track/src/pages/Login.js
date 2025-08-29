import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";   // ✅ useNavigate for redirects
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // ✅ hook for navigation

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
      };
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setLoading(false);
      if (!response.ok) {
        const err = await response.json();
        toast.error(err.detail || "Login failed", { position: "top-right" });
        return;
      }

      const data = await response.json();

      // ✅ Save token + role
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userEmail", form.email);
      localStorage.setItem("role", data.role);

      toast.success("🚀 Login successful!", { position: "top-right" });

      // ✅ Redirect by role
      setTimeout(() => {
        if (data.role === "company_admin") {
          navigate("/admin-dashboard");
        } else if (data.role === "department_user") {
          navigate("/department-dashboard");
        } else {
          navigate("/"); // fallback
        }
      }, 1500);

    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong", { position: "top-right" });
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

            {/* Password with toggle icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 pr-10"
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-green-600 text-xl"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

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
              className="w-full bg-gradient-to-r from-green-600 to-teal-400 text-white py-2 rounded-lg hover:from-green-600 hover:to-teal-800"
            >
              {loading ? "Logging in..." : "Login"}
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ fontSize: "0.95rem", minHeight: "40px", padding: "8px 16px" }}
      />
    </div>
  );
}
