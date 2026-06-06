import { NextResponse } from 'next/server';
import { getMerchantDashboardData } from '@/lib/data';
import { askGemini } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { merchantId, prompt, history } = await request.json();

    if (!merchantId || !prompt) {
      return NextResponse.json(
        { error: 'merchantId and prompt are required parameters.' },
        { status: 400 }
      );
    }

    const dashboardData = getMerchantDashboardData(merchantId);
    if (!dashboardData) {
      return NextResponse.json(
        { error: `Merchant with ID "${merchantId}" not found.` },
        { status: 404 }
      );
    }

    const answer = await askGemini(prompt, dashboardData, history || []);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
