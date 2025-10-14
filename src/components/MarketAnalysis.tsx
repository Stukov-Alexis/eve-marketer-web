'use client';

import { MarketAnalysis, MarketOrder, TradingCalculation, MarketAnomalies } from '@/types/eve';

interface MarketAnalysisProps {
  analysis: MarketAnalysis;
  tradingCalculation?: TradingCalculation;
  anomalies?: MarketAnomalies;
  recommendation: string;
  itemName?: string;
}

export default function MarketAnalysisDisplay({ 
  analysis, 
  tradingCalculation, 
  anomalies, 
  recommendation,
  itemName 
}: MarketAnalysisProps) {
  const formatISK = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toFixed(2);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'Strong Buy': return 'text-green-400 border-green-500/50 bg-green-900/20';
      case 'Buy': return 'text-green-300 border-green-500/30 bg-green-900/10';
      case 'Sell': return 'text-red-400 border-red-500/50 bg-red-900/20';
      case 'Consider Trading': return 'text-yellow-400 border-yellow-500/50 bg-yellow-900/20';
      default: return 'text-blue-400 border-blue-500/30 bg-blue-900/10';
    }
  };

  const getProfitMarginColor = (margin: number) => {
    if (margin > 15) return 'text-green-400';
    if (margin > 10) return 'text-green-300';
    if (margin > 5) return 'text-yellow-400';
    if (margin > 0) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
        <div className="text-xl font-bold text-blue-300 mb-2">
          📊 Market Analysis: {itemName}
        </div>
        <div className={`inline-flex items-center px-4 py-2 rounded-lg border font-medium ${getRecommendationColor(analysis.recommended_action)}`}>
          {analysis.recommended_action}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-300 font-medium mb-1">Best Buy Price</div>
          <div className="text-2xl font-bold text-green-400">
            {formatISK(analysis.best_buy_price)} ISK
          </div>
        </div>
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-300 font-medium mb-1">Best Sell Price</div>
          <div className="text-2xl font-bold text-red-400">
            {formatISK(analysis.best_sell_price)} ISK
          </div>
        </div>
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-300 font-medium mb-1">Spread</div>
          <div className="text-2xl font-bold text-yellow-400">
            {formatISK(analysis.spread)} ISK
          </div>
          <div className="text-sm text-gray-400">
            ({analysis.spread_percentage.toFixed(1)}%)
          </div>
        </div>
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-300 font-medium mb-1">Profit Margin</div>
          <div className={`text-2xl font-bold ${getProfitMarginColor(analysis.profit_margin)}`}>
            {analysis.profit_margin.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Trading Calculator */}
      {tradingCalculation && (
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <div className="text-xl font-bold text-green-300 mb-4">
            💰 Investment Analysis
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-green-300 font-medium">Investment</div>
              <div className="text-lg font-bold text-white">
                {formatISK(tradingCalculation.investment_amount)} ISK
              </div>
            </div>
            <div>
              <div className="text-green-300 font-medium">Units Tradeable</div>
              <div className="text-lg font-bold text-white">
                {formatNumber(tradingCalculation.quantity)}
              </div>
            </div>
            <div>
              <div className="text-green-300 font-medium">Total Fees</div>
              <div className="text-lg font-bold text-red-400">
                {formatISK(tradingCalculation.broker_fee + tradingCalculation.sales_tax)} ISK
              </div>
            </div>
            <div>
              <div className="text-green-300 font-medium">Net Profit</div>
              <div className={`text-lg font-bold ${tradingCalculation.net_profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatISK(tradingCalculation.net_profit)} ISK
              </div>
              <div className="text-sm text-gray-400">
                ROI: {tradingCalculation.roi_percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buy Orders */}
        <div className="bg-gradient-to-r from-green-900/20 to-slate-900/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <div className="text-lg font-bold text-green-300 mb-4">
            📈 Buy Orders ({formatNumber(analysis.total_buy_volume)} units)
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analysis.buy_orders.slice(0, 10).map((order) => (
              <div key={order.order_id} className="flex justify-between items-center py-2 px-3 bg-green-900/10 rounded">
                <div className="text-green-400 font-mono">
                  {formatISK(order.price)} ISK
                </div>
                <div className="text-green-300">
                  {formatNumber(order.volume_remain)} units
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sell Orders */}
        <div className="bg-gradient-to-r from-red-900/20 to-slate-900/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-6">
          <div className="text-lg font-bold text-red-300 mb-4">
            📉 Sell Orders ({formatNumber(analysis.total_sell_volume)} units)
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analysis.sell_orders.slice(0, 10).map((order) => (
              <div key={order.order_id} className="flex justify-between items-center py-2 px-3 bg-red-900/10 rounded">
                <div className="text-red-400 font-mono">
                  {formatISK(order.price)} ISK
                </div>
                <div className="text-red-300">
                  {formatNumber(order.volume_remain)} units
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anomalies */}
      {anomalies && (
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
          <div className="text-xl font-bold text-yellow-300 mb-4">
            ⚠️ Market Anomalies
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Inversions */}
            {anomalies.price_inversions.length > 0 && (
              <div>
                <div className="text-yellow-300 font-medium mb-2">💎 Arbitrage Opportunities</div>
                {anomalies.price_inversions.map((inversion, index) => (
                  <div key={index} className="bg-yellow-900/20 rounded p-3 mb-2">
                    <div className="text-green-400">Buy at: {formatISK(inversion.sell_price)} ISK</div>
                    <div className="text-red-400">Sell at: {formatISK(inversion.buy_price)} ISK</div>
                    <div className="text-yellow-400 font-bold">
                      Profit: {formatISK(inversion.arbitrage_opportunity)} ISK/unit
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Large Orders */}
            {anomalies.large_orders.length > 0 && (
              <div>
                <div className="text-yellow-300 font-medium mb-2">📦 Large Orders</div>
                {anomalies.large_orders.slice(0, 3).map((order) => (
                  <div key={order.order_id} className="bg-orange-900/20 rounded p-3 mb-2">
                    <div className={order.is_buy_order ? 'text-green-400' : 'text-red-400'}>
                      {order.is_buy_order ? 'BUY' : 'SELL'}: {formatISK(order.price)} ISK
                    </div>
                    <div className="text-orange-400 font-bold">
                      Volume: {formatNumber(order.volume_remain)} units
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
        <div className="text-xl font-bold text-purple-300 mb-4">
          🤖 Trading Recommendations
        </div>
        <div className="text-gray-200 whitespace-pre-line leading-relaxed">
          {recommendation}
        </div>
      </div>
    </div>
  );
}
