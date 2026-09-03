'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Pagination, Select, Spin, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { useRouter } from 'next/navigation';

import type { IMerchantList } from '@/lib/interfaces/merchant-list.interface';
import type { TransactionDispute } from '@/lib/interfaces/dispute.interface';
import {
  useAdminDisputesList,
  useMerchantDisputesList,
} from '@/lib/hooks/use-disputes';
import {
  formatStatus,
  getFormattedTime,
  isAdmin,
  isMerchant,
  isOps,
  viewOnlyAdmin,
} from '@/lib/utils/utils';
import { useRole } from '@/lib/components/Role/RoleContext';
import { getMerchantList } from '@/lib/hooks/merchant-list';
import DisputeDetailModal from '@/lib/components/disputes/DisputeDetailModal';

function MerchantDisputesView() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [detailId, setDetailId] = useState<string | null>(null);

  const listQuery = useMerchantDisputesList({ page, limit }, true);

  const tuple = listQuery.data as
    | [{ data: TransactionDispute[]; pagination: { totalItems: number } } | null, unknown]
    | undefined;
  const payload = tuple?.[0];
  const rows = payload?.data ?? [];
  const total = payload?.pagination?.totalItems ?? 0;

  const columns: TableColumnsType<TransactionDispute> = useMemo(
    () => [
      {
        title: 'Acknowledgement',
        dataIndex: 'acknowledgementNumber',
        key: 'acknowledgementNumber',
        width: 160,
      },
      {
        title: 'Type',
        dataIndex: 'disputeType',
        key: 'disputeType',
        width: 140,
        render: (t: string) =>
          t === 'CHARGEBACK' ? 'Chargeback' : 'Cyber complaint',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 160,
        render: (s: string) => <Tag>{formatStatus(s)}</Tag>,
      },
      {
        title: 'Transaction',
        dataIndex: 'transactionId',
        key: 'transactionId',
        ellipsis: true,
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 180,
        render: (v: string) => getFormattedTime(new Date(v)),
      },
      {
        title: '',
        key: 'actions',
        width: 120,
        render: (_: unknown, r: TransactionDispute) => (
          <Button type="link" onClick={() => setDetailId(r.id)}>
            Manage
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <h1 className="text-2xl font-semibold mb-2" style={{ color: '#006B4F' }}>
        Disputes
      </h1>
      <p className="text-gray-600 mb-6 max-w-3xl">
        Open chargebacks and cyber complaints linked to your transactions. Use
        Manage to accept or reject a chargeback (with supporting invoice) or
        submit your NOC for cyber complaints.
      </p>

      <Spin spinning={listQuery.isLoading}>
        <Table<TransactionDispute>
          rowKey="id"
          columns={columns}
          dataSource={rows}
          pagination={false}
          locale={{ emptyText: 'No disputes' }}
        />
        <div className="flex justify-end mt-4">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      </Spin>

      <DisputeDetailModal
        open={Boolean(detailId)}
        disputeId={detailId}
        variant="merchant"
        onClose={() => setDetailId(null)}
      />
    </>
  );
}

function AdminDisputesView() {
  const { role } = useRole();
  const [page, setPage] = useState(1);
  const limit = 20;
  const [detailId, setDetailId] = useState<string | null>(null);
  const [merchantUserId, setMerchantUserId] = useState<string>('');

  const canMutateAdmin = isAdmin(role || '') || isOps(role || '');

  const merchantListQuery = getMerchantList();
  const merchantTuple = merchantListQuery?.data;
  const merchantRows = useMemo(() => {
    const raw = merchantTuple?.[0] as { data?: IMerchantList[] } | null;
    return raw?.data ?? [];
  }, [merchantTuple]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = new URLSearchParams(window.location.search).get(
      'merchantUserId',
    );
    if (q) setMerchantUserId(q);
  }, []);

  const listQuery = useAdminDisputesList(
    { page, limit, merchantUserId: merchantUserId || undefined },
    true,
  );

  const tuple = listQuery.data as
    | [{ data: TransactionDispute[]; pagination: { totalItems: number } } | null, unknown]
    | undefined;
  const payload = tuple?.[0];
  const serverRows = payload?.data ?? [];
  const total = payload?.pagination?.totalItems ?? 0;

  const rows = useMemo(() => {
    if (!merchantUserId) return serverRows;
    return serverRows.filter(
      (r) => r.transaction?.user?.id === merchantUserId,
    );
  }, [serverRows, merchantUserId]);

  const columns: TableColumnsType<TransactionDispute> = useMemo(
    () => [
      {
        title: 'Acknowledgement',
        dataIndex: 'acknowledgementNumber',
        key: 'acknowledgementNumber',
        width: 150,
      },
      {
        title: 'Merchant',
        key: 'merchant',
        width: 160,
        ellipsis: true,
        render: (_: unknown, r: TransactionDispute) =>
          r.transaction?.user?.fullName || r.transaction?.user?.id || '—',
      },
      {
        title: 'Type',
        dataIndex: 'disputeType',
        key: 'disputeType',
        width: 130,
        render: (t: string) =>
          t === 'CHARGEBACK' ? 'Chargeback' : 'Cyber complaint',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        render: (s: string) => <Tag>{formatStatus(s)}</Tag>,
      },
      {
        title: 'Transaction',
        dataIndex: 'transactionId',
        key: 'transactionId',
        ellipsis: true,
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 170,
        render: (v: string) => getFormattedTime(new Date(v)),
      },
      {
        title: '',
        key: 'actions',
        width: 100,
        render: (_: unknown, r: TransactionDispute) => (
          <Button type="link" onClick={() => setDetailId(r.id)}>
            View
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <h1 className="text-2xl font-semibold mb-2" style={{ color: '#006B4F' }}>
        Disputes
      </h1>
      <p className="text-gray-600 mb-4 max-w-3xl">
        All disputes on merchant transactions. Filter by merchant to align with
        a merchant view; <code className="text-sm">merchantUserId</code> is
        sent to the API when set, and rows are also filtered on this page for
        the selected merchant.
      </p>

      <div className="mb-4 max-w-md">
        <div className="text-sm text-gray-600 mb-1">Merchant</div>
        <Select
          showSearch
          allowClear
          placeholder="All merchants"
          optionFilterProp="label"
          className="w-full"
          value={merchantUserId || undefined}
          onChange={(v) => {
            setMerchantUserId(v || '');
            setPage(1);
          }}
          options={merchantRows.map((m) => ({
            value: m.id,
            label: m.fullName || m.id,
          }))}
        />
      </div>

      <Spin spinning={listQuery.isLoading}>
        <Table<TransactionDispute>
          rowKey="id"
          columns={columns}
          dataSource={rows}
          pagination={false}
          locale={{ emptyText: 'No disputes' }}
        />
        <div className="flex justify-end mt-4">
          <Pagination
            current={merchantUserId ? 1 : page}
            pageSize={limit}
            total={merchantUserId ? rows.length : total}
            onChange={(p) => {
              if (!merchantUserId) setPage(p);
            }}
            showSizeChanger={false}
            disabled={Boolean(merchantUserId)}
          />
        </div>
      </Spin>

      <DisputeDetailModal
        open={Boolean(detailId)}
        disputeId={detailId}
        variant="admin"
        canMutateAdmin={canMutateAdmin}
        onClose={() => setDetailId(null)}
      />
    </>
  );
}

const DisputesPage: React.FC = () => {
  const { role } = useRole();
  const router = useRouter();

  const isStaff =
    isAdmin(role || '') || isOps(role || '') || viewOnlyAdmin(role || '');

  if (isMerchant(role || '')) {
    return (
      <div className="mx-4 my-6">
        <MerchantDisputesView />
      </div>
    );
  }

  if (isStaff) {
    return (
      <div className="mx-4 my-6">
        <AdminDisputesView />
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <p className="mb-4">You do not have access to this page.</p>
      <Button type="primary" onClick={() => router.push('/summary/overview')}>
        Go home
      </Button>
    </div>
  );
};

export default DisputesPage;
