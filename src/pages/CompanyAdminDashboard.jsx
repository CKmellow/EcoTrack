import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/home/layout/ui/Footer.jsx";
import AdminSidebar from "../components/auth/admin/dash/AdminSidebar.jsx";
import AdminUsers from "../components/auth/admin/dash/AdminUsers.jsx";
// Ensure we use the AdminDepartments with device logic, not the pages one
import AdminDepartments from "../components/auth/admin/dash/AdminDepartments.jsx";

// --- Modern Company Admin Dashboard ---
export default function CompanyAdminDashboard() {
  const [tab, setTab] = useState("users");
  const [admins, setAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [userForm, setUserForm] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  // Fetch admins and departments
  const fetchData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    Promise.all([
      fetch("http://127.0.0.1:8000/api/admin/company/department-admins", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://127.0.0.1:8000/api/admin/company/departments", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([adminsRes, deptsRes]) => {
        setAdmins(Array.isArray(adminsRes) ? adminsRes : []);
        setDepartments(deptsRes.departments || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load dashboard data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // --- User CRUD Handlers ---
  const handleAddUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/company/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...userForm, role: "department_admin" }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.detail || "Failed to add user");
        return;
      }
      toast.success("User added successfully");
      setShowUserModal(false);
      fetchData();
    } catch {
      toast.error("Network error");
    }
  };

  const handleEditUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/company/edit-user/${selectedUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(userForm),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.detail || "Failed to update user");
        return;
      }
      toast.success("User updated successfully");
      setShowUserModal(false);
      fetchData();
    } catch {
      toast.error("Network error");
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete user ${user.name}?`)) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/company/delete-user/${user._id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.detail || "Failed to delete user");
        return;
      }
      toast.success("User deleted");
      fetchData();
    } catch {
      toast.error("Network error");
    }
  };

  // --- Modal Handlers ---
  const openAddUserModal = () => {
    setModalMode("add");
    setUserForm({ name: "", email: "", phone: "" }); // no password field
    setShowUserModal(true);
  };
  const openEditUserModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setUserForm({ name: user.name, email: user.email, phone: user.phone || "", password: "" });
    setShowUserModal(true);
  };

  // --- UI ---
  return (
    <div className="w-full min-h-screen flex bg-[#f5f8f2]">
      <AdminSidebar tab={tab} setTab={setTab} onLogout={() => { localStorage.clear(); navigate("/login"); }} />
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-[#144D52] mb-8">Company Admin Dashboard</h1>
        {tab === "users" && (
          <AdminUsers
            admins={admins}
            loading={loading}
            openAddUserModal={openAddUserModal}
            openEditUserModal={openEditUserModal}
            handleDeleteUser={handleDeleteUser}
          />
        )}
        {tab === "departments" && (
          <AdminDepartments
            departments={departments}
            loading={loading}
          />
        )}
      </main>
      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl"
              aria-label="Close"
            >×</button>
            <h3 className="text-lg font-bold mb-4">
              {modalMode === "add" ? "Add Department Admin" : "Edit Department Admin"}
            </h3>
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                modalMode === "add" ? handleAddUser() : handleEditUser();
              }}
            >
              <input
                type="text"
                placeholder="Name"
                className="w-full border p-2 rounded"
                value={userForm.name}
                onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={userForm.email}
                onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border p-2 rounded"
                value={userForm.phone}
                onChange={e => setUserForm(f => ({ ...f, phone: e.target.value }))}
              />
              {/* Only show password field in edit mode */}
              {modalMode === "edit" && (
                <input
                  type="password"
                  placeholder="New Password (leave blank to keep current)"
                  className="w-full border p-2 rounded"
                  value={userForm.password || ""}
                  onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))}
                />
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >Cancel</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >{modalMode === "add" ? "Add" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
