import React from 'react';
import Header from '../components/Header';
import PriceAlerts from '../components/PriceAlerts';

const PriceAlertsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <PriceAlerts />
      </div>
    </div>
  );
};

export default PriceAlertsPage;

