'use client';

import { useState, useEffect } from 'react';
import { Region, ItemType } from '@/types/eve';

interface MarketSearchProps {
  onSearch: (regionId: number, typeId: number, investmentAmount?: number) => void;
  isLoading?: boolean;
}

export default function MarketSearch({ onSearch, isLoading = false }: MarketSearchProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number>(0);
  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState<number>(100000000); // 100M ISK default
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  
  useEffect(() => {
    fetchRegions();
    fetchPopularItems();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await fetch('/api/regions');
      const data = await response.json();
      setRegions(data);
      // Default to The Forge (Jita) if available
      const theForge = data.find((r: Region) => r.name === 'The Forge');
      if (theForge) {
        setSelectedRegion(theForge.region_id);
      } else if (data.length > 0) {
        setSelectedRegion(data[0].region_id);
      }
    } catch (error) {
      console.error('Failed to fetch regions:', error);
    } finally {
      setLoadingRegions(false);
    }
  };

  const fetchPopularItems = async () => {
    try {
      const response = await fetch('/api/items?popular=true');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch popular items:', error);
    }
  };

  const searchItems = async () => {
    if (!searchTerm.trim()) return;
    
    setLoadingItems(true);
    try {
      const response = await fetch(`/api/items?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to search items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRegion && selectedItem) {
      onSearch(selectedRegion, selectedItem, investmentAmount);
    }
  };

  const formatISK = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
          ⚡ MARKET NEXUS ⚡
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Region Selection */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-blue-200 mb-2">
            📍 Trading Region
          </label>
          <select
            id="region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(parseInt(e.target.value))}
            disabled={loadingRegions}
            className="w-full bg-slate-800/50 border border-blue-500/50 rounded-lg px-4 py-2 text-white 
                     focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={0}>Select a region...</option>
            {regions.map((region) => (
              <option key={region.region_id} value={region.region_id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Item Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-blue-200 mb-2">
            🔍 Item Search
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for items (e.g., Tritanium, Caracal)"
              className="flex-1 bg-slate-800/50 border border-blue-500/50 rounded-lg px-4 py-2 text-white 
                       placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchItems())}
            />
            <button
              type="button"
              onClick={searchItems}
              disabled={loadingItems || !searchTerm.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                       text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              {loadingItems ? '🔄' : '🔍'}
            </button>
            <button
              type="button"
              onClick={fetchPopularItems}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Popular
            </button>
          </div>
        </div>

        {/* Item Selection */}
        <div>
          <label htmlFor="item" className="block text-sm font-medium text-blue-200 mb-2">
            📦 Select Item
          </label>
          <select
            id="item"
            value={selectedItem}
            onChange={(e) => setSelectedItem(parseInt(e.target.value))}
            className="w-full bg-slate-800/50 border border-blue-500/50 rounded-lg px-4 py-2 text-white 
                     focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          >
            <option value={0}>Select an item...</option>
            {items.map((item) => (
              <option key={item.type_id} value={item.type_id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Investment Amount */}
        <div>
          <label htmlFor="investment" className="block text-sm font-medium text-blue-200 mb-2">
            💰 Investment Amount ({formatISK(investmentAmount)} ISK)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              id="investment"
              min={1000000} // 1M ISK
              max={10000000000} // 10B ISK
              step={10000000} // 10M ISK steps
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                       slider:bg-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1M</span>
              <span>1B</span>
              <span>10B</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedRegion || !selectedItem}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                   disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed
                   text-white font-bold py-3 px-6 rounded-lg transition-all duration-200
                   transform hover:scale-105 disabled:transform-none
                   shadow-lg shadow-blue-500/25"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analyzing Market...
            </div>
          ) : (
            '🚀 Analyze Market'
          )}
        </button>
      </form>
    </div>
  );
}
