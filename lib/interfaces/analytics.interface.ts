interface Summary {
  successfulTransactionsRate: number;
  numberOfSuccessfulTransactions: number;
  volumeOfTransactions: number;
}

interface Insights {
  successRate: number;
  numberOfTransactions: number;
  highestPaymentMethodSuccessRate: string;
  lowestPaymentMethod: string;
  totalSuccessGrossVolume: number;
}

export interface TableData {
  paymentMethod: string;
  successRatioToday: number;
  successRatioYesterday: number;
  averageSuccessRatio: number;
  successToday: number;
  successYesterday: number;
  averageVolume: number;
}

export interface TransactionData {
  summary: Summary;
  insights: Insights;
  tableData: TableData[];
}

interface ConversionRate {
  numberOfOrdersCreated: number;
  numberOfOrdersAttempted: number;
  numberOfOrdersPaid: number;
  ordersConversionRate: number;
}

interface FailedAnalytics {
  failedVolume: string;
  failedCount: number;
  failedPercentage: number;
}

export interface NestedData {
  data:
    | TransactionData
    | { conversionRate: ConversionRate }
    | { failedAnalytics: FailedAnalytics };
}

export interface AnalyticsApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: NestedData;
}

export interface BusinessTrendsState {
  summary: {
    successfulTransactionsRate: number;
    numberOfSuccessfulTransactions: number;
    volumeOfTransactions: number;
  };
  insights: {
    successRate: number;
    numberOfTransactions: number;
    highestPaymentMethodSuccessRate: string;
    lowestPaymentMethod: string;
    totalSuccessGrossVolume: number;
  };
  tableData: TableData[];
}

export interface ConversionRateState {
  data: {
    numberOfOrdersCreated: number;
    numberOfOrdersAttempted: number;
    numberOfOrdersPaid: number;
    successPayinAmount: number;
    failedPayinAmount: number;
    ordersConversionRate: number;
  };
}

export interface FailedOrdersState {
  data: {
    failedVolume: number;
    failedCount: number;
    failedPercentage: number;
  };
}

export interface SuccessAnalyticsState {
  successVolume: number;
  successCount: number;
  transactionSuccessRate: number;
  orderSuccessRate: number;
  declineRate: number;
}

export interface systemHealth {
  status: string;
  uptime: {
    percentage: number;
    duration: string;
    lastRestart: string;
  };
  performance: {
    memory: {
      heapUsed: number;
      heapTotal: number;
      rss: number;
    };
    api: string;
    timestamp: string;
  };
}

export interface SuccessSummaryAnalytics {
  paymentMode: string;
  transactionCount: number;
  successPercentage: number;
  declinePercentage: number;
  bankDeclinePercentage: number;
  RupeeFlowDeclinePercentage: number;
}
export interface PaymentModeAnalytics {
  upiPercentage: number;
}
export interface SuccessAnalyticsResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    successAnalytics: SuccessAnalyticsState;
    systemHealth: systemHealth;
    summary: SuccessSummaryAnalytics;
    paymentMode: PaymentModeAnalytics;
  };
}
