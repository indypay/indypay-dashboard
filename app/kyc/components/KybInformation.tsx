'use client';

import { useEffect, useState } from 'react';
import { Input } from 'antd';

import { useKycStore } from '../store/useKycStore';

export default function KYBInformation() {
  const { kybData, setKYBData, gstVerification, setCurrentStep } =
    useKycStore();

  // Pre-fill from GST/Aadhaar verification data
  const [businessPan, setBusinessPan] = useState(kybData.businessPan || '');
  const [registeredAddress, setRegisteredAddress] = useState(
    kybData.registeredAddress || '',
  );
  const [state, setState] = useState(kybData.state || '');
  const [city, setCity] = useState(kybData.city || '');
  const [businessDescription, setBusinessDescription] = useState(
    kybData.businessDescription || '',
  );
  const [websiteUrl, setWebsiteUrl] = useState(kybData.websiteUrl || '');

  // Auto-populate from GST verification
  useEffect(() => {
    if (gstVerification.registeredAddress && !registeredAddress) {
      setRegisteredAddress(gstVerification.registeredAddress);
    }
    if (gstVerification.state && !state) setState(gstVerification.state);
    if (gstVerification.city && !city) setCity(gstVerification.city);
  }, [gstVerification]);

  // Auto-populate business PAN from GST number (first 10 chars derive PAN)
  useEffect(() => {
    // GST format: 2 state + 10 PAN + 3 extra. PAN is chars 3–12 of GST
    const gst = useKycStore.getState().businessStructure.gstNumber;
    if (gst && gst.length === 15 && !businessPan) {
      setBusinessPan(gst.substring(2, 12));
    }
  }, []);

  const canContinue =
    registeredAddress.trim() &&
    state.trim() &&
    city.trim() &&
    businessDescription.trim();

  const handleContinue = () => {
    if (!canContinue) return;
    setKYBData({
      businessPan,
      registeredAddress,
      state,
      city,
      businessDescription,
      websiteUrl,
    });
    setCurrentStep(4);
  };

  return (
    <div>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Know Your Business — regulatory information required for RBI PA
        compliance.
      </p>

      <div className="space-y-5 max-w-lg">
        {/* Business PAN (pre-filled) */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Business PAN
            {businessPan && (
              <span
                className="text-xs font-normal ml-1"
                style={{ color: 'var(--primary)' }}
              >
                (from GST)
              </span>
            )}
          </label>
          <Input
            value={businessPan}
            onChange={(e) =>
              setBusinessPan(e.target.value.toUpperCase().slice(0, 10))
            }
            placeholder="ABCDE1234F"
            size="large"
            className="kyc-input"
            style={{
              backgroundColor: businessPan ? 'var(--primary-soft-bg)' : '#FFFFFF',
              borderColor: businessPan ? 'var(--primary)' : 'var(--border)',
              color: 'var(--text)',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '15px',
            }}
          />
        </div>

        {/* Registered Address */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Registered Address <span className="text-red-500">*</span>
            {gstVerification.registeredAddress && (
              <span
                className="text-xs font-normal ml-1"
                style={{ color: 'var(--primary)' }}
              >
                (pre-filled from GST)
              </span>
            )}
          </label>
          <Input.TextArea
            value={registeredAddress}
            onChange={(e) => setRegisteredAddress(e.target.value)}
            placeholder="Full registered business address"
            rows={3}
            className="kyc-input"
            style={{
              backgroundColor:
                registeredAddress && gstVerification.registeredAddress
                  ? 'var(--primary-soft-bg)'
                  : '#FFFFFF',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '15px',
            }}
          />
        </div>

        {/* State & City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--text)' }}
            >
              State <span className="text-red-500">*</span>
            </label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Maharashtra"
              size="large"
              className="kyc-input"
              style={{
                backgroundColor:
                  state && gstVerification.state ? 'var(--primary-soft-bg)' : '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '15px',
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--text)' }}
            >
              City <span className="text-red-500">*</span>
            </label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai"
              size="large"
              className="kyc-input"
              style={{
                backgroundColor:
                  city && gstVerification.city ? 'var(--primary-soft-bg)' : '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '15px',
              }}
            />
          </div>
        </div>

        {/* Business Description */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Business Description <span className="text-red-500">*</span>
          </label>
          <Input.TextArea
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            placeholder="Describe what your business does (e.g. Payment aggregation platform for MSMEs...)"
            rows={3}
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

        {/* Website URL (optional) */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Company Website
            <span
              className="text-xs font-normal ml-1"
              style={{ color: '#9CA3AF' }}
            >
              (optional)
            </span>
          </label>
          <Input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.com"
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

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
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
        .kyc-input input,
        .kyc-input textarea {
          background-color: inherit !important;
          color: var(--text) !important;
        }
        .kyc-input input::placeholder,
        .kyc-input textarea::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
        .kyc-input.ant-input-focused,
        .kyc-input:focus,
        .kyc-input:focus-within,
        .ant-input-affix-wrapper:focus-within {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.1) !important;
        }
        .kyc-input:hover {
          border-color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
}
