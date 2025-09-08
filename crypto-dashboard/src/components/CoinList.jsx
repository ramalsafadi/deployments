import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { cryptoService } from '../api/cryptoService';
import { getChangeColor, getChangeBgColor } from '../utils/helpers';

const CoinList = ({ coins, loading, error }) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:gap-6">
        {[...Array(10)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6 text-center">
          <div className="text-destructive mb-2">Error loading cryptocurrency data</div>
          <p className="text-muted-foreground text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!coins || coins.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">No cryptocurrencies found</div>
        </CardContent>
      </Card>
    );
  }

  const getCoinCardClass = (priceChange) => {
    if (priceChange > 0) return 'shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-l-4 border-green-500 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-900/20';
    if (priceChange < 0) return 'shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-l-4 border-red-500 bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-900/20';
    return 'shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-l-4 border-gray-300 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/20';
  };

  return (
    <div className="grid gap-3 md:gap-4">
      {coins.map((coin, index) => (
        <Link key={coin.id} to={`/coin/${coin.id}`} className="block">
          <Card className={`cursor-pointer ${getCoinCardClass(coin.price_change_percentage_24h)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {/* Left side - Coin info */}
                <div className="flex items-center space-x-4">
                  {/* Special indicator for Vanry/USDT */}
                  {coin.id === 'vanry' && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  
                  {/* Rank */}
                  <div className="text-sm text-muted-foreground font-medium min-w-[2rem]">
                    #{coin.market_cap_rank || index + 1}
                  </div>
                  
                  {/* Coin image and name */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        e.target.src = '/favicon.ico';
                      }}
                    />
                    <div>
                      <div className="font-semibold text-foreground">
                        {coin.name}
                        {coin.pair && (
                          <span className="text-muted-foreground text-sm ml-1">
                            /{coin.pair}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Price info */}
                <div className="text-right space-y-1">
                  <div className="font-semibold text-lg">
                    {cryptoService.formatCurrency(coin.current_price)}
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2">
                    {/* 24h change */}
                    <div className={`flex items-center space-x-1 text-sm font-medium ${getChangeColor(coin.price_change_percentage_24h)}`}>
                      {coin.price_change_percentage_24h > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : coin.price_change_percentage_24h < 0 ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      <span>
                        {cryptoService.formatPercentage(coin.price_change_percentage_24h)}
                      </span>
                    </div>
                    
                    {/* 24h change badge */}
                    <Badge 
                      variant="secondary" 
                      className={`${getChangeBgColor(coin.price_change_percentage_24h)} border-0`}
                    >
                      24h
                    </Badge>
                  </div>
                  
                  {/* Market cap */}
                  <div className="text-xs text-muted-foreground">
                    MCap: {cryptoService.formatLargeNumber(coin.market_cap)}
                  </div>
                </div>
              </div>

              {/* Additional info row */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                <div className="text-xs text-muted-foreground">
                  Volume: {cryptoService.formatLargeNumber(coin.total_volume)}
                </div>
                
                <div className="flex space-x-4 text-xs text-muted-foreground">
                  <span>
                    High: {cryptoService.formatCurrency(coin.high_24h)}
                  </span>
                  <span>
                    Low: {cryptoService.formatCurrency(coin.low_24h)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CoinList;

