export interface WebhookApi {
  payInWebhookUrl: string;
  payOutWebhookUrl: string;
}

export interface WebhookApiRequest {
  webhookUrl: WebhookApi;
}

export interface WebhookApiResponse {
  data: WebhookDetails;
  message: string;
}

export interface WebhookDetails {
  id: string;
  payInWebhookUrl: string;
  payOutWebhookUrl: string;
}
