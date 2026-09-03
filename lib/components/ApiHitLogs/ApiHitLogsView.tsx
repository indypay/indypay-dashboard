'use client';
import { useTenant } from '@/context/TenantContext';
import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { CopyOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useApiHitLogs } from '@/lib/hooks/use-api-hit-logs';
import { ApiHitLog } from '@/lib/interfaces/api-hit-logs.interface';
import {
  maskClientId,
  methodTagColor,
  statusCodeColor,
  toEpochRange,
} from '@/lib/utils/api-hit-logs.utils';

const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: '2xx', label: '2xx Success' },
  { value: '4xx', label: '4xx Client error' },
  { value: '5xx', label: '5xx Server error' },
];

const LIMIT_OPTIONS = [
  { value: 50, label: '50 rows' },
  { value: 100, label: '100 rows' },
  { value: 200, label: '200 rows' },
  { value: 500, label: '500 rows' },
];

export type ApiHitLogsVariant = 'api-requests' | 'traffic-logs';

type ApiHitLogsViewProps = {
  variant: ApiHitLogsVariant;
  title: string;
  subtitle: string;
};

function defaultDateRange(): [Dayjs, Dayjs] {
  return [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')];
}

function matchesStatusFilter(code: number, filter: string): boolean {
  if (filter === 'all') return true;
  if (filter === '2xx') return code >= 200 && code < 300;
  if (filter === '4xx') return code >= 400 && code < 500;
  if (filter === '5xx') return code >= 500;
  return true;
}

export default function ApiHitLogsView({
  variant,
  title,
  subtitle,
}: ApiHitLogsViewProps) {
  const searchParams = useSearchParams();
  const adminUserId = searchParams.get('userId') ?? undefined;
  const { tenantConfig } = useTenant();

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(defaultDateRange);
  const [pathSearch, setPathSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [limit, setLimit] = useState(100);

  const epoch = useMemo(
    () => toEpochRange(dateRange[0].toDate(), dateRange[1].toDate()),
    [dateRange],
  );

  const { data: logs = [], isLoading, refetch, isFetching } = useApiHitLogs({
    limit,
    fromTime: epoch.fromTime,
    toTime: epoch.toTime,
    ...(adminUserId ? { userId: adminUserId } : {}),
  });

  const filteredLogs = useMemo(() => {
    const q = pathSearch.trim().toLowerCase();
    return logs.filter((row) => {
      if (!matchesStatusFilter(row.statusCode, statusFilter)) return false;
      if (q && !row.path.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [logs, pathSearch, statusFilter]);

  const showTraceColumn = variant === 'traffic-logs';

  const columns: TableColumnsType<ApiHitLog> = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      width: 168,
      render: (v: string) => (
        <Text style={{ fontSize: 12 }}>{dayjs(v).format('DD MMM YYYY HH:mm:ss')}</Text>
      ),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      width: 88,
      render: (v: string) => <Tag color={methodTagColor(v)}>{v}</Tag>,
    },
    {
      title: 'Endpoint',
      dataIndex: 'path',
      ellipsis: true,
      render: (v: string) => (
        <Tooltip title={v}>
          <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusCode',
      width: 80,
      render: (v: number) => <Tag color={statusCodeColor(v)}>{v}</Tag>,
    },
    {
      title: 'Duration',
      dataIndex: 'durationMs',
      width: 96,
      render: (v: number) => <Text style={{ fontSize: 12 }}>{v} ms</Text>,
    },
    {
      title: 'Integration',
      dataIndex: 'integrationCode',
      width: 110,
      render: (v?: string) => (v ? <Tag>{v}</Tag> : '—'),
    },
    {
      title: 'IP',
      dataIndex: 'requestIp',
      width: 130,
      render: (v?: string) => v ?? '—',
    },
    ...(showTraceColumn
      ? [
          {
            title: 'Trace ID',
            dataIndex: 'traceId',
            width: 120,
            render: (v?: string) =>
              v ? (
                <Tooltip title="Copy trace id">
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => navigator.clipboard.writeText(v)}
                  >
                    {v.slice(0, 8)}…
                  </Button>
                </Tooltip>
              ) : (
                '—'
              ),
          } as TableColumnsType<ApiHitLog>[number],
        ]
      : []),
    {
      title: 'API key',
      dataIndex: 'clientId',
      width: 100,
      render: (v?: string) => (
        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
          {maskClientId(v)}
        </Text>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen">
      <div
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: '12px',
          padding: '2px',
          margin: '24px 24px 0',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            padding: '28px 32px',
          }}
        >
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              margin: 0,
              background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h1>
          <Paragraph style={{ color: 'var(--text-muted)', margin: '8px 0 0' }}>
            {subtitle}
          </Paragraph>
          <Paragraph type="secondary" style={{ margin: '12px 0 0', fontSize: 13 }}>
Logs of API requests made to {tenantConfig.name} using your API keys (payin, payout,            checkout, etc.). Login and dashboard activity are not included.
          </Paragraph>
          {adminUserId && (
            <Alert
              type="info"
              showIcon
              style={{ marginTop: 12 }}
              message={`Showing logs for merchant ${adminUserId}`}
            />
          )}
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <Card bordered style={{ borderRadius: 12, marginBottom: 20 }}>
          <Space wrap>
            <RangePicker
              value={dateRange}
              format="DD MMM YYYY"
              onChange={(dates) => {
                if (dates?.[0] && dates?.[1]) {
                  setDateRange([dates[0].startOf('day'), dates[1].endOf('day')]);
                }
              }}
            />
            <Input
              placeholder="Search endpoint path"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 240 }}
              value={pathSearch}
              onChange={(e) => setPathSearch(e.target.value)}
            />
            <Select
              value={statusFilter}
              style={{ width: 160 }}
              options={STATUS_FILTER_OPTIONS}
              onChange={setStatusFilter}
            />
            <Select
              value={limit}
              style={{ width: 120 }}
              options={LIMIT_OPTIONS}
              onChange={setLimit}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isFetching}
            >
              Refresh
            </Button>
          </Space>
        </Card>

        <Card bordered style={{ borderRadius: 12 }}>
          <Table
            dataSource={filteredLogs}
            columns={columns}
            rowKey={(row) =>
              `${row.timestamp}-${row.method}-${row.path}-${row.traceId ?? row.durationMs}`
            }
            loading={isLoading}
            size="small"
            locale={{
              emptyText: (
                <Empty
                  description={
                    <>
                      <div>No API hits yet.</div>
                      <Text type="secondary">
                        Logs appear after your server calls our APIs using API key
                        authentication.
                      </Text>
                    </>
                  }
                />
              ),
            }}
            pagination={{
              pageSize: 25,
              showTotal: (t) => `${t} events (max ${limit} from server)`,
            }}
            scroll={{ x: showTraceColumn ? 1100 : 980 }}
          />
        </Card>
      </div>
    </div>
  );
}
