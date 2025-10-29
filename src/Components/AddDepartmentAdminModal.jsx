// Components/AddDepartmentAdminModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AddDepartmentAdminModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch list of departments to populate dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      setFetching(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://127.0.0.1:8000/api/admin/company/departments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch departments");

        const data = await res.json();
        // Make sure we get an array
        setDepartments(Array.isArray(data.departments) ? data.departments : []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        toast.error("Failed to load departments");
        setDepartments([]);
      } finally {
        setFetching(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/company/add-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, role: "department_admin" }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.detail || "Failed to add department admin");
        setLoading(false);
        return;
      }

      toast.success("Department admin added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add Department Admin</h3>

        {fetching ? (
          <p className="text-center">Loading departments...</p>
        ) : (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border px-3 py-2 rounded"
              required
            />

            {/* Department dropdown */}
            <select
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Department</option>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <option key={dept.department_id || dept._id} value={dept.department_id || dept._id}>
                    {dept.name || "Unnamed Department"}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No departments available
                </option>
              )}
            </select>

            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {loading ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
