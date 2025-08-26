import React from 'react'
import { useNavigate } from 'react-router-dom'
const Header = () => {
    const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-green-700 to-teal-400 py-8 px-8 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded" />
        </div>
        <nav className="flex items-center space-x-6 text-white font-medium">
          <a href="/admin-dashboard" className="hover:text-[#144D52]">Dashboard</a>
          <a href="/admin-reports" className="hover:text-[#144D52]">Reports</a>
          <a href="/admin-settings" className="hover:text-[#144D52]">Settings</a>
          <button onClick={() => navigate("/")} className="bg-black hover:bg-[#1e8c6b] text-white rounded px-5 py-2 font-medium">Logout</button>
        </nav>
      </header>
  )
}

export default Header