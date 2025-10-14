import { NextRequest, NextResponse } from 'next/server';
import { esiClient } from '@/lib/esi-client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const popular = searchParams.get('popular');

  try {
    if (popular === 'true') {
      const items = esiClient.getPopularTradeItems();
      return NextResponse.json(items);
    }
    
    if (!search) {
      return NextResponse.json(
        { error: 'Search parameter is required' },
        { status: 400 }
      );
    }

    const items = await esiClient.searchItems(search);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
