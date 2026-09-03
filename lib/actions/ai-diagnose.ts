'use server';

import Anthropic from '@anthropic-ai/sdk';

export interface FailureDiagnosisInput {
  failedVolume: number;
  failedCount: number;
  failedPercentage: number;
  startDate: string;
  endDate: string;
}

export interface FailureDiagnosisResult {
  summary: string;
  severity: 'low' | 'medium' | 'high';
  suggestions: string[];
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function diagnosePaymentFailures(
  input: FailureDiagnosisInput,
): Promise<FailureDiagnosisResult> {
  const prompt = `You are a fintech payments analyst for an Indian payment gateway.

Analyze this payment failure data for the period ${input.startDate} to ${input.endDate}:
- Failed transaction volume: ₹${input.failedVolume.toLocaleString('en-IN')}
- Number of failed transactions: ${input.failedCount}
- Failure rate: ${input.failedPercentage}%

Reply with raw JSON only — no markdown, no code fences, no explanation. Use this exact shape:
{"summary":"2-3 sentence plain-English diagnosis","severity":"low","suggestions":["suggestion 1","suggestion 2","suggestion 3"]}

Rules:
- severity must be "low" (rate < 5%), "medium" (5–15%), or "high" (> 15%)
- suggestions must be specific and actionable for a payments team
- summary must be concise and jargon-free`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = (message.content[0] as { type: 'text'; text: string }).text;
  const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(text) as FailureDiagnosisResult;
}
