import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import CarForm from './components/CarForm';
import PackageForm from './components/PackageForm';
import ServiceForm from './components/ServiceForm';
import PaymentForm from './components/PaymentForm';
import Report from './components/Report';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/cars" />} />
            <Route path="/cars" element={<CarForm />} />
            <Route path="/packages" element={<PackageForm />} />
            <Route path="/services" element={<ServiceForm />} />
            <Route path="/payments" element={<PaymentForm />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;