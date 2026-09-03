export interface PaymentLinkRequest {
  data: IPaymentLink;
  clientId: string;
  clientSecret: string;
}

export interface IPaymentLink {
  orderId: string;
  amount: number;
  name: string;
  email: string;
  mobile: string;
  vpa: string;
}
