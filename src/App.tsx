import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { VehicleDetailsPage } from './pages/VehicleDetails';
import Financing from './pages/Financing';
import DashboardApp from './dashadmin/App';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/veiculo/:id" element={<VehicleDetailsPage />} />
        <Route path="/veiculo/:id/:slug" element={<VehicleDetailsPage />} />
        <Route path="/financiamento" element={<Financing />} />
        <Route path="/dashadmin" element={<DashboardApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;