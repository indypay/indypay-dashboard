'use client';

import { useRouter } from 'next/navigation';
import { Card, Col, Row, Statistic, Tag, Typography } from 'antd';
import {
  UserOutlined,
  SafetyCertificateOutlined,
  ApartmentOutlined,
  AuditOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import {
  useGetRoles,
  useGetPermissions,
  useGetTenants,
  useGetAuditLogs,
} from '@/lib/hooks/use-ums';

const { Title, Text } = Typography;

const RISK_COLOR: Record<string, string> = {
  CRITICAL: 'red',
  HIGH: 'orange',
  MEDIUM: 'gold',
  LOW: 'green',
};

const TIER_LABEL: Record<string, string> = {
  A: 'Internal',
  B: 'External',
  C: 'Consumer',
};

export default function UmsOverviewPage() {
  const router = useRouter();
  const { data: rolesData } = useGetRoles();
  const { data: permissionsData } = useGetPermissions();
  const { data: tenantsData } = useGetTenants();
  const { data: auditData } = useGetAuditLogs({ limit: 5 });

  const roles = Array.isArray(rolesData?.[0]) ? rolesData![0]! : [];
  const permissions = Array.isArray(permissionsData?.[0])
    ? permissionsData![0]!
    : [];
  const tenants =
    tenantsData?.[0] && !Array.isArray(tenantsData[0]) ? tenantsData[0] : null;
  const recentLogs =
    Array.isArray(auditData) && Array.isArray(auditData[0]?.data)
      ? auditData[0].data
      : [];

  const navCards = [
    {
      title: 'User Management',
      icon: <UserOutlined style={{ fontSize: 28, color: 'var(--primary)' }} />,
      description: 'Assign & revoke roles, manage user sessions',
      path: '/ums/users',
      stat: `${roles.length} roles`,
    },
    {
      title: 'Role & Permissions',
      icon: (
        <SafetyCertificateOutlined style={{ fontSize: 28, color: '#1677ff' }} />
      ),
      description: 'Edit the permission matrix for each role',
      path: '/ums/roles',
      stat: `${permissions.length} permissions`,
    },
    {
      title: 'Tenants',
      icon: <ApartmentOutlined style={{ fontSize: 28, color: '#722ed1' }} />,
      description: 'Partners, Resellers & Aggregator registry',
      path: '/ums/tenants',
      stat: `${tenants?.total ?? 0} tenants`,
    },
    {
      title: 'Audit Logs',
      icon: <AuditOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
      description: 'Append-only trail — RBI 7-year retention',
      path: '/ums/audit-logs',
      stat: 'View logs',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          <KeyOutlined style={{ marginRight: 8, color: 'var(--primary)' }} />
          User Management System
        </Title>
        <Text type="secondary">
          Fintech UMS v2.0 — Multi-tenant RBAC with full audit trail
        </Text>
      </div>

      {/* Summary stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card bordered style={{ borderRadius: 12 }}>
            <Statistic
              title="Total Roles"
              value={roles.length}
              valueStyle={{ color: 'var(--primary)' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered style={{ borderRadius: 12 }}>
            <Statistic
              title="Permissions"
              value={permissions.length}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered style={{ borderRadius: 12 }}>
            <Statistic
              title="Active Tenants"
              value={tenants?.total ?? 0}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered style={{ borderRadius: 12 }}>
            <Statistic
              title="Recent Events"
              value={recentLogs.length}
              suffix="/ last 5"
            />
          </Card>
        </Col>
      </Row>

      {/* Nav cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {navCards.map((c) => (
          <Col xs={24} sm={12} lg={6} key={c.path}>
            <Card
              hoverable
              onClick={() => router.push(c.path)}
              style={{ borderRadius: 12, cursor: 'pointer', height: '100%' }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {c.icon}
              <Title level={5} style={{ margin: 0 }}>
                {c.title}
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {c.description}
              </Text>
              <Tag color="default" style={{ width: 'fit-content' }}>
                {c.stat}
              </Tag>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Role taxonomy quick-view */}
      <Card
        title="Role Taxonomy"
        bordered
        style={{ borderRadius: 12, marginBottom: 24 }}
        extra={
          <a onClick={() => router.push('/ums/roles')}>Edit permissions →</a>
        }
      >
        <Row gutter={[12, 8]}>
          {roles.map((role) => (
            <Col key={role.id}>
              <Tag
                color={
                  TIER_LABEL[role.tier] === 'Internal'
                    ? 'blue'
                    : TIER_LABEL[role.tier] === 'External'
                      ? 'purple'
                      : 'cyan'
                }
              >
                {role.code}
              </Tag>
              <Tag
                color={RISK_COLOR[role.riskLevel] ?? 'default'}
                style={{ marginLeft: -4 }}
              >
                {role.riskLevel}
              </Tag>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Recent audit logs */}
      <Card
        title="Recent Activity"
        bordered
        style={{ borderRadius: 12 }}
        extra={<a onClick={() => router.push('/ums/audit-logs')}>View all →</a>}
      >
        {recentLogs.length === 0 ? (
          <Text type="secondary">No recent audit events</Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentLogs.map((log: (typeof recentLogs)[0]) => (
              <div
                key={log.id}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Tag
                  color={
                    log.status === 'SUCCESS'
                      ? 'green'
                      : log.status === 'BLOCKED'
                        ? 'red'
                        : 'orange'
                  }
                >
                  {log.status}
                </Tag>
                <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {log.action}
                </Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {new Date(log.createdAt).toLocaleString()}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
