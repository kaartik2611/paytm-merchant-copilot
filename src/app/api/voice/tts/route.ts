import { NextResponse } from 'next/server';
import { SarvamAIClient } from 'sarvamai';

// Strip markdown formatting so TTS doesn't read out symbols
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .trim();
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SARVAM_API_KEY not configured' }, { status: 503 });
    }

    const { text, language = 'en-IN' } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    // Truncate to 500 chars — TTS works best with concise input
    const cleaned = stripMarkdown(text).slice(0, 500);
    // anushka supports all Indian languages in bulbul:v2
    const speaker = 'anushka';

    console.log(`[TTS] ${new Date().toISOString()} → lang=${language} speaker=${speaker} chars=${cleaned.length}`);

    const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });

    const result = await client.textToSpeech.convert({
      text: cleaned,
      target_language_code: language as 'en-IN' | 'hi-IN',
      model: 'bulbul:v2',
      speaker,
    });

    const audio = result.audios?.[0];
    if (!audio) {
      return NextResponse.json({ error: 'No audio generated' }, { status: 500 });
    }

    console.log(`[TTS] ${new Date().toISOString()} ← audio=${audio.length} chars (base64 WAV)`);

    return NextResponse.json({ audio });
  } catch (error) {
    console.error('[TTS] Error:', error);
    return NextResponse.json({ error: 'Text-to-speech failed' }, { status: 500 });
  }
}
