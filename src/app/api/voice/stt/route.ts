import { NextResponse } from 'next/server';
import { SarvamAIClient } from 'sarvamai';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SARVAM_API_KEY not configured' }, { status: 503 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const language = (formData.get('language') as string | null) || 'en-IN';

    if (!audioFile) {
      return NextResponse.json({ error: 'audio file is required' }, { status: 400 });
    }

    console.log(`[STT] ${new Date().toISOString()} → transcribe lang=${language} size=${audioFile.size}B`);

    const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });

    const result = await client.speechToText.transcribe({
      file: audioFile,
      language_code: language as 'en-IN' | 'hi-IN',
      model: 'saarika:v2.5',
    });

    console.log(`[STT] ${new Date().toISOString()} ← "${result.transcript}"`);

    return NextResponse.json({ transcript: result.transcript });
  } catch (error) {
    console.error('[STT] Error:', error);
    return NextResponse.json({ error: 'Speech-to-text failed' }, { status: 500 });
  }
}
