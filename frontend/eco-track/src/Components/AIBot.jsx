import React, { useState } from "react";

export default function AIBot() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const token = localStorage.getItem("token");
    let consumptionData;
    try {
      consumptionData = JSON.parse(input);
    } catch {
      setResult("Invalid input format. Please provide a JSON array.");
      setLoading(false);
      return;
    }
    try {
      // Run all endpoints in parallel
      const [anomalyRes, carbonRes, forecastRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/ai/anomaly-detect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ consumption_data: consumptionData })
        }).then(r => r.json()),
        fetch("http://127.0.0.1:8000/api/ai/carbon-calc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ consumption_data: consumptionData })
        }).then(r => r.json()),
        fetch("http://127.0.0.1:8000/api/ai/forecast-energy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ consumption_data: consumptionData })
        }).then(r => r.json())
      ]);
      setResult({
        anomaly: anomalyRes,
        carbon: carbonRes,
        forecast: forecastRes
      });
    } catch (err) {
      setResult("Error connecting to backend.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">EcoTrack AI Bot</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows={5}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Paste consumption data as JSON: [{"timestamp": "2025-08-30T12:00:00", "consumption": 10}]'
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Processing..." : "Analyze All"}
        </button>
      </form>
      {result && typeof result === "object" ? (
        <div className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
          <div className="mb-2">
            <strong>Carbon Emissions:</strong>
            <pre>{JSON.stringify(result.carbon, null, 2)}</pre>
          </div>
          <div className="mb-2">
            <strong>Anomaly Detection:</strong>
            <pre>{JSON.stringify(result.anomaly, null, 2)}</pre>
          </div>
          <div className="mb-2">
            <strong>Energy Forecast:</strong>
            <pre>{JSON.stringify(result.forecast, null, 2)}</pre>
          </div>
        </div>
      ) : result && (
        <div className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{result}</div>
      )}
    </div>
  );
}
