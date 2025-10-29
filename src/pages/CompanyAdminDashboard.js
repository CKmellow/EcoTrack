import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import AnalyticsDashboard from "../Components/CompanyAnalytics";
import AddDepartmentModal from "../Components/AddDepartmentModal";
import AddDepartmentAdminModal from "../Components/AddDepartmentAdminModal";// import modal

function CompanyAdminDashboard() {
  const navigate = useNavigate();
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddDeptAdmin, setShowAddDeptAdmin] = useState(false);

  const handleDeptAdded = () => {
    // Optionally refresh stats or department list here
    console.log("Department added successfully!");
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F8F2] flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white border border-green-200 rounded-xl p-6 shadow text-center">
            <p className="text-gray-600 text-sm">Total Energy Usage</p>
            <h3 className="text-3xl font-bold text-[#24A47F]">12,400 kWh</h3>
            <p className="text-xs text-green-600 mt-2">+5% this week</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow text-center">
            <p className="text-gray-600 text-sm">Carbon Footprint</p>
            <h3 className="text-3xl font-bold text-[#24A47F]">7.5t CO₂</h3>
            <p className="text-xs text-green-600 mt-2">-18% this month</p>
          </div>
          <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow text-center">
            <p className="text-gray-600 text-sm">Efficiency Score</p>
            <h3 className="text-3xl font-bold text-[#24A47F]">95%</h3>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div className="h-2 bg-green-500 rounded-full w-[91%]"></div>
            </div>
            <p className="text-xs text-green-700 mt-1">Excellent</p>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
            <h4 className="text-lg font-semibold text-[#144D52] mb-4">Recent Activity</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>✔️ Department B reduced energy by 8% this week</li>
              <li>✔️ New solar panels installed on HQ roof</li>
              <li>⚠️ High usage alert in Manufacturing</li>
              <li>✔️ Monthly sustainability report generated</li>
            </ul>
          </div>

          {/* Quick Actions */}
          {/* Quick Actions */}
<div className="bg-white border border-green-200 rounded-xl p-6 shadow">
  <h4 className="text-lg font-semibold text-green-700 mb-4">Quick Actions</h4>
  <div className="flex flex-col space-y-4">
    <button
      onClick={() => setShowAddDept(true)}
      className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform"
    >
      Add Department
    </button>

    {/* 🔹 New Button for Department Admin */}
    <button
      onClick={() => { setShowAddDeptAdmin(true); console.log("Open Add Department Admin Modal"); }}
      className="bg-gradient-to-r from-teal-500 to-green-400 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform"
    >
      Add Department Admin
    </button>

    <button className="bg-white border border-gray-300 text-[#144D52] px-6 py-3 rounded-lg hover:bg-gray-100">
      Generate Report
    </button>
    <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-[#1e8c6b]">
      Send Alert
    </button>
    <button
      onClick={() => navigate("/bills")}
      className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform"
    >
      Bill Management
    </button>
  </div>
</div>

        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mt-10 shadow">
          <h4 className="text-lg font-semibold text-[#144D52] mb-6">Analytics Overview</h4>
          <AnalyticsDashboard />
        </div>
      </main>

      <Footer />

      {/* Add Department Modal */}
      {/* Add Department Modal */}
      {showAddDept && (
        <AddDepartmentModal
          onClose={() => setShowAddDept(false)}
          onSuccess={handleDeptAdded}
        />
      )}

      {/* Add Department Admin Modal */}
      {showAddDeptAdmin && (
        <AddDepartmentAdminModal
          onClose={() => setShowAddDeptAdmin(false)} // FIXED: close the correct modal
          onSuccess={handleDeptAdded}
        />
      )}

    </div>
  );
}

export default CompanyAdminDashboard;
