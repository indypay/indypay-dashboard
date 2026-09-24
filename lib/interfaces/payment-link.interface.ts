export interface IPaymentLink {
  // clientId: string;
  // clientSecret: string;
  orderId: string;
  amount: number;
  name: string;
  email: string;
  mobile: string;
  vpa: string;
}

export interface IPaymentLinkCreateRequest {
  amount: number;
  name?: string;
  email: string;
  mobile: string;
  /** ISO 8601 date string from DatePicker — omit for a link that never expires */
  expiresAt?: string;
  notifyOnEmail?: boolean;
  notifyOnNumber?: boolean;
  note?: string;
  allowPartialPayment?: boolean;
  minimumAmount?: number;
}

export interface IPaymentLinkCreateResponse {
  success: boolean;
  linkId: string;
  linkUrl: string;
  /** PNG data URL returned by the backend for QR display. */
  qr?: string;
  /** Backend may return this as null when the link never expires. */
  expiryTime?: string | null;
  /** Backend response may also expose these fields. */
  paymentLinkUrl?: string;
  expiresAt?: string | null;
  whatsappShareUrl?: string;
  message?: string;
}

export interface IPaymentLinkDetails {
  amount: number;
  email: string;
  mobile: string;
  notifyEmail?: boolean;
  notifyNumber?: boolean;
}

export interface IPaymentLinkDetailsResponse {
  success: boolean;
  data: IPaymentLinkDetails;
  expiryTime: string;
  remainingTime: number; // in milliseconds
}

export interface IPaymentLinkData {
  id: string;
  amount: string | number;
  orderId?: string;
  name?: string;
  email?: string;
  mobile?: string;
  status: string;
  txnRefId?: string | null;
  intent?: string | null;
  createdAt: string;
  expiresAt?: string;
  description?: string;
  allowPartialPayment?: boolean;
  minimumAmount?: number;
  thankYouMessage?: string;
  user?: {
    id: string;
    fullName: string;
  };
}
