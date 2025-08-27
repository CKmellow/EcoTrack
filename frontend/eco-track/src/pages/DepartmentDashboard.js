import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../Components/ui/Card.js"
import { Button } from '../Components/ui/Button.js'
import Leaderboard from "../Components/Leaderboard";
import Metrics from "../Components/Departmentmetrics.jsx"


export default function DepartmentDashboard() {
     const departments = [
    { id: 1, name: "HR", score: 82 },
    { id: 2, name: "IT", score: 95 },
    { id: 3, name: "Finance", score: 75 },
    { id: 4, name: "Marketing", score: 90 },
  ];

  const currentDeptId = 2; 
  // Sample Data
  const consumptionData = [
    { month: "Jan", actual: 400, target: 350 },
    { month: "Feb", actual: 300, target: 320 },
    { month: "Mar", actual: 500, target: 450 },
  ];

  const departmentComparison = [
    { dept: "HR", cost: 200 },
    { dept: "IT", cost: 450 },
    { dept: "Finance", cost: 350 },
    { dept: "Operations", cost: 400 },
  ];

  // Inventory State
  const [inventory, setInventory] = useState([
    { id: 1, name: "Printer", status: "More than usual" },
    { id: 2, name: "AC Unit", status: "Normal" },
  ]);
  const [newEquipment, setNewEquipment] = useState("");

  // Goals State
  const [goals, setGoals] = useState(["Reduce energy by 10%"]);
  const [newGoal, setNewGoal] = useState("");

  const addEquipment = () => {
    if (newEquipment.trim() !== "") {
      setInventory([...inventory, { id: inventory.length + 1, name: newEquipment, status: "Operational" }]);
      setNewEquipment("");
    }
  };

  const addGoal = () => {
    if (newGoal.trim() !== "") {
      setGoals([...goals, newGoal]);
      setNewGoal("");
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-600 to-teal-400 text-white flex justify-between items-center px-6 py-4 shadow-lg z-50">
        <h1 className="text-xl font-bold">Department Dashboard</h1>
        <div className="space-x-6">
          <a href="#metrics" className="text-black">Metrics</a>
          <a href="#inventory" className="text-black">Inventory</a>
          <a href="#goals" className="text-black">Goals</a>
          <a href="#comparison" className="text-black">Comparison</a>
        </div>
      </nav>
      <div className="p-6 mb-2">
<Leaderboard departments={departments} currentDeptId={currentDeptId} /></div>
      {/* Main Content */}
      <div className="pt-24 px-6 space-y-12">
        {/* Metrics Section */}
        <section id="metrics">
             <div className="p-8  ">
          <h2 className="text-2xl text-black font-semibold mb-4">Department-Specific Metrics</h2>
          
     
      <Metrics />
    </div>

          <div className="h-64 mt-6 bg-white rounded-lg shadow p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#1e8c6b" />
                <Line type="monotone" dataKey="target" stroke="#144D52" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Inventory Section */}
        <section id="inventory">
          <h2 className="text-2xl font-semibold mb-4">Equipment Energy Consumption</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <table className="w-full text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{item.id}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                placeholder="Add new equipment"
                className="border p-2 flex-1 rounded"
              />
              <Button  className='bg-gradient-to-r from-green-600 to-teal-400'onClick={addEquipment}>Add</Button>
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section id="goals">
          <h2 className="text-2xl font-semibold mb-4">Goal Setting & Tracking</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <ul className="list-disc pl-6 space-y-2">
              {goals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Set a new goal"
                className="border p-2 flex-1 rounded"
              />
              <Button className='bg-gradient-to-r from-green-600 to-teal-400' onClick={addGoal}>Add Goal</Button>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section id="comparison">
          <h2 className="text-2xl font-semibold mb-4">Comparative Analysis</h2>
          <div className="h-64 bg-white rounded-lg shadow p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentComparison}>
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" fill="#1e8c6b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

