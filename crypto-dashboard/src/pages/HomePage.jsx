// MADE BY Ram ALSAFADI - Crypto Dashboard Home Page
import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchAndFilter from '../components/SearchAndFilter';
import CoinList from '../components/CoinList';
import { useCrypto } from '../context/CryptoContext';

const HomePage = () => {
  const {
    coins,
    loading,
    error,
    searchQuery,
    sortBy,
    fetchCoins,
    searchCoins,
    setSortBy,
    clearError,
    fetchGlobalData
  } = useCrypto();

  // Fetch initial data
  useEffect(() => {
    fetchCoins();
    fetchGlobalData();
  }, []);

  const handleRefresh = () => {
    clearError();
    if (searchQuery.trim() === '') {
      fetchCoins();
    } else {
      searchCoins(searchQuery);
    }
  };

  const handleSearchChange = (query) => {
    searchCoins(query);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Title and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Cryptocurrency Prices
            </h2>
            <p className="text-muted-foreground">
              Track real-time prices and market data for top cryptocurrencies
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-auto p-1"
              >
                ×
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          loading={loading}
        />

        {/* Featured Coin Notice */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-yellow-800 dark:text-yellow-200">
                Vanry/USDT is featured and always shown at the top
              </span>
            </div>
          </div>
        </div>

        {/* Coin List */}
        <CoinList
          coins={coins}
          loading={loading}
          error={error}
        />

        {/* Results Summary */}
        {!loading && coins && coins.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {coins.length} cryptocurrencies
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Auto-refresh Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Prices update automatically every 30 seconds
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;

