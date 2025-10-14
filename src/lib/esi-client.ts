import { MarketOrder, MarketHistory, Region, ItemType } from '@/types/eve';

class ESIClient {
  private baseUrl = 'https://esi.evetech.net/latest';
  private lastRequestTime = 0;
  private requestDelay = 100; // 100ms between requests

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.requestDelay) {
      await new Promise(resolve => setTimeout(resolve, this.requestDelay - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, unknown>): Promise<T | null> {
    await this.rateLimit();

    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'EVE Market Nexus/1.0 (Next.js)',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(`ESI API error: ${response.status} ${response.statusText}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('ESI API request failed:', error);
      return null;
    }
  }

  async getRegions(): Promise<Region[]> {
    const regionIds = await this.makeRequest<number[]>('/universe/regions/');
    if (!regionIds) return [];

    const regions: Region[] = [];
    
    // Fetch details for major trading regions
    const majorRegionIds = regionIds.slice(0, 20); // Limit to avoid too many requests
    
    for (const regionId of majorRegionIds) {
      const regionInfo = await this.makeRequest<{name: string; description?: string}>(`/universe/regions/${regionId}/`);
      if (regionInfo && regionInfo.name) {
        regions.push({
          region_id: regionId,
          name: regionInfo.name,
          description: regionInfo.description,
        });
      }
    }

    return regions.sort((a, b) => a.name.localeCompare(b.name));
  }

  async searchItems(searchTerm: string): Promise<ItemType[]> {
    const searchData = await this.makeRequest<{inventory_type?: number[]}>('/search/', {
      categories: 'inventory_type',
      search: searchTerm,
      strict: false,
    });

    if (!searchData || !searchData.inventory_type) return [];

    const items: ItemType[] = [];
    const typeIds = searchData.inventory_type.slice(0, 20); // Limit results

    for (const typeId of typeIds) {
      const itemInfo = await this.makeRequest<{name: string; description?: string; published: boolean}>(`/universe/types/${typeId}/`);
      if (itemInfo && itemInfo.published) {
        items.push({
          type_id: typeId,
          name: itemInfo.name,
          description: itemInfo.description,
          published: itemInfo.published,
        });
      }
    }

    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getMarketOrders(regionId: number, typeId: number): Promise<MarketOrder[]> {
    const orders = await this.makeRequest<MarketOrder[]>(`/markets/${regionId}/orders/`, {
      order_type: 'all',
      type_id: typeId,
    });

    return orders || [];
  }

  async getMarketHistory(regionId: number, typeId: number): Promise<MarketHistory[]> {
    const history = await this.makeRequest<MarketHistory[]>(`/markets/${regionId}/history/`, {
      type_id: typeId,
    });

    return history || [];
  }

  async getItemInfo(typeId: number): Promise<ItemType | null> {
    const itemInfo = await this.makeRequest<{name: string; description?: string; published: boolean}>(`/universe/types/${typeId}/`);
    
    if (!itemInfo) return null;

    return {
      type_id: typeId,
      name: itemInfo.name,
      description: itemInfo.description,
      published: itemInfo.published,
    };
  }

  getPopularTradeItems(): ItemType[] {
    return [
      { type_id: 34, name: 'Tritanium', published: true },
      { type_id: 35, name: 'Pyerite', published: true },
      { type_id: 36, name: 'Mexallon', published: true },
      { type_id: 37, name: 'Isogen', published: true },
      { type_id: 38, name: 'Nocxium', published: true },
      { type_id: 39, name: 'Zydrine', published: true },
      { type_id: 40, name: 'Megacyte', published: true },
      { type_id: 11399, name: 'Morphite', published: true },
      { type_id: 2456, name: 'Dominix', published: true },
      { type_id: 587, name: 'Rifter', published: true },
      { type_id: 596, name: 'Caracal', published: true },
      { type_id: 2006, name: 'Typhoon', published: true },
      { type_id: 3756, name: 'Catalyst', published: true },
      { type_id: 16236, name: 'Procurer', published: true },
      { type_id: 17738, name: 'Retriever', published: true },
      { type_id: 22544, name: 'Mackinaw', published: true },
    ];
  }
}

export const esiClient = new ESIClient();
