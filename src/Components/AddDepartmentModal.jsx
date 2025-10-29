// Components/AddDepartmentModal.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AddDepartmentModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    employee_count: "",
    expected_power_intensity: "",
    department_type: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/admin/company/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          employee_count: Number(form.employee_count),
          expected_power_intensity: Number(form.expected_power_intensity),
        }),
      });

      setLoading(false);

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.detail || "Failed to create department");
        return;
      }

      toast.success("Department created successfully!");
      onSuccess(); // callback to refresh list if needed
      onClose();
    } catch (error) {
      setLoading(false);
      toast.error("Network error: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add Department</h3>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Department Name"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            name="employee_count"
            value={form.employee_count}
            onChange={handleChange}
            placeholder="Employee Count"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            name="expected_power_intensity"
            value={form.expected_power_intensity}
            onChange={handleChange}
            placeholder="Expected Power Intensity"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="department_type"
            value={form.department_type}
            onChange={handleChange}
            placeholder="Department Type (IT, HR, Finance...)"
            className="w-full border px-3 py-2 rounded"
            required
          />

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
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
