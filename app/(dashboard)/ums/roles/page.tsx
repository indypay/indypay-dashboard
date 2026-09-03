'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Select,
  Spin,
  Table,
  Tag,
  Typography,
  Space,
  TableColumnsType,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useToast } from '@/lib/components/Toast/ToastContext';
import {
  useGetRoles,
  useGetPermissions,
  useGetRolePermissions,
  useBulkUpdatePermissions,
} from '@/lib/hooks/use-ums';
import { IUmsPermission, UmsGrantType } from '@/lib/interfaces/ums.interface';

const { Title, Text } = Typography;

const GRANT_COLORS: Record<UmsGrantType, string> = {
  [UmsGrantType.FULL]: 'green',
  [UmsGrantType.PARTIAL]: 'gold',
  [UmsGrantType.WITH_APPROVAL]: 'orange',
};

const GRANT_ICONS: Record<UmsGrantType, React.ReactNode> = {
  [UmsGrantType.FULL]: <CheckCircleOutlined />,
  [UmsGrantType.PARTIAL]: <ClockCircleOutlined />,
  [UmsGrantType.WITH_APPROVAL]: <QuestionCircleOutlined />,
};

const GRANT_OPTIONS = [
  { value: null, label: 'None' },
  { value: UmsGrantType.FULL, label: 'Full' },
  { value: UmsGrantType.PARTIAL, label: 'Partial' },
  { value: UmsGrantType.WITH_APPROVAL, label: 'With Approval' },
];

type GrantMatrix = Record<string, UmsGrantType | null>;

export default function UmsRolesPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [matrix, setMatrix] = useState<GrantMatrix>({});
  const [dirty, setDirty] = useState(false);
  const { showToast } = useToast();

  const { data: rolesResult } = useGetRoles();
  const { data: permissionsResult } = useGetPermissions();
  const { data: rolePermsResult, isLoading: loadingPerms } =
    useGetRolePermissions(selectedRole);
  const { mutate: bulkSave, isPending: saving } = useBulkUpdatePermissions();

  const allRoles = Array.isArray(rolesResult?.[0]) ? rolesResult![0]! : [];
  const allPermissions = Array.isArray(permissionsResult?.[0])
    ? permissionsResult![0]!
    : [];
  const existingPerms = Array.isArray(rolePermsResult?.[0])
    ? rolePermsResult![0]!
    : [];

  // Initialise matrix when role or existing perms change
  useEffect(() => {
    if (!selectedRole) return;
    const init: GrantMatrix = {};
    allPermissions.forEach((p) => {
      init[p.code] = null;
    });
    existingPerms.forEach((rp) => {
      init[rp.permissionCode] = rp.grantType;
    });
    setMatrix(init);
    setDirty(false);
  }, [selectedRole, existingPerms.length]);

  const handleChange = (permCode: string, value: UmsGrantType | null) => {
    setMatrix((prev) => ({ ...prev, [permCode]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    const updates = Object.entries(matrix)
      .filter(([, grant]) => grant !== null)
      .map(([permissionCode, grantType]) => ({
        roleCode: selectedRole,
        permissionCode,
        grantType: grantType!,
      }));

    if (updates.length === 0) {
      showToast('No permissions selected', 'hint');
      return;
    }

    bulkSave(updates, {
      onSuccess: ([, err]) => {
        if (err) {
          showToast('Failed to save permissions', 'error');
          return;
        }
        showToast('Permissions saved', 'success');
        setDirty(false);
      },
    });
  };

  // Group permissions by resource
  const byResource = allPermissions.reduce<Record<string, IUmsPermission[]>>(
    (acc, p) => {
      if (!acc[p.resource]) acc[p.resource] = [];
      acc[p.resource].push(p);
      return acc;
    },
    {},
  );

  const columns: TableColumnsType<IUmsPermission> = [
    {
      title: 'Permission',
      dataIndex: 'name',
      render: (name: string, row: IUmsPermission) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text
            type="secondary"
            style={{ fontSize: 11, fontFamily: 'monospace' }}
          >
            {row.code}
          </Text>
        </div>
      ),
    },
    {
      title: 'Current Grant',
      dataIndex: 'code',
      render: (code: string) => {
        const grant = matrix[code];
        if (!grant) return <Tag>None</Tag>;
        return (
          <Tag color={GRANT_COLORS[grant]} icon={GRANT_ICONS[grant]}>
            {grant}
          </Tag>
        );
      },
    },
    {
      title: 'Set Grant',
      dataIndex: 'code',
      render: (code: string) => (
        <Select
          value={matrix[code] ?? null}
          onChange={(v) => handleChange(code, v)}
          style={{ width: 160 }}
          options={GRANT_OPTIONS}
          disabled={!selectedRole}
        />
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
          Role & Permission Matrix
        </Title>
        {dirty && (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSave}
            style={{ background: 'var(--primary)' }}
          >
            Save Changes
          </Button>
        )}
      </div>

      {/* Role selector */}
      <Card bordered style={{ borderRadius: 12, marginBottom: 20 }}>
        <Space>
          <Text strong>Select Role:</Text>
          <Select
            style={{ width: 320 }}
            placeholder="Choose a role to edit"
            value={selectedRole || undefined}
            onChange={setSelectedRole}
            showSearch
            optionFilterProp="label"
          >
            {allRoles.map((r) => (
              <Select.Option
                key={r.code}
                value={r.code}
                label={`${r.code} — ${r.name}`}
              >
                <Tag color="blue">{r.code}</Tag> {r.name}
                <Tag color="default" style={{ marginLeft: 8, fontSize: 10 }}>
                  {r.riskLevel}
                </Tag>
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Card>

      {selectedRole && (
        <Spin spinning={loadingPerms}>
          {Object.entries(byResource).map(([resource, perms]) => (
            <Card
              key={resource}
              title={
                <Text style={{ textTransform: 'capitalize' }}>
                  {resource.replace('_', ' ')}
                </Text>
              }
              bordered
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Table
                dataSource={perms}
                columns={columns}
                rowKey="code"
                pagination={false}
                size="small"
                showHeader={false}
              />
            </Card>
          ))}
        </Spin>
      )}

      {!selectedRole && (
        <Card style={{ borderRadius: 12, textAlign: 'center', padding: 40 }}>
          <Text type="secondary">
            Select a role above to view and edit its permission matrix
          </Text>
        </Card>
      )}
    </div>
  );
}
