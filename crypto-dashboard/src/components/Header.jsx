// MADE BY Ram ALSAFADI - Crypto Dashboard Header Component
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, TrendingUp, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useCrypto } from '../context/CryptoContext';

const Header = () => {
  const { theme, toggleTheme, alerts, globalData } = useCrypto();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Crypto Dashboard
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Real-time cryptocurrency tracker
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/alerts"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/alerts' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              Price Alerts
            </Link>
          </nav>

          {/* Global Market Stats */}
          {globalData && (
            <div className="hidden lg:flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-muted-foreground text-xs">Market Cap</div>
                <div className="font-semibold">
                  ${(globalData.total_market_cap / 1e12).toFixed(2)}T
                </div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-xs">24h Volume</div>
                <div className="font-semibold">
                  ${(globalData.total_volume / 1e9).toFixed(1)}B
                </div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-xs">Active Coins</div>
                <div className="font-semibold">
                  {globalData.active_cryptocurrencies?.toLocaleString() || 'N/A'}
                </div>
              </div>
            </div>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Price Alerts Indicator */}
            <Link to="/alerts">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {alerts && alerts.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {alerts.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile menu button (placeholder for future) */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

