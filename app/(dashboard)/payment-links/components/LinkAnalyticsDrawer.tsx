'use client';

import { useState, useEffect, useCallback } from 'react';
import { Drawer, Tabs, Button, Tag, Tooltip, Spin, message } from 'antd';
import {
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  SendOutlined,
  WhatsAppOutlined,
  MessageOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { IPaymentLinkData } from '@/lib/interfaces/payment-link.interface';
import { formatAmount } from '@/lib/utils/utils';
import {
  getPaymentLinkAnalytics,
  getPaymentLinkReminders,
  toggleAutoReminders,
  sendReminder,
  type ILinkAnalyticsResponse,
  type ILinkRemindersResponse,
} from '@/lib/services/payment-link-new-service';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const formatRelative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const formatHour = (h: number) => {
  if (h === 0) return '12am';
  if (h < 12) return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
};

const ACTION_CONFIG = {
  paid: {
    color: 'var(--primary)',
    bg: 'var(--sidebar-active-bg)',
    icon: <CheckCircleOutlined />,
    label: 'Paid',
  },
  opened: {
    color: '#2563EB',
    bg: '#DBEAFE',
    icon: <EyeOutlined />,
    label: 'Opened',
  },
  abandoned: {
    color: '#9CA3AF',
    bg: '#F3F4F6',
    icon: <CloseCircleOutlined />,
    label: 'Left',
  },
};

const STATUS_CONFIG = {
  delivered: { color: 'var(--primary)', bg: 'var(--sidebar-active-bg)', label: 'Delivered' },
  sent: { color: '#2563EB', bg: '#DBEAFE', label: 'Sent' },
  failed: { color: '#DC2626', bg: '#FEE2E2', label: 'Failed' },
};

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-muted)',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {icon} {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: accent || 'var(--text)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

function AnalyticsTab({
  analytics,
  loading,
}: {
  analytics: ILinkAnalyticsResponse | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin />
      </div>
    );
  }
  if (!analytics) {
    return (
      <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 32 }}>
        Failed to load analytics.
      </p>
    );
  }

  const maxHourly = Math.max(
    ...analytics.hourlyActivity.map((h) => h.count),
    1,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard
          icon={<EyeOutlined />}
          label="Total Opens"
          value={analytics.totalOpens}
          sub={`${analytics.uniqueVisitors} unique visitors`}
        />
        <StatCard
          icon={<CheckCircleOutlined />}
          label="Paid"
          value={analytics.paidCount}
          sub={`${analytics.conversionRate}% conversion`}
          accent="var(--primary)"
        />
        <StatCard
          icon={<EnvironmentOutlined />}
          label="Top City"
          value={analytics.cityBreakdown[0]?.city ?? '—'}
          sub={`${analytics.cityBreakdown[0]?.count ?? 0} opens`}
        />
        <StatCard
          icon={<ClockCircleOutlined />}
          label="Peak Hours"
          value={analytics.peakHours}
          sub="most opens"
        />
      </div>

      {/* City breakdown */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '16px',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Opens by City
        </p>
        {analytics.cityBreakdown.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0 }}>
            No city data yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {analytics.cityBreakdown.map((c) => (
              <div
                key={c.city}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span
                  style={{
                    width: 80,
                    fontSize: 13,
                    color: '#374151',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {c.city}
                </span>
                <div
                  style={{
                    flex: 1,
                    background: '#F0FDF4',
                    borderRadius: 6,
                    height: 10,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${c.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--accent), var(--primary))',
                      borderRadius: 6,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    width: 28,
                    fontSize: 13,
                    color: '#6B7280',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hourly activity */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '16px',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Time of Day
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            height: 56,
          }}
        >
          {analytics.hourlyActivity.map((h) => (
            <Tooltip
              key={h.hour}
              title={`${formatHour(h.hour)}: ${h.count} opens`}
            >
              <div
                style={{
                  flex: 1,
                  height: `${Math.max((h.count / maxHourly) * 100, h.count > 0 ? 8 : 4)}%`,
                  background:
                    h.count > 0
                      ? 'linear-gradient(180deg, var(--accent), var(--primary))'
                      : 'var(--border)',
                  borderRadius: '3px 3px 0 0',
                  cursor: 'default',
                  transition: 'height 0.3s ease',
                }}
              />
            </Tooltip>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
          }}
        >
          {['12am', '6am', '12pm', '6pm', '11pm'].map((t) => (
            <span key={t} style={{ fontSize: 10, color: '#9CA3AF' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '16px',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Recent Activity
        </p>
        {analytics.recentActivity.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0 }}>
            No activity yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {analytics.recentActivity.map((ev, i) => {
              const cfg = ACTION_CONFIG[ev.action] ?? ACTION_CONFIG.opened;
              return (
                <div
                  key={ev.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 0',
                    borderBottom:
                      i < analytics.recentActivity.length - 1
                        ? '1px solid #F3F4F6'
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: cfg.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cfg.color,
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    {cfg.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: cfg.color,
                      }}
                    >
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>
                      {' '}
                      · {ev.city}
                    </span>
                  </div>
                  <span
                    style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}
                  >
                    {formatRelative(ev.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function RemindersTab({
  reminders: initialReminders,
  linkId,
  loading,
  onRefresh,
}: {
  reminders: ILinkRemindersResponse | null;
  linkId: string;
  loading: boolean;
  onRefresh: () => void;
}) {
  const [reminders, setReminders] = useState<ILinkRemindersResponse | null>(
    initialReminders,
  );
  const [sending, setSending] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    setReminders(initialReminders);
  }, [initialReminders]);

  const handleToggleAuto = async () => {
    if (!reminders) return;
    setToggling(true);
    const [res, err] = await toggleAutoReminders(
      linkId,
      !reminders.autoRemindersEnabled,
    );
    setToggling(false);
    if (err) {
      message.error('Failed to update auto reminder setting');
      return;
    }
    setReminders((prev) =>
      prev
        ? { ...prev, autoRemindersEnabled: res!.autoRemindersEnabled }
        : prev,
    );
    message.success(res!.message);
  };

  const handleSendNow = async (channel: 'whatsapp' | 'sms') => {
    setSending(true);
    const [res, err] = await sendReminder(linkId, channel);
    setSending(false);
    if (err) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to send reminder';
      message.error(msg);
      return;
    }
    message.success(res!.message);
    onRefresh(); // reload reminder history
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin />
      </div>
    );
  }
  if (!reminders) {
    return (
      <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 32 }}>
        Failed to load reminders.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Auto-reminder toggle */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                color: 'var(--text)',
                fontSize: 14,
              }}
            >
              Auto Reminders
            </p>
            <p
              style={{
                margin: 0,
                color: 'var(--text-muted)',
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Send reminder if link is unpaid after 24 hours
            </p>
          </div>
          <button
            onClick={handleToggleAuto}
            disabled={toggling}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              background: reminders.autoRemindersEnabled
                ? 'var(--primary)'
                : '#D1D5DB',
              border: 'none',
              cursor: toggling ? 'not-allowed' : 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
              opacity: toggling ? 0.6 : 1,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 3,
                left: reminders.autoRemindersEnabled ? 23 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            />
          </button>
        </div>
        {reminders.autoRemindersEnabled && (
          <div
            style={{
              marginTop: 10,
              background: '#F0FDF4',
              borderRadius: 8,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: 'var(--secondary)',
              fontWeight: 500,
            }}
          >
            <ClockCircleOutlined />
            Next reminder: 24h after last open if unpaid
          </div>
        )}
      </div>

      {/* Stats row */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}
      >
        {[
          { label: 'Total Sent', value: reminders.totalSent, color: '#374151' },
          { label: 'Delivered', value: reminders.delivered, color: 'var(--primary)' },
          { label: 'Failed', value: reminders.failed, color: '#DC2626' },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Send now */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '16px',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text)',
          }}
        >
          Send Reminder Now
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            icon={<WhatsAppOutlined />}
            loading={sending}
            onClick={() => handleSendNow('whatsapp')}
            style={{
              flex: 1,
              background: '#25D366',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              height: 40,
              borderRadius: 8,
            }}
          >
            WhatsApp
          </Button>
          <Button
            icon={<MessageOutlined />}
            loading={sending}
            onClick={() => handleSendNow('sms')}
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              color: '#374151',
              fontWeight: 600,
              height: 40,
              borderRadius: 8,
            }}
          >
            SMS
          </Button>
        </div>
      </div>

      {/* Reminder history */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            History
          </p>
          <Tooltip title="Refresh">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              style={{ color: 'var(--text-muted)' }}
              onClick={onRefresh}
            />
          </Tooltip>
        </div>
        {reminders.reminders.length === 0 ? (
          <p
            style={{
              color: '#9CA3AF',
              fontSize: 13,
              textAlign: 'center',
              margin: '16px 0',
            }}
          >
            No reminders sent yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {reminders.reminders.map((r, i) => {
              const stCfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.sent;
              return (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 0',
                    borderBottom:
                      i < reminders.reminders.length - 1
                        ? '1px solid #F3F4F6'
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background:
                        r.channel === 'whatsapp' ? 'var(--sidebar-active-bg)' : '#DBEAFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: r.channel === 'whatsapp' ? 'var(--primary)' : '#2563EB',
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {r.channel === 'whatsapp' ? (
                      <WhatsAppOutlined />
                    ) : (
                      <MessageOutlined />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#374151',
                      }}
                    >
                      {r.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                    </span>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                      {' '}
                      · {r.recipient}
                    </span>
                    <div
                      style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}
                    >
                      {new Date(r.sentAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </div>
                  </div>
                  <Tag
                    style={{
                      background: stCfg.bg,
                      color: stCfg.color,
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  >
                    {stCfg.label}
                  </Tag>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Drawer
// ─────────────────────────────────────────────────────────────

interface LinkAnalyticsDrawerProps {
  open: boolean;
  onClose: () => void;
  paymentLink: IPaymentLinkData | null;
}

export default function LinkAnalyticsDrawer({
  open,
  onClose,
  paymentLink,
}: LinkAnalyticsDrawerProps) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState<ILinkAnalyticsResponse | null>(
    null,
  );
  const [reminders, setReminders] = useState<ILinkRemindersResponse | null>(
    null,
  );
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [remindersLoading, setRemindersLoading] = useState(false);

  const fetchAnalytics = useCallback(async (linkId: string) => {
    setAnalyticsLoading(true);
    const [data] = await getPaymentLinkAnalytics(linkId);
    setAnalytics(data);
    setAnalyticsLoading(false);
  }, []);

  const fetchReminders = useCallback(async (linkId: string) => {
    setRemindersLoading(true);
    const [data] = await getPaymentLinkReminders(linkId);
    setReminders(data);
    setRemindersLoading(false);
  }, []);

  useEffect(() => {
    if (!open || !paymentLink?.id) return;
    setAnalytics(null);
    setReminders(null);
    fetchAnalytics(paymentLink.id);
    fetchReminders(paymentLink.id);
  }, [open, paymentLink?.id, fetchAnalytics, fetchReminders]);

  if (!paymentLink) return null;

  const amountStr =
    formatAmount(Number(paymentLink.amount)) || `₹${paymentLink.amount}`;
  const statusColors: Record<string, { color: string; bg: string }> = {
    success: { color: 'var(--primary)', bg: 'var(--sidebar-active-bg)' },
    paid: { color: 'var(--primary)', bg: 'var(--sidebar-active-bg)' },
    pending: { color: '#D97706', bg: '#FEF3C7' },
    failed: { color: '#DC2626', bg: '#FEE2E2' },
    expired: { color: '#6B7280', bg: '#F3F4F6' },
  };
  const sc = statusColors[paymentLink.status?.toLowerCase()] ?? {
    color: '#6B7280',
    bg: '#F3F4F6',
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={480}
      title={null}
      styles={{
        header: { display: 'none' },
        body: { padding: 0, background: 'var(--background)' },
        wrapper: { boxShadow: '-4px 0 24px rgba(0,0,0,0.08)' },
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--cta-gradient)',
          padding: '20px 24px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Payment Link
            </p>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: 28,
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.03em',
              }}
            >
              {amountStr}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {paymentLink.name && (
            <span
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 500,
              }}
            >
              {paymentLink.name}
            </span>
          )}
          <Tag
            style={{
              background: sc.bg,
              color: sc.color,
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            {(paymentLink.status || 'pending').toUpperCase()}
          </Tag>
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'monospace',
            }}
          >
            {String(paymentLink.id).slice(0, 14)}…
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 24px 24px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          style={{ marginTop: 4 }}
          tabBarStyle={{ marginBottom: 16 }}
          items={[
            {
              key: 'analytics',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <EyeOutlined style={{ marginRight: 5 }} />
                  Analytics
                </span>
              ),
              children: (
                <AnalyticsTab
                  analytics={analytics}
                  loading={analyticsLoading}
                />
              ),
            },
            {
              key: 'reminders',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <SendOutlined style={{ marginRight: 5 }} />
                  Reminders
                </span>
              ),
              children: (
                <RemindersTab
                  reminders={reminders}
                  linkId={paymentLink.id}
                  loading={remindersLoading}
                  onRefresh={() => fetchReminders(paymentLink.id)}
                />
              ),
            },
          ]}
        />
      </div>
    </Drawer>
  );
}
