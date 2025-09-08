// Utility functions for the crypto dashboard

// Debounce function for search input
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Theme utilities
export const theme = {
  get: () => storage.get('theme', 'light'),
  set: (theme) => {
    storage.set('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },
  toggle: () => {
    const current = theme.get();
    const next = current === 'light' ? 'dark' : 'light';
    theme.set(next);
    return next;
  }
};

// Price alert utilities
export const priceAlerts = {
  get: () => storage.get('priceAlerts', []),
  
  add: (alert) => {
    const alerts = priceAlerts.get();
    const newAlert = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...alert
    };
    alerts.push(newAlert);
    storage.set('priceAlerts', alerts);
    return newAlert;
  },
  
  remove: (alertId) => {
    const alerts = priceAlerts.get();
    const filtered = alerts.filter(alert => alert.id !== alertId);
    storage.set('priceAlerts', filtered);
    return filtered;
  },
  
  update: (alertId, updates) => {
    const alerts = priceAlerts.get();
    const index = alerts.findIndex(alert => alert.id === alertId);
    if (index !== -1) {
      alerts[index] = { ...alerts[index], ...updates };
      storage.set('priceAlerts', alerts);
    }
    return alerts;
  },
  
  clear: () => {
    storage.remove('priceAlerts');
  }
};

// Notification utilities
export const notifications = {
  isSupported: () => 'Notification' in window,
  
  requestPermission: async () => {
    if (!notifications.isSupported()) {
      return 'denied';
    }
    
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }
    
    return Notification.permission;
  },
  
  show: (title, options = {}) => {
    if (Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  }
};

// Color utilities for price changes
export const getChangeColor = (change) => {
  if (change > 0) return 'text-green-600 dark:text-green-400';
  if (change < 0) return 'text-red-600 dark:text-red-400';
  return 'text-muted-foreground';
};

export const getChangeBgColor = (change) => {
  if (change > 0) return 'bg-green-100 dark:bg-green-900/20';
  if (change < 0) return 'bg-red-100 dark:bg-red-900/20';
  return 'bg-muted';
};

// Chart color utilities
export const chartColors = {
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  gradient: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    danger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  }
};

// Validation utilities
export const validation = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  isValidPrice: (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
  },
  
  isValidPercentage: (percentage) => {
    const num = parseFloat(percentage);
    return !isNaN(num) && num >= -100 && num <= 1000;
  }
};

// URL utilities
export const url = {
  getCoinDetailUrl: (coinId) => `/coin/${coinId}`,
  
  getExternalCoinUrl: (coinId) => `https://www.coingecko.com/en/coins/${coinId}`,
  
  getCoinImageUrl: (coinId, size = 'large') => {
    // Fallback image URL structure
    return `https://assets.coingecko.com/coins/images/1/large/${coinId}.png`;
  }
};

// Error handling utilities
export const errorHandler = {
  getErrorMessage: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
  
  logError: (error, context = '') => {
    console.error(`Error ${context}:`, error);
  }
};

