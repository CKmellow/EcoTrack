import React from "react";

export default function AdminDepartments({ departments, loading }) {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-700">Departments</h2>
        {/* Add button for creating new department can go here */}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-green-100 to-green-300 border border-green-200 rounded-2xl shadow p-6 flex flex-col items-start animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            </div>
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="text-gray-500">No departments found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.department_id} className="bg-gradient-to-br from-green-100 to-green-300 border border-green-200 rounded-2xl shadow p-6 flex flex-col items-start hover:shadow-xl transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-[#144D52]">{dept.name}</span>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-2">ID: {dept.department_id}</span>
              {/* Add more department info or actions here */}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
