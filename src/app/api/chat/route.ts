import { NextResponse } from 'next/server';
import { SarvamAIClient } from 'sarvamai';
import { getMerchantDashboardData } from '@/lib/data';
import { askGemini } from '@/lib/gemini';
import { toolDefinitions, executeTool, getSystemPrompt } from '@/lib/agent/agentTools';

const MAX_TOOL_ROUNDS = 3;

type HistoryMessage = { role: string; text: string };
type AgentMessage = { role: 'system' | 'user' | 'assistant' | 'tool'; content: string | null; tool_calls?: unknown[]; tool_call_id?: string };
type SarvamResponse = { choices: Array<{ message: { content: string | null; tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }> } }> };

function translateHistory(history: HistoryMessage[]): AgentMessage[] {
  return history
    .filter(m => m.role === 'user' || m.role === 'model')
    .map(m => ({
      role: (m.role === 'model' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.text,
    }));
}

async function runSarvamAgent(params: {
  message: string;
  history: AgentMessage[];
  merchantId?: string;
  language?: string;
  voiceMode?: boolean;
}): Promise<string> {
  const { message, history, merchantId, language = 'en-IN', voiceMode = false } = params;

  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new Error('SARVAM_API_KEY not configured');

  const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });

  const messages: AgentMessage[] = [
    { role: 'system', content: getSystemPrompt(language, voiceMode) },
    ...history.slice(-10),
    { role: 'user', content: message },
  ];

  const startMs = Date.now();
  console.log(`[Agent] ${new Date().toISOString()} → POST /api/chat`);
  console.log(`[Agent]    req  ${JSON.stringify({ message, historyLen: history.length, language, voiceMode })}`);

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const sarvamReq = { model: 'sarvam-30b' as const, messages, tools: [...toolDefinitions], tool_choice: 'auto' as const };
    console.log(`[Agent] ${new Date().toISOString()} → Sarvam (round ${round + 1})`);
    console.log(`[Agent]    req  ${JSON.stringify(sarvamReq)}`);

    const response = await client.chat.completions(sarvamReq as Parameters<typeof client.chat.completions>[0]) as unknown as SarvamResponse;

    console.log(`[Agent] ${new Date().toISOString()} ← Sarvam (round ${round + 1})`);
    console.log(`[Agent]    res  ${JSON.stringify(response)}`);

    const assistantMsg = response.choices[0].message;

    if (!assistantMsg.tool_calls?.length) {
      const reply = assistantMsg.content ?? '';
      console.log(`[Agent] ${new Date().toISOString()} ← done (${Date.now() - startMs}ms)`);
      console.log(`[Agent]    res  ${JSON.stringify({ reply })}`);
      return reply;
    }

    messages.push({
      role: 'assistant',
      content: assistantMsg.content ?? null,
      tool_calls: assistantMsg.tool_calls,
    });

    for (const tc of assistantMsg.tool_calls) {
      let fnArgs: Record<string, string> = {};
      try { fnArgs = JSON.parse(tc.function.arguments); } catch { /* empty args */ }

      const result = executeTool(tc.function.name, fnArgs, { merchantId });
      console.log(`[Agent] ${new Date().toISOString()} ⚙ ${tc.function.name}(${JSON.stringify(fnArgs)}) → ${JSON.stringify(result)}`);

      messages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) });
    }
  }

  // Exhausted tool rounds — force a plain text answer
  const final = await client.chat.completions({ model: 'sarvam-30b' as const, messages } as Parameters<typeof client.chat.completions>[0]) as unknown as SarvamResponse;
  const finalText = final.choices[0].message.content ?? "I couldn't complete that analysis. Please try again.";
  console.log(`[Agent] ${new Date().toISOString()} ← done (${Date.now() - startMs}ms)`);
  return finalText;
}

export async function POST(request: Request) {
  try {
    const { merchantId, prompt, history, language, voiceMode } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required.' }, { status: 400 });
    }

    const agentHistory = translateHistory(history || []);

    let reply: string;
    try {
      reply = await runSarvamAgent({ message: prompt, history: agentHistory, merchantId, language, voiceMode });
    } catch (err) {
      console.warn('[Chat] Sarvam agent failed, falling back to Gemini:', (err as Error).message);
      const data = getMerchantDashboardData(merchantId);
      if (!data) {
        return NextResponse.json({ error: `Merchant ${merchantId} not found` }, { status: 404 });
      }
      reply = await askGemini(prompt, data, history || []);
    }

    return NextResponse.json({ answer: reply });
  } catch (error) {
    console.error('[Chat] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
