import { NextResponse } from 'next/server';
import { getTransactions } from '@/lib/data';
import { generateDailyRecap } from '@/lib/analytics/recaps';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchantId');
    const date = searchParams.get('date');

    if (!merchantId || !date) {
      return NextResponse.json(
        { error: 'merchantId and date are required query parameters.' },
        { status: 400 }
      );
    }

    const transactions = getTransactions(merchantId);
    const recap = generateDailyRecap(transactions, date);

    return NextResponse.json({ recap });
  } catch (error) {
    console.error('Recap API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
