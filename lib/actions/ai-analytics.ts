'use server';

import Anthropic from '@anthropic-ai/sdk';
import { FailureDiagnosisResult } from './ai-diagnose';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const parse = (raw: string): FailureDiagnosisResult => {
  const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(text);
};

export async function analyzeBusinessTrends(data: {
  successRate: number;
  numberOfTransactions: number;
  volumeOfTransactions: number;
  highestPaymentMethod: string;
  lowestPaymentMethod: string;
  startDate: string;
  endDate: string;
}): Promise<FailureDiagnosisResult> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `You are a fintech analyst for an Indian payment gateway. Analyze these business trends for ${data.startDate} to ${data.endDate}:
- Success rate: ${data.successRate}%
- Total transactions: ${data.numberOfTransactions}
- Transaction volume: ₹${data.volumeOfTransactions.toLocaleString('en-IN')}
- Highest performing payment method: ${data.highestPaymentMethod}
- Lowest performing payment method: ${data.lowestPaymentMethod}

Reply with raw JSON only — no markdown, no code fences:
{"summary":"2-3 sentence analysis of overall business health and trends","severity":"low","suggestions":["suggestion 1","suggestion 2","suggestion 3"]}

severity: "low" if success rate > 85%, "medium" if 70–85%, "high" if < 70%.`,
    }],
  });
  return parse((msg.content[0] as { type: 'text'; text: string }).text);
}

export async function analyzeConversionRate(data: {
  numberOfOrdersCreated: number;
  numberOfOrdersAttempted: number;
  numberOfOrdersPaid: number;
  ordersConversionRate: number;
  successPayinAmount: number;
  failedPayinAmount: number;
  startDate: string;
  endDate: string;
}): Promise<FailureDiagnosisResult> {
  const dropOff = data.numberOfOrdersCreated - data.numberOfOrdersPaid;
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `You are a fintech analyst for an Indian payment gateway. Analyze this conversion funnel for ${data.startDate} to ${data.endDate}:
- Orders created: ${data.numberOfOrdersCreated}
- Orders attempted: ${data.numberOfOrdersAttempted}
- Orders paid: ${data.numberOfOrdersPaid}
- Conversion rate: ${data.ordersConversionRate}%
- Successful payin: ₹${data.successPayinAmount.toLocaleString('en-IN')}
- Failed payin: ₹${data.failedPayinAmount.toLocaleString('en-IN')}
- Drop-off count: ${dropOff}

Reply with raw JSON only — no markdown, no code fences:
{"summary":"2-3 sentence analysis of conversion funnel health and drop-off patterns","severity":"low","suggestions":["suggestion 1","suggestion 2","suggestion 3"]}

severity: "low" if conversion > 75%, "medium" if 50–75%, "high" if < 50%.`,
    }],
  });
  return parse((msg.content[0] as { type: 'text'; text: string }).text);
}

export async function analyzeSuccessRate(data: {
  orderSuccessRate: number;
  transactionSuccessRate: number;
  declineRate: number;
  uptime: number;
  startDate: string;
  endDate: string;
}): Promise<FailureDiagnosisResult> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `You are a fintech analyst for an Indian payment gateway. Analyze these success metrics for ${data.startDate} to ${data.endDate}:
- Order success rate: ${data.orderSuccessRate}%
- Transaction success rate: ${data.transactionSuccessRate}%
- Decline rate: ${data.declineRate}%
- System uptime: ${data.uptime}%

Reply with raw JSON only — no markdown, no code fences:
{"summary":"2-3 sentence analysis of payment success health and decline patterns","severity":"low","suggestions":["suggestion 1","suggestion 2","suggestion 3"]}

severity: "low" if transaction success > 85%, "medium" if 70–85%, "high" if < 70%.`,
    }],
  });
  return parse((msg.content[0] as { type: 'text'; text: string }).text);
}

export async function analyzeOverview(data: {
  totalPayinAmount: number;
  totalPayinCount: number;
  successPayinAmount: number | null;
  failedPayinAmount: number | null;
  totalPayoutAmount: number;
  totalPayoutCount: number;
  startDate: string;
  endDate: string;
}): Promise<FailureDiagnosisResult> {
  const failureRate = data.totalPayinAmount > 0
    ? (((data.failedPayinAmount ?? 0) / data.totalPayinAmount) * 100).toFixed(1)
    : '0';
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `You are a fintech analyst for an Indian payment gateway. Analyze this dashboard snapshot for ${data.startDate} to ${data.endDate}:
- Total payin volume: ₹${data.totalPayinAmount.toLocaleString('en-IN')} (${data.totalPayinCount} transactions)
- Successful payin: ₹${(data.successPayinAmount ?? 0).toLocaleString('en-IN')}
- Failed payin: ₹${(data.failedPayinAmount ?? 0).toLocaleString('en-IN')}
- Payin failure rate: ${failureRate}%
- Total payout volume: ₹${data.totalPayoutAmount.toLocaleString('en-IN')} (${data.totalPayoutCount} transactions)

Reply with raw JSON only — no markdown, no code fences:
{"summary":"2-3 sentence overview of business health, flagging any anomalies or risks","severity":"low","suggestions":["suggestion 1","suggestion 2","suggestion 3"]}

severity: "low" if failure rate < 5%, "medium" if 5–15%, "high" if > 15%.`,
    }],
  });
  return parse((msg.content[0] as { type: 'text'; text: string }).text);
}
