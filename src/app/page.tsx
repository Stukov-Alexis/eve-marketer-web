'use client';

import { useState } from 'react';
import MarketSearch from '@/components/MarketSearch';
import MarketAnalysisDisplay from '@/components/MarketAnalysis';
import { MarketAnalysis, TradingCalculation, MarketAnomalies } from '@/types/eve';

interface MarketData {
  analysis: MarketAnalysis;
  trading_calculation?: TradingCalculation;
  anomalies?: MarketAnomalies;
  recommendation: string;
  item_info?: { name: string };
}

export default function Home() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarketSearch = async (regionId: number, typeId: number, investmentAmount?: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        regionId: regionId.toString(),
        typeId: typeId.toString(),
      });
      
      if (investmentAmount) {
        params.append('investmentAmount', investmentAmount.toString());
      }
      
      const response = await fetch(`/api/market?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch market data');
      }
      
      if (data.error) {
        setError(data.error);
        setMarketData(null);
      } else {
        setMarketData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setMarketData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text mb-4">
            🌌 EVE MARKET NEXUS 🌌
          </div>
          <div className="text-xl text-blue-200 font-light">
            Real-time Market Analysis for New Eden's Elite Traders
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Powered by EVE Online ESI API • Built for Capsuleers
          </div>
        </header>

        {/* Market Search */}
        <MarketSearch onSearch={handleMarketSearch} isLoading={isLoading} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center text-red-400">
              <span className="text-xl mr-2">⚠️</span>
              <div>
                <div className="font-bold">Error</div>
                <div className="text-red-300">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Market Analysis Results */}
        {marketData && (
          <MarketAnalysisDisplay
            analysis={marketData.analysis}
            tradingCalculation={marketData.trading_calculation}
            anomalies={marketData.anomalies}
            recommendation={marketData.recommendation}
            itemName={marketData.item_info?.name}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mr-4"></div>
              <div className="text-blue-300 text-xl font-semibold">
                Scanning market data across New Eden...
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-blue-500/20">
          <div className="text-gray-400 text-sm">
            <div className="mb-2">
              EVE Online Market Nexus • Not affiliated with CCP Games
            </div>
            <div className="text-xs text-gray-500">
              Data sourced from the official EVE ESI API • For educational purposes
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
