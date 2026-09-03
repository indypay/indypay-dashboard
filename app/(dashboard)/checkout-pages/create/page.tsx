'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Button,
  Card,
  Input,
  InputNumber,
  Divider,
  Switch,
  Tooltip,
  Select,
  Upload,
  message,
  Spin,
  Alert,
} from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
  PlusOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  SendOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  BgColorsOutlined,
  LinkOutlined as LinkIcon,
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useCreateCheckoutPage,
  useUpdateCheckoutPage,
  usePublishCheckoutPage,
  useGetCheckoutPageById,
} from '@/lib/hooks/use-checkout-pages';
import type { CheckoutPagePayload } from '@/lib/interfaces/checkout-page.interface';
import { getLogoUploadUrl } from '@/lib/services/checkout-page.service';

const { TextArea } = Input;

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomField {
  id: string;
  type: 'input' | 'price';
  label: string;
  required: boolean;
}

interface PageBuilderState {
  logoUrl: string | null;
  merchantName: string;
  isTestMode: boolean;
  pageTitle: string;
  pageDescription: string; // HTML
  goalEnabled: boolean;
  goalTitle: string;
  goalAmount: number;
  socialEnabled: boolean;
  socialLinks: Record<
    'twitter' | 'facebook' | 'instagram' | 'linkedin',
    string
  >;
  supportEmail: string;
  supportPhone: string;
  termsEnabled: boolean;
  termsText: string;
  customFields: CustomField[];
  amountType: 'USER_ENTERED' | 'FIXED';
  fixedAmount: number | null;
  minimumAmount: number | null;
  collectAddress: boolean;
  // Branding
  primaryColor: string;
  buttonText: string;
  // Post-payment
  successRedirectUrl: string;
  failureRedirectUrl: string;
  successMessage: string;
}

const DEFAULT_STATE: PageBuilderState = {
  logoUrl: null,
  merchantName: 'Your Business Name',
  isTestMode: true,
  pageTitle: '',
  pageDescription: '',
  goalEnabled: false,
  goalTitle: '',
  goalAmount: 0,
  socialEnabled: false,
  socialLinks: { twitter: '', facebook: '', instagram: '', linkedin: '' },
  supportEmail: '',
  supportPhone: '',
  termsEnabled: false,
  termsText: '',
  customFields: [],
  amountType: 'USER_ENTERED',
  fixedAmount: null,
  minimumAmount: null,
  collectAddress: false,
  primaryColor: '#006B4F',
  buttonText: 'Pay Now',
  successRedirectUrl: '',
  failureRedirectUrl: '',
  successMessage: '',
};

// ─── Rich Text Toolbar ────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !initializedRef.current) {
      editorRef.current.innerHTML = value;
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSelection = (): Range | null => {
    const sel = window.getSelection();
    return sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
  };

  const restoreSelection = (range: Range | null) => {
    if (!range) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const execCmd = useCallback(
    (command: string, val?: string) => {
      editorRef.current?.focus();
      const saved = saveSelection();
      document.execCommand(command, false, val ?? undefined);
      restoreSelection(saved);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    },
    [onChange],
  );

  const Sep = () => (
    <div
      style={{
        width: 1,
        height: 20,
        background: '#e8e8e8',
        margin: '0 2px',
        flexShrink: 0,
      }}
    />
  );

  const ToolBtn = ({
    icon,
    command,
    value: val,
    title,
  }: {
    icon: React.ReactNode;
    command: string;
    value?: string;
    title?: string;
  }) => (
    <Tooltip title={title}>
      <Button
        type="text"
        size="small"
        onMouseDown={(e) => {
          e.preventDefault();
          execCmd(command, val);
        }}
        style={{
          color: '#374151',
          padding: '2px 6px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {icon}
      </Button>
    </Tooltip>
  );

  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid #e8e8e8',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          flexWrap: 'wrap',
          background: '#fafafa',
          userSelect: 'none',
        }}
      >
        <Select
          size="small"
          defaultValue="normal"
          style={{ width: 90, marginRight: '4px' }}
          options={[
            { label: 'Normal', value: 'normal' },
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
          ]}
          onMouseDown={(e) => e.preventDefault()}
          onChange={(val) => {
            editorRef.current?.focus();
            document.execCommand(
              'formatBlock',
              false,
              val === 'normal' ? 'p' : val,
            );
            if (editorRef.current) onChange(editorRef.current.innerHTML);
          }}
        />
        <Sep />
        <ToolBtn icon={<BoldOutlined />} command="bold" title="Bold (Ctrl+B)" />
        <ToolBtn
          icon={<ItalicOutlined />}
          command="italic"
          title="Italic (Ctrl+I)"
        />
        <ToolBtn
          icon={<UnderlineOutlined />}
          command="underline"
          title="Underline (Ctrl+U)"
        />
        <Sep />
        <ToolBtn
          icon={<UnorderedListOutlined />}
          command="insertUnorderedList"
          title="Bullet list"
        />
        <ToolBtn
          icon={<OrderedListOutlined />}
          command="insertOrderedList"
          title="Numbered list"
        />
        <Sep />
        <Tooltip title="Insert link">
          <Button
            type="text"
            size="small"
            onMouseDown={(e) => {
              e.preventDefault();
              const saved = saveSelection();
              const url = window.prompt('Enter URL:');
              if (url) {
                restoreSelection(saved);
                document.execCommand('createLink', false, url);
                if (editorRef.current) onChange(editorRef.current.innerHTML);
              }
            }}
            style={{
              color: '#374151',
              padding: '2px 6px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LinkOutlined />
          </Button>
        </Tooltip>
        <Tooltip title="Insert image">
          <Button
            type="text"
            size="small"
            onMouseDown={(e) => {
              e.preventDefault();
              const saved = saveSelection();
              const url = window.prompt('Enter image URL:');
              if (url) {
                restoreSelection(saved);
                document.execCommand('insertImage', false, url);
                if (editorRef.current) onChange(editorRef.current.innerHTML);
              }
            }}
            style={{
              color: '#374151',
              padding: '2px 6px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <PictureOutlined />
          </Button>
        </Tooltip>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b') {
              e.preventDefault();
              execCmd('bold');
            }
            if (e.key === 'i') {
              e.preventDefault();
              execCmd('italic');
            }
            if (e.key === 'u') {
              e.preventDefault();
              execCmd('underline');
            }
          }
        }}
        style={{
          minHeight: '140px',
          padding: '12px 14px',
          outline: 'none',
          color: '#111',
          fontSize: '14px',
          lineHeight: '1.7',
          wordBreak: 'break-word',
        }}
      />
    </div>
  );
}

// ─── Payment Method Icons ─────────────────────────────────────────────────────

function UpiIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="3" fill="#F4F4F4" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#6739B7"
      >
        UPI
      </text>
    </svg>
  );
}
function VisaIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="3" fill="#1A1F71" />
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#FFFFFF"
        fontStyle="italic"
      >
        VISA
      </text>
    </svg>
  );
}
function MastercardIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="3" fill="#F4F4F4" />
      <circle cx="12" cy="10" r="6" fill="#EB001B" />
      <circle cx="20" cy="10" r="6" fill="#F79E1B" />
      <path
        d="M16 5.8A6 6 0 0 1 20 10a6 6 0 0 1-4 4.2A6 6 0 0 1 12 10a6 6 0 0 1 4-4.2z"
        fill="#FF5F00"
      />
    </svg>
  );
}
function RupayIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="3" fill="#F4F4F4" />
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="6"
        fontWeight="bold"
        fill="#006B3F"
      >
        RuPay
      </text>
    </svg>
  );
}

// ─── Section Heading helper ───────────────────────────────────────────────────

function SectionLabel({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#374151',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '10px',
      }}
    >
      {icon}
      {children}
    </div>
  );
}

// ─── Page Builder ─────────────────────────────────────────────────────────────

export default function CreateCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [state, setState] = useState<PageBuilderState>(DEFAULT_STATE);
  const [pageId, setPageId] = useState<string | null>(editId);
  const [saving, setSaving] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const createMutation = useCreateCheckoutPage();
  const updateMutation = useUpdateCheckoutPage();
  const publishMutation = usePublishCheckoutPage();
  const { data: existingPage } = useGetCheckoutPageById(editId);

  // Load existing page into state when editing
  useEffect(() => {
    if (!existingPage) return;
    const p = Array.isArray(existingPage)
      ? existingPage[0]
      : (existingPage as { data?: { data?: unknown } })?.data;
    const page = (p as { data?: unknown })?.data ?? p;
    if (!page || typeof page !== 'object') return;
    const rec = page as Record<string, unknown>;
    setState((prev) => ({
      ...prev,
      logoUrl: (rec.logoUrl as string) ?? null,
      merchantName: (rec.name as string) ?? prev.merchantName,
      pageTitle: (rec.title as string) ?? '',
      pageDescription: (rec.pageDescription as string) ?? '',
      supportEmail: (rec.contactEmail as string) ?? '',
      supportPhone: (rec.contactMobile as string) ?? '',
      termsEnabled: !!rec.termsAndConditions,
      termsText: (rec.termsAndConditions as string) ?? '',
      amountType:
        (rec.amountType as 'USER_ENTERED' | 'FIXED') ?? 'USER_ENTERED',
      fixedAmount: (rec.fixedAmount as number) ?? null,
      minimumAmount: (rec.minimumAmount as number) ?? null,
      collectAddress: (rec.collectAddress as boolean) ?? false,
      primaryColor: (rec.primaryColor as string) ?? '#006B4F',
      buttonText: (rec.buttonText as string) ?? 'Pay Now',
      successRedirectUrl: (rec.successRedirectUrl as string) ?? '',
      failureRedirectUrl: (rec.failureRedirectUrl as string) ?? '',
      successMessage: (rec.successMessage as string) ?? '',
      customFields: (
        (rec.customFields as Array<{
          key: string;
          label: string;
          type: string;
          required: boolean;
        }>) ?? []
      ).map((cf) => ({
        id: cf.key,
        label: cf.label,
        type: cf.type === 'number' ? 'price' : 'input',
        required: cf.required,
      })),
    }));
  }, [existingPage]);

  const update = useCallback(
    <K extends keyof PageBuilderState>(key: K, value: PageBuilderState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const buildPayload = (): CheckoutPagePayload => ({
    name: state.merchantName,
    logoUrl: state.logoUrl ?? undefined,
    title: state.pageTitle || 'Untitled Page',
    pageDescription: state.pageDescription || undefined,
    primaryColor: state.primaryColor,
    buttonText: state.buttonText,
    contactEmail: state.supportEmail || undefined,
    contactMobile: state.supportPhone || undefined,
    termsAndConditions: state.termsEnabled ? state.termsText : undefined,
    amountType: state.amountType,
    fixedAmount: state.amountType === 'FIXED' ? state.fixedAmount : undefined,
    minimumAmount:
      state.amountType === 'USER_ENTERED' ? state.minimumAmount : undefined,
    collectAddress: state.collectAddress,
    customFields: state.customFields.map((f, i) => ({
      key: f.id || `field_${i}`,
      label: f.label,
      type: f.type === 'price' ? 'number' : 'text',
      required: f.required,
    })),
    successRedirectUrl: state.successRedirectUrl || null,
    failureRedirectUrl: state.failureRedirectUrl || null,
    successMessage: state.successMessage || null,
  });

  const handleSaveDraft = async () => {
    if (!state.pageTitle.trim()) {
      message.warning('Please add a page title before saving.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...buildPayload(), status: 'DRAFT' as const };
      let result;
      if (pageId) {
        const [res, err] = await updateMutation.mutateAsync({
          id: pageId,
          payload,
        });
        if (err) throw err;
        result = res;
      } else {
        const [res, err] = await createMutation.mutateAsync(payload);
        if (err) throw err;
        result = res;
      }
      const savedId = result?.id;
      if (savedId) setPageId(savedId);
      message.success('Draft saved successfully!');
    } catch (e) {
      console.error('[SaveDraft] error:', e);
      const msg = (e as { message?: string })?.message ?? 'Please try again.';
      message.error(`Failed to save draft. ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!state.pageTitle.trim()) {
      message.warning('Please add a page title before publishing.');
      return;
    }
    setSaving(true);
    try {
      // Save first, then publish
      const payload = buildPayload();
      let id = pageId;
      if (!id) {
        const [res, err] = await createMutation.mutateAsync({
          ...payload,
          status: 'DRAFT' as const,
        });
        if (err) throw err;
        const savedId = res?.id;
        if (!savedId)
          throw new Error(
            'Create succeeded but returned no page ID. Please try again.',
          );
        id = savedId;
        setPageId(savedId);
      } else {
        const [, err] = await updateMutation.mutateAsync({
          id,
          payload: { ...payload, status: 'DRAFT' as const },
        });
        if (err) throw err;
      }
      const [pubRes, pubErr] = await publishMutation.mutateAsync(id);
      if (pubErr) throw pubErr;
      const url = pubRes?.pageUrl;
      if (url) setPublishedUrl(url);
      message.success('Checkout page published!');
    } catch (e) {
      console.error('[Publish] error:', e);
      const msg = (e as { message?: string })?.message ?? 'Please try again.';
      message.error(`Failed to publish. ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const addCustomField = (type: 'input' | 'price') => {
    const newField: CustomField = {
      id: Date.now().toString(),
      type,
      label: type === 'input' ? 'Text field' : 'Price',
      required: false,
    };
    setState((prev) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }));
  };

  const removeCustomField = (id: string) => {
    setState((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((f) => f.id !== id),
    }));
  };

  const updateFieldLabel = (id: string, label: string) => {
    setState((prev) => ({
      ...prev,
      customFields: prev.customFields.map((f) =>
        f.id === id ? { ...f, label } : f,
      ),
    }));
  };

  const displayAmount =
    state.amountType === 'FIXED' && state.fixedAmount != null
      ? state.fixedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })
      : '000.00';

  const payBtnStyle: React.CSSProperties = {
    background: state.primaryColor || '#006B4F',
    border: 'none',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '16px',
    height: '48px',
    borderRadius: '8px',
    width: '100%',
    cursor: 'pointer',
  };

  return (
    <Spin spinning={saving} tip="Saving...">
      <div style={{ minHeight: '100vh', background: '#F4F8F6' }}>
        {/* Published success banner */}
        {publishedUrl && (
          <Alert
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
            message={
              <span>
                Page published!{' '}
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 600, color: '#006B4F' }}
                >
                  {publishedUrl}
                </a>
              </span>
            }
            closable
            onClose={() => setPublishedUrl(null)}
            style={{ borderRadius: 0 }}
          />
        )}

        {/* Action bar */}
        <div
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/checkout-pages')}
            style={{ color: '#3D5C4A', fontWeight: 500 }}
          >
            Back to Checkout Pages
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {pageId && (
              <span
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  fontStyle: 'italic',
                }}
              >
                ID: {pageId.slice(-8)}
              </span>
            )}
            <Button
              ghost
              size="large"
              icon={<SaveOutlined />}
              loading={saving}
              style={{ borderColor: '#d9d9d9', color: '#333', fontWeight: 600 }}
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              loading={saving}
              style={{
                background: 'linear-gradient(135deg, #006B4F, #00875A)',
                border: 'none',
                color: '#F4F8F6',
                fontWeight: 700,
              }}
              onClick={handlePublish}
            >
              Publish
            </Button>
          </div>
        </div>

        {/* Two-column editor */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            padding: '24px',
            maxWidth: '1280px',
            margin: '0 auto',
            alignItems: 'flex-start',
          }}
        >
          {/* ── Left Panel ── */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Card
              styles={{ body: { padding: '32px' } }}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {/* Header: logo + title */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '28px',
                }}
              >
                <div>
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={async (file) => {
                      try {
                        const { presignedUrl, fileUrl } =
                          await getLogoUploadUrl(file.name, file.type);
                        await fetch(presignedUrl, {
                          method: 'PUT',
                          headers: { 'Content-Type': file.type },
                          body: file,
                        });
                        update('logoUrl', fileUrl);
                      } catch (e) {
                        console.error('[LogoUpload] error:', e);
                        message.error(
                          'Failed to upload logo. Please try again.',
                        );
                      }
                      return false;
                    }}
                  >
                    {state.logoUrl ? (
                      <div style={{ cursor: 'pointer', marginBottom: '12px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={state.logoUrl}
                          alt="Logo"
                          style={{
                            maxHeight: '56px',
                            maxWidth: '160px',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '120px',
                          height: '56px',
                          border: '2px dashed #d9d9d9',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          marginBottom: '12px',
                          background: '#fafafa',
                        }}
                      >
                        <UploadOutlined
                          style={{ color: '#aaa', fontSize: '16px' }}
                        />
                        <span
                          style={{
                            color: '#aaa',
                            fontSize: '10px',
                            marginTop: '2px',
                            textAlign: 'center',
                            padding: '0 4px',
                          }}
                        >
                          Add your logo
                        </span>
                      </div>
                    )}
                  </Upload>
                  <Input
                    value={state.merchantName}
                    onChange={(e) => update('merchantName', e.target.value)}
                    variant="borderless"
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#111',
                      padding: '0',
                      width: '280px',
                    }}
                  />
                  <div
                    style={{
                      color: '#999',
                      fontSize: '12px',
                      marginTop: '2px',
                    }}
                  >
                    powered by RupeeFlow
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 800,
                      color: '#1a1a1a',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    PAYMENT PAGE
                  </div>
                </div>
              </div>

              <Divider style={{ margin: '0 0 24px 0' }} />

              {/* Page title */}
              <div style={{ marginBottom: '4px' }}>
                <Input
                  value={state.pageTitle}
                  onChange={(e) => update('pageTitle', e.target.value)}
                  placeholder="Enter page title here"
                  variant="borderless"
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#111',
                    padding: '0 0 8px 0',
                    borderBottom: `2px solid ${state.primaryColor || '#00875A'}`,
                    borderRadius: 0,
                    width: '100%',
                  }}
                />
              </div>

              {/* Goal tracker */}
              <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => update('goalEnabled', !state.goalEnabled)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#006B4F',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <PlusOutlined style={{ fontSize: '11px' }} />
                  Add a Goal Tracker
                  <Tooltip title="Show a fundraising progress bar on your page">
                    <QuestionCircleOutlined
                      style={{ fontSize: '12px', color: '#aaa' }}
                    />
                  </Tooltip>
                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#16a34a',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    NEW
                  </span>
                </button>

                {state.goalEnabled && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '16px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                    }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          style={{
                            color: '#374151',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'block',
                            marginBottom: '4px',
                          }}
                        >
                          Goal Title
                        </label>
                        <Input
                          placeholder="e.g. Fundraising goal"
                          value={state.goalTitle}
                          onChange={(e) => update('goalTitle', e.target.value)}
                          size="small"
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            color: '#374151',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'block',
                            marginBottom: '4px',
                          }}
                        >
                          Target Amount (₹)
                        </label>
                        <InputNumber
                          placeholder="50000"
                          value={state.goalAmount || undefined}
                          onChange={(val) => update('goalAmount', val ?? 0)}
                          prefix="₹"
                          size="small"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ marginTop: '20px', marginBottom: '16px' }}>
                <label
                  style={{
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Page Description
                </label>
                <RichTextEditor
                  value={state.pageDescription}
                  onChange={(html) => update('pageDescription', html)}
                />
              </div>

              {/* Social media */}
              <div style={{ marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => update('socialEnabled', !state.socialEnabled)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#006B4F',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <PlusOutlined style={{ fontSize: '11px' }} />
                  Add social media share icons
                </button>

                {state.socialEnabled && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          'twitter',
                          'facebook',
                          'instagram',
                          'linkedin',
                        ] as const
                      ).map((platform) => (
                        <div key={platform}>
                          <label
                            style={{
                              color: '#374151',
                              fontSize: '12px',
                              fontWeight: 600,
                              display: 'block',
                              marginBottom: '4px',
                              textTransform: 'capitalize',
                            }}
                          >
                            {platform === 'twitter'
                              ? 'Twitter / X'
                              : platform.charAt(0).toUpperCase() +
                                platform.slice(1)}
                          </label>
                          <Input
                            placeholder={`https://${platform}.com/...`}
                            value={state.socialLinks[platform]}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                socialLinks: {
                                  ...prev.socialLinks,
                                  [platform]: e.target.value,
                                },
                              }))
                            }
                            size="small"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Us */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 700,
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Contact Us:
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: '#aaa' }} />}
                    placeholder="support@yourbusiness.com"
                    value={state.supportEmail}
                    onChange={(e) => update('supportEmail', e.target.value)}
                    variant="borderless"
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      borderRadius: 0,
                      paddingLeft: '0',
                    }}
                  />
                  <Input
                    prefix={<PhoneOutlined style={{ color: '#aaa' }} />}
                    placeholder="+91 99999 00000"
                    value={state.supportPhone}
                    onChange={(e) => update('supportPhone', e.target.value)}
                    variant="borderless"
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      borderRadius: 0,
                      paddingLeft: '0',
                    }}
                  />
                </div>
              </div>

              {/* Terms */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => update('termsEnabled', !state.termsEnabled)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#006B4F',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <PlusOutlined style={{ fontSize: '11px' }} />
                  Add Your Terms and Conditions
                </button>

                {state.termsEnabled && (
                  <div style={{ marginTop: '10px' }}>
                    <TextArea
                      placeholder="Enter your terms and conditions here..."
                      value={state.termsText}
                      onChange={(e) => update('termsText', e.target.value)}
                      rows={4}
                      style={{ borderColor: '#d9d9d9', color: '#333' }}
                    />
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div
                style={{ color: '#9ca3af', fontSize: '11px', lineHeight: 1.5 }}
              >
                You agree to share information entered on this page with{' '}
                <strong style={{ color: '#6b7280' }}>
                  {state.merchantName || 'the merchant'}
                </strong>{' '}
                and RupeeFlow, adhering to applicable laws.
              </div>
            </Card>

            {/* ── Branding Card ── */}
            <Card
              styles={{ body: { padding: '24px' } }}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <SectionLabel
                icon={<BgColorsOutlined style={{ color: '#6366F1' }} />}
              >
                Branding
              </SectionLabel>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label
                    style={{
                      color: '#555',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Brand Colour
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="color"
                      value={state.primaryColor}
                      onChange={(e) => update('primaryColor', e.target.value)}
                      style={{
                        width: '40px',
                        height: '36px',
                        padding: '2px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    />
                    <Input
                      value={state.primaryColor}
                      onChange={(e) => update('primaryColor', e.target.value)}
                      placeholder="#006B4F"
                      maxLength={7}
                      style={{ width: '110px', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginTop: '4px',
                    }}
                  >
                    Used for button, links, and accents
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label
                    style={{
                      color: '#555',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Pay Button Label
                  </label>
                  <Input
                    value={state.buttonText}
                    onChange={(e) => update('buttonText', e.target.value)}
                    placeholder="Pay Now"
                    maxLength={30}
                  />
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginTop: '4px',
                    }}
                  >
                    E.g. "Pay Now", "Donate", "Subscribe"
                  </div>
                </div>
              </div>
            </Card>

            {/* ── Post-Payment Settings Card ── */}
            <Card
              styles={{ body: { padding: '24px' } }}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <SectionLabel
                icon={<CheckCircleOutlined style={{ color: '#16a34a' }} />}
              >
                Post-Payment Settings
              </SectionLabel>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      color: '#555',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Success Redirect URL
                  </label>
                  <Input
                    prefix={<LinkIcon style={{ color: '#aaa' }} />}
                    value={state.successRedirectUrl}
                    onChange={(e) =>
                      update('successRedirectUrl', e.target.value)
                    }
                    placeholder="https://yourbusiness.com/thank-you"
                  />
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginTop: '4px',
                    }}
                  >
                    Redirect customer here after a successful payment. Leave
                    blank to show the default success screen.
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      color: '#555',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Failure Redirect URL
                  </label>
                  <Input
                    prefix={<LinkIcon style={{ color: '#aaa' }} />}
                    value={state.failureRedirectUrl}
                    onChange={(e) =>
                      update('failureRedirectUrl', e.target.value)
                    }
                    placeholder="https://yourbusiness.com/payment-failed"
                  />
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginTop: '4px',
                    }}
                  >
                    Redirect customer here when payment fails or is cancelled.
                  </div>
                </div>

                {!state.successRedirectUrl && (
                  <div>
                    <label
                      style={{
                        color: '#555',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Custom Thank-You Message
                    </label>
                    <TextArea
                      value={state.successMessage}
                      onChange={(e) => update('successMessage', e.target.value)}
                      placeholder="Thank you for your payment! We'll be in touch soon."
                      rows={3}
                      maxLength={300}
                      showCount
                    />
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        marginTop: '4px',
                      }}
                    >
                      Shown on the default success screen instead of a redirect.
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* ── Right Panel ── */}
          <div style={{ width: '380px', flexShrink: 0 }}>
            <Card
              styles={{ body: { padding: '24px' } }}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: '20px',
              }}
            >
              {/* Test mode warning */}
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '14px' }}>⚠</span>
                <p
                  style={{
                    color: '#92400e',
                    fontSize: '12px',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  <strong>Test Mode is on.</strong> Only test payments can be
                  made for this payment page.
                </p>
              </div>

              {/* Payment Details heading */}
              <div style={{ marginBottom: '20px' }}>
                <h3
                  style={{
                    color: '#111',
                    fontSize: '18px',
                    fontWeight: 700,
                    margin: '0 0 6px 0',
                  }}
                >
                  Payment Details
                </h3>
                <div
                  style={{
                    height: '3px',
                    width: '48px',
                    background: state.primaryColor || '#00875A',
                    borderRadius: '2px',
                  }}
                />
              </div>

              {/* Amount row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  minHeight: '36px',
                }}
              >
                <span
                  style={{
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    minWidth: '80px',
                  }}
                >
                  Amount
                </span>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  {state.amountType === 'USER_ENTERED' ? (
                    <button
                      type="button"
                      onClick={() => update('amountType', 'FIXED')}
                      style={{
                        border: `1.5px dashed ${state.primaryColor || '#00875A'}`,
                        background: '#E8F5EF',
                        color: '#006B4F',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      ₹ Customer enters
                    </button>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <InputNumber
                        placeholder="Enter amount"
                        value={state.fixedAmount ?? undefined}
                        onChange={(val) => update('fixedAmount', val)}
                        prefix="₹"
                        min={1}
                        style={{ width: '160px' }}
                        size="small"
                      />
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          update('amountType', 'USER_ENTERED');
                          update('fixedAmount', null);
                        }}
                        style={{ color: '#999', padding: '0 4px' }}
                      >
                        <CloseOutlined style={{ fontSize: '10px' }} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Minimum amount row — only when USER_ENTERED */}
              {state.amountType === 'USER_ENTERED' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      color: '#374151',
                      fontSize: '13px',
                      fontWeight: 600,
                      minWidth: '80px',
                    }}
                  >
                    Min. amount
                  </span>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <InputNumber
                      placeholder="No minimum"
                      value={state.minimumAmount ?? undefined}
                      onChange={(val) => update('minimumAmount', val)}
                      prefix="₹"
                      min={1}
                      style={{ width: '160px' }}
                      size="small"
                    />
                    {state.minimumAmount && (
                      <Button
                        type="text"
                        size="small"
                        onClick={() => update('minimumAmount', null)}
                        style={{ color: '#999', padding: '0 4px' }}
                      >
                        <CloseOutlined style={{ fontSize: '10px' }} />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Email row (preview) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    minWidth: '80px',
                  }}
                >
                  Email
                </span>
                <Input
                  placeholder="customer@email.com"
                  disabled
                  size="small"
                  style={{
                    flex: 1,
                    background: '#f9fafb',
                    borderColor: '#e5e7eb',
                    color: '#9ca3af',
                  }}
                />
              </div>

              {/* Phone row (preview) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    minWidth: '80px',
                  }}
                >
                  Phone
                </span>
                <Input
                  placeholder="+91 99999 00000"
                  disabled
                  size="small"
                  style={{
                    flex: 1,
                    background: '#f9fafb',
                    borderColor: '#e5e7eb',
                    color: '#9ca3af',
                  }}
                />
              </div>

              {/* Collect Address toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <HomeOutlined style={{ color: '#6b7280' }} /> Collect Address
                </span>
                <Switch
                  checked={state.collectAddress}
                  onChange={(checked) => update('collectAddress', checked)}
                  size="small"
                  style={{
                    backgroundColor: state.collectAddress
                      ? state.primaryColor || '#00875A'
                      : undefined,
                  }}
                />
              </div>

              {state.collectAddress && (
                <div style={{ marginBottom: '12px' }}>
                  <Input
                    placeholder="House / Flat No."
                    disabled
                    size="small"
                    style={{
                      background: '#f9fafb',
                      borderColor: '#e5e7eb',
                      color: '#9ca3af',
                      marginBottom: '6px',
                    }}
                  />
                  <Input
                    placeholder="City, State, PIN"
                    disabled
                    size="small"
                    style={{
                      background: '#f9fafb',
                      borderColor: '#e5e7eb',
                      color: '#9ca3af',
                    }}
                  />
                </div>
              )}

              {/* Custom fields */}
              {state.customFields.map((field) => (
                <div
                  key={field.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    position: 'relative',
                  }}
                  onMouseEnter={() => setHoveredFieldId(field.id)}
                  onMouseLeave={() => setHoveredFieldId(null)}
                >
                  {editingFieldId === field.id ? (
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        updateFieldLabel(field.id, e.target.value)
                      }
                      onBlur={() => setEditingFieldId(null)}
                      onPressEnter={() => setEditingFieldId(null)}
                      autoFocus
                      size="small"
                      style={{
                        width: '100px',
                        marginRight: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    />
                  ) : (
                    <span
                      onClick={() => setEditingFieldId(field.id)}
                      style={{
                        color: '#374151',
                        fontSize: '13px',
                        fontWeight: 600,
                        minWidth: '80px',
                        cursor: 'text',
                      }}
                      title="Click to edit label"
                    >
                      {field.label}
                    </span>
                  )}

                  {field.type === 'input' ? (
                    <Input
                      placeholder="Customer input"
                      disabled
                      size="small"
                      style={{
                        flex: 1,
                        background: '#f9fafb',
                        borderColor: '#e5e7eb',
                        color: '#9ca3af',
                      }}
                    />
                  ) : (
                    <InputNumber
                      placeholder="0.00"
                      disabled
                      prefix="₹"
                      size="small"
                      style={{ flex: 1, background: '#f9fafb' }}
                    />
                  )}

                  {hoveredFieldId === field.id && (
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => removeCustomField(field.id)}
                      style={{
                        color: '#ef4444',
                        position: 'absolute',
                        right: '-28px',
                        padding: '0 4px',
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Add new field */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingTop: '4px',
                }}
              >
                <span
                  style={{
                    color: '#9ca3af',
                    fontSize: '13px',
                    fontWeight: 600,
                    minWidth: '80px',
                  }}
                >
                  Add new
                </span>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => addCustomField('input')}
                    style={{
                      border: '1.5px dashed #d1d5db',
                      background: '#f9fafb',
                      color: '#6b7280',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <PlusOutlined style={{ fontSize: '10px' }} />A Input field
                  </button>
                  <button
                    type="button"
                    onClick={() => addCustomField('price')}
                    style={{
                      border: '1.5px dashed #d1d5db',
                      background: '#f9fafb',
                      color: '#6b7280',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <PlusOutlined style={{ fontSize: '10px' }} />₹ Price field
                  </button>
                </div>
              </div>

              <Divider style={{ margin: '0 0 16px 0' }} />

              {/* Payment method icons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                <UpiIcon />
                <VisaIcon />
                <MastercardIcon />
                <RupayIcon />
              </div>

              {/* Pay button — live preview with brand colour & custom label */}
              <button type="button" style={payBtnStyle} disabled>
                {state.buttonText || 'Pay Now'} ₹{displayAmount}
              </button>
            </Card>
          </div>
        </div>
      </div>
    </Spin>
  );
}
