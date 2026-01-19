import React from "react";

export default function AdminSidebar({ tab, setTab, onLogout }) {
  return (
    <aside className="w-64 bg-black text-white flex flex-col py-8 px-6 min-h-screen shadow-lg">
      <div className="flex items-center mb-10">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded mr-2" />
        <span className="font-bold text-lg">EcoTrack Admin</span>
      </div>
      <nav className="flex flex-col gap-4">
        <button onClick={() => setTab("users")}
          className={`text-left px-3 py-2 rounded transition ${tab === "users" ? "bg-green-700" : "hover:bg-green-900"}`}>Users</button>
        <button onClick={() => setTab("departments")}
          className={`text-left px-3 py-2 rounded transition ${tab === "departments" ? "bg-green-700" : "hover:bg-green-900"}`}>Departments</button>
        {/* Add more nav items for Devices, Logs, Analytics */}
      </nav>
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="w-full bg-gradient-to-r from-green-700 to-teal-400 text-white rounded px-5 py-2 font-medium mt-10"
        >Logout</button>
      </div>
    </aside>
  );
}
