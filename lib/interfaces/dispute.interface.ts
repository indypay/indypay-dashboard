export type DisputeType = 'CHARGEBACK' | 'CYBER_COMPLAINT';

export type DisputeStatus =
  | 'OPEN'
  | 'CHARGEBACK_ACCEPTED'
  | 'CHARGEBACK_REJECTED'
  | 'CYBER_RESOLVED';

export type ChargebackMerchantOutcome = 'ACCEPT' | 'REJECT' | null;

export interface DisputeComplainantDetails {
  name?: string;
  phone?: string;
  email?: string;
  relationship?: string;
  notes?: string;
}

export interface CreateTransactionDisputeDto {
  acknowledgementNumber: string;
  disputeType: DisputeType;
  complainantDetails?: DisputeComplainantDetails;
}

export interface ChargebackDecisionDto {
  outcome: 'ACCEPT' | 'REJECT';
  supportingInvoiceId?: string;
  supportingInvoiceUrl?: string;
}

export interface CyberNocDto {
  merchantNocUrl: string;
}

export interface CyberLegalLayerDto {
  adminLegalLayerDetails: string;
}

export interface DisputeChargebackSupportingInvoice {
  id: string;
}

export interface DisputeTransactionRelation {
  id: string;
  user?: { id: string; fullName?: string };
  payInOrder?: { id: string; orderId?: string; amount?: string };
  payOutOrder?: unknown;
}

export interface TransactionDispute {
  id: string;
  transactionId: string;
  acknowledgementNumber: string;
  complainantDetails?: DisputeComplainantDetails | null;
  disputeType: DisputeType;
  status: DisputeStatus | string;
  chargebackMerchantOutcome?: ChargebackMerchantOutcome;
  chargebackSupportingInvoiceId?: string | null;
  chargebackSupportingInvoiceUrl?: string | null;
  adminLegalLayerDetails?: string | null;
  merchantNocUrl?: string | null;
  merchantNocProvidedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  transaction?: DisputeTransactionRelation;
  chargebackSupportingInvoice?: DisputeChargebackSupportingInvoice | null;
}

export interface DisputesPaginatedPayload {
  data: TransactionDispute[];
  pagination: {
    totalItems: number;
    page: number;
    limit: number;
  };
}
