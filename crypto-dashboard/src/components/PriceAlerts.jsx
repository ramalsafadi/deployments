import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { useCrypto } from '../context/CryptoContext';
import { cryptoService } from '../api/cryptoService';
import { notifications, validation } from '../utils/helpers';

const PriceAlerts = () => {
  const { coins, alerts, addAlert, removeAlert } = useCrypto();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    coinId: '',
    coinName: '',
    alertType: 'above',
    targetPrice: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    // Request notification permission on component mount
    if (notifications.isSupported()) {
      notifications.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCoinSelect = (coinId) => {
    const selectedCoin = coins.find(coin => coin.id === coinId);
    if (selectedCoin) {
      setFormData(prev => ({
        ...prev,
        coinId,
        coinName: selectedCoin.name,
        targetPrice: selectedCoin.current_price.toString()
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.coinId) {
      newErrors.coinId = 'Please select a cryptocurrency';
    }

    if (!formData.targetPrice) {
      newErrors.targetPrice = 'Please enter a target price';
    } else if (!validation.isValidPrice(formData.targetPrice)) {
      newErrors.targetPrice = 'Please enter a valid price';
    }

    if (!formData.alertType) {
      newErrors.alertType = 'Please select an alert type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const alertData = {
      coinId: formData.coinId,
      coinName: formData.coinName,
      type: formData.alertType,
      price: parseFloat(formData.targetPrice),
      message: formData.message || `${formData.coinName} price alert`,
      isActive: true
    };

    addAlert(alertData);
    
    // Reset form
    setFormData({
      coinId: '',
      coinName: '',
      alertType: 'above',
      targetPrice: '',
      message: ''
    });
    
    setIsDialogOpen(false);
  };

  const handleDeleteAlert = (alertId) => {
    removeAlert(alertId);
  };

  const getAlertTypeLabel = (type) => {
    switch (type) {
      case 'above': return 'Price Above';
      case 'below': return 'Price Below';
      case 'change_above': return '24h Change Above';
      case 'change_below': return '24h Change Below';
      default: return type;
    }
  };

  const getAlertStatusColor = (alert) => {
    const coin = coins.find(c => c.id === alert.coinId);
    if (!coin) return 'secondary';
    
    const isTriggered = cryptoService.checkPriceAlert(coin, alert.price, alert.type);
    return isTriggered ? 'destructive' : 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Price Alerts</h2>
          <p className="text-muted-foreground">
            Get notified when your favorite cryptocurrencies reach target prices
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Price Alert</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cryptocurrency Selection */}
              <div className="space-y-2">
                <Label htmlFor="coin">Cryptocurrency</Label>
                <Select value={formData.coinId} onValueChange={handleCoinSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {coins.map((coin) => (
                      <SelectItem key={coin.id} value={coin.id}>
                        <div className="flex items-center space-x-2">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-4 h-4 rounded-full"
                            onError={(e) => {
                              e.target.src = '/favicon.ico';
                            }}
                          />
                          <span>{coin.name}</span>
                          <span className="text-muted-foreground">({coin.symbol.toUpperCase()})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.coinId && (
                  <p className="text-sm text-destructive">{errors.coinId}</p>
                )}
              </div>

              {/* Alert Type */}
              <div className="space-y-2">
                <Label htmlFor="alertType">Alert Type</Label>
                <Select value={formData.alertType} onValueChange={(value) => handleInputChange('alertType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Price goes above</SelectItem>
                    <SelectItem value="below">Price goes below</SelectItem>
                    <SelectItem value="change_above">24h change above (%)</SelectItem>
                    <SelectItem value="change_below">24h change below (%)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.alertType && (
                  <p className="text-sm text-destructive">{errors.alertType}</p>
                )}
              </div>

              {/* Target Price */}
              <div className="space-y-2">
                <Label htmlFor="targetPrice">
                  Target {formData.alertType.includes('change') ? 'Percentage (%)' : 'Price ($)'}
                </Label>
                <Input
                  id="targetPrice"
                  type="number"
                  step={formData.alertType.includes('change') ? '0.01' : '0.000001'}
                  placeholder={formData.alertType.includes('change') ? 'e.g., 5.00' : 'e.g., 50000.00'}
                  value={formData.targetPrice}
                  onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                />
                {errors.targetPrice && (
                  <p className="text-sm text-destructive">{errors.targetPrice}</p>
                )}
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Input
                  id="message"
                  placeholder="e.g., Time to buy more!"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                />
              </div>

              {/* Notification Permission Warning */}
              {notificationPermission !== 'granted' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please enable browser notifications to receive price alerts.
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="p-0 h-auto ml-2"
                      onClick={() => notifications.requestPermission().then(setNotificationPermission)}
                    >
                      Enable Notifications
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Alert
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notification Status */}
      {notificationPermission === 'granted' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Browser notifications are enabled. You'll receive alerts when your price targets are reached.
          </AlertDescription>
        </Alert>
      )}

      {/* Active Alerts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Alerts ({alerts.length})</h3>
        
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">No price alerts set</h4>
              <p className="text-muted-foreground mb-4">
                Create your first price alert to get notified when cryptocurrencies reach your target prices.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert) => {
              const coin = coins.find(c => c.id === alert.coinId);
              const currentPrice = coin?.current_price || 0;
              const isTriggered = coin ? cryptoService.checkPriceAlert(coin, alert.price, alert.type) : false;
              
              return (
                <Card key={alert.id} className={isTriggered ? 'border-destructive' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {coin && (
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.target.src = '/favicon.ico';
                            }}
                          />
                        )}
                        <div>
                          <div className="font-medium">{alert.coinName}</div>
                          <div className="text-sm text-muted-foreground">
                            {getAlertTypeLabel(alert.type)}: {' '}
                            {alert.type.includes('change') 
                              ? `${alert.price}%` 
                              : cryptoService.formatCurrency(alert.price)
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Current: {coin ? (
                              alert.type.includes('change') 
                                ? cryptoService.formatPercentage(coin.price_change_percentage_24h)
                                : cryptoService.formatCurrency(currentPrice)
                            ) : 'N/A'}
                          </div>
                          <Badge variant={getAlertStatusColor(alert)}>
                            {isTriggered ? 'Triggered' : 'Active'}
                          </Badge>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {alert.message && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Message: {alert.message}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>How Price Alerts Work</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Alerts are checked automatically every 30 seconds when the app is open</p>
            <p>• Browser notifications will appear when your price targets are reached</p>
            <p>• Alerts are stored locally in your browser and will persist between sessions</p>
            <p>• Each alert triggers only once and is then removed automatically</p>
            <p>• Make sure to keep the browser tab open to receive real-time notifications</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceAlerts;

