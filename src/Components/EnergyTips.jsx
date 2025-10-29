import React from 'react'

const EnergyTips = () => {
  return (
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
  )
}

export default EnergyTips