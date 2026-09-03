export type AiCommissionStatus = 'PENDING' | 'APPLIED' | 'DISMISSED';
export type AiChurnRisk = 'LOW' | 'MEDIUM' | 'HIGH';
export type AiVolumeTrend = 'GROWING' | 'STABLE' | 'DECLINING';
export type AiCommissionAction = 'REDUCE' | 'INCREASE' | 'KEEP_CURRENT';

export interface AiCommissionRecommendation {
  id: string;
  merchantId: string;

  // Snapshot of plan at analysis time
  currentPayinCommissionId: string | null;
  currentPayinPlanName: string | null;
  currentChargeType: string | null;
  currentChargeValue: number | null;
  currentGstPercentage: number | null;

  // AI decision
  action: AiCommissionAction;
  recommendedChargeType: string;
  recommendedChargeValue: number;
  churnRiskLevel: AiChurnRisk;
  volumeTrend: AiVolumeTrend;

  // Business metrics
  monthlyVolumeAvg: number;
  monthlyTxnCountAvg: number;
  successRatePct: number;
  estimatedMonthlyImpact: number;

  // AI output
  aiReasoning: string;
  analysisSnapshot: Record<string, unknown> | null;

  // Lifecycle
  status: AiCommissionStatus;
  appliedAt: string | null;
  appliedBy: string | null;
  dismissedAt: string | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiCommissionListResponse {
  items: AiCommissionRecommendation[];
  total: number;
}

export interface TriggerAnalysisResponse {
  queued: boolean;
  reason?: string;
}
