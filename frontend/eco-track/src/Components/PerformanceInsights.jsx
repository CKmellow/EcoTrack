import React from 'react'

const PerformanceInsights = () => {
  return (
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
  )
}

export default PerformanceInsights