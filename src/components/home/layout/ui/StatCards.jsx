import React from 'react'

const StatCards = () => {
  return (
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
  )
}

export default StatCards