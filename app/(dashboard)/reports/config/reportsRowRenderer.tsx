import { safeAny } from '@/lib/interfaces/global.interface';
import {
  formatAmount,
  getFormattedTime,
  formatStatus,
  getTagStyle,
} from '@/lib/utils/utils';
import { Button, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import React from 'react';
import { SectionType } from '@/lib/types/sections';
import { CollectionDetailsTransData } from '@/lib/interfaces/transactions.interface';
import { MerchantPayoutCollectionsData } from '@/lib/interfaces/payout.interface';

interface ReportsRowRendererProps {
  item: safeAny;
  columnKey: React.Key;
  handleViewDetailsClick: (id: string) => void;
  sectionType: SectionType;
}

const ReportsRowRenderer: React.FC<ReportsRowRendererProps> = React.useCallback(
  ({ item, columnKey, handleViewDetailsClick, sectionType }) => {
    switch (sectionType) {
      case 'collections':
        return renderCollectionsRow(item, columnKey, handleViewDetailsClick);
      case 'payouts':
        return renderPayoutsRow(item, columnKey, handleViewDetailsClick);
      // case 'wallets':
      //     return renderWalletsRow(item, columnKey, handleViewDetailsClick);
      // case 'settlements':
      //     return renderSettlementsRow(item, columnKey, handleViewDetailsClick);
      default:
        return '-';
    }
  },
  [],
);

const renderCollectionsRow = React.useCallback(
  (
    item: CollectionDetailsTransData,
    columnKey: React.Key,
    handleViewDetailsClick: (id: string) => void,
  ) => {
    const merchantItem = item as safeAny;
    switch (columnKey) {
      case 'createdAt':
        return getFormattedTime(new Date(merchantItem.createdAt)) || '-';
      case 'utr':
        return merchantItem.utr || '-';
      case 'orderId':
        return merchantItem.orderId || '-';
      case 'amount':
        return formatAmount(merchantItem.amount) || '-';
      case 'netPayableAmount':
        return formatAmount(merchantItem.netPayableAmount) || '-';
      case 'status':
        return (
          <Tag style={getTagStyle(merchantItem.status)} bordered={false}>
            {formatStatus(merchantItem.status) || '-'}
          </Tag>
        );
      case 'txnRefId':
        return merchantItem.txnRefId || '-';
      case 'view-details':
        return (
          <div
            onClick={() => handleViewDetailsClick(merchantItem.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: 'var(--secondary)',
            }}
          >
            <EyeOutlined style={{ fontSize: '18px', color: 'var(--secondary)' }} />
            <span style={{ color: 'var(--secondary)', fontWeight: 500 }}>
              View Details
            </span>
          </div>
        );
      default:
        return '-';
    }

    return '-';
  },
  [],
);

const renderPayoutsRow = (
  record: MerchantPayoutCollectionsData,
  columnKey: React.Key,
  handleViewDetailsClick: (id: string) => void,
) => {
  switch (columnKey) {
    case 'fullName':
      return record.user.fullName || '-';
    case 'createdAt':
      return record.createdAt
        ? getFormattedTime(new Date(record.createdAt))
        : '-';
    case 'orderId':
      return record.orderId || '-';
    case 'payoutId':
      return record.payoutId || '-';
    case 'amountBeforeDeduction':
      return formatAmount(record.amountBeforeDeduction) || '-';
    case 'charges':
      return (
        formatAmount(+record.amountBeforeDeduction - +record.amount) || '-'
      );
    case 'amount':
      return formatAmount(record.amount) || '-';
    case 'utr':
      return record.utr || '-';
    case 'status':
      return (
        <div className="flex items-center gap-2">
          <Tag style={getTagStyle(record.status)} bordered={false}>
            {formatStatus(record.status) || '-'}
          </Tag>
        </div>
      );
    case 'transferId':
      return record.transferId || '-';
    case 'view-details':
      return (
        <Button
          size="middle"
          type="primary"
          icon={<EyeOutlined />}
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            border: 'none',
            color: 'var(--background)',
            fontWeight: 600,
          }}
          onClick={() => handleViewDetailsClick(record.id)}
        >
          View
        </Button>
      );
    default:
      return '-';
  }
  return '-';
};

export default ReportsRowRenderer;
