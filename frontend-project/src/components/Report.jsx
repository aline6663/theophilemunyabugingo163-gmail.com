import React, { useState } from 'react';
import axios from 'axios';

const Report = () => {
  const [date, setDate] = useState('');
  const [reports, setReports] = useState([]);
  const [billData, setBillData] = useState(null);
  const [billRecordNumber, setBillRecordNumber] = useState('');

  const generateDailyReport = async () => {
    const response = await axios.get(`http://localhost:5000/api/reports/daily?date=${date}`);
    setReports(response.data);
  };

  const generateBill = async () => {
    const response = await axios.get(`http://localhost:5000/api/bill/${billRecordNumber}`);
    setBillData(response.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reports</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl mb-4">Daily Report</h3>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded mr-2" />
        <button onClick={generateDailyReport} className="bg-blue-600 text-white px-4 py-2 rounded">Generate</button>
        {reports.length > 0 && (
          <table className="w-full mt-4">
            <thead><tr><th>Plate</th><th>Package</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i}><td>{r.PlateNumber}</td><td>{r.PackageName}</td><td>{r.AmountPaid}</td><td>{r.PaymentDate}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl mb-4">Generate Bill</h3>
        <input type="text" placeholder="Record Number" value={billRecordNumber} onChange={(e) => setBillRecordNumber(e.target.value)} className="p-2 border rounded mr-2" />
        <button onClick={generateBill} className="bg-green-600 text-white px-4 py-2 rounded">Generate Bill</button>
        {billData && (
          <div className="mt-4 p-4 border">
            <h4>Invoice: {billData.RecordNumber}</h4>
            <p>Driver: {billData.DriverName}</p>
            <p>Plate: {billData.PlateNumber}</p>
            <p>Package: {billData.PackageName}</p>
            <p>Amount: {billData.AmountPaid || billData.PackagePrice} RWF</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;