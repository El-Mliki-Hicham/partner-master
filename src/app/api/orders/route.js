import { NextResponse } from 'next/server';
import { API_ROUTES } from '../../../api/config';

export async function GET() {
  try {
    const response = await fetch(API_ROUTES.ORDERS, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
