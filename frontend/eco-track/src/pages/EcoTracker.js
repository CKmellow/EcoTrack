import React from "react";
import { Link } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/backgroundimg2.jpg";
import PerformanceInsights from "../Components/PerformanceInsights";
import EnergyTips from "../Components/EnergyTips";
import StatCards from "../Components/StatCards";
function EcoTracker() {
  const navigate = useNavigate();
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
      <Link to="/admin-dashboard" className="hover:text-[#144D52]">Dashboard</Link>
      <Link to="/analytics" className="hover:text-[#144D52]">Analytics</Link>
      <button  onClick={() => navigate("/signup")} className="bg-black hover:bg-[#1e8c6b] text-white rounded px-5 py-2 font-medium">
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
      <button onClick={() => navigate("/signup")} className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
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
      <StatCards/>

      {/* Trends Chart Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '2rem',
        marginBottom: '2.5rem',
      }}>
        <h3 className="text-lg font-semibold text-[#144D52] mb-2">
          Energy Consumption Trends
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          24-hour energy usage patterns and efficiency metrics
        </p>
        <Line
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
              {
                label: 'Energy Consumption',
                data: [60, 80, 75, 110, 90, 130, 100],
                fill: true,
                backgroundColor: function(context) {
                  const chart = context.chart;
                  const {ctx, chartArea} = chart;
                  if (!chartArea) return null;
                  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                  gradient.addColorStop(0, 'rgba(0, 200, 83, 0.4)'); // Green
                  gradient.addColorStop(1, 'rgba(0, 200, 83, 0)');
                  return gradient;
                },
                borderColor: '#00C853', // Green
                tension: 0.4, // Smooth curve
                pointRadius: 0,
                borderWidth: 3,
                pointBackgroundColor: '#00C853',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#00C853',
                pointHoverBorderColor: '#fff',
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              y: {
                min: 40,
                max: 140,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { color: '#333' },
              },
              x: {
                grid: { color: 'rgba(0,0,0,0.05)', drawOnChartArea: true },
                ticks: { color: '#333' },
              },
            },
          }}
        />
      </div>

      {/* Tips & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Energy Saving Tips */}
        <EnergyTips/>

        {/* Performance Insights */}
        <PerformanceInsights/>
    </div>
    </div>
    </div>

  );
}


export default EcoTracker;

