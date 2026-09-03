'use client';

import { Card, Button, Spin, Typography, Input } from 'antd';
import {
  CopyOutlined,
  LinkOutlined,
  KeyOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { unstable_noStore } from 'next/cache';

import AnimatedTick from './success';
import {
  useAdminGenerateSecretKey,
  useMerchantGenerateSecretKey,
  useUpdateWebhookUrl,
} from '@/lib/hooks/generate-secretKey';
import { safeAny } from '@/lib/interfaces/global.interface';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { isAdmin } from '@/lib/utils/utils';
import { queryClient } from '@/app/api/query-client';
import {
  callgetWebhookUrl,
  callValidateApiKey,
} from '@/lib/services/transaction-service';
import { SecretApiRequest } from '@/lib/interfaces/secret.interface';
import { useRole } from '@/lib/components/Role/RoleContext';

const { Paragraph } = Typography;

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  color: 'var(--text-muted)',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.01em',
};

const credentialBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'var(--background)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '11px 16px',
};

const DeveloperSection = () => {
  unstable_noStore();

  const [isupdating, setIsUpdating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [trackUpdate, setTrackUpdate] = useState(false);
  const [clientId, setClientId] = useState('your_actual_client_id');
  const [clientSecret, setClientSecret] = useState('your_actual_client_secret');
  const [updatePayoutWebhookUrl, setUpdatePayoutWebhookUrl] = useState('');
  const [updatePayInWebhookUrl, setUpdatePayInWebhookUrl] = useState('');
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();
  const { role } = useRole();

  const { mutate: mutateMerchant } = useMerchantGenerateSecretKey();
  const { mutate: mutateAdmin } = useAdminGenerateSecretKey();
  const { mutate: mutateUpdateWebhookUrl } = useUpdateWebhookUrl();

  useEffect(() => {
    getValidateApiKey();
    getWebhookUrl();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsSecretVisible(true);
    showToast(`Copied to clipboard`, 'success');
  };

  const handleGenerateSecretKey = () => {
    if (isAdmin(role)) {
      const payload: SecretApiRequest = { mobile: '' };
      mutateAdmin(payload, {
        onSuccess: (data: [safeAny, safeAny]) => {
          queryClient.invalidateQueries({ queryKey: ['secretKey'] });
          const [response, error] = data;
          if (error) {
            showToast(
              error?.message || 'Failed to generate secret key',
              'error',
            );
            return;
          }
          if (response) {
            setClientId(response.data.clientId);
            setClientSecret(response.data.clientSecret);
            showToast(response.message, 'success');
          }
        },
        onError: (error: safeAny) => {
          showToast(error?.message || 'An error occurred', 'error');
        },
      });
    } else {
      mutateMerchant();
    }
  };

  const handleUpdateWebhookUrl = () => {
    setIsUpdating(true);
    mutateUpdateWebhookUrl(
      {
        webhookUrl: {
          payInWebhookUrl: updatePayInWebhookUrl,
          payOutWebhookUrl: updatePayoutWebhookUrl,
        },
      },
      {
        onSuccess: (data: [safeAny, safeAny]) => {
          const [response, error] = data;
          if (error) {
            showToast(error?.message, 'error');
            setIsUpdating(false);
            return;
          }
          if (response) {
            showToast(response?.message, 'success');
            callgetWebhookUrl().then(([updatedResponse]) => {
              if (updatedResponse?.data) {
                setUpdatePayInWebhookUrl(updatedResponse.data.payInWebhookUrl);
                setUpdatePayoutWebhookUrl(
                  updatedResponse.data.payOutWebhookUrl,
                );
              }
              setTimeout(() => {
                setIsUpdating(false);
                setIsEditMode(false);
                setTrackUpdate(true);
              }, 1000);
            });
          }
        },
      },
    );
  };

  const handleEditMode = () => {
    setIsEditMode(true);
    setTrackUpdate(false);
  };

  const getValidateApiKey = async () => {
    const [response, error] = await callValidateApiKey();
    if (error) showToast(error?.message, 'error');
    if (response?.data) {
      setClientId(response.data.clientId);
      setClientSecret(response.data.clientSecret);
    }
    setIsLoading(false);
  };

  const getWebhookUrl = async () => {
    const [response, error] = await callgetWebhookUrl();
    if (error) showToast(error?.message, 'error');
    if (response?.data) {
      setUpdatePayInWebhookUrl(response.data.payInWebhookUrl);
      setUpdatePayoutWebhookUrl(response.data.payOutWebhookUrl);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* API Credentials Card */}
      <div
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: '14px',
          padding: '1.5px',
        }}
      >
        <Card
          style={{
            background: '#FFFFFF',
            borderRadius: '13px',
            border: 'none',
          }}
          styles={{ body: { padding: '28px 32px' } }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  margin: 0,
                  background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.01em',
                }}
              >
                API Credentials
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  margin: '4px 0 0',
                }}
              >
                Your keys for authenticating API requests
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Button
                icon={<EyeOutlined />}
                size="middle"
                onClick={() => setIsSecretVisible((v) => !v)}
                style={{
                  background: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  borderRadius: '8px',
                }}
              >
                {isSecretVisible ? 'Hide' : 'Reveal'}
              </Button>
              <Button
                icon={<KeyOutlined />}
                size="middle"
                onClick={handleGenerateSecretKey}
                style={{
                  background: 'linear-gradient(to right, var(--secondary), var(--primary))',
                  border: 'none',
                  color: 'var(--background)',
                  fontWeight: 700,
                  borderRadius: '8px',
                }}
              >
                Regenerate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Client ID */}
            <div>
              <label style={labelStyle}>Client ID</label>
              <div style={credentialBoxStyle}>
                <Paragraph
                  style={{
                    margin: 0,
                    color: 'var(--text)',
                    flex: 1,
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    wordBreak: 'break-all',
                  }}
                >
                  {isSecretVisible ? clientId : '••••••••••••••••••••'}
                </Paragraph>
                <CopyOutlined
                  style={{
                    color: 'var(--secondary)',
                    fontSize: '15px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  onClick={() => handleCopy(clientId)}
                />
              </div>
            </div>

            {/* Client Secret */}
            <div>
              <label style={labelStyle}>Client Secret</label>
              <div style={credentialBoxStyle}>
                <Paragraph
                  style={{
                    margin: 0,
                    color: 'var(--text)',
                    flex: 1,
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    wordBreak: 'break-all',
                  }}
                >
                  {isSecretVisible ? clientSecret : '••••••••••••••••••••'}
                </Paragraph>
                <CopyOutlined
                  style={{
                    color: 'var(--secondary)',
                    fontSize: '15px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  onClick={() => handleCopy(clientSecret)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Webhook URL Card */}
      <div
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: '14px',
          padding: '1.5px',
        }}
      >
        <Card
          style={{
            background: '#FFFFFF',
            borderRadius: '13px',
            border: 'none',
          }}
          styles={{ body: { padding: '28px 32px' } }}
        >
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                margin: 0,
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em',
              }}
            >
              Webhook URLs
            </h2>
            <p
              style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}
            >
              Endpoints where RupeeFlow will deliver payment event notifications
            </p>
          </div>

          {/* Webhook Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* PayIn Webhook */}
            <div>
              <label style={labelStyle}>PayIn Webhook URL</label>
              <Input
                size="large"
                value={updatePayInWebhookUrl}
                onChange={(e) => setUpdatePayInWebhookUrl(e.target.value)}
                placeholder="https://yourdomain.com/webhook/payin"
                disabled={!isEditMode}
                prefix={
                  <LinkOutlined
                    style={{ color: 'var(--text-muted)', marginRight: '4px' }}
                  />
                }
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                }}
                styles={{
                  input: { backgroundColor: 'var(--background)', color: 'var(--text)' },
                }}
                className="developer-webhook-input"
              />
            </div>

            {/* PayOut Webhook */}
            <div>
              <label style={labelStyle}>PayOut Webhook URL</label>
              <Input
                size="large"
                value={updatePayoutWebhookUrl}
                onChange={(e) => setUpdatePayoutWebhookUrl(e.target.value)}
                placeholder="https://yourdomain.com/webhook/payout"
                disabled={!isEditMode}
                prefix={
                  <LinkOutlined
                    style={{ color: 'var(--text-muted)', marginRight: '4px' }}
                  />
                }
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                }}
                styles={{
                  input: { backgroundColor: 'var(--background)', color: 'var(--text)' },
                }}
                className="developer-webhook-input"
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
          >
            {!isEditMode ? (
              <Button
                size="large"
                onClick={handleEditMode}
                style={{
                  background: 'linear-gradient(to right, var(--secondary), var(--primary))',
                  border: 'none',
                  color: 'var(--background)',
                  fontWeight: 700,
                  borderRadius: '8px',
                  paddingInline: '28px',
                }}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  size="large"
                  onClick={() => {
                    setIsEditMode(false);
                    setTrackUpdate(false);
                  }}
                  style={{
                    background: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    borderRadius: '8px',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="large"
                  onClick={handleUpdateWebhookUrl}
                  disabled={isupdating || trackUpdate}
                  style={{
                    background: trackUpdate
                      ? 'var(--background)'
                      : 'linear-gradient(to right, var(--secondary), var(--primary))',
                    border: trackUpdate ? '1px solid var(--border)' : 'none',
                    color: trackUpdate ? '#9CA3AF' : 'var(--background)',
                    fontWeight: 700,
                    borderRadius: '8px',
                    paddingInline: '28px',
                    cursor:
                      isupdating || trackUpdate ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isupdating ? <AnimatedTick /> : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>

      <style jsx global>{`
        .developer-webhook-input.ant-input-affix-wrapper {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
          border-radius: 8px !important;
        }

        .developer-webhook-input.ant-input-affix-wrapper:not(
            .ant-input-affix-wrapper-disabled
          ):hover {
          border-color: var(--primary) !important;
        }

        .developer-webhook-input.ant-input-affix-wrapper-focused {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.12) !important;
        }

        .developer-webhook-input.ant-input-affix-wrapper-disabled {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
          opacity: 0.7 !important;
        }

        .developer-webhook-input .ant-input:disabled,
        .developer-webhook-input .ant-input[disabled] {
          color: var(--text-muted) !important;
          -webkit-text-fill-color: var(--text-muted) !important;
          background-color: var(--background) !important;
        }

        .developer-webhook-input .ant-input {
          background-color: var(--background) !important;
          color: var(--text) !important;
        }
      `}</style>
    </div>
  );
};

export default function AccountPage() {
  return <DeveloperSection />;
}
