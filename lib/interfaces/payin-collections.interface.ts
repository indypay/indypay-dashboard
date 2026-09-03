type Transaction = {
  id: string;
  amount: string; // consider using number if you will be doing calculations
  orderId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED'; // use actual statuses as union types
  txnRefId: string;
  commissionAmount: string; // same note as amount
  gstAmount: string; // same note as amount
  netPayableAmount: string; // same note as amount
  settlementStatus: 'NOT_INITIATED' | 'INITIATED' | 'COMPLETED'; // use actual statuses as union types
  createdAt: string; // consider using Date type if applicable
};

export interface PayinCollectionsApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: Transaction[];
}
