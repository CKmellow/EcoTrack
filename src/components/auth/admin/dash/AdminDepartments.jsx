
import React, { useState, useEffect } from "react";

export default function AdminDepartments({ departments, loading }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [devices, setDevices] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [deviceDetailsLoading, setDeviceDetailsLoading] = useState(false);

  // Fetch devices for selected department
  useEffect(() => {
    if (!selectedDept || !selectedDept.department_id) return;
    setDeviceLoading(true);
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/api/devices/devices/department/${selectedDept.department_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        let devices = Array.isArray(data.devices) ? data.devices : [];
        // Map backend keys to frontend keys
        devices = devices.map(d => ({
          ...d,
          name: d.deviceName || d.name || '',
          department_id: d.deptId || d.department_id || '',
        }));
        setDevices(devices);
        setDeviceLoading(false);
      })
      .catch(() => setDeviceLoading(false));
  }, [selectedDept]);

  // Fetch device details
  useEffect(() => {
    if (!selectedDevice) return;
    setDeviceDetailsLoading(true);
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/api/devices/devices/${selectedDevice._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setDeviceDetails(data);
        setDeviceDetailsLoading(false);
      })
      .catch(() => setDeviceDetailsLoading(false));
  }, [selectedDevice]);

  // Filtered devices
  const filteredDevices = devices.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-700">Departments</h2>
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
      ) : selectedDept ? (
        <div>
          <button
            className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setSelectedDept(null)}
          >← Back to Departments</button>
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-[#144D52] mb-2">{selectedDept.name}</h3>
            <div className="flex flex-wrap gap-4 mb-2">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Dept ID: {selectedDept.department_id}</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Employees: {selectedDept.employee_count}</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Type: {selectedDept.department_type}</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Power Intensity: {selectedDept.expected_power_intensity}</span>
            </div>
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {Object.entries(selectedDept.metrics || {}).map(([key, val]) => (
                <div key={key} className="bg-green-50 border border-green-200 rounded p-2 text-xs">
                  <div className="font-semibold mb-1">{key.replace(/_/g, " ")}</div>
                  <div>Consumption: {val.consumption}</div>
                  <div>Cost: {val.cost}</div>
                  <div>Emissions: {val.emissions}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Devices */}
          <div className="mb-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search devices..."
              className="border p-2 rounded w-full max-w-xs"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {deviceLoading ? (
            <div className="text-gray-500">Loading devices...</div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-gray-500">No devices found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredDevices.map(device => (
                <div key={device._id} className="bg-white border border-green-200 rounded-lg p-4 shadow">
                  <div className="font-semibold text-green-800">{device.name}</div>
                  <div className="text-xs text-gray-500">Type: {device.type}</div>
                  <div className="text-xs text-gray-400">Device ID: {device._id}</div>
                  <div className="text-xs text-gray-400">Dept ID: {device.department_id}</div>
                  <button
                    className="mt-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                    onClick={() => setSelectedDevice(device)}
                  >View Details</button>
                </div>
              ))}
            </div>
          )}
          {/* Device details block - outside device grid */}
          <div>
            {deviceDetailsLoading && (
              <div className="text-gray-500 mt-4">Loading device details...</div>
            )}
            {!deviceDetailsLoading && deviceDetails && (
              <div className="mt-4 p-4 border border-green-300 rounded bg-green-50">
                <h4 className="font-bold text-green-800 mb-2">Device Details</h4>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(deviceDetails, null, 2)}</pre>
                <button
                  className="mt-2 px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                  onClick={() => { setSelectedDevice(null); setDeviceDetails(null); }}
                >Close Details</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <button
              key={dept.department_id}
              className="bg-gradient-to-br from-green-100 to-green-300 border border-green-200 rounded-2xl shadow p-6 flex flex-col items-start hover:shadow-xl transition cursor-pointer text-left"
              onClick={() => setSelectedDept(dept)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-[#144D52]">{dept.name}</span>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-2">Dept ID: {dept.department_id}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-2">Employees: {dept.employee_count}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-2">Type: {dept.department_type}</span>
              {/* Add more department info or actions here */}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
