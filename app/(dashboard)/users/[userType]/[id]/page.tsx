'use client';

import { getUserDetails } from '@/lib/hooks/merchant-list';
import { Divider, Card, Avatar, Button, Tag, Spin, Select, message, Alert, Tooltip, Popconfirm } from 'antd';
import { UserOutlined, CheckCircleFilled, SwapOutlined, RobotOutlined, ThunderboltOutlined, CloseOutlined } from '@ant-design/icons';
import { ACCOUNT_STATUS } from '@/lib/enum/auth';
import {
  formatOnboardingStatus,
  getFormattedTime,
  isChannelPartner,
  isMerchant,
  isOps,
} from '@/lib/utils/utils';
import { useParams } from 'next/navigation';
import {
  businessEntityTypes,
  industries,
  turnoverRanges,
} from '@/lib/constants/BusinessDetails/BusinessDetails';
import { useCallback, useEffect, useState } from 'react';
import { useFetchKYC } from '@/lib/hooks/use-fetchKyc';
import {
  KYCDocument,
  KYCDetails,
  Director,
} from '@/lib/interfaces/users.interface';
import {
  DocComponent,
  DirectorDocComponent,
} from '@/lib/components/DocComponent/DocComponent';
import {
  useCommissions,
  useUserCommissionMapping,
  useAssignCommissionToUser,
} from '@/lib/hooks/use-commission';
import {
  useLatestAiRecommendation,
  useTriggerAiAnalysis,
  useApplyAiRecommendation,
  useDismissAiRecommendation,
} from '@/lib/hooks/use-ai-commission';
import type { CommissionPlan } from '@/lib/interfaces/commission.interface';
import Link from 'next/link';

const UserDetailsPage: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>() || { id: null };

  const { data, isLoading } = getUserDetails({ userId: userId });

  const [kycDetails, setKycDetails] = useState<KYCDetails | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadingKYC, setLoadingKYC] = useState(false);

  const { mutateAsync: fetchKYC } = useFetchKYC();

  const handleLoadKYCDetails = useCallback(async () => {
    setLoadingKYC(true);
    try {
      const response = await fetchKYC(userId);
      if (response?.[0]) {
        setKycDetails(response?.[0]);
        setHasLoaded(true);
      } else {
        setKycDetails(null);
        setHasLoaded(true);
      }
    } catch (error) {
      console.error('Error loading KYC details:', error);
    } finally {
      setLoadingKYC(false);
    }
  }, [fetchKYC, userId]);

  useEffect(() => {
    setKycDetails(null);
    setHasLoaded(false);
  }, [userId]);

  const getRoleName = (role: string) => {
    if (isMerchant(role ?? '')) {
      return 'Merchant';
    } else if (isOps(role ?? '')) {
      return 'Ops';
    } else if (isChannelPartner(role ?? '')) {
      return 'Channel Partner';
    } else {
      return 'Admin';
    }
  };

  const accountStatus = ACCOUNT_STATUS[data?.[0]?.data?.accountStatus ?? 0];
  const getStatusStyle = (status: string): React.CSSProperties => {
    if (status === 'Active') {
      return {
        backgroundColor: '#0DD25F15',
        color: '#0DD25F',
        border: '1px solid #0DD25F40',
        borderRadius: '6px',
        padding: '4px 12px',
        fontWeight: 500,
      };
    } else {
      return {
        backgroundColor: '#D51C4415',
        color: '#D51C44',
        border: '1px solid #D51C4440',
        borderRadius: '6px',
        padding: '4px 12px',
        fontWeight: 500,
      };
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Loading user details..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div className="flex flex-col gap-6">
        {/* User Profile Card */}
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
            bodyStyle={{ padding: '32px' }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Avatar
                  size={80}
                  src={data?.[0]?.data?.image}
                  icon={<UserOutlined />}
                  style={{ marginRight: '24px' }}
                />
                <div className="flex flex-col">
                  <h2
                    style={{
                      color: 'var(--text)',
                      fontSize: '24px',
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {data?.[0]?.data?.fullName}
                  </h2>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '14px',
                      margin: '4px 0 0 0',
                    }}
                  >
                    {data?.[0]?.data?.email}
                  </p>
                </div>
              </div>
              <Tag style={getStatusStyle(accountStatus)} bordered={false}>
                {accountStatus}
              </Tag>
            </div>

            <Divider style={{ borderColor: 'var(--border)', margin: '24px 0' }} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem label="Mobile" value={data?.[0]?.data?.mobile || '-'} />
              <InfoItem
                label="Status"
                value={
                  formatOnboardingStatus(data?.[0]?.data?.onboardingStatus ?? 0)
                    ?.label ?? '-'
                }
              />
              <InfoItem
                label="Role"
                value={getRoleName(data?.[0]?.data?.role.toString() ?? '')}
              />
              <InfoItem
                label="Created At"
                value={getFormattedTime(
                  new Date(data?.[0]?.data?.createdAt || '-'),
                )}
              />
            </div>

            {data?.[0]?.data?.businessDetails ? (
              <>
                <div className="flex flex-col" style={{ marginTop: '32px' }}>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '16px',
                      fontWeight: 600,
                    }}
                  >
                    Business Details
                  </p>
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  style={{ marginTop: '16px' }}
                >
                  <InfoItem
                    label="Business Name"
                    value={
                      data?.[0]?.data?.businessDetails?.businessName || '-'
                    }
                  />
                  <InfoItem
                    label="Business Entity Type"
                    value={
                      businessEntityTypes.find(
                        (item) =>
                          item.key ===
                          data?.[0]?.data?.businessDetails?.businessEntityType,
                      )?.label || '-'
                    }
                  />
                  <InfoItem
                    label="Designation"
                    value={data?.[0]?.data?.businessDetails?.designation || '-'}
                  />
                  <InfoItem
                    label="Turnover"
                    value={
                      turnoverRanges.find(
                        (item) =>
                          item.key ===
                          Number(data?.[0]?.data?.businessDetails?.turnover),
                      )?.label || '-'
                    }
                  />
                  <InfoItem
                    label="Register Business Number"
                    value={
                      data?.[0]?.data?.businessDetails
                        ?.registerBusinessNumber || '-'
                    }
                  />
                  <InfoItem
                    label="Business Industry"
                    value={
                      industries.find(
                        (item) =>
                          item.key ===
                          Number(
                            data?.[0]?.data?.businessDetails?.businessIndustry,
                          ),
                      )?.label || '-'
                    }
                  />
                  <InfoItem
                    label="Business PAN"
                    value={data?.[0]?.data?.businessDetails?.businessPan || '-'}
                  />

                  <InfoItem
                    label="Website URL"
                    value={data?.[0]?.data?.businessDetails?.websiteUrl || '-'}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex flex-col">
                  <span style={{ color: 'var(--text-muted)', padding: '16px 0' }}>
                    Business Details not filled yet
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* KYC Details Card */}
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
            bodyStyle={{ padding: '32px' }}
          >
            <div className="flex w-full items-end justify-between align-center">
              <p
                style={{
                  color: 'var(--text)',
                  fontSize: '20px',
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                KYC Details
              </p>
              <Button
                type="primary"
                size="large"
                loading={loadingKYC}
                onClick={handleLoadKYCDetails}
                style={{
                  background: 'linear-gradient(to right, var(--border), var(--primary))',
                  border: 'none',
                  color: 'var(--background)',
                  fontWeight: 600,
                }}
              >
                Load KYC Details
              </Button>
            </div>

            <div className="my-6">
              {hasLoaded && kycDetails?.data && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                  {kycDetails?.data?.map((document: KYCDocument) => (
                    <div
                      key={document.id}
                      style={{
                        background: 'var(--background)',
                        border: '1px solid #4E4E4E',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'transform 0.2s, border-color 0.2s',
                      }}
                      className="hover:border-[#30F3BC]"
                    >
                      <Link
                        href={document.url || document.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3"
                      >
                        <div style={{ height: '120px', overflow: 'hidden' }}>
                          <DocComponent document={document} compact />
                        </div>
                        <p
                          style={{
                            padding: '8px 0 0 0',
                            color: 'var(--text)',
                            fontSize: '13px',
                            fontWeight: 500,
                          }}
                        >
                          {document.documentName}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {hasLoaded && !kycDetails?.data && (
                <div className="flex items-center justify-center my-6">
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '16px',
                      fontWeight: 600,
                    }}
                  >
                    No KYC Details yet
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Commission Assignment Card */}
        <CommissionAssignmentCard userId={userId} />

        {/* Director Details Card */}
        {data?.[0]?.data?.businessDetails?.directors?.length ? (
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
              bodyStyle={{ padding: '32px' }}
            >
              <p
                style={{
                  color: 'var(--text)',
                  fontSize: '18px',
                  fontWeight: 700,
                  marginBottom: '24px',
                }}
              >
                Director Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.[0]?.data?.businessDetails?.directors?.map(
                  (director: Director) => (
                    <div key={director.id} className="flex flex-col gap-4">
                      <InfoItem
                        key={director.id}
                        label="Name"
                        value={director.name}
                      />
                      <InfoItem
                        key={director.id}
                        label="PAN"
                        value={director.pan}
                      />
                      {director?.panCardDoc && (
                        <div
                          style={{
                            background: 'var(--background)',
                            border: '1px solid #4E4E4E',
                            borderRadius: '8px',
                            overflow: 'hidden',
                          }}
                        >
                          <Link
                            href={director?.panCardDoc.s3Url}
                            target="_blank"
                            className="p-5"
                          >
                            <DirectorDocComponent
                              document={director?.panCardDoc}
                            />
                            <p style={{ padding: '16px', color: 'var(--text)' }}>
                              {director?.panCardDoc.docType}
                            </p>
                          </Link>
                        </div>
                      )}
                      <InfoItem
                        key={director.id}
                        label="Aadhar Card"
                        value={director.aadharNumber}
                      />

                      {director?.aadharCardDoc && (
                        <div
                          style={{
                            background: 'var(--background)',
                            border: '1px solid #4E4E4E',
                            borderRadius: '8px',
                            overflow: 'hidden',
                          }}
                        >
                          <Link
                            href={director?.aadharCardDoc.s3Url}
                            target="_blank"
                            className="p-5"
                          >
                            <DirectorDocComponent
                              document={director?.aadharCardDoc}
                            />
                            <p style={{ padding: '16px', color: 'var(--text)' }}>
                              {director?.aadharCardDoc.docType}
                            </p>
                          </Link>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center my-6">
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 600 }}>
              No Director Details yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Commission Assignment Card ───────────────────────────────────────────────

function CommissionAssignmentCard({ userId }: { userId: string }) {
  const { data: allCommissionsData, isLoading: loadingPlans } = useCommissions();
  const {
    data: mappingData,
    isLoading: loadingMapping,
    refetch: refetchMapping,
  } = useUserCommissionMapping(userId, !!userId);
  const assignMutation = useAssignCommissionToUser();
  const { data: aiData, isLoading: loadingAi, refetch: refetchAi } = useLatestAiRecommendation(userId, !!userId);
  const triggerMutation = useTriggerAiAnalysis();
  const applyMutation = useApplyAiRecommendation();
  const dismissMutation = useDismissAiRecommendation();

  const aiRec = aiData?.[0];

  const allPlans: CommissionPlan[] = allCommissionsData?.[0] ?? [];
  const payinPlans = allPlans.filter((p) => p.type === 'PAYIN' && p.isActive);
  const payoutPlans = allPlans.filter((p) => p.type === 'PAYOUT' && p.isActive);

  const currentMapping = mappingData?.[0];

  const [selectedPayin, setSelectedPayin] = useState<string | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);

  // Pre-fill selects when current mapping loads
  useEffect(() => {
    if (currentMapping) {
      setSelectedPayin(currentMapping.payinCommissionId ?? null);
      setSelectedPayout(currentMapping.payoutCommissionId ?? null);
    }
  }, [currentMapping]);

  const handleSave = async () => {
    if (!selectedPayin) {
      message.error('Please select a PayIn commission plan');
      return;
    }
    const [, err] = await assignMutation.mutateAsync({
      userId,
      body: {
        payinCommissionId: selectedPayin,
        payoutCommissionId: selectedPayout ?? null,
      },
    });
    if (err) {
      message.error(err?.message ?? 'Failed to assign commission plan');
      return;
    }
    message.success('Commission plan assigned successfully');
    refetchMapping();
  };

  const isLoading = loadingPlans || loadingMapping || loadingAi;

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, var(--border), var(--primary))',
        borderRadius: '12px',
        padding: '2px',
      }}
    >
      <Card
        style={{ background: '#FFFFFF', borderRadius: '10px', border: 'none' }}
        bodyStyle={{ padding: '32px' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 700, margin: 0 }}>
              Commission Plan
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}>
              Assign PayIn and PayOut commission plans for this user
            </p>
          </div>
          {currentMapping && (
            <Tag
              icon={<CheckCircleFilled />}
              style={{
                background: 'var(--sidebar-active-bg)',
                borderColor: 'var(--primary)',
                color: 'var(--secondary)',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '12px',
                padding: '4px 10px',
              }}
            >
              Plan assigned
            </Tag>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : (
          <>
            {/* Current assignment summary */}
            {currentMapping ? (
              <div
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ ...labelStyle }}>Current PayIn Plan</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '14px' }}>
                    {currentMapping.payinCommission?.name ?? '—'}
                  </span>
                  {currentMapping.payinCommission && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>
                      {currentMapping.payinCommission.slabs?.length ?? 0} slabs · GST {currentMapping.payinCommission.defaultGstPercentage}%
                    </span>
                  )}
                </div>
                <div>
                  <span style={{ ...labelStyle }}>Current PayOut Plan</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '14px' }}>
                    {currentMapping.payoutCommission?.name ?? 'Not assigned'}
                  </span>
                  {currentMapping.payoutCommission && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>
                      {currentMapping.payoutCommission.slabs?.length ?? 0} slabs · GST {currentMapping.payoutCommission.defaultGstPercentage}%
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <Alert
                type="info"
                showIcon
                message="No commission plan assigned"
                description="Select PayIn and optional PayOut plans below, then save."
                style={{ marginBottom: '24px' }}
              />
            )}

            {/* AI Recommendation Banner */}
            {aiRec?.status === 'PENDING' ? (
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--sidebar-active-bg) 0%, var(--background) 100%)',
                  border: '1px solid var(--primary)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                    <RobotOutlined style={{ fontSize: '20px', color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#003d24', fontSize: '13px' }}>
                          AI Recommendation
                        </span>
                        <Tag
                          style={{
                            background: aiRec.churnRiskLevel === 'HIGH' ? '#FFF0F0' : aiRec.churnRiskLevel === 'MEDIUM' ? '#FFF8E6' : '#EAF5EF',
                            borderColor: aiRec.churnRiskLevel === 'HIGH' ? '#E8526A' : aiRec.churnRiskLevel === 'MEDIUM' ? '#F5A623' : 'var(--primary)',
                            color: aiRec.churnRiskLevel === 'HIGH' ? '#E8526A' : aiRec.churnRiskLevel === 'MEDIUM' ? '#C47D00' : 'var(--secondary)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {aiRec.churnRiskLevel} churn risk
                        </Tag>
                        <Tag
                          style={{
                            background: '#F0F8FF',
                            borderColor: '#1890FF',
                            color: '#0050B3',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {aiRec.volumeTrend}
                        </Tag>
                      </div>
                      <p style={{ color: 'var(--text)', fontSize: '13px', margin: '0 0 8px', lineHeight: 1.6 }}>
                        <strong>
                          {aiRec.action === 'REDUCE' ? 'Reduce' : aiRec.action === 'INCREASE' ? 'Increase' : 'Keep current'}
                        </strong>
                        {' '}commission →{' '}
                        <strong>
                          {aiRec.recommendedChargeType === 'PERCENTAGE'
                            ? `${aiRec.recommendedChargeValue}%`
                            : `₹${aiRec.recommendedChargeValue}`}
                        </strong>
                        {' '}({aiRec.recommendedChargeType.toLowerCase()})
                        {aiRec.estimatedMonthlyImpact !== 0 && (
                          <span style={{ color: aiRec.estimatedMonthlyImpact > 0 ? 'var(--secondary)' : '#E8526A', marginLeft: '6px', fontWeight: 600 }}>
                            {aiRec.estimatedMonthlyImpact > 0 ? '+' : ''}₹{Math.abs(aiRec.estimatedMonthlyImpact).toLocaleString('en-IN')} est. impact/mo
                          </span>
                        )}
                      </p>
                      <Tooltip title={aiRec.aiReasoning}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0, cursor: 'help',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '480px' }}>
                          {aiRec.aiReasoning}
                        </p>
                      </Tooltip>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <Popconfirm
                      title="Apply this recommendation?"
                      description="This will update the merchant's commission plan."
                      onConfirm={async () => {
                        const [, err] = await applyMutation.mutateAsync({ id: aiRec.id, merchantId: userId });
                        if (err) { message.error('Failed to apply recommendation'); return; }
                        message.success('Recommendation applied');
                        refetchMapping();
                        refetchAi();
                      }}
                      okText="Apply"
                      cancelText="Cancel"
                    >
                      <Button
                        size="small"
                        loading={applyMutation.isPending}
                        style={{
                          background: 'var(--primary)', borderColor: 'var(--primary)', color: '#fff',
                          fontWeight: 600, borderRadius: '6px', fontSize: '12px',
                        }}
                      >
                        Apply
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title="Dismiss this recommendation?"
                      onConfirm={async () => {
                        const [, err] = await dismissMutation.mutateAsync({ id: aiRec.id, merchantId: userId });
                        if (err) { message.error('Failed to dismiss'); return; }
                        refetchAi();
                      }}
                      okText="Dismiss"
                      cancelText="Cancel"
                    >
                      <Button
                        size="small"
                        icon={<CloseOutlined />}
                        loading={dismissMutation.isPending}
                        style={{ borderRadius: '6px', fontSize: '12px', color: 'var(--text-muted)' }}
                      />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  icon={<ThunderboltOutlined />}
                  size="small"
                  loading={triggerMutation.isPending}
                  onClick={async () => {
                    const [res, err] = await triggerMutation.mutateAsync(userId);
                    if (err) { message.error('Failed to trigger analysis'); return; }
                    if (res?.queued) {
                      message.success('AI analysis queued — check back in a moment');
                    } else {
                      message.info(res?.reason ?? 'Analysis skipped');
                    }
                  }}
                  style={{
                    borderColor: 'var(--primary)', color: 'var(--primary)',
                    fontWeight: 600, borderRadius: '6px', fontSize: '12px',
                  }}
                >
                  Run AI Analysis
                </Button>
              </div>
            )}

            {/* Assignment selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label style={labelStyle}>
                  PayIn Commission Plan <span style={{ color: '#E8526A' }}>*</span>
                </label>
                <Select
                  value={selectedPayin ?? undefined}
                  onChange={(v) => setSelectedPayin(v)}
                  placeholder="Select a PayIn plan"
                  size="large"
                  style={{ width: '100%' }}
                  allowClear
                  onClear={() => setSelectedPayin(null)}
                  notFoundContent={
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      No active PayIn plans. Create one in Settings → Commission.
                    </span>
                  }
                >
                  {payinPlans.map((plan) => (
                    <Select.Option key={plan.id} value={plan.id}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{plan.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>
                          {plan.slabs?.length ?? 0} slabs · GST {plan.defaultGstPercentage}%
                        </span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <label style={labelStyle}>
                  PayOut Commission Plan{' '}
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'none', fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <Select
                  value={selectedPayout ?? undefined}
                  onChange={(v) => setSelectedPayout(v)}
                  placeholder="Select a PayOut plan (optional)"
                  size="large"
                  style={{ width: '100%' }}
                  allowClear
                  onClear={() => setSelectedPayout(null)}
                  notFoundContent={
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      No active PayOut plans. Create one in Settings → Commission.
                    </span>
                  }
                >
                  {payoutPlans.map((plan) => (
                    <Select.Option key={plan.id} value={plan.id}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{plan.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>
                          {plan.slabs?.length ?? 0} slabs · GST {plan.defaultGstPercentage}%
                        </span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                icon={<SwapOutlined />}
                size="large"
                onClick={handleSave}
                loading={assignMutation.isPending}
                style={{
                  background: 'linear-gradient(to right, var(--border), var(--primary))',
                  border: 'none',
                  color: 'var(--background)',
                  fontWeight: 700,
                  borderRadius: '8px',
                  paddingInline: '28px',
                }}
              >
                {currentMapping ? 'Update Commission Plan' : 'Assign Commission Plan'}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ─── Info Item ─────────────────────────────────────────────────────────────────

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-2">
    <span
      style={{
        fontWeight: 600,
        color: 'var(--text-muted)',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {label}:
    </span>{' '}
    <span style={{ color: 'var(--text)', fontSize: '14px' }}>{value}</span>
  </div>
);

export default UserDetailsPage;
