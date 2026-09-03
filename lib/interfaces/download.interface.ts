type TransactionType = 'payin' | 'payout';

export interface DownloadTransactionAttachmentRequest {
  transactionType: TransactionType;
  startDate: string; // ISO 8601 date string
  endDate: string;
}
