import {
  getAdminCollectionData,
  getMerchantCollectionData,
} from '@/lib/hooks/use-collections';
import {
  getAdminPayoutByUserId,
  getMerchantPayoutData,
} from '@/lib/hooks/use-payout';
import {
  callMerchantCollectionsDetailsById,
  callMerchantCollectionsById,
  callAdminCollectionsStats,
} from '@/lib/services/collections-service';

export const reportsApiMap = {
  collections: {
    admin: {
      withUserId: getAdminCollectionData,
      // withoutUserId: callAdminCollections,
    },
    merchant: getMerchantCollectionData,
    //   'channel-partner': callChannelPartnerCollectionData,
  },

  payouts: {
    admin: {
      withUserId: getAdminPayoutByUserId,
      // withoutUserId: callAdminPayouts,
    },
    merchant: getMerchantPayoutData,
    //   'channel-partner': callChannelPartnerPayouts,
  },

  // wallet: {
  //   admin: {
  //     withUserId: callAdminWalletByMerchant,
  //     withoutUserId: callAdminWallet,
  //   },
  //   merchant: callMerchantWallet,
  // },

  // settlement: {
  //   admin: {
  //     withUserId: callAdminSettlementsByMerchant,
  //     withoutUserId: callAdminSettlements,
  //   },
  //   merchant: callMerchantSettlements,
  // },
} as const;
