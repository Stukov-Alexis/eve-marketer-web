import { NextRequest, NextResponse } from 'next/server';
import { esiClient } from '@/lib/esi-client';
import { MarketAnalyzer } from '@/lib/market-analyzer';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const regionId = searchParams.get('regionId');
  const typeId = searchParams.get('typeId');
  const investmentAmount = searchParams.get('investmentAmount');

  if (!regionId || !typeId) {
    return NextResponse.json(
      { error: 'regionId and typeId parameters are required' },
      { status: 400 }
    );
  }

  try {
    const [orders, history, itemInfo] = await Promise.all([
      esiClient.getMarketOrders(parseInt(regionId), parseInt(typeId)),
      esiClient.getMarketHistory(parseInt(regionId), parseInt(typeId)),
      esiClient.getItemInfo(parseInt(typeId))
    ]);

    if (orders.length === 0) {
      return NextResponse.json({
        error: 'No market data found for this item in the selected region',
        orders: [],
        history: [],
        analysis: null,
        anomalies: null,
        trading_calculation: null,
        recommendation: 'No data available for analysis'
      });
    }

    // Analyze market data
    const analysis = MarketAnalyzer.analyzeMarket(orders);
    const anomalies = MarketAnalyzer.detectAnomalies(orders, history);
    const recommendation = MarketAnalyzer.getTradingRecommendation(analysis, history);

    // Calculate trading profit if investment amount provided
    let tradingCalculation = null;
    if (investmentAmount && analysis.best_buy_price > 0 && analysis.best_sell_price > 0) {
      tradingCalculation = MarketAnalyzer.calculateTradingProfit(
        parseFloat(investmentAmount),
        analysis.best_buy_price,
        analysis.best_sell_price
      );
    }

    return NextResponse.json({
      orders,
      history,
      analysis,
      anomalies,
      trading_calculation: tradingCalculation,
      recommendation,
      item_info: itemInfo
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
