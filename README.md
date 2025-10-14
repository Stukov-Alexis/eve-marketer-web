# 🌌 EVE Market Nexus - Web Application

WARNING STILL IN DEVELOPMENT
[FOR TRAINING PURPOSE]
A modern Next.js web application for EVE Online market analysis, featuring real-time data from the EVE ESI API.

## Features

- **🚀 Real-time Market Data**: Live market orders and pricing from EVE ESI API
- **📊 Advanced Analysis**: Profit calculations, market trends, and trading recommendations
- **💰 Investment Calculator**: Calculate potential profits with EVE's tax system
- **⚠️ Anomaly Detection**: Identify arbitrage opportunities and market inefficiencies
- **🎨 EVE Online Theme**: Authentic space-themed UI matching EVE's design language
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Select Region**: Choose your trading region (defaults to The Forge/Jita)
2. **Search Items**: Search for specific items or browse popular trading commodities
3. **Set Investment**: Adjust your investment amount using the slider
4. **Analyze**: Click "Analyze Market" to get comprehensive market data

## API Endpoints

- `GET /api/regions` - Fetch all EVE regions
- `GET /api/items?search=<term>` - Search for items
- `GET /api/items?popular=true` - Get popular trading items
- `GET /api/market?regionId=<id>&typeId=<id>&investmentAmount=<amount>` - Get market analysis

## Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom EVE theme
- **API**: EVE Online ESI (EVE Swagger Interface)
- **Data Analysis**: Custom market analysis algorithms

## EVE Online Integration

This application uses the official EVE Online ESI API to provide:
- Real-time market orders
- Historical price data
- Item information
- Region data

## Features Overview

### Market Analysis
- Buy/sell order analysis
- Profit margin calculations
- Market spread analysis
- Volume indicators

### Trading Calculator
- Investment amount optimization
- EVE tax calculations (5% broker fee, 8% sales tax)
- ROI projections
- Unit calculations

### Anomaly Detection
- Price inversions (arbitrage opportunities)
- Large volume orders
- Price gaps
- Volume spikes

### AI Recommendations
- Market trend analysis
- Trading suggestions
- Risk assessment
- Timing recommendations

## Development

### Project Structure
```
src/
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # React components
├── lib/              # Utilities and API clients
└── types/            # TypeScript definitions
```

### Building for Production

```bash
npm run build
npm start
```

## Legal Notice

This application is not affiliated with or endorsed by CCP Games. EVE Online and all related marks are trademarks of CCP hf.

## License

This project is for educational purposes. EVE Online data is provided under CCP Games' ESI API terms.

---

**Disclaimer**: Use this tool for informational purposes only. Always conduct your own research before making trading decisions in EVE Online.
