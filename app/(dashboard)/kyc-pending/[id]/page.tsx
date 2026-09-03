'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Spin } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
} from '@ant-design/icons';

import { useToast } from '@/lib/components/Toast/ToastContext';
import { ONBOARDING_STATUS } from '@/lib/enum';
import { useChangeKYCStatus, useFetchKYC } from '@/lib/hooks/use-fetchKyc';
import { KYCDetails, KYCDocument } from '@/lib/interfaces/users.interface';
import { DocComponent } from '@/lib/components/DocComponent/DocComponent';
import Link from 'next/link';

const KYUserDoc = () => {
  const { mutateAsync: fetchKYC } = useFetchKYC();
  const [kycDetails, setKycDetails] = useState<KYCDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const router = useRouter();
  const { id: userId } = useParams<{ id: string }>() || { id: null };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchKYC(userId || '');
        setKycDetails(response?.[0]);
      } catch (error) {
        console.error('Error loading KYC details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchKYC, userId]);

  const { mutateAsync: changeKYCStatus } = useChangeKYCStatus();
  const handleKYCStatus = (onboardingStatus: ONBOARDING_STATUS) => {
    if (!userId) return;
    changeKYCStatus({ userId, onboardingStatus });
    showToast('KYC status updated successfully', 'success');
    router.push('/kyc-pending');
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Loading KYC Details..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={() => router.push('/kyc-pending')}
        style={{
          color: 'var(--text)',
          marginBottom: '16px',
          fontSize: '16px',
          fontWeight: 600,
        }}
      >
        Back to KYC Pending List
      </Button>
      <div
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: '12px',
          padding: '2px',
        }}
      >
        <Card
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: 'none',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              style={{
                color: 'var(--text)',
                fontSize: '24px',
                fontWeight: 700,
                margin: 0,
              }}
            >
              KYC Documents
            </h2>
            <div className="flex items-center gap-3">
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                disabled={!kycDetails?.data || kycDetails?.data?.length === 0}
                onClick={() => handleKYCStatus(ONBOARDING_STATUS.KYC_VERIFIED)}
                style={{
                  background:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? 'var(--border)'
                      : 'linear-gradient(to right, var(--border), var(--primary))',
                  border: 'none',
                  color:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? 'var(--text-muted)'
                      : 'var(--background)',
                  fontWeight: 600,
                  cursor:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                Approve
              </Button>

              <Button
                size="large"
                icon={<ClockCircleOutlined />}
                disabled={!kycDetails?.data || kycDetails?.data?.length === 0}
                onClick={() => handleKYCStatus(ONBOARDING_STATUS.KYC_ON_HOLD)}
                style={{
                  background:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? 'var(--border)'
                      : '#F5A524',
                  border: 'none',
                  color:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? 'var(--text-muted)'
                      : '#FFFFFF',
                  fontWeight: 600,
                  cursor:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                On Hold
              </Button>

              <Button
                size="large"
                icon={<CloseCircleOutlined />}
                disabled={!kycDetails?.data || kycDetails?.data?.length === 0}
                onClick={() => handleKYCStatus(ONBOARDING_STATUS.KYC_REJECTED)}
                style={{
                  background:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? 'var(--border)'
                      : 'var(--background)',
                  border:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? '1px solid #4E4E4E'
                      : '1px solid #D51C44',
                  color:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? 'var(--text-muted)'
                      : '#D51C44',
                  fontWeight: 600,
                  cursor:
                    !kycDetails?.data || kycDetails?.data?.length === 0
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                Reject
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            {kycDetails?.data && kycDetails.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {kycDetails.data.map((document: KYCDocument) => (
                  <div
                    key={document.id}
                    style={{
                      background: 'var(--background)',
                      border: '1px solid #4E4E4E',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      transition: 'transform 0.2s, border-color 0.2s',
                    }}
                    className="hover:border-[#30F3BC] hover:scale-105"
                  >
                    <Link
                      href={document.url || document.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4"
                    >
                      <div
                        style={{
                          height: '150px',
                          overflow: 'hidden',
                          marginBottom: '12px',
                        }}
                      >
                        <DocComponent document={document} compact />
                      </div>
                      <p
                        style={{
                          color: 'var(--text)',
                          fontSize: '14px',
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {document.documentName}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center my-12">
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  No KYC Documents Found
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KYUserDoc;
