import { Input, Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useState } from 'react';

import { useRegisterStore } from '../store/useRegisterStore';
import { useTenant } from '@/context/TenantContext';

export const VerificationForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const {
    emailOtp,
    mobileOtp,
    setField,
    email,
    mobileNumber,
    setVerificationStatus,
  } = useRegisterStore();

  const { tenantConfig } = useTenant();
  const [emailOtpError, setEmailOtpError] = useState('');
  const [mobileOtpError, setMobileOtpError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  const handleEmailOtpChange = (value: string) => {
    setField('emailOtp', value);
    if (value.length === 6) {
      setEmailOtpError('');
    } else {
      setEmailOtpError('Email OTP must be exactly 6 digits');
    }
  };

  const handleMobileOtpChange = (value: string) => {
    setField('mobileOtp', value);
    if (value.length === 6) {
      setMobileOtpError('');
    } else {
      setMobileOtpError('Mobile OTP must be exactly 6 digits');
    }
  };

  const handleEmailVerification = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setEmailOtpError('Email OTP must be 6 digits');
      return;
    }
    setEmailOtpError('');
    try {
      setVerificationStatus('isEmailVerified', true);
      setEmailVerified(true);
    } catch (error) {
      console.error('Email verification failed:', error);
    }
  };

  const handleMobileVerification = async () => {
    if (!mobileOtp || mobileOtp.length !== 6) {
      setMobileOtpError('Mobile OTP must be 6 digits');
      return;
    }
    setMobileOtpError('');
    try {
      setVerificationStatus('isMobileVerified', true);
      setMobileVerified(true);
    } catch (error) {
      console.error('Mobile verification failed:', error);
    }
  };

  const handleRegister = async () => {
    onSubmit();
  };

  const verifyBtnStyle = {
    background: 'linear-gradient(to right, var(--secondary), var(--primary))',
    border: 'none',
    color: '#FFFFFF',
    borderRadius: '10px',
    fontWeight: 600,
    height: 40,
    paddingInline: 20,
  };

  const verifyBtnDisabledStyle = {
    background: 'var(--border)',
    border: 'none',
    color: '#9CA3AF',
    borderRadius: '10px',
    fontWeight: 600,
    height: 40,
    paddingInline: 20,
  };

  return (
    <div className="space-y-6">
      {/* Email Verification */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3
            className="text-base sm:text-lg font-semibold"
            style={{ color: 'var(--text)' }}
          >
            Email Verification
          </h3>
          {emailVerified && (
            <CheckCircleFilled style={{ color: 'var(--primary)', fontSize: 16 }} />
          )}
        </div>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Enter the OTP sent to {email}
        </p>

        {/* OTP boxes */}
        <div>
          <label
            className="block text-xs sm:text-sm font-medium mb-2"
            style={{ color: 'var(--text)' }}
          >
            Email OTP
          </label>
          <Input.OTP
            length={6}
            value={emailOtp}
            onChange={handleEmailOtpChange}
            disabled={emailVerified}
            size="large"
            style={{ gap: 8 }}
          />
          {emailOtpError && (
            <p className="text-red-500 text-xs mt-1">{emailOtpError}</p>
          )}
          {emailVerified && (
            <p
              className="text-xs mt-1.5 flex items-center gap-1 font-medium"
              style={{ color: 'var(--primary)' }}
            >
              <CheckCircleFilled /> Email verified successfully
            </p>
          )}
        </div>

        {!emailVerified && (
          <Button
            onClick={handleEmailVerification}
            disabled={!emailOtp || emailOtp.length !== 6}
            size="large"
            style={
              emailOtp?.length === 6 ? verifyBtnStyle : verifyBtnDisabledStyle
            }
          >
            Verify Email
          </Button>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Mobile Verification */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3
            className="text-base sm:text-lg font-semibold"
            style={{ color: 'var(--text)' }}
          >
            Mobile Verification
          </h3>
          {mobileVerified && (
            <CheckCircleFilled style={{ color: 'var(--primary)', fontSize: 16 }} />
          )}
        </div>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Enter the OTP sent to {mobileNumber}
        </p>

        {/* OTP boxes */}
        <div>
          <label
            className="block text-xs sm:text-sm font-medium mb-2"
            style={{ color: 'var(--text)' }}
          >
            Mobile OTP
          </label>
          <Input.OTP
            length={6}
            value={mobileOtp}
            onChange={handleMobileOtpChange}
            disabled={mobileVerified}
            size="large"
            style={{ gap: 8 }}
          />
          {mobileOtpError && (
            <p className="text-red-500 text-xs mt-1">{mobileOtpError}</p>
          )}
          {mobileVerified && (
            <p
              className="text-xs mt-1.5 flex items-center gap-1 font-medium"
              style={{ color: 'var(--primary)' }}
            >
              <CheckCircleFilled /> Mobile verified successfully
            </p>
          )}
        </div>

        {!mobileVerified && (
          <Button
            onClick={handleMobileVerification}
            disabled={!mobileOtp || mobileOtp.length !== 6}
            size="large"
            style={
              mobileOtp?.length === 6 ? verifyBtnStyle : verifyBtnDisabledStyle
            }
          >
            Verify Mobile
          </Button>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleRegister}
          disabled={!emailOtp || !mobileOtp}
          className="w-full py-3.5 text-base sm:text-lg font-semibold text-white rounded-xl transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(to right, var(--secondary), var(--primary))',
            border: 'none',
          }}
        >
          Submit
        </button>
      </div>

      <style jsx global>{`
        .ant-otp-input {
          border-color: var(--border) !important;
          border-radius: 10px !important;
          color: var(--text) !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          background-color: #ffffff !important;
        }
        .ant-otp-input:focus,
        .ant-otp-input:focus-within {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 10%, transparent) !important;
        }
        .ant-otp-input:hover {
          border-color: var(--primary) !important;
        }
        .ant-otp-input.ant-input-disabled {
          background-color: var(--background) !important;
          border-color: var(--primary) !important;
          color: var(--text) !important;
        }
      `}</style>
    </div>
  );
};
