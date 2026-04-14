import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PackageForm = () => {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    PackageNumber: '',
    PackageName: '',
    PackageDescription: '',
    PackagePrice: ''
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/packages/${formData.PackageNumber}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/packages', formData);
      }
      resetForm();
      fetchPackages();
    } catch (error) {
      alert('Error saving package');
    }
  };

  const resetForm = () => {
    setFormData({ PackageNumber: '', PackageName: '', PackageDescription: '', PackagePrice: '' });
    setEditing(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Package Management</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="PackageNumber" placeholder="Package Number" value={formData.PackageNumber} onChange={handleChange} className="p-2 border rounded" required disabled={editing} />
            <input type="text" name="PackageName" placeholder="Package Name" value={formData.PackageName} onChange={handleChange} className="p-2 border rounded" required />
            <textarea name="PackageDescription" placeholder="Description" value={formData.PackageDescription} onChange={handleChange} className="p-2 border rounded col-span-2" required />
            <input type="number" name="PackagePrice" placeholder="Price (RWF)" value={formData.PackagePrice} onChange={handleChange} className="p-2 border rounded" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editing ? 'Update' : 'Save'}</button>
            {editing && <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageForm;