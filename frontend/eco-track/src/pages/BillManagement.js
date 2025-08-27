import React, { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const glassStyle = {
  background: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255,255,255,0.3)",
  padding: "2rem",
  margin: "2rem 0",
};

// Bill processing flow
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/bills/upload', {
    method: 'POST',
    body: formData,
  });
  return await res.json(); // { fileId: ... }
};

const extractBillData = async (fileId) => {
  const res = await fetch(`/api/bills/ocr/${fileId}`);
  return await res.json(); // { extractedData: ... }
};

const validateBillData = async (data) => {
  const res = await fetch('/api/bills/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json(); // { validatedData: ... }
};

const saveBill = async (data) => {
  const res = await fetch('/api/bills/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json(); // { savedBill: ... }
};

const processBill = async (file, setStatus, setResults) => {
  try {
    setStatus('Uploading file...');
    const uploadResponse = await uploadFile(file);
    setStatus('Processing bill...');
    // Example: fetch results from backend after upload
    const res = await fetch(`/api/bills/process/${uploadResponse.fileId}`);
    const data = await res.json();
    setResults(data); // Save results to state
    setStatus('Bill processed and results received!');
    return data;
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
  const [manualData, setManualData] = useState({ account: "", amount: "", date: "" });
  const [status, setStatus] = useState("");
  const [bills, setBills] = useState(sampleBills);
  const [editBill, setEditBill] = useState(null);
  const [results, setResults] = useState(null);

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
      const res = await fetch('/api/bills/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualData),
      });
      if (res.ok) {
        setStatus('Manual bill submitted!');
        setManualData({ account: "", amount: "", date: "" });
      } else {
        setStatus('Error submitting manual bill.');
      }
    } catch {
      setStatus('Error submitting manual bill.');
    }
  };

  const handleProcessFiles = async () => {
    for (const file of files) {
      await processBill(file, setStatus, setResults);
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
        head: [["Date", "Account", "Amount", "Verified"]],
        body: bills.map(bill => [bill.date, bill.account, bill.amount, bill.verified ? "Yes" : "No"]),
      });
      doc.save("bills.pdf");
    } else {
      alert("PDF export failed: autoTable is not available. Please check jspdf-autotable installation.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#F5F8F2] py-10 px-4">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-400 mb-8">Bill Management</h2>
      <div style={glassStyle} className="w-full max-w-2xl mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[#144D52]">Upload Bills</h3>
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
        <button className="mt-4 bg-gradient-to-r from-green-600 to-teal-400 text-white px-6 py-2 rounded-lg shadow-lg" onClick={handleProcessFiles} disabled={files.length === 0}>Process with OCR</button>
      </div>
      <div style={glassStyle} className="w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4 text-[#144D52]">Manual Bill Entry</h3>
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="account"
            placeholder="Account Number"
            value={manualData.account}
            onChange={handleManualChange}
            className="p-2 rounded border border-gray-300"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={manualData.amount}
            onChange={handleManualChange}
            className="p-2 rounded border border-gray-300"
            required
          />
          <input
            type="date"
            name="date"
            value={manualData.date}
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
          <pre className="text-sm text-gray-800 bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}

      {status && (
        <div className="mt-6 text-center text-lg text-[#144D52] font-semibold">
          {status}
        </div>
      )}
    </div>
  );
}

export default BillManagement;
