import { ACCOUNT_STATUS } from '../enum';

export interface IMerchantListResponse {
  data: IMerchantList[];
}

export interface IMerchantList {
  id: string;
  fullName: string;
}

export interface IMerchantListChannelPartner {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  accountStatus: ACCOUNT_STATUS;
  channelPartnerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMerchantListChannelPartnerResponse {
  data: {
    data: IMerchantListChannelPartner[];
    pagination: {
      totalItems: number;
      limit: number;
      page: number;
    };
  };
}
