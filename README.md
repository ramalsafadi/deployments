# Crypto Dashboard - Real-time Cryptocurrency Tracker

A modern, responsive cryptocurrency dashboard built with React + Vite, featuring real-time price tracking, advanced search functionality, interactive charts, dark/light mode, and price alerts with browser notifications.

## 🚀 Features

### Core Functionality
- **Real-time Cryptocurrency Prices**: Track live prices for top cryptocurrencies
- **Vanry/USDT Featured**: Vanry/USDT pair is prominently featured and always pinned at the top
- **Advanced Search**: Debounced search functionality with instant results
- **Smart Filtering**: Sort by market cap, price, volume, and 24h change
- **Responsive Design**: Optimized for both desktop and mobile devices

### Interactive Charts
- **Price History Visualization**: Interactive line charts using Recharts
- **Multiple Time Periods**: 7D, 30D, 3M, and 1Y chart views
- **Real-time Updates**: Charts update automatically with latest data
- **Hover Tooltips**: Detailed price information on hover

### Price Alerts System
- **Custom Price Alerts**: Set alerts for price above/below targets
- **Percentage Change Alerts**: Get notified on 24h change thresholds
- **Browser Notifications**: Native browser notification support
- **Local Storage**: Alerts persist between browser sessions
- **One-time Triggers**: Alerts automatically remove after triggering

### User Experience
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Auto-refresh**: Prices update automatically every 30 seconds

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.7 with custom design system
- **UI Components**: shadcn/ui component library
- **Charts**: Recharts 2.15.3 for data visualization
- **Routing**: React Router DOM 7.6.1
- **Icons**: Lucide React 0.510.0
- **HTTP Client**: Axios 1.11.0
- **Package Manager**: pnpm 10.4.1

## 📦 Installation

### Prerequisites
- Node.js 20.18.0 or higher
- pnpm (recommended) or npm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev --host
   # or
   npm run dev -- --host
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
pnpm run build
# or
npm run build
```

The built files will be in the `dist/` directory.

## 🏗️ Project Structure

```
crypto-dashboard/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service layer
│   │   └── cryptoService.js
│   ├── components/        # Reusable React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── CoinList.jsx
│   │   ├── Header.jsx
│   │   ├── PriceAlerts.jsx
│   │   └── SearchAndFilter.jsx
│   ├── context/          # React Context providers
│   │   └── CryptoContext.jsx
│   ├── data/             # Mock data and constants
│   │   └── mockData.js
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── CoinDetailPage.jsx
│   │   └── PriceAlertsPage.jsx
│   ├── utils/            # Utility functions
│   │   └── helpers.js
│   ├── App.jsx           # Main application component
│   ├── App.css          # Global styles
│   └── main.jsx         # Application entry point
├── docs/                 # Documentation
│   └── ai_usage.md      # AI assistance documentation
├── package.json         # Project dependencies and scripts
└── README.md           # This file
```

## 🎯 Key Features Explained

### Vanry/USDT Integration
As per project requirements, Vanry/USDT is prominently featured:
- Always appears at the top of the coin list regardless of sorting
- Special "Featured" badge with star icon
- Highlighted with distinctive styling
- Includes pair notation (VANRY/USDT)

### Mock Data Implementation
The application uses comprehensive mock data to simulate real CoinGecko API responses:
- Realistic cryptocurrency data for 10+ popular coins
- Historical price data generation for charts
- Market statistics and global data
- Configurable API delay simulation

### Search and Filter System
- **Debounced Search**: 300ms delay prevents excessive API calls
- **Real-time Results**: Instant filtering as you type
- **Multiple Sort Options**: Market cap, price, volume, 24h change
- **Persistent Vanry Position**: Vanry/USDT remains at top even when searching

### Price Alert System
- **Multiple Alert Types**: Price above/below, percentage change alerts
- **Browser Notifications**: Native notification API integration
- **Local Persistence**: Alerts saved in localStorage
- **Smart Triggering**: Automatic alert checking every 30 seconds
- **User-friendly Management**: Easy creation and deletion of alerts

## 🎨 Design System

### Color Scheme
- **Light Mode**: Clean whites and subtle grays
- **Dark Mode**: Rich blacks with purple accents
- **Accent Colors**: Blue to purple gradient for branding
- **Status Colors**: Green for gains, red for losses

### Typography
- **Font Family**: System fonts for optimal performance
- **Hierarchy**: Clear heading and body text distinction
- **Responsive Sizing**: Scales appropriately across devices

### Component Design
- **Cards**: Elevated surfaces with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean inputs with validation feedback
- **Charts**: Coordinated colors with theme system

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full feature set with sidebar layouts
- **Tablet**: Adapted layouts with touch-friendly controls
- **Mobile**: Streamlined interface with collapsible navigation

## 🔧 Configuration

### Environment Variables
Currently, the application uses mock data by default. To switch to live data:

1. Set `USE_MOCK_DATA = false` in `src/api/cryptoService.js`
2. Ensure proper CORS configuration for CoinGecko API calls

### Customization Options
- **Theme Colors**: Modify CSS variables in `src/App.css`
- **Mock Data**: Update `src/data/mockData.js` for different coins
- **API Endpoints**: Configure base URLs in `src/api/cryptoService.js`
- **Refresh Intervals**: Adjust timing in `src/context/CryptoContext.jsx`

## 🚀 Performance Optimizations

- **Code Splitting**: React.lazy() for route-based splitting
- **Memoization**: React.memo() for expensive components
- **Debounced Search**: Prevents excessive API calls
- **Efficient Re-renders**: Optimized context usage
- **Image Optimization**: Fallback handling for coin images

## 🧪 Testing

The application includes comprehensive error handling and loading states:
- **Network Error Handling**: Graceful fallbacks for API failures
- **Loading States**: Skeleton screens during data fetching
- **Form Validation**: Client-side validation with error messages
- **Browser Compatibility**: Tested across modern browsers

## 🔮 Future Enhancements

Potential improvements for future versions:
- **Portfolio Tracking**: Add/remove coins to personal portfolio
- **Advanced Charts**: Candlestick charts and technical indicators
- **News Integration**: Cryptocurrency news feed
- **Social Features**: Share alerts and watchlists
- **Mobile App**: React Native version
- **Real-time WebSocket**: Live price streaming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **CoinGecko API**: Cryptocurrency data structure reference
- **shadcn/ui**: Beautiful and accessible UI components
- **Recharts**: Powerful charting library for React
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful and consistent icon set

## 📞 Support

For questions, issues, or feature requests:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include browser version and steps to reproduce

---

**Built with ❤️ using React + Vite**

