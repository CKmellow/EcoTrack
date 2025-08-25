import React from "react";
import backgroundImg from "../assets/backgroundimg2.jpg";
function EcoTracker() {
  return (
    <div className="w-full min-h-screen flex flex-col">

      <header
  className="relative w-full min-h-[100vh] flex flex-col px-8 py-10 bg-cover bg-center"
  style={{ backgroundImage: `url(${backgroundImg})` }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/40 z-0"></div>

  <div className="relative z-10 flex justify-between items-center">
    {/* Logo */}
    <div className="flex items-center space-x-2">
      <div className="w-20 h-10 rounded flex items-center justify-center text-white font-bold">
       
        <img src="/logo.png" alt="Logo" />
         <span className="text-white font-semibold text-lg">EcoTrack</span>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex items-center space-x-6 text-gray-200 font-medium backdrop-blur-sm">
      <a href="#" className="hover:text-[#144D52]">Dashboard</a>
      <a href="#" className="hover:text-[#144D52]">Analytics</a>
      <button className="bg-black hover:bg-[#1e8c6b] text-white rounded px-5 py-2 font-medium">
        Get Started
      </button>
    </nav>
  </div>

  {/* Hero Section */}
  <div className="relative z-15 w-full text-center mt-20">
    <h1 className="text-6xl font-bold text-white">
      Track Your Company’s <br />
      <span className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-400">
        Energy Impact
      </span>
    </h1>

    <p className="text-white mt-4 text-lg">
      Track energy use in real time, cut your carbon footprint, and drive sustainable growth.
    </p>

    <div className="flex justify-center space-x-4 mt-20">
      <button className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
        Start Monitoring →
      </button>
      <button className="bg-white border border-gray-300 text-[#144D52] px-6 py-3 rounded-lg hover:bg-gray-100">
        View Demo
      </button>
    </div>
  </div>
</header>

     


      {/* Stats Section */}
       
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
       
        <div className="bg-black shadow-md border border-[#D5E6AE] rounded-xl p-6 text-center">
          <p className="text-[#24A47F] font-semibold text-2xl">-23%</p>
          <p className="text-white">Carbon Reduction</p>
        </div>

        <div className="bg-black shadow-md border border-[#648E94] rounded-xl p-6 text-center">
          <p className="text-[#24A47F] font-semibold text-2xl">89%</p>
          <p className="text-white">Efficiency Score</p>
        </div> 

        <div className="bg-black shadow-md border border-[#F5D67B] rounded-xl p-6 text-center">
          <p className="text-[#24A47F] font-semibold text-2xl">12k</p>
          <p className="text-white">kWh Saved</p>
        </div>
        </div>
        <div className="w-full bg-[#F5F8F2] py-10 px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-400">
          Real-Time Energy Dashboard
        </h2>
        <p className="text-gray-600 mt-5 max-w-1xl mx-auto">
          Monitor your company's energy consumption, efficiency metrics, and 
          environmental impact in real-time.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
          <p className="text-gray-600 text-sm font-medium"> Current Usage</p>
          <h3 className="text-2xl font-bold text-[#24A47F]">847 kW</h3>
          <p className="text-sm text-green-600">-12% from last hour</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
          <p className="text-gray-600 text-sm font-medium">Efficiency Score</p>
          <h3 className="text-2xl font-bold text-[#24A47F]">89%</h3>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div className="h-2 bg-green-500 rounded-full w-[89%]"></div>
          </div>
          <p className="text-xs text-green-700 mt-1">Excellent performance</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
          <p className="text-gray-600 text-sm font-medium"> Carbon Footprint</p>
          <h3 className="text-2xl font-bold text-[#24A47F]">2.3t CO₂</h3>
          <p className="text-sm text-green-600">↓ 23% this month</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
          <p className="text-gray-600 text-sm font-medium"> Active Alerts</p>
          <h3 className="text-2xl font-bold text-[#24A47F]">2</h3>
          <span className="inline-block mt-2 text-xs bg-black text-white px-3 py-1 rounded-full">
            High Usage Detected
          </span>
        </div>
      </div>

      {/* Trends Chart Section */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8 mb-10">
        <h3 className="text-lg font-semibold text-[#144D52] mb-2">
          Energy Consumption Trends
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          24-hour energy usage patterns and efficiency metrics
        </p>
        <div className="flex justify-center items-center h-48 text-gray-400">
       
          <p className="ml-2">Interactive energy chart visualization</p>
        </div>
      </div>

      {/* Tips & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Energy Saving Tips */}
        <div className="bg-white shadow-sm border border-green-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-green-700 mb-4">
             Energy Saving Tips
          </h4>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>
              <span className="text-green-600 font-medium">•</span> Reduce HVAC usage during off-hours
              <p className="text-gray-500 text-xs">Potential savings: 15% monthly</p>
            </li>
            <li>
              <span className="text-green-600 font-medium">•</span> Switch to LED lighting in Conference Room B
              <p className="text-gray-500 text-xs">Potential savings: 8% lighting costs</p>
            </li>
            <li>
              <span className="text-green-600 font-medium">•</span> Install smart power strips for workstations
              <p className="text-gray-500 text-xs">Potential savings: 5% overall consumption</p>
            </li>
          </ul>
        </div>

        {/* Performance Insights */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-[#144D52] mb-4">
             Performance Insights
          </h4>
          <ul className="space-y-4 text-sm text-gray-700">
            <li className="flex justify-between">
              <span>Energy Efficiency</span>
              <span className="text-green-700 font-medium">Excellent</span>
            </li>
            <li className="flex justify-between">
              <span>Cost Reduction</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">2,340k saved</span>
            </li>
            <li className="flex justify-between">
              <span>Carbon Impact</span>
              <span className="bg-black text-white px-2 py-1 rounded text-xs">-480 kg CO₂</span>
            </li>
            <li className="flex justify-between">
              <span>Sustainability Score</span>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">A+ Rating</span>
            </li>
          </ul>
        </div>
    </div>
    </div>
    </div>

  );
}


export default EcoTracker;

