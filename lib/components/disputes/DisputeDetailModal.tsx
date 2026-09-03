'use client';

import React, { useEffect, useMemo } from 'react';
import {
  Button,
  Descriptions,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Spin,
  Tag,
} from 'antd';
import { useQuery } from '@tanstack/react-query';

import type { TransactionDispute } from '@/lib/interfaces/dispute.interface';
import {
  useAdminCyberLegalLayer,
  useAdminDisputeById,
  useMerchantChargebackDecision,
  useMerchantCyberNoc,
  useMerchantDisputeById,
} from '@/lib/hooks/use-disputes';
import { callGetInvoices } from '@/lib/services/invoice-service';
import type { IInvoice } from '@/lib/interfaces/invoice.interface';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { formatStatus, getFormattedTime } from '@/lib/utils/utils';

type Props = {
  open: boolean;
  disputeId: string | null;
  variant: 'admin' | 'merchant';
  canMutateAdmin?: boolean;
  onClose: () => void;
};

const DisputeDetailModal: React.FC<Props> = ({
  open,
  disputeId,
  variant,
  canMutateAdmin = true,
  onClose,
}) => {
  const { showToast } = useToast();
  const [legalForm] = Form.useForm<{ adminLegalLayerDetails: string }>();
  const [cbForm] = Form.useForm<{
    outcome: 'ACCEPT' | 'REJECT';
    supportingInvoiceId?: string;
    supportingInvoiceUrl?: string;
  }>();
  const [nocForm] = Form.useForm<{ merchantNocUrl: string }>();

  const adminQ = useAdminDisputeById(
    disputeId,
    open && variant === 'admin',
  );
  const merchantQ = useMerchantDisputeById(
    disputeId,
    open && variant === 'merchant',
  );

  const activeQuery = variant === 'admin' ? adminQ : merchantQ;
  const tuple = activeQuery.data as
    | [TransactionDispute | null, unknown]
    | undefined;
  const dispute = tuple?.[0] ?? null;
  const loading = activeQuery.isLoading;

  const cyberMut = useAdminCyberLegalLayer();
  const cbMut = useMerchantChargebackDecision();
  const nocMut = useMerchantCyberNoc();

  const invoiceQuery = useQuery({
    queryKey: ['invoices', 'dispute-modal'],
    queryFn: () => callGetInvoices({ page: 1, limit: 100 }),
    enabled:
      open &&
      variant === 'merchant' &&
      dispute?.disputeType === 'CHARGEBACK' &&
      dispute?.status === 'OPEN',
  });

  const invoiceOptions = useMemo(() => {
    const raw = invoiceQuery.data?.[0] as { data?: { data?: IInvoice[] } };
    const rows = raw?.data?.data ?? [];
    return rows.map((inv) => ({
      value: inv.id,
      label: `${inv.invoiceNumber} — ₹${inv.totalAmount}`,
    }));
  }, [invoiceQuery.data]);

  useEffect(() => {
    if (dispute && open) {
      legalForm.setFieldsValue({
        adminLegalLayerDetails: dispute.adminLegalLayerDetails || '',
      });
      nocForm.setFieldsValue({
        merchantNocUrl: dispute.merchantNocUrl || '',
      });
      cbForm.setFieldsValue({
        outcome: 'ACCEPT',
        supportingInvoiceId: dispute.chargebackSupportingInvoiceId || undefined,
        supportingInvoiceUrl: dispute.chargebackSupportingInvoiceUrl || undefined,
      });
    }
  }, [dispute, open, legalForm, nocForm, cbForm]);

  const saveLegal = async () => {
    if (!disputeId || !dispute) return;
    if (dispute.disputeType !== 'CYBER_COMPLAINT') return;
    try {
      const v = await legalForm.validateFields();
      const [, err] = await cyberMut.mutateAsync({
        disputeId,
        body: { adminLegalLayerDetails: v.adminLegalLayerDetails.trim() },
      });
      if (err) {
        showToast(
          (err as { message?: string })?.message || 'Update failed',
          'error',
        );
        return;
      }
      showToast('Legal layer details saved', 'success');
      adminQ.refetch();
    } catch {
      /* noop */
    }
  };

  const submitChargeback = async () => {
    if (!disputeId) return;
    try {
      const v = await cbForm.validateFields();
      if (v.outcome === 'REJECT') {
        const hasInv = Boolean(v.supportingInvoiceId?.trim());
        const hasUrl = Boolean(v.supportingInvoiceUrl?.trim());
        if (!hasInv && !hasUrl) {
          showToast(
            'Reject requires supporting invoice ID and/or invoice URL',
            'error',
          );
          return;
        }
      }
      const [, err] = await cbMut.mutateAsync({
        disputeId,
        body: {
          outcome: v.outcome,
          supportingInvoiceId: v.supportingInvoiceId?.trim() || undefined,
          supportingInvoiceUrl: v.supportingInvoiceUrl?.trim() || undefined,
        },
      });
      if (err) {
        showToast(
          (err as { message?: string })?.message || 'Update failed',
          'error',
        );
        return;
      }
      showToast('Chargeback decision recorded', 'success');
      merchantQ.refetch();
    } catch {
      /* validation */
    }
  };

  const submitNoc = async () => {
    if (!disputeId) return;
    try {
      const v = await nocForm.validateFields();
      const [, err] = await nocMut.mutateAsync({
        disputeId,
        body: { merchantNocUrl: v.merchantNocUrl.trim() },
      });
      if (err) {
        showToast(
          (err as { message?: string })?.message || 'Could not submit NOC',
          'error',
        );
        return;
      }
      showToast('NOC submitted', 'success');
      merchantQ.refetch();
    } catch {
      /* validation */
    }
  };

  const complainant = dispute?.complainantDetails;

  return (
    <Modal
      title="Dispute details"
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {!dispute ? (
          <div className="py-8 text-center text-gray-500">
            {loading ? 'Loading…' : 'No dispute loaded'}
          </div>
        ) : (
          <div className="space-y-6">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Acknowledgement">
                {dispute.acknowledgementNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                {dispute.disputeType === 'CHARGEBACK'
                  ? 'Chargeback'
                  : 'Cyber complaint'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag>{formatStatus(dispute.status)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Transaction ID">
                {dispute.transactionId}
              </Descriptions.Item>
              {dispute.transaction?.user?.fullName && (
                <Descriptions.Item label="Merchant">
                  {dispute.transaction.user.fullName}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Created">
                {getFormattedTime(new Date(dispute.createdAt))}
              </Descriptions.Item>
            </Descriptions>

            {complainant &&
              (complainant.name ||
                complainant.phone ||
                complainant.email ||
                complainant.relationship ||
                complainant.notes) && (
                <Descriptions title="Complainant" column={1} bordered size="small">
                  {complainant.name && (
                    <Descriptions.Item label="Name">
                      {complainant.name}
                    </Descriptions.Item>
                  )}
                  {complainant.phone && (
                    <Descriptions.Item label="Phone">
                      {complainant.phone}
                    </Descriptions.Item>
                  )}
                  {complainant.email && (
                    <Descriptions.Item label="Email">
                      {complainant.email}
                    </Descriptions.Item>
                  )}
                  {complainant.relationship && (
                    <Descriptions.Item label="Relationship">
                      {complainant.relationship}
                    </Descriptions.Item>
                  )}
                  {complainant.notes && (
                    <Descriptions.Item label="Notes">
                      {complainant.notes}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              )}

            {dispute.disputeType === 'CHARGEBACK' &&
              dispute.status !== 'OPEN' && (
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Merchant outcome">
                    {dispute.chargebackMerchantOutcome || '—'}
                  </Descriptions.Item>
                  {dispute.chargebackSupportingInvoiceId && (
                    <Descriptions.Item label="Supporting invoice ID">
                      {dispute.chargebackSupportingInvoiceId}
                    </Descriptions.Item>
                  )}
                  {dispute.chargebackSupportingInvoiceUrl && (
                    <Descriptions.Item label="Supporting invoice URL">
                      <a
                        href={dispute.chargebackSupportingInvoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              )}

            {dispute.disputeType === 'CYBER_COMPLAINT' && (
              <>
                <div>
                  <div className="font-medium mb-1">Admin legal layer</div>
                  <div className="text-gray-700 whitespace-pre-wrap border rounded p-3 bg-gray-50 min-h-[60px]">
                    {dispute.adminLegalLayerDetails?.trim()
                      ? dispute.adminLegalLayerDetails
                      : '—'}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">Merchant NOC</div>
                  {dispute.merchantNocUrl ? (
                    <a
                      href={dispute.merchantNocUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {dispute.merchantNocUrl}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not provided</span>
                  )}
                  {dispute.merchantNocProvidedAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      Submitted{' '}
                      {getFormattedTime(
                        new Date(dispute.merchantNocProvidedAt),
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {variant === 'admin' &&
              dispute.disputeType === 'CYBER_COMPLAINT' &&
              canMutateAdmin && (
                <Form form={legalForm} layout="vertical">
                  <Form.Item
                    name="adminLegalLayerDetails"
                    label="Update legal layer details"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input.TextArea rows={4} placeholder="Layer / escalation notes" />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={saveLegal}
                    loading={cyberMut.isPending}
                  >
                    Save legal layer
                  </Button>
                </Form>
              )}

            {variant === 'merchant' &&
              dispute.disputeType === 'CHARGEBACK' &&
              dispute.status === 'OPEN' && (
                <Form form={cbForm} layout="vertical">
                  <Form.Item name="outcome" label="Decision" rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio value="ACCEPT">Accept chargeback</Radio>
                      <Radio value="REJECT">Reject to merchant (provide proof)</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, cur) => prev.outcome !== cur.outcome}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('outcome') === 'REJECT' ? (
                        <>
                          <Form.Item
                            name="supportingInvoiceId"
                            label="Platform invoice (optional if URL set)"
                          >
                            <Select
                              allowClear
                              showSearch
                              optionFilterProp="label"
                              placeholder="Select finalized invoice"
                              options={invoiceOptions}
                              loading={invoiceQuery.isLoading}
                            />
                          </Form.Item>
                          <Form.Item
                            name="supportingInvoiceUrl"
                            label="Invoice document URL"
                          >
                            <Input placeholder="https://…" />
                          </Form.Item>
                        </>
                      ) : null
                    }
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={submitChargeback}
                    loading={cbMut.isPending}
                  >
                    Submit decision
                  </Button>
                </Form>
              )}

            {variant === 'merchant' &&
              dispute.disputeType === 'CYBER_COMPLAINT' &&
              dispute.status === 'OPEN' && (
                <Form form={nocForm} layout="vertical">
                  <Form.Item
                    name="merchantNocUrl"
                    label="NOC URL or reference"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input placeholder="Link to NOC document" />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={submitNoc}
                    loading={nocMut.isPending}
                  >
                    Submit NOC (marks resolved)
                  </Button>
                </Form>
              )}
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default DisputeDetailModal;
