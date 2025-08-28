import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department_id: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: form.email,
        password: form.password,
        role: "company_admin", // always company admin
        name: form.name,
        phone: form.phone,
        department_id: "", // always empty
        is_active: true
      };
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("🎉 Account created successfully!", { position: "top-right" });
        setTimeout(() => navigate("/bills"), 2000);
      } else {
        const error = await res.json();
        toast.error("Signup failed: " + (error.detail || "Unknown error"), { position: "top-right" });
      }
    } catch (err) {
      toast.error("Network error: " + err.message, { position: "top-right" });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src="/formbg.jpg"
          alt="EcoTrack Illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-r from-green-600 to-green-400 p-6">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-center bg-white mb-4 text-transparent bg-clip-text ">
            Create EcoTrack Account
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />

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

            {/* Phone (optional) */}
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-teal-400 text-white py-2 rounded-lg hover:from-green-600 hover:to-teal-800"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-green-800 font-medium hover:underline">
              Login
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