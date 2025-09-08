// MADE BY Ram ALSAFADI - Crypto Dashboard Main Application
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CryptoProvider } from './context/CryptoContext';
import HomePage from './pages/HomePage';
import CoinDetailPage from './pages/CoinDetailPage';
import PriceAlertsPage from './pages/PriceAlertsPage';
import './App.css';

function App() {
  return (
    <CryptoProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/coin/:id" element={<CoinDetailPage />} />
            <Route path="/alerts" element={<PriceAlertsPage />} />
          </Routes>
        </div>
      </Router>
    </CryptoProvider>
  );
}

export default App;

