import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "company_admin", // signup always creates company admin
        department_id: "",
        is_active: true,
      };

      const signupRes = await fetch("http://127.0.0.1:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!signupRes.ok) {
        const err = await signupRes.json();
        toast.error(err.detail || "Signup failed", { position: "top-right" });
        setLoading(false);
        return;
      }

      // ✅ Signup successful → login immediately
      const loginRes = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      setLoading(false);

      if (!loginRes.ok) {
        toast.error("Signup succeeded but login failed", { position: "top-right" });
        return;
      }

      const data = await loginRes.json();
      // Save token + role
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userEmail", form.email);
      localStorage.setItem("role", data.role);

      toast.success("🎉 Account created & logged in!", { position: "top-right" });

      // ✅ Redirect by role
      setTimeout(() => {
        if (data.role === "company_admin") {
          navigate("/admin-dashboard");
        } else if (data.role === "department_user") {
          navigate("/department-dashboard");
        } else {
          navigate("/");
        }
      }, 1500);

    } catch (err) {
      setLoading(false);
      toast.error("Network error: " + err.message, { position: "top-right" });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="/formbg.jpg"
          alt="EcoTrack Illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-r from-green-800 to-green-400 p-6">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
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

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Password with toggle */}
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
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-green-800 font-medium hover:underline">
              Log in
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
