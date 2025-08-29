import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ScatterChart, Scatter
} from "recharts";
import { Card, CardContent } from "../Components/ui/Card";

const COLORS = ["#31a05aff", "#f87171"]; // green + red

export default function AnalyticsDashboard({
  carbonData = [
    { month: "Jan", emissions: 400, target: 350 },
    { month: "Feb", emissions: 380, target: 340 },
    { month: "Mar", emissions: 420, target: 330 },
  ],
  efficiencyData = [
    { department: "IT", efficiency: 85 },
    { department: "HR", efficiency: 70 },
    { department: "Finance", efficiency: 90 },
    { department: "Ops", efficiency: 60 },
  ],
  accuracyData = [
    { name: "Accurate", value: 80 },
    { name: "Error", value: 20 },
  ],
  costEmissionData = [
    { x: 1000, y: 400 }, // x = cost, y = emissions
    { x: 1500, y: 350 },
    { x: 1200, y: 300 },
    { x: 1800, y: 500 },
  ]
}) {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Carbon Footprint Tracking */}
      <Card className="rounded-2xl shadow-md">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Carbon Footprint Tracking</h2>
          <LineChart width={400} height={250} data={carbonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="emissions" stroke="#f87171" />
            <Line type="monotone" dataKey="target" stroke="#31a05aff" />
          </LineChart>
        </CardContent>
      </Card>

      {/* Energy Efficiency Metrics */}
      <Card className="rounded-2xl shadow-md bg-green-200">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Energy Efficiency Metrics</h2>
          <BarChart width={400} height={250} data={efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="efficiency" fill="#31a05aff" />
          </BarChart>
        </CardContent>
      </Card>

      {/* Prediction Accuracy */}
      <Card className="rounded-2xl shadow-md">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Prediction Accuracy</h2>
          <PieChart width={400} height={250}>
            <Pie
              data={accuracyData}
              cx={200}
              cy={120}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {accuracyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      {/* Cost vs Emissions Analysis */}
      <Card className="rounded-2xl shadow-md">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Cost vs Emissions</h2>
          <ScatterChart width={400} height={250}>
            <CartesianGrid />
            <XAxis dataKey="x" name="Cost" unit="$" />
            <YAxis dataKey="y" name="Emissions" unit="kg" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="Departments" data={costEmissionData} fill="#31a05aff" />
          </ScatterChart>
        </CardContent>
      </Card>

    </div>
  );
}

