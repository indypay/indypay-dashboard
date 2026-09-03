'use client';

import { useState, useEffect } from 'react';
import { Input, Select, Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

import { useTenant } from '@/context/TenantContext';
import { useKycStore } from '../store/useKycStore';
import {
  validateGST,
  validateCIN,
  formatGST,
  formatCIN,
  requiresCIN,
} from '@/lib/constants/kyc/kyc-validation.constants';
import {
  businessTypes,
  industryTypes,
  turnoverOptions,
} from '@/lib/constants/RegisterForm/RegisterForm.constants';

export default function BusinessStructure() {
  const { tenantConfig } = useTenant();
  const {
    businessStructure,
    setBusinessStructure,
    gstVerification,
    setGSTVerification,
    cinVerification,
    setCINVerification,
    setCurrentStep,
  } = useKycStore();

  const [gst, setGst] = useState(businessStructure.gstNumber || '');
  const [businessName, setBusinessName] = useState(
    businessStructure.businessName || '',
  );
  const [typeOfBusiness, setTypeOfBusiness] = useState<number | string>(
    businessStructure.typeOfBusiness || '',
  );
  const [cin, setCin] = useState(businessStructure.cinNumber || '');
  const [industryName, setIndustryName] = useState(
    businessStructure.industryName || '',
  );
  const [turnover, setTurnover] = useState(businessStructure.turnover || '');
  const [yearEstablished, setYearEstablished] = useState(
    businessStructure.yearEstablished || '',
  );

  const gstValidation = validateGST(gst);
  const cinValidation = validateCIN(cin);
  const showCIN = requiresCIN(typeOfBusiness);

  // Auto-fill business name when GST is verified
  useEffect(() => {
    if (gstVerification.businessName) {
      setBusinessName(gstVerification.businessName);
    }
  }, [gstVerification.businessName]);

  // ── GST Verification ────────────────────────────────────────────────────────

  const handleVerifyGST = async () => {
    if (!gstValidation.valid) return;
    setGSTVerification({ status: 'verifying', message: '' });
    try {
      // TODO: POST /api/kyc/verify-gst { gst }
      // const res = await kycService.verifyGST(gst);
      await new Promise((r) => setTimeout(r, 1200));
      // Simulate GST API response:
      const simulatedName = businessName || 'Business Name from GST Records';
      setGSTVerification({
        status: 'verified',
        businessName: simulatedName,
        registeredAddress: 'Address from GST Records',
        state: 'Maharashtra',
        city: 'Mumbai',
        gstStatus: 'Active',
        filingStatus: 'Regular',
        message: '',
      });
      setBusinessStructure({ gstNumber: gst, businessName: simulatedName });
    } catch {
      setGSTVerification({
        status: 'failed',
        message: 'GST verification failed. Check the number and retry.',
      });
    }
  };

  // ── CIN Verification ────────────────────────────────────────────────────────

  const handleVerifyCIN = async () => {
    if (!cinValidation.valid) return;
    setCINVerification({ status: 'verifying', message: '' });
    try {
      // TODO: POST /api/kyc/verify-cin { cin }
      await new Promise((r) => setTimeout(r, 1000));
      setCINVerification({
        status: 'verified',
        companyName: businessName || 'Company Name from MCA',
        mcaStatus: 'Active',
        message: '',
      });
      setBusinessStructure({ cinNumber: cin });
    } catch {
      setCINVerification({
        status: 'failed',
        message: 'CIN verification failed.',
      });
    }
  };

  const canContinue =
    gstVerification.status === 'verified' &&
    businessName.trim() &&
    typeOfBusiness &&
    industryName &&
    turnover &&
    (!showCIN || cinVerification.status === 'verified');

  const handleContinue = () => {
    if (!canContinue) return;
    setBusinessStructure({
      businessName,
      typeOfBusiness,
      cinNumber: cin,
      industryName,
      turnover,
      yearEstablished,
    });
    setCurrentStep(3);
  };

  return (
    <div>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        {tenantConfig.name} collects this information to better understand and
        serve your business.
      </p>

      <div className="space-y-5 max-w-lg">
        {/* GST Number */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            GST Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <Input
              value={gst}
              onChange={(e) => {
                const formatted = formatGST(e.target.value);
                setGst(formatted);
                if (gstVerification.status !== 'idle')
                  setGSTVerification({ status: 'idle' });
              }}
              placeholder="29ABCDE1234F1Z5"
              size="large"
              maxLength={15}
              disabled={gstVerification.status === 'verified'}
              className="kyc-input"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor:
                  gstVerification.status === 'failed'
                    ? '#DC3545'
                    : gstVerification.status === 'verified'
                      ? 'var(--primary)'
                      : 'var(--border)',
                color: 'var(--text)',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '15px',
                flex: 1,
              }}
              suffix={
                gstVerification.status === 'verified' ? (
                  <CheckCircleFilled style={{ color: 'var(--primary)' }} />
                ) : gstVerification.status === 'failed' ? (
                  <CloseCircleFilled style={{ color: '#DC3545' }} />
                ) : null
              }
            />
            {gstVerification.status !== 'verified' && (
              <Button
                size="large"
                onClick={handleVerifyGST}
                disabled={!gstValidation.valid}
                loading={gstVerification.status === 'verifying'}
                style={{
                  background: gstValidation.valid
                    ? 'var(--cta-gradient)'
                    : 'var(--border)',
                  border: 'none',
                  color: gstValidation.valid ? '#FFFFFF' : '#9CA3AF',
                  borderRadius: '12px',
                  minWidth: '110px',
                  fontWeight: 600,
                }}
              >
                Verify GST
              </Button>
            )}
          </div>
          {gstVerification.status === 'verified' && (
            <p
              className="text-xs mt-1.5 flex items-center gap-1"
              style={{ color: 'var(--primary)' }}
            >
              <CheckCircleFilled /> {gstVerification.gstStatus} —{' '}
              {gstVerification.businessName}
            </p>
          )}
          {gstVerification.status === 'failed' && (
            <p className="text-xs mt-1.5" style={{ color: '#DC3545' }}>
              {gstVerification.message}
            </p>
          )}
        </div>

        {/* Business Name (auto-filled from GST) */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Business Name{' '}
            {gstVerification.status === 'verified' && (
              <span
                className="text-xs font-normal ml-1"
                style={{ color: 'var(--primary)' }}
              >
                (auto-filled from GST)
              </span>
            )}
            <span className="text-red-500"> *</span>
          </label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your registered business name"
            size="large"
            className="kyc-input"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '15px',
            }}
          />
        </div>

        {/* Type of Business */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Type of Business <span className="text-red-500">*</span>
          </label>
          <Select
            value={typeOfBusiness || undefined}
            onChange={(val) => {
              setTypeOfBusiness(val);
              if (requiresCIN(val) !== requiresCIN(typeOfBusiness)) {
                setCINVerification({ status: 'idle' });
                setCin('');
              }
            }}
            placeholder="Select business type"
            size="large"
            style={{ width: '100%' }}
            dropdownStyle={{ backgroundColor: 'var(--surface)' }}
            className="kyc-select"
          >
            {businessTypes.map((type) => (
              <Select.Option key={type.key} value={type.key}>
                {type.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* CIN — conditional for Pvt Ltd / Public Ltd / LLP */}
        {showCIN && (
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--text)' }}
            >
              CIN (Corporate Identification Number){' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                value={cin}
                onChange={(e) => {
                  const formatted = formatCIN(e.target.value);
                  setCin(formatted);
                  if (cinVerification.status !== 'idle')
                    setCINVerification({ status: 'idle' });
                }}
                placeholder="U64990KA2025PTC209485"
                size="large"
                maxLength={21}
                disabled={cinVerification.status === 'verified'}
                className="kyc-input"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor:
                    cinVerification.status === 'failed'
                      ? '#DC3545'
                      : cinVerification.status === 'verified'
                        ? 'var(--primary)'
                        : 'var(--border)',
                  color: 'var(--text)',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  fontSize: '15px',
                  flex: 1,
                }}
                suffix={
                  cinVerification.status === 'verified' ? (
                    <CheckCircleFilled style={{ color: 'var(--primary)' }} />
                  ) : null
                }
              />
              {cinVerification.status !== 'verified' && (
                <Button
                  size="large"
                  onClick={handleVerifyCIN}
                  disabled={!cinValidation.valid}
                  loading={cinVerification.status === 'verifying'}
                  style={{
                    background: cinValidation.valid
                      ? 'var(--cta-gradient)'
                      : 'var(--border)',
                    border: 'none',
                    color: cinValidation.valid ? '#FFFFFF' : '#9CA3AF',
                    borderRadius: '12px',
                    minWidth: '110px',
                    fontWeight: 600,
                  }}
                >
                  Verify CIN
                </Button>
              )}
            </div>
            {cinVerification.status === 'verified' && (
              <p
                className="text-xs mt-1.5 flex items-center gap-1"
                style={{ color: 'var(--primary)' }}
              >
                <CheckCircleFilled /> {cinVerification.mcaStatus} —{' '}
                {cinVerification.companyName}
              </p>
            )}
            {cinVerification.status === 'failed' && (
              <p className="text-xs mt-1.5" style={{ color: '#DC3545' }}>
                {cinVerification.message}
              </p>
            )}
          </div>
        )}

        {/* Industry */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Industry <span className="text-red-500">*</span>
          </label>
          <Select
            value={industryName || undefined}
            onChange={setIndustryName}
            placeholder="Select industry"
            size="large"
            style={{ width: '100%' }}
            dropdownStyle={{ backgroundColor: 'var(--surface)' }}
            className="kyc-select"
          >
            {industryTypes.map((ind) => (
              <Select.Option key={ind.key} value={ind.key}>
                {ind.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Turnover */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Annual Turnover <span className="text-red-500">*</span>
          </label>
          <Select
            value={turnover || undefined}
            onChange={setTurnover}
            placeholder="Select turnover range"
            size="large"
            style={{ width: '100%' }}
            dropdownStyle={{ backgroundColor: 'var(--surface)' }}
            className="kyc-select"
          >
            {turnoverOptions.map((t) => (
              <Select.Option key={t.key} value={t.key}>
                {t.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Year Established */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Year Established
          </label>
          <Input
            value={yearEstablished}
            onChange={(e) =>
              setYearEstablished(e.target.value.replace(/\D/g, '').slice(0, 4))
            }
            placeholder="e.g. 2020"
            size="large"
            maxLength={4}
            className="kyc-input"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '15px',
            }}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="px-8 py-3 rounded-lg transition-all flex items-center gap-2 font-semibold"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="px-8 py-3 text-white rounded-lg transition-all font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'var(--cta-gradient)',
              border: 'none',
            }}
          >
            Continue
          </button>
        </div>
      </div>

      <style jsx global>{`
        .kyc-input {
          background-color: var(--surface) !important;
        }
        .kyc-input input {
          background-color: var(--surface) !important;
          color: var(--text) !important;
        }
        .kyc-input input::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
        .kyc-input.ant-input-focused,
        .kyc-input:focus,
        .kyc-input:focus-within {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.1) !important;
        }
        .kyc-input:hover {
          border-color: var(--primary) !important;
        }
        .kyc-select .ant-select-selector {
          background-color: var(--surface) !important;
          border-color: var(--border) !important;
          border-radius: 12px !important;
          padding: 6px 12px !important;
          height: 50px !important;
          color: var(--text) !important;
        }
        .kyc-select .ant-select-selection-placeholder {
          color: #9ca3af !important;
        }
        .kyc-select .ant-select-selection-item {
          color: var(--text) !important;
          line-height: 34px !important;
        }
        .kyc-select:hover .ant-select-selector {
          border-color: var(--primary) !important;
        }
        .kyc-select.ant-select-focused .ant-select-selector {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
