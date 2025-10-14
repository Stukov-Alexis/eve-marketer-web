import { MarketOrder, MarketHistory, MarketAnalysis, TradingCalculation, MarketAnomalies } from '@/types/eve';

export class MarketAnalyzer {
  // EVE Online tax rates
  private static readonly BROKER_FEE_RATE = 0.05; // 5% max broker fee
  private static readonly SALES_TAX_RATE = 0.08; // 8% sales tax

  static analyzeMarket(orders: MarketOrder[]): MarketAnalysis {
    const buyOrders = orders
      .filter(order => order.is_buy_order)
      .sort((a, b) => b.price - a.price); // Highest buy price first

    const sellOrders = orders
      .filter(order => !order.is_buy_order)
      .sort((a, b) => a.price - b.price); // Lowest sell price first

    const bestBuyPrice = buyOrders.length > 0 ? buyOrders[0].price : 0;
    const bestSellPrice = sellOrders.length > 0 ? sellOrders[0].price : 0;

    const spread = bestSellPrice - bestBuyPrice;
    const spreadPercentage = bestBuyPrice > 0 ? (spread / bestBuyPrice) * 100 : 0;

    const totalBuyVolume = buyOrders.reduce((sum, order) => sum + order.volume_remain, 0);
    const totalSellVolume = sellOrders.reduce((sum, order) => sum + order.volume_remain, 0);

    const profitMargin = this.calculateProfitMargin(bestBuyPrice, bestSellPrice);

    let recommendedAction = 'Hold';
    if (profitMargin > 15) {
      recommendedAction = 'Strong Buy';
    } else if (profitMargin > 10) {
      recommendedAction = 'Buy';
    } else if (profitMargin < -10) {
      recommendedAction = 'Sell';
    } else if (spreadPercentage > 20) {
      recommendedAction = 'Consider Trading';
    }

    return {
      buy_orders: buyOrders,
      sell_orders: sellOrders,
      best_buy_price: bestBuyPrice,
      best_sell_price: bestSellPrice,
      spread,
      spread_percentage: spreadPercentage,
      total_buy_volume: totalBuyVolume,
      total_sell_volume: totalSellVolume,
      profit_margin: profitMargin,
      recommended_action: recommendedAction,
    };
  }

  static calculateTradingProfit(
    investmentAmount: number,
    buyPrice: number,
    sellPrice: number
  ): TradingCalculation {
    const quantity = Math.floor(investmentAmount / buyPrice);
    const totalCost = quantity * buyPrice;
    
    const brokerFee = totalCost * this.BROKER_FEE_RATE;
    const grossRevenue = quantity * sellPrice;
    const salesTax = grossRevenue * this.SALES_TAX_RATE;
    
    const totalFees = brokerFee + salesTax;
    const netRevenue = grossRevenue - totalFees;
    const netProfit = netRevenue - totalCost;
    const profitMargin = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    return {
      investment_amount: investmentAmount,
      buy_price: buyPrice,
      sell_price: sellPrice,
      quantity,
      broker_fee: brokerFee,
      sales_tax: salesTax,
      gross_profit: grossRevenue - totalCost,
      net_profit: netProfit,
      profit_margin: profitMargin,
      roi_percentage: profitMargin,
    };
  }

  static detectAnomalies(
    orders: MarketOrder[],
    history: MarketHistory[]
  ): MarketAnomalies {
    const buyOrders = orders
      .filter(order => order.is_buy_order)
      .sort((a, b) => b.price - a.price);

    const sellOrders = orders
      .filter(order => !order.is_buy_order)
      .sort((a, b) => a.price - b.price);

    // Price inversions (arbitrage opportunities)
    const priceInversions: Array<{
      buy_price: number;
      sell_price: number;
      arbitrage_opportunity: number;
    }> = [];
    if (buyOrders.length > 0 && sellOrders.length > 0) {
      const highestBuy = buyOrders[0].price;
      const lowestSell = sellOrders[0].price;
      
      if (highestBuy > lowestSell) {
        priceInversions.push({
          buy_price: highestBuy,
          sell_price: lowestSell,
          arbitrage_opportunity: highestBuy - lowestSell,
        });
      }
    }

    // Large orders (>10x average volume)
    const averageVolume = orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.volume_remain, 0) / orders.length 
      : 0;
    
    const largeOrders = orders.filter(
      order => order.volume_remain > averageVolume * 10
    );

    // Price gaps (significant gaps between order prices)
    const priceGaps: Array<{
      gap_size: number;
      gap_percentage: number;
    }> = [];
    for (let i = 0; i < sellOrders.length - 1; i++) {
      const currentPrice = sellOrders[i].price;
      const nextPrice = sellOrders[i + 1].price;
      const gap = nextPrice - currentPrice;
      const gapPercentage = (gap / currentPrice) * 100;

      if (gapPercentage > 10) { // >10% gap
        priceGaps.push({
          gap_size: gap,
          gap_percentage: gapPercentage,
        });
      }
    }

    // Volume spikes in historical data
    const volumeSpikes: Array<{
      date: string;
      volume: number;
      average_volume: number;
    }> = [];
    if (history.length > 7) {
      const averageHistoricalVolume = history
        .slice(-30) // Last 30 days
        .reduce((sum, day) => sum + day.volume, 0) / Math.min(30, history.length);

      history.slice(-7).forEach(day => { // Last 7 days
        if (day.volume > averageHistoricalVolume * 3) { // 3x average volume
          volumeSpikes.push({
            date: day.date,
            volume: day.volume,
            average_volume: averageHistoricalVolume,
          });
        }
      });
    }

    return {
      price_inversions: priceInversions,
      large_orders: largeOrders,
      price_gaps: priceGaps,
      volume_spikes: volumeSpikes,
    };
  }

  private static calculateProfitMargin(buyPrice: number, sellPrice: number): number {
    if (buyPrice <= 0) return 0;
    
    const grossMargin = ((sellPrice - buyPrice) / buyPrice) * 100;
    const feeRate = this.BROKER_FEE_RATE + this.SALES_TAX_RATE;
    const netMargin = grossMargin - (feeRate * 100);
    
    return netMargin;
  }

  static calculateMovingAverage(history: MarketHistory[], days: number): number[] {
    const movingAverages: number[] = [];
    
    for (let i = 0; i < history.length; i++) {
      const start = Math.max(0, i - days + 1);
      const slice = history.slice(start, i + 1);
      const average = slice.reduce((sum, day) => sum + day.average, 0) / slice.length;
      movingAverages.push(average);
    }
    
    return movingAverages;
  }

  static calculateVolatility(history: MarketHistory[]): number {
    if (history.length < 2) return 0;

    const prices = history.map(day => day.average);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    const squaredDifferences = prices.map(price => Math.pow(price - mean, 2));
    const variance = squaredDifferences.reduce((sum, sq) => sum + sq, 0) / prices.length;
    
    return Math.sqrt(variance);
  }

  static getTradingRecommendation(analysis: MarketAnalysis, history: MarketHistory[]): string {
    const { profit_margin, spread_percentage, total_buy_volume, total_sell_volume } = analysis;
    
    const recommendations: string[] = [];

    if (profit_margin > 15) {
      recommendations.push("🟢 Excellent profit opportunity (>15% margin)");
    } else if (profit_margin > 10) {
      recommendations.push("🟡 Good trading opportunity (>10% margin)");
    } else if (profit_margin < 5) {
      recommendations.push("🔴 Low profit margins, consider other items");
    }

    if (spread_percentage > 20) {
      recommendations.push("💰 Large spread detected - potential for market making");
    }

    if (total_buy_volume > total_sell_volume * 2) {
      recommendations.push("📈 High demand - consider selling");
    } else if (total_sell_volume > total_buy_volume * 2) {
      recommendations.push("📉 High supply - consider buying");
    }

    if (history.length >= 7) {
      const recentTrend = this.calculateMovingAverage(history.slice(-7), 3);
      const trendDirection = recentTrend[recentTrend.length - 1] - recentTrend[0];
      
      if (trendDirection > 0) {
        recommendations.push("📊 Price trending upward - consider buying");
      } else if (trendDirection < 0) {
        recommendations.push("📊 Price trending downward - consider selling");
      }
    }

    return recommendations.length > 0 
      ? recommendations.join('\n') 
      : "📋 Stable market conditions - monitor for opportunities";
  }
}
