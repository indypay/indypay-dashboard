export interface WhitelistIpsRequest {
  ipAddress: string;
}

export interface GetWhitelistIpsResponse {
  data: WhitelistIpsResponse[];
  message: string;
}

export interface WhitelistIpsResponse {
  id: string;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
}
