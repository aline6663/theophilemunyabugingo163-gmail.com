import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [payments, setPayments] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    PaymentNumber: '',
    AmountPaid: '',
    PaymentDate: '',
    RecordNumber: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchServices();
  }, []);

  const fetchPayments = async () => {
    const response = await axios.get('http://localhost:5000/api/payments');
    setPayments(response.data);
  };
  const fetchServices = async () => {
    const response = await axios.get('http://localhost:5000/api/services');
    setServices(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/payments', formData);
    alert('Payment recorded!');
    setFormData({ PaymentNumber: '', AmountPaid: '', PaymentDate: '', RecordNumber: '' });
    fetchPayments();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payments</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="PaymentNumber" placeholder="Payment Number" value={formData.PaymentNumber} onChange={handleChange} className="p-2 border rounded" required />
            <input type="number" name="AmountPaid" placeholder="Amount Paid" value={formData.AmountPaid} onChange={handleChange} className="p-2 border rounded" required />
            <input type="datetime-local" name="PaymentDate" value={formData.PaymentDate} onChange={handleChange} className="p-2 border rounded" required />
            <select name="RecordNumber" value={formData.RecordNumber} onChange={handleChange} className="p-2 border rounded" required>
              <option value="">Select Service</option>
              {services.map(service => <option key={service.RecordNumber} value={service.RecordNumber}>{service.RecordNumber}</option>)}
            </select>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Record Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;