import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    role: "Company Admin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data:", form);
    // TODO: integrate with backend API
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
            {/* Company Name */}
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Company Name"
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
    </div>
  );
}