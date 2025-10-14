import { NextResponse } from 'next/server';
import { esiClient } from '@/lib/esi-client';

export async function GET() {
  try {
    const regions = await esiClient.getRegions();
    return NextResponse.json(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
      { status: 500 }
    );
  }
}
