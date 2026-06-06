import { NextResponse } from 'next/server';
import { getMerchantDashboardData } from '@/lib/data';
import { askGemini } from '@/lib/gemini';

const SARVAM_AGENT_URL = process.env.SARVAM_AGENT_URL || 'http://localhost:3001/api/chat';

// Translate Next.js chat history format → OpenAI-compatible format for the Sarvam agent.
// Frontend uses { role: 'user' | 'model', text } — agent expects { role: 'user' | 'assistant', content }.
function translateHistory(
  history: { role: string; text: string }[]
): { role: 'user' | 'assistant'; content: string }[] {
  return history
    .filter(m => m.role === 'user' || m.role === 'model')
    .map(m => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.text,
    }));
}

export async function POST(request: Request) {
  try {
    const { merchantId, prompt, history, language, voiceMode } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required.' }, { status: 400 });
    }

    const agentHistory = translateHistory(history || []);
    let reply = '';

    try {
      const agentRes = await fetch(SARVAM_AGENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history: agentHistory, merchantId, language, voiceMode }),
      });

      if (!agentRes.ok) {
        const errorBody = await agentRes.json().catch(() => ({}));
        console.warn('[Chat proxy] Agent error, falling back to Gemini:', agentRes.status, errorBody);
        throw new Error('Sarvam agent returned non-ok status');
      }

      const resData = await agentRes.json();
      reply = resData.reply;
    } catch {
      console.log('[Chat proxy] Calling Gemini fallback...');
      const data = getMerchantDashboardData(merchantId);
      if (!data) {
        return NextResponse.json({ error: `Merchant ${merchantId} not found` }, { status: 404 });
      }
      reply = await askGemini(prompt, data, history || []);
    }

    // Return as { answer } to preserve the existing frontend contract
    return NextResponse.json({ answer: reply });
  } catch (error) {
    console.error('[Chat proxy] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
