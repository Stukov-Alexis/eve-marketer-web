export interface MarketOrder {
  duration: number;
  is_buy_order: boolean;
  issued: string;
  location_id: number;
  min_volume: number;
  order_id: number;
  price: number;
  range: string;
  system_id: number;
  type_id: number;
  volume_remain: number;
  volume_total: number;
}

export interface MarketHistory {
  average: number;
  date: string;
  highest: number;
  lowest: number;
  order_count: number;
  volume: number;
}

export interface Region {
  region_id: number;
  name: string;
  description?: string;
}

export interface ItemType {
  type_id: number;
  name: string;
  description?: string;
  published: boolean;
}

export interface MarketAnalysis {
  buy_orders: MarketOrder[];
  sell_orders: MarketOrder[];
  best_buy_price: number;
  best_sell_price: number;
  spread: number;
  spread_percentage: number;
  total_buy_volume: number;
  total_sell_volume: number;
  profit_margin: number;
  recommended_action: string;
}

export interface TradingCalculation {
  investment_amount: number;
  buy_price: number;
  sell_price: number;
  quantity: number;
  broker_fee: number;
  sales_tax: number;
  gross_profit: number;
  net_profit: number;
  profit_margin: number;
  roi_percentage: number;
}

export interface MarketAnomalies {
  price_inversions: Array<{
    buy_price: number;
    sell_price: number;
    arbitrage_opportunity: number;
  }>;
  large_orders: MarketOrder[];
  price_gaps: Array<{
    gap_size: number;
    gap_percentage: number;
  }>;
  volume_spikes: Array<{
    date: string;
    volume: number;
    average_volume: number;
  }>;
}
