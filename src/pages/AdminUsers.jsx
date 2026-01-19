import React from "react";

export default function AdminUsers({ admins, loading, openAddUserModal, openEditUserModal, handleDeleteUser }) {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-700">Department Admins</h2>
        <button
          onClick={openAddUserModal}
          className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-4 py-2 rounded-lg font-medium shadow hover:scale-105 transition"
        >Add Admin</button>
      </div>
      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-green-50">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 px-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="py-2 px-4"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="py-2 px-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="py-2 px-4 flex gap-2">
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-gray-500">No department admins found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-green-50">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="border-b">
                  <td className="py-2 px-4">{admin.name}</td>
                  <td className="py-2 px-4">{admin.email}</td>
                  <td className="py-2 px-4">{admin.phone || "-"}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => openEditUserModal(admin)}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
                    >Edit</button>
                    <button
                      onClick={() => handleDeleteUser(admin)}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
