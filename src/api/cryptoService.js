import axios from 'axios';
import { mockCoins, generateMockHistoricalData, mockMarketData } from '../data/mockData';

// Base configuration for CoinGecko API (for future real implementation)
const BASE_URL = 'https://api.coingecko.com/api/v3';
const USE_MOCK_DATA = true; // Toggle to switch between mock and real API

// Helper function to simulate API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to sort coins with Vanry/USDT always at top
const sortCoinsWithVanryFirst = (coins) => {
  const vanryIndex = coins.findIndex(coin => coin.id === 'vanry');
  if (vanryIndex > 0) {
    const vanryCoin = coins.splice(vanryIndex, 1)[0];
    coins.unshift(vanryCoin);
  }
  return coins;
};

export const cryptoService = {
  // Get list of cryptocurrencies
  async getCoins(limit = 50, sortBy = 'market_cap_desc') {
    try {
      if (USE_MOCK_DATA) {
        await simulateDelay();
        let sortedCoins = [...mockCoins];
        
        // Apply sorting
        switch (sortBy) {
          case 'price_desc':
            sortedCoins.sort((a, b) => b.current_price - a.current_price);
            break;
          case 'price_asc':
            sortedCoins.sort((a, b) => a.current_price - b.current_price);
            break;
          case 'volume_desc':
            sortedCoins.sort((a, b) => b.total_volume - a.total_volume);
            break;
          case 'change_desc':
            sortedCoins.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
            break;
          case 'change_asc':
            sortedCoins.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
            break;
          case 'market_cap_desc':
          default:
            sortedCoins.sort((a, b) => b.market_cap - a.market_cap);
            break;
        }
        
        // Always ensure Vanry/USDT is at the top
        sortedCoins = sortCoinsWithVanryFirst(sortedCoins);
        
        return sortedCoins.slice(0, limit);
      } else {
        // Real API implementation (for future use)
        const response = await axios.get(`${BASE_URL}/coins/markets`, {
          params: {
            vs_currency: 'usd',
            order: sortBy,
            per_page: limit,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h'
          }
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  },

  // Get specific coin details
  async getCoinById(coinId) {
    try {
      if (USE_MOCK_DATA) {
        await simulateDelay();
        const coin = mockCoins.find(coin => coin.id === coinId);
        if (!coin) {
          throw new Error(`Coin with id ${coinId} not found`);
        }
        return coin;
      } else {
        // Real API implementation
        const response = await axios.get(`${BASE_URL}/coins/${coinId}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false
          }
        });
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching coin ${coinId}:`, error);
      throw new Error(`Failed to fetch data for ${coinId}`);
    }
  },

  // Get historical price data for charts
  async getCoinHistory(coinId, days = 30) {
    try {
      if (USE_MOCK_DATA) {
        await simulateDelay();
        return generateMockHistoricalData(coinId, days);
      } else {
        // Real API implementation
        const response = await axios.get(`${BASE_URL}/coins/${coinId}/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: days,
            interval: days <= 1 ? 'hourly' : 'daily'
          }
        });
        
        // Transform the data to match our expected format
        return response.data.prices.map(([timestamp, price], index) => ({
          date: new Date(timestamp).toISOString().split('T')[0],
          timestamp,
          price: parseFloat(price.toFixed(6)),
          volume: response.data.total_volumes[index] ? response.data.total_volumes[index][1] : 0
        }));
      }
    } catch (error) {
      console.error(`Error fetching history for ${coinId}:`, error);
      throw new Error(`Failed to fetch historical data for ${coinId}`);
    }
  },

  // Search coins by name or symbol
  async searchCoins(query) {
    try {
      if (USE_MOCK_DATA) {
        await simulateDelay(200);
        const lowercaseQuery = query.toLowerCase();
        const filteredCoins = mockCoins.filter(coin => 
          coin.name.toLowerCase().includes(lowercaseQuery) ||
          coin.symbol.toLowerCase().includes(lowercaseQuery) ||
          coin.id.toLowerCase().includes(lowercaseQuery)
        );
        return sortCoinsWithVanryFirst(filteredCoins);
      } else {
        // Real API implementation
        const response = await axios.get(`${BASE_URL}/search`, {
          params: { query }
        });
        return response.data.coins;
      }
    } catch (error) {
      console.error('Error searching coins:', error);
      throw new Error('Failed to search cryptocurrencies');
    }
  },

  // Get global market data
  async getGlobalMarketData() {
    try {
      if (USE_MOCK_DATA) {
        await simulateDelay(300);
        return mockMarketData;
      } else {
        // Real API implementation
        const response = await axios.get(`${BASE_URL}/global`);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error fetching global market data:', error);
      throw new Error('Failed to fetch global market data');
    }
  },

  // Price alert utilities
  checkPriceAlert(coin, alertPrice, alertType) {
    const currentPrice = coin.current_price;
    
    switch (alertType) {
      case 'above':
        return currentPrice >= alertPrice;
      case 'below':
        return currentPrice <= alertPrice;
      case 'change_above':
        return coin.price_change_percentage_24h >= alertPrice;
      case 'change_below':
        return coin.price_change_percentage_24h <= alertPrice;
      default:
        return false;
    }
  },

  // Format currency values
  formatCurrency(value, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: value < 1 ? 6 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
  },

  // Format percentage values
  formatPercentage(value) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  },

  // Format large numbers (market cap, volume)
  formatLargeNumber(value) {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  },

  // Sort coins by specified criteria
  sortCoins(coins, sortBy) {
    let sortedCoins = [...coins];
    
    switch (sortBy) {
      case 'price_desc':
        sortedCoins.sort((a, b) => b.current_price - a.current_price);
        break;
      case 'price_asc':
        sortedCoins.sort((a, b) => a.current_price - b.current_price);
        break;
      case 'volume_desc':
        sortedCoins.sort((a, b) => b.total_volume - a.total_volume);
        break;
      case 'change_desc':
        sortedCoins.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        break;
      case 'change_asc':
        sortedCoins.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        break;
      case 'market_cap_desc':
      default:
        sortedCoins.sort((a, b) => b.market_cap - a.market_cap);
        break;
    }
    
    // Always ensure Vanry/USDT is at the top
    return sortCoinsWithVanryFirst(sortedCoins);
  }
};

export default cryptoService;

