'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Tooltip,
  Drawer,
  TableColumnsType,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGetAuditLogs } from '@/lib/hooks/use-ums';
import { IUmsAuditLog, UmsAuditStatus } from '@/lib/interfaces/ums.interface';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const STATUS_COLOR: Record<UmsAuditStatus, string> = {
  SUCCESS: 'green',
  FAILURE: 'red',
  BLOCKED: 'orange',
};

const RESOURCE_OPTIONS = [
  'user',
  'role',
  'role_permission',
  'tenant',
  'session',
  'permission',
].map((r) => ({ value: r, label: r }));

export default function UmsAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    actorId?: string;
    tenantId?: string;
    action?: string;
    resource?: string;
    from?: string;
    to?: string;
  }>({});
  const [selectedLog, setSelectedLog] = useState<IUmsAuditLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const {
    data: logsResultRaw,
    isLoading,
    refetch,
  } = useGetAuditLogs({ ...filters, page, limit: 50 });
  const logsResult = logsResultRaw as any[];
  const logsPayload =
    logsResult?.[0] && !Array.isArray(logsResult[0]) ? logsResult[0] : null;
  const logs = Array.isArray(logsPayload?.data) ? logsPayload!.data : [];
  const total = logsPayload?.total ?? 0;

  const applyFilters = (updates: typeof filters) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  };

  const columns: TableColumnsType<IUmsAuditLog> = [
    {
      title: 'Time',
      dataIndex: 'createdAt',
      width: 160,
      render: (v: string) => (
        <Text style={{ fontSize: 12 }}>
          {dayjs(v).format('DD MMM HH:mm:ss')}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (v: UmsAuditStatus) => <Tag color={STATUS_COLOR[v]}>{v}</Tag>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (v: string) => (
        <Text style={{ fontFamily: 'monospace', fontSize: 12 }} copyable>
          {v}
        </Text>
      ),
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      width: 110,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: 'Actor',
      dataIndex: 'actorId',
      width: 160,
      render: (v: string | null, row: IUmsAuditLog) => (
        <div>
          {v ? (
            <Text code style={{ fontSize: 11 }}>
              {v.slice(0, 14)}…
            </Text>
          ) : (
            <Text type="secondary">System</Text>
          )}
          {row.actorRole && (
            <Tag style={{ marginLeft: 4, fontSize: 10 }}>{row.actorRole}</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      width: 130,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: '',
      width: 40,
      render: (_: unknown, row: IUmsAuditLog) => (
        <Tooltip title="View details">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              setSelectedLog(row);
              setDetailOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          <AuditOutlined style={{ marginRight: 8 }} />
          Audit Trail
        </Title>
        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card bordered style={{ borderRadius: 12, marginBottom: 20 }}>
        <Space wrap>
          <Input
            placeholder="Actor User ID"
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 200 }}
            onBlur={(e) =>
              applyFilters({ actorId: e.target.value || undefined })
            }
          />
          <Input
            placeholder="Action (e.g. user.role.assign)"
            allowClear
            style={{ width: 220 }}
            onBlur={(e) =>
              applyFilters({ action: e.target.value || undefined })
            }
          />
          <Select
            placeholder="Resource"
            allowClear
            style={{ width: 140 }}
            options={RESOURCE_OPTIONS}
            onChange={(v) => applyFilters({ resource: v || undefined })}
          />
          <Input
            placeholder="Tenant ID"
            allowClear
            style={{ width: 200 }}
            onBlur={(e) =>
              applyFilters({ tenantId: e.target.value || undefined })
            }
          />
          <RangePicker
            showTime
            format="DD MMM HH:mm"
            onChange={(dates) => {
              applyFilters({
                from: dates?.[0]?.toISOString(),
                to: dates?.[1]?.toISOString(),
              });
            }}
          />
        </Space>
      </Card>

      <Card bordered style={{ borderRadius: 12 }}>
        <Table
          dataSource={logs}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          size="small"
          pagination={{
            current: page,
            total,
            pageSize: 50,
            onChange: setPage,
            showTotal: (t) => `${t} events`,
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Detail drawer */}
      <Drawer
        title="Audit Event Detail"
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedLog(null);
        }}
        width={480}
      >
        {selectedLog && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <Text type="secondary">Action</Text>
              <br />
              <Text style={{ fontFamily: 'monospace' }}>
                {selectedLog.action}
              </Text>
            </div>
            <div>
              <Text type="secondary">Status</Text>
              <br />
              <Tag color={STATUS_COLOR[selectedLog.status]}>
                {selectedLog.status}
              </Tag>
            </div>
            <div>
              <Text type="secondary">Resource</Text>
              <br />
              <Tag>{selectedLog.resource}</Tag>
              {selectedLog.resourceId && (
                <Text code style={{ marginLeft: 8 }}>
                  {selectedLog.resourceId}
                </Text>
              )}
            </div>
            <div>
              <Text type="secondary">Actor</Text>
              <br />
              <Text code>{selectedLog.actorId ?? 'System'}</Text>
              {selectedLog.actorRole && (
                <Tag style={{ marginLeft: 8 }}>{selectedLog.actorRole}</Tag>
              )}
            </div>
            <div>
              <Text type="secondary">Tenant</Text>
              <br />
              <Text>{selectedLog.tenantId ?? 'Platform'}</Text>
            </div>
            <div>
              <Text type="secondary">IP Address</Text>
              <br />
              <Text>{selectedLog.ipAddress ?? '—'}</Text>
            </div>
            <div>
              <Text type="secondary">Timestamp</Text>
              <br />
              <Text>
                {dayjs(selectedLog.createdAt).format('DD MMM YYYY HH:mm:ss')}
              </Text>
            </div>
            {Object.keys(selectedLog.details).length > 0 && (
              <div>
                <Text type="secondary">Details</Text>
                <br />
                <pre
                  style={{
                    background: '#f5f5f5',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 12,
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            )}
            {selectedLog.userAgent && (
              <div>
                <Text type="secondary">User Agent</Text>
                <br />
                <Text style={{ fontSize: 11 }}>{selectedLog.userAgent}</Text>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
