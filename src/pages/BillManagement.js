import React, { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Header from "../Components/Header";

const glassStyle = {
  background: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255,255,255,0.3)",
  padding: "2rem",
  margin: "2rem 0",
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Bill processing flow
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch(`${API_BASE_URL}/api/bills/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${res.status} ${errorText}`);
    }
    return await res.json(); // { fileId: ... }
  } catch (err) {
    throw new Error(`Upload error: ${err.message}`);
  }
};


const processBill = async (file, setStatus, setResults) => {
  try {
  setStatus('Uploading file...');
  const uploadResponse = await uploadFile(file);
  setStatus('Extracting bill data (OCR)...');    
  const ocrRes = await fetch(`${API_BASE_URL}/api/bills/ocr/${uploadResponse.filename}`);
  const ocrData = await ocrRes.json();

    const consumptionData = ocrData.consumption_data || [];
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus('Authentication error: Please log in to process bills.');
      return;
    }
    try {
      const [anomalyRes, carbonRes, forecastRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/ai/anomaly-detect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ consumption_data: consumptionData })
        }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/ai/carbon-calc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ consumption_data: consumptionData })
        }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/ai/forecast-energy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ consumption_data: consumptionData })
        }).then(r => r.json())
      ]);
      setResults({
        bill: ocrData,
        anomaly: anomalyRes,
        carbon: carbonRes,
        forecast: forecastRes
      });
      setStatus('Bill processed and AI results received!');
      return ocrData;
    } catch (apiErr) {
      setStatus('Authentication error: Your session may have expired. Please log in again.');
      return;
    }
  } catch (err) {
    setStatus('Error processing bill.');
    throw err;
  }
};

// Sample historical bills data
const sampleBills = [
  { id: 1, account: "12345", amount: 120, date: "2023-07-01", verified: true },
  { id: 2, account: "12345", amount: 110, date: "2023-08-01", verified: true },
  { id: 3, account: "12345", amount: 130, date: "2023-09-01", verified: false },
];

function BillManagement() {
  const [files, setFiles] = useState([]);
  const [manualData, setManualData] = useState({ account: "", amount: "", date: "", consumption: "" });
  const [status, setStatus] = useState("");
  const [bills, setBills] = useState(sampleBills);
  const [editBill, setEditBill] = useState(null);
  const [results, setResults] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState();

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };

  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleManualChange = (e) => {
    setManualData({ ...manualData, [e.target.name]: e.target.value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting manual bill...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/bills/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualData),
      });
      if (res.ok) {
        setStatus('Manual bill submitted!');
        setManualData({ account: "", amount: "", date: "", consumption: "" });
        // For manual, build consumptionData from manualData
        let consumptionData = [{
          timestamp: manualData.date,
          consumption: Number(manualData.consumption)
        }];
        // Check if there are at least two records
        if (consumptionData.length < 2) {
          // For demo, duplicate with next day if only one record
          const nextDay = new Date(manualData.date);
          nextDay.setDate(nextDay.getDate() + 1);
          consumptionData.push({
            timestamp: nextDay.toISOString().slice(0, 10),
            consumption: Number(manualData.consumption)
          });
        }
        const token = localStorage.getItem("token");
        const [anomalyRes, carbonRes, forecastRes] = await Promise.all([
          fetch(`${API_BASE_URL}/ai/anomaly-detect`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ consumption_data: consumptionData })
          }).then(r => r.json()),
          fetch(`${API_BASE_URL}/ai/carbon-calc`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ consumption_data: consumptionData })
          }).then(r => r.json()),
          fetch(`${API_BASE_URL}/ai/forecast-energy`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ consumption_data: consumptionData })
          }).then(r => r.json())
        ]);
        setResults({
          bill: manualData,
          anomaly: anomalyRes,
          carbon: carbonRes,
          forecast: forecastRes
        });
      } else {
        setStatus('Error submitting manual bill.');
      }
    } catch (err) {
      setStatus('Error submitting manual bill.');
      console.error(err);
    }
  };

  const handleProcessFiles = async () => {
    for (const file of files) {
      try {
        await processBill(file, setStatus, setResults);
      } catch (err) {
        setStatus(`Error uploading file: ${err.message}`);
        return;
      }
    }
    setFiles([]);
  };

  // Data verification and error correction
  const handleVerify = (billId) => {
    setBills(bills.map(b => b.id === billId ? { ...b, verified: true } : b));
  };

  const handleEdit = (bill) => {
    setEditBill(bill);
  };

  const handleEditChange = (e) => {
    setEditBill({ ...editBill, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    setBills(bills.map(b => b.id === editBill.id ? editBill : b));
    setEditBill(null);
  };

  // Export capabilities
  const csvData = bills.map(({ id, ...rest }) => rest);

  // PDF export handler
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Bills", 14, 16);
    // Ensure autoTable is available
    if (typeof doc.autoTable === "function") {
      doc.autoTable({
        startY: 20,
        body: bills.map(bill => [bill.date, bill.account, bill.amount, bill.verified ? "Yes" : "No"]),
      });
      doc.save("bills.pdf");
    } else {
      alert("PDF export failed: autoTable is not available. Please check jspdf-autotable installation.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F8F2] flex flex-col"> 
      <Header />
      <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#F5F8F2] py-10 px-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-400 mb-8">Bill Management</h2>
        {/* Status/Loading Message */}
        {status && (
          <div className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded shadow text-center">
            {status}
          </div>
        )}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-lg p-8 mb-4 cursor-pointer bg-white/30"
          >
            <p className="text-gray-600 mb-2">Drag & drop PDF or image files here</p>
          <input type="file" multiple accept=".pdf,image/*" onChange={handleFileChange} className="mb-2" />
          <p className="text-xs text-gray-400">Bulk upload supported</p>
        </div>
        {files.length > 0 && (
          <div className="mt-2 text-sm text-gray-700">
            <strong>Files:</strong> {files.map((f) => f.name).join(", ")}
          </div>
        )}
  <div style={glassStyle} className="w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4 text-[#144D52]">Manual Bill Entry</h3>
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
          <label className="font-semibold text-[#144D52]">Account Number</label>
          <input
            type="text"
            name="account"
            placeholder="Account Number"
            value={manualData.account}
            onChange={handleManualChange}
            className="p-2 rounded border border-gray-300"
            required
          />
          <label className="font-semibold text-[#144D52]">Date</label>
          <input
            type="date"
            name="date"
            value={manualData.date}
            onChange={handleManualChange}
            className="p-2 rounded border border-gray-300"
            required
          />
          <label className="font-semibold text-[#144D52]">Consumption (kWh)</label>
          <input
            type="number"
            name="consumption"
            placeholder="Consumption (kWh)"
            value={manualData.consumption || ''}
            onChange={handleManualChange}
            className="p-2 rounded border border-gray-300"
            required
          />
          <label className="font-semibold text-[#144D52]">Amount (currency)</label>
          <input
            type="number"
            name="amount"
            placeholder="Amount (currency)"
            value={manualData.amount}
            onChange={handleManualChange}
            className="p-2 rounded border border-gray-300"
            required
          />
          <button type="submit" className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-6 py-2 rounded-lg shadow-lg">Submit Bill</button>
        </form>
      </div>

      {/* Historical Bill Comparison */}
      <div style={glassStyle} className="w-full max-w-2xl mt-8 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[#144D52]">Historical Bill Comparison</h3>
        <table className="w-full text-left border-collapse mb-4">
          <thead>
            <tr className="bg-green-100">
              <th className="p-2">Date</th>
              <th className="p-2">Account</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.id} className="border-b">
                <td className="p-2">{bill.date}</td>
                <td className="p-2">{bill.account}</td>
                <td className="p-2">{bill.amount}</td>
                <td className="p-2">{bill.verified ? "✅" : "❌"}</td>
                <td className="p-2">
                  {!bill.verified && <button className="text-green-600 mr-2" onClick={() => handleVerify(bill.id)}>Verify</button>}
                  <button className="text-blue-600" onClick={() => handleEdit(bill)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4">
          <CSVLink data={csvData} filename={"bills.csv"} className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-6 py-2 rounded-lg shadow-lg">Export as CSV</CSVLink>
          <button onClick={handleExportPDF} className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-6 py-2 rounded-lg shadow-lg">Export as PDF</button>
        </div>
      </div>

      {/* Edit Bill Modal */}
      {editBill && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div style={glassStyle} className="max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#144D52]">Edit Bill</h3>
            <form className="flex flex-col gap-4">
              <input type="text" name="account" value={editBill.account} onChange={handleEditChange} className="p-2 rounded border border-gray-300" />
              <input type="number" name="amount" value={editBill.amount} onChange={handleEditChange} className="p-2 rounded border border-gray-300" />
              <input type="date" name="date" value={editBill.date} onChange={handleEditChange} className="p-2 rounded border border-gray-300" />
              <div className="flex gap-2 mt-4">
                <button type="button" className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-4 py-2 rounded-lg shadow-lg" onClick={handleEditSave}>Save</button>
                <button type="button" className="bg-gray-300 px-4 py-2 rounded-lg" onClick={() => setEditBill(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="mt-6 p-4 bg-white rounded shadow w-full max-w-2xl">
          <h4 className="font-bold text-green-700 mb-2">Bill Analysis Results</h4>
          {/* Bill Data Table */}
          <div className="mb-2">
            <strong>Bill Data:</strong>
            <table className="w-full text-sm bg-gray-100 rounded mb-2">
              <tbody>
                {Object.entries(results.bill).map(([key, value]) => (
                  <tr key={key}>
                    <td className="font-semibold p-1 text-gray-700">{key}</td>
                    <td className="p-1 text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Carbon Emissions Summary */}
          <div className="mb-2">
            <strong>Carbon Emissions:</strong>
            <div className="text-gray-800 bg-gray-100 p-2 rounded">
              {results.carbon && results.carbon.carbon_footprint !== undefined ? (
                typeof results.carbon.carbon_footprint === 'object' ? (
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(results.carbon.carbon_footprint).map(([key, value]) => (
                        <tr key={key}>
                          <td className="font-semibold p-1 text-gray-700">{key.replace(/_/g, ' ')}</td>
                          <td className="p-1 text-gray-800">{
                            typeof value === 'object' ? JSON.stringify(value) : value
                          }</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <span>Total Carbon Footprint: <span className="font-bold">{results.carbon.carbon_footprint}</span> kg CO₂</span>
                )
              ) : (
                <span>No carbon data available.</span>
              )}
            </div>
          </div>
          {/* Anomaly Detection Table */}
          <div className="mb-2">
            <strong>Anomaly Detection:</strong>
            <div className="text-gray-800 bg-gray-100 p-2 rounded">
              {results.anomaly && Array.isArray(results.anomaly.anomalies) ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-1">Index</th>
                      <th className="p-1">Anomaly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.anomaly.anomalies.map((a, i) => (
                      <tr key={i}>
                        <td className="p-1">{i + 1}</td>
                        <td className="p-1">{a === -1 ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span>No anomaly data available.</span>
              )}
            </div>
          </div>
          {/* Energy Forecast Table */}
          <div className="mb-2">
            <strong>Energy Forecast:</strong>
            <div className="text-gray-800 bg-gray-100 p-2 rounded">
              {results.forecast && Array.isArray(results.forecast.forecast) ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-1">Date</th>
                      <th className="p-1">Forecast (kWh)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.forecast.forecast.map((row, i) => (
                      <tr key={i}>
                        <td className="p-1">{row.ds}</td>
                        <td className="p-1">{row.yhat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span>No forecast data available.</span>
              )}
            </div>
          </div>
          {/* Analyze with AI Button and Result */}
          <div className="mt-4">
            <button
              className="bg-gradient-to-r from-green-600 to-teal-400 text-white px-6 py-2 rounded-lg shadow-lg"
              onClick={async () => {
                setStatus('Analyzing with AI...');
                // Build summary from all model outputs
                const summary = `Bill Data: ${JSON.stringify(results.bill)}\n\nCarbon Emissions: ${JSON.stringify(results.carbon)}\n\nAnomaly Detection: ${JSON.stringify(results.anomaly)}\n\nEnergy Forecast: ${JSON.stringify(results.forecast)}`;
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/ai/analyze`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ summary })
                });
                const data = await res.json();
                setStatus('');
                setAiAnalysis(data.analysis || 'No analysis received.');
              }}
            >Analyze with AI</button>
            {typeof aiAnalysis !== 'undefined' && (
              <div className="mt-4 p-4 bg-green-50 rounded shadow">
                <h5 className="font-bold text-green-700 mb-2">AI Analysis</h5>
                <div className="text-gray-800 whitespace-pre-line">{aiAnalysis}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {status && (
        <div className="mt-6 text-center text-lg text-[#144D52] font-semibold">
          {status}
        </div>
      )}
    </div>
    </div>
  );
}

export default BillManagement;
