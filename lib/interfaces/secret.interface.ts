export interface SecretAPIResponse {
  clientId: string;
  clientSecret: string;
  mobile: string;
}

export interface SecretApiRequest {
  mobile?: string;
}

export interface ApiKeyData {
  data: ApiKeyDetails;
  message: string;
}

export interface ApiKeyDetails {
  id: string;
  clientId: string;
  clientSecret: string;
  createdAt: string;
  updatedAt: string;
}
