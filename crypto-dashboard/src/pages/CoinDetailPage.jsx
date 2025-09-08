// MADE BY Ram ALSAFADI - Crypto Dashboard Coin Detail Page
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Star, ExternalLink, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import Header from '../components/Header';
import { useCrypto } from '../context/CryptoContext';
import { cryptoService } from '../api/cryptoService';
import { getChangeColor, getChangeBgColor } from '../utils/helpers';

const CoinDetailPage = () => {
  const { id } = useParams();
  const { selectedCoin, coinHistory, fetchCoinDetails, fetchCoinHistory, loading, error } = useCrypto();
  const [chartPeriod, setChartPeriod] = useState('30');

  useEffect(() => {
    if (id) {
      fetchCoinDetails(id);
      fetchCoinHistory(id, parseInt(chartPeriod));
    }
  }, [id, chartPeriod]);

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
    if (id) {
      fetchCoinHistory(id, parseInt(period));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-96 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!selectedCoin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Coin not found</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = coinHistory[id] || [];
  const formatChartData = (data) => {
    return data.map(item => ({
      date: item.date,
      price: item.price,
      volume: item.volume
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Coin Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={selectedCoin.image}
              alt={selectedCoin.name}
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                e.target.src = '/favicon.ico';
              }}
            />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-foreground">
                  {selectedCoin.name}
                  {selectedCoin.pair && (
                    <span className="text-muted-foreground">/{selectedCoin.pair}</span>
                  )}
                </h1>
                {selectedCoin.id === 'vanry' && (
                  <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground uppercase">
                {selectedCoin.symbol} • Rank #{selectedCoin.market_cap_rank}
              </p>
            </div>
          </div>

          {/* Price and Change */}
          <div className="flex items-center space-x-6">
            <div className="text-4xl font-bold text-foreground">
              {cryptoService.formatCurrency(selectedCoin.current_price)}
            </div>
            <div className={`flex items-center space-x-2 text-lg font-semibold ${getChangeColor(selectedCoin.price_change_percentage_24h)}`}>
              {selectedCoin.price_change_percentage_24h > 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : selectedCoin.price_change_percentage_24h < 0 ? (
                <TrendingDown className="w-5 h-5" />
              ) : null}
              <span>
                {cryptoService.formatPercentage(selectedCoin.price_change_percentage_24h)}
              </span>
              <Badge 
                variant="secondary" 
                className={`${getChangeBgColor(selectedCoin.price_change_percentage_24h)} border-0`}
              >
                24h
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Price Chart</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    {['7', '30', '90', '365'].map((period) => (
                      <Button
                        key={period}
                        variant={chartPeriod === period ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePeriodChange(period)}
                      >
                        {period === '7' ? '7D' : period === '30' ? '30D' : period === '90' ? '3M' : '1Y'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formatChartData(chartData)}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `$${value.toFixed(value < 1 ? 4 : 2)}`}
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            `$${parseFloat(value).toFixed(value < 1 ? 6 : 2)}`,
                            'Price'
                          ]}
                          labelFormatter={(label) => `Date: ${label}`}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={selectedCoin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Market Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Market Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-semibold">
                    {cryptoService.formatLargeNumber(selectedCoin.market_cap)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span className="font-semibold">
                    {cryptoService.formatLargeNumber(selectedCoin.total_volume)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Circulating Supply</span>
                  <span className="font-semibold">
                    {selectedCoin.circulating_supply?.toLocaleString() || 'N/A'}
                  </span>
                </div>
                {selectedCoin.max_supply && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Supply</span>
                    <span className="font-semibold">
                      {selectedCoin.max_supply.toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
              <CardHeader>
                <CardTitle>24h Price Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Low</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {cryptoService.formatCurrency(selectedCoin.low_24h)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {cryptoService.formatCurrency(selectedCoin.high_24h)}
                  </span>
                </div>
                
                {/* Price Range Bar */}
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full"
                      style={{
                        width: `${((selectedCoin.current_price - selectedCoin.low_24h) / (selectedCoin.high_24h - selectedCoin.low_24h)) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>Current</span>
                    <span>High</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All-Time High/Low */}
            <Card>
              <CardHeader>
                <CardTitle>All-Time Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">All-Time High</span>
                    <span className="font-semibold">
                      {cryptoService.formatCurrency(selectedCoin.ath)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedCoin.ath_change_percentage?.toFixed(2)}% from ATH
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">All-Time Low</span>
                    <span className="font-semibold">
                      {cryptoService.formatCurrency(selectedCoin.atl)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedCoin.atl_change_percentage?.toFixed(2)}% from ATL
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* External Links */}
            <Card>
              <CardHeader>
                <CardTitle>External Links</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <a 
                    href={`https://www.coingecko.com/en/coins/${selectedCoin.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on CoinGecko
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {selectedCoin.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Key Information</h4>
                      <ul className="space-y-2 text-sm">
                        <li><span className="text-muted-foreground">Symbol:</span> {selectedCoin.symbol.toUpperCase()}</li>
                        <li><span className="text-muted-foreground">Rank:</span> #{selectedCoin.market_cap_rank}</li>
                        <li><span className="text-muted-foreground">Market Cap:</span> {cryptoService.formatLargeNumber(selectedCoin.market_cap)}</li>
                        <li><span className="text-muted-foreground">Total Volume:</span> {cryptoService.formatLargeNumber(selectedCoin.total_volume)}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Supply Information</h4>
                      <ul className="space-y-2 text-sm">
                        <li><span className="text-muted-foreground">Circulating:</span> {selectedCoin.circulating_supply?.toLocaleString() || 'N/A'}</li>
                        <li><span className="text-muted-foreground">Total:</span> {selectedCoin.total_supply?.toLocaleString() || 'N/A'}</li>
                        <li><span className="text-muted-foreground">Max:</span> {selectedCoin.max_supply?.toLocaleString() || 'Unlimited'}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Set Price Alert</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Price alert functionality will be implemented in the next phase.
                  </p>
                  <Button disabled>
                    Create Alert
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CoinDetailPage;

