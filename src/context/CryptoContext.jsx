// MADE BY Ram ALSAFADI - Crypto Dashboard Context Provider
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cryptoService } from '../api/cryptoService';
import { priceAlerts, notifications, storage } from '../utils/helpers';

// Initial state
const initialState = {
  coins: [],
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'market_cap_desc',
  selectedCoin: null,
  coinHistory: {},
  alerts: [],
  theme: 'light',
  globalData: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_COINS: 'SET_COINS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SORT_BY: 'SET_SORT_BY',
  SET_SELECTED_COIN: 'SET_SELECTED_COIN',
  SET_COIN_HISTORY: 'SET_COIN_HISTORY',
  SET_ALERTS: 'SET_ALERTS',
  ADD_ALERT: 'ADD_ALERT',
  REMOVE_ALERT: 'REMOVE_ALERT',
  SET_THEME: 'SET_THEME',
  SET_GLOBAL_DATA: 'SET_GLOBAL_DATA',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const cryptoReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_COINS:
      return { ...state, coins: action.payload, loading: false, error: null };
    
    case actionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case actionTypes.SET_SORT_BY:
      return { ...state, sortBy: action.payload };
    
    case actionTypes.SET_SELECTED_COIN:
      return { ...state, selectedCoin: action.payload };
    
    case actionTypes.SET_COIN_HISTORY:
      return {
        ...state,
        coinHistory: {
          ...state.coinHistory,
          [action.payload.coinId]: action.payload.data
        }
      };
    
    case actionTypes.SET_ALERTS:
      return { ...state, alerts: action.payload };
    
    case actionTypes.ADD_ALERT:
      return { ...state, alerts: [...state.alerts, action.payload] };
    
    case actionTypes.REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      };
    
    case actionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    
    case actionTypes.SET_GLOBAL_DATA:
      return { ...state, globalData: action.payload };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Create context
const CryptoContext = createContext();

// Context provider component
export const CryptoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cryptoReducer, {
    ...initialState,
    theme: storage.get('theme', 'light'),
    alerts: priceAlerts.get()
  });

  // Action creators
  const actions = {
    setLoading: (loading) => {
      dispatch({ type: actionTypes.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: actionTypes.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: actionTypes.CLEAR_ERROR });
    },

    fetchCoins: async (limit = 50) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        const coins = await cryptoService.getCoins(limit, state.sortBy);
        dispatch({ type: actionTypes.SET_COINS, payload: coins });
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      }
    },

    searchCoins: async (query) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: query });
        
        if (query.trim() === '') {
          // If search is empty, fetch all coins
          const coins = await cryptoService.getCoins(50, state.sortBy);
          dispatch({ type: actionTypes.SET_COINS, payload: coins });
        } else {
          const coins = await cryptoService.searchCoins(query);
          dispatch({ type: actionTypes.SET_COINS, payload: coins });
        }
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    setSortBy: async (sortBy) => {
      try {
        dispatch({ type: actionTypes.SET_SORT_BY, payload: sortBy });
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        
        const query = state.searchQuery.trim();
        let coins;
        
        if (query === '') {
          coins = await cryptoService.getCoins(50, sortBy);
        } else {
          coins = await cryptoService.searchCoins(query);
          // Apply sorting to search results
          coins = cryptoService.sortCoins(coins, sortBy);
        }
        
        dispatch({ type: actionTypes.SET_COINS, payload: coins });
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    fetchCoinDetails: async (coinId) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        const coin = await cryptoService.getCoinById(coinId);
        dispatch({ type: actionTypes.SET_SELECTED_COIN, payload: coin });
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    fetchCoinHistory: async (coinId, days = 30) => {
      try {
        const history = await cryptoService.getCoinHistory(coinId, days);
        dispatch({
          type: actionTypes.SET_COIN_HISTORY,
          payload: { coinId, data: history }
        });
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      } catch (error) {
        console.error("Error fetching coin history:", error);
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    addAlert: (alertData) => {
      const newAlert = priceAlerts.add(alertData);
      dispatch({ type: actionTypes.ADD_ALERT, payload: newAlert });
      return newAlert;
    },

    removeAlert: (alertId) => {
      priceAlerts.remove(alertId);
      dispatch({ type: actionTypes.REMOVE_ALERT, payload: alertId });
    },

    checkAlerts: () => {
      const alerts = state.alerts;
      const coins = state.coins;
      
      alerts.forEach(alert => {
        const coin = coins.find(c => c.id === alert.coinId);
        if (coin && cryptoService.checkPriceAlert(coin, alert.price, alert.type)) {
          // Trigger notification
          notifications.show(
            `Price Alert: ${coin.name}`,
            {
              body: `${coin.name} has ${alert.type} ${alert.price}. Current price: ${cryptoService.formatCurrency(coin.current_price)}`,
              icon: coin.image
            }
          );
          
          // Remove the alert after triggering (one-time alert)
          actions.removeAlert(alert.id);
        }
      });
    },

    setTheme: (theme) => {
      storage.set('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
      dispatch({ type: actionTypes.SET_THEME, payload: theme });
    },

    toggleTheme: () => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      actions.setTheme(newTheme);
    },

    fetchGlobalData: async () => {
      try {
        const globalData = await cryptoService.getGlobalMarketData();
        dispatch({ type: actionTypes.SET_GLOBAL_DATA, payload: globalData });
      } catch (error) {
        console.error('Error fetching global data:', error);
      }
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, []);

  // Auto-refresh coins every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.coins.length > 0 && !state.loading) {
        actions.fetchCoins();
        actions.checkAlerts();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [state.coins.length, state.loading]);

  // Request notification permission on mount
  useEffect(() => {
    notifications.requestPermission();
  }, []);

  const value = {
    ...state,
    ...actions
  };

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
};

// Custom hook to use the crypto context
export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};

export default CryptoContext;

