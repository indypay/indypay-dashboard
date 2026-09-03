import { TableColumnsType } from 'antd';
import { safeAny } from '@/lib/interfaces/global.interface';
import { CollectionsMerchantColumns } from '@/lib/constants/collections/collections.constants';
import { PayoutTransactionColumns } from '@/lib/constants/payoutConstants/payout.constants';
import { MerchantWalletColumns } from '@/lib/constants/payout-wallet/payout-wallet.constants';
import { getSettlementColumns } from '@/lib/constants/SettlementsConstants/SettlementConstants';
import { SectionType } from '@/lib/types/sections';

import ReportsRowRenderer from './reportsRowRenderer';

export const SECTION_COLUMNS: Record<
  SectionType,
  (isAdmin?: boolean) => any[]
> = {
  collections: () => CollectionsMerchantColumns,
  payouts: () => PayoutTransactionColumns,
  wallets: () => MerchantWalletColumns,
  settlements: (isAdmin?: boolean) => getSettlementColumns(!!isAdmin),
};

export function mapColumn(col: any, index: number, all: any[]) {
  const isFirst = index === 0;
  const isLast = index === all.length - 1;

  return {
    title: col.label,
    key: col.key,
    dataIndex: col.key,
    fixed: isFirst ? 'left' : isLast ? 'right' : undefined,
    width: col.width ?? 180,
    render: (_: safeAny, record: safeAny) =>
      ReportsRowRenderer({
        item: record,
        columnKey: col.key,
        handleViewDetailsClick: () => {},
        sectionType: 'collections',
      }) ??
      record[col.key] ??
      '-',
  };
}
