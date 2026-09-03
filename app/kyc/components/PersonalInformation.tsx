'use client';

import { useEffect, useState } from 'react';
import { Input, Button, message } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

import { useKycStore } from '../store/useKycStore';
import {
  validatePAN,
  validateAadhaar,
  formatPAN,
  formatAadhaar,
  maskAadhaar,
  panRecordFullName,
  kycEnteredNameMatchesPanRecord,
  validateIndianMobile,
} from '@/lib/constants/kyc/kyc-validation.constants';
import { kycService } from '@/lib/services/kyc.service';
import {
  profileMobileService,
  syncSessionAfterMobileUpdate,
} from '@/lib/services/profile-mobile.service';
import { AxiosError } from 'axios';

const PERSONAL_INFO_DRAFT_KEY = 'kyc-personal-info-draft-v1';

export default function PersonalInformation() {
  const {
    personalInfo,
    setPersonalInfo,
    panVerification,
    setPANVerification,
    aadhaarVerification,
    setAadhaarVerification,
    setCurrentStep,
  } = useKycStore();

  const [pan, setPan] = useState(personalInfo.panNumber || '');
  const [aadhaar, setAadhaar] = useState('');
  const [fullName, setFullName] = useState(personalInfo.fullName || '');

  const [accountMobile, setAccountMobile] = useState('');
  const [profileOtp, setProfileOtp] = useState('');
  const [profileOtpSent, setProfileOtpSent] = useState(false);
  const [profileMobileLoading, setProfileMobileLoading] = useState(false);

  const panValidation = validatePAN(pan);
  const aadhaarValidation = validateAadhaar(aadhaar);
  const accountMobileValidation = validateIndianMobile(accountMobile);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(PERSONAL_INFO_DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        fullName?: string;
        pan?: string;
        aadhaar?: string;
        accountMobile?: string;
      };
      if (typeof parsed.fullName === 'string') setFullName(parsed.fullName);
      if (typeof parsed.pan === 'string') setPan(parsed.pan);
      if (typeof parsed.aadhaar === 'string') setAadhaar(parsed.aadhaar);
      if (typeof parsed.accountMobile === 'string')
        setAccountMobile(parsed.accountMobile);
    } catch {
      // Ignore malformed local drafts.
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      PERSONAL_INFO_DRAFT_KEY,
      JSON.stringify({
        fullName,
        pan,
        aadhaar,
        accountMobile,
      }),
    );
  }, [fullName, pan, aadhaar, accountMobile]);

  // ── PAN Verification ────────────────────────────────────────────────────────

  const handleVerifyPAN = async () => {
    if (!panValidation.valid || !fullName.trim()) return;
    setPANVerification({ status: 'verifying', message: '' });
    try {
      const res = await kycService.verifyPan(pan);
      const payload = res.data;
      if (!res.success || !payload?.verified) {
        setPANVerification({
          status: 'failed',
          message:
            payload?.message?.trim() ||
            res.message ||
            'PAN could not be verified. Please check the number and try again.',
        });
        return;
      }

      const recordName = panRecordFullName(payload);
      if (!recordName) {
        setPANVerification({
          status: 'failed',
          message:
            'PAN verified but no name was returned. Please contact support.',
        });
        return;
      }

      if (!kycEnteredNameMatchesPanRecord(fullName, recordName)) {
        setPANVerification({
          status: 'failed',
          message: `Name on PAN (${recordName}) does not match the full name you entered. Please correct your name or PAN.`,
        });
        return;
      }

      setPANVerification({
        status: 'verified',
        verifiedName: recordName,
        panType: 'Individual',
        message: '',
      });
      setPersonalInfo({ panNumber: pan });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const apiMsg = axiosError.response?.data?.message;
      setPANVerification({
        status: 'failed',
        message:
          (typeof apiMsg === 'string' && apiMsg.trim()) ||
          'PAN verification failed. Please retry.',
      });
    }
  };

  // ── Aadhaar ↔ account mobile link ───────────────────────────────────────────

  const handleVerifyAadhaar = async () => {
    if (!aadhaarValidation.valid) return;
    setAadhaarVerification({
      status: 'verifying',
      otpSent: false,
      mobileMismatch: false,
      message: '',
    });
    try {
      const res = await kycService.verifyAadhaarMobileLink(aadhaar);
      const d = res.data;
      const ok =
        res.success &&
        d?.verified === true &&
        d?.isMobileLinked === true &&
        d?.isVerified !== false;
      if (!ok) {
        setAadhaarVerification({
          status: 'failed',
          otpSent: false,
          mobileMismatch: false,
          message:
            (typeof d?.message === 'string' && d.message.trim()) ||
            res.message ||
            'Aadhaar could not be verified.',
        });
        return;
      }
      setAadhaarVerification({
        status: 'verified',
        otpSent: false,
        mobileMismatch: false,
        verifiedName: fullName.trim(),
        maskedNumber: maskAadhaar(aadhaar),
        linkMessage:
          (typeof d?.message === 'string' && d.message.trim()) || undefined,
        message: '',
      });
      setPersonalInfo({ aadhaarNumber: aadhaar.slice(-4), fullName });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError.response?.status;
      const apiMsg = axiosError.response?.data?.message;
      const errText =
        (typeof apiMsg === 'string' && apiMsg.trim()) ||
        'Aadhaar verification failed. Please retry.';
      if (status === 400) {
        setAadhaarVerification({
          status: 'failed',
          otpSent: false,
          mobileMismatch: true,
          message: errText,
        });
      } else {
        setAadhaarVerification({
          status: 'failed',
          otpSent: false,
          mobileMismatch: false,
          message: errText,
        });
      }
    }
  };

  const handleRequestProfileMobileOtp = async () => {
    if (!accountMobileValidation.valid) return;
    setProfileMobileLoading(true);
    try {
      const clean = accountMobile.replace(/\D/g, '');
      const res = await profileMobileService.requestOtp(clean);
      if (!res.success) {
        message.error(res.message || 'Could not send OTP.');
        return;
      }
      setProfileOtpSent(true);
      message.success(
        res.message?.trim() || 'OTP sent to the new mobile number.',
      );
    } catch (err) {
      const ax = err as AxiosError<{ message?: string }>;
      const m = ax.response?.data?.message;
      message.error(
        (typeof m === 'string' && m.trim()) || 'Could not send OTP.',
      );
    } finally {
      setProfileMobileLoading(false);
    }
  };

  const handleConfirmProfileMobile = async () => {
    if (!accountMobileValidation.valid || profileOtp.length !== 6) return;
    setProfileMobileLoading(true);
    try {
      const cleanMobile = accountMobile.replace(/\D/g, '');
      const res = await profileMobileService.confirm(cleanMobile, profileOtp);
      if (!res.success) {
        message.error(res.message || 'Could not update mobile.');
        return;
      }
      const session = await syncSessionAfterMobileUpdate(res);
      if (!session.ok) {
        message.warning(
          session.errorMessage ||
            'Mobile updated, but session refresh was partial. Continuing on this page.',
        );
      }
      message.success('Mobile number updated.');
      setProfileOtp('');
      setProfileOtpSent(false);
      setAccountMobile('');
      setAadhaarVerification({
        status: 'idle',
        otpSent: false,
        mobileMismatch: false,
        message: '',
      });
      if (aadhaarValidation.valid) {
        await handleVerifyAadhaar();
      } else {
        message.info('Please enter Aadhaar and verify again.');
      }
    } catch (err) {
      const ax = err as AxiosError<{ message?: string }>;
      const m = ax.response?.data?.message;
      message.error(
        (typeof m === 'string' && m.trim()) || 'Could not update mobile.',
      );
    } finally {
      setProfileMobileLoading(false);
    }
  };

  const canContinue =
    fullName.trim().length > 0 &&
    panVerification.status === 'verified' &&
    aadhaarVerification.status === 'verified';

  const handleContinue = () => {
    if (!canContinue) return;
    setPersonalInfo({ fullName });
    setCurrentStep(2);
  };

  return (
    <div>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Enter and verify your personal details.
      </p>

      <div className="space-y-5 max-w-lg">
        {/* Full Name */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={fullName}
            onChange={(e) => {
              const value = e.target.value;
              setFullName(value);
              setPersonalInfo({ fullName: value });
              if (panVerification.status === 'verified')
                setPANVerification({ status: 'idle' });
            }}
            placeholder="As per your Aadhaar / PAN"
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

        {/* PAN Number */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            PAN Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <Input
              value={pan}
              onChange={(e) => {
                const formatted = formatPAN(e.target.value);
                setPan(formatted);
                setPersonalInfo({ panNumber: formatted });
                if (panVerification.status !== 'idle')
                  setPANVerification({ status: 'idle' });
              }}
              placeholder="ABCDE1234F"
              size="large"
              maxLength={10}
              className="kyc-input"
              disabled={panVerification.status === 'verified'}
              style={{
                backgroundColor: 'var(--surface)',
                borderColor:
                  panVerification.status === 'failed'
                    ? '#DC3545'
                    : panVerification.status === 'verified'
                      ? 'var(--primary)'
                      : 'var(--border)',
                color: 'var(--text)',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '15px',
                flex: 1,
              }}
              suffix={
                panVerification.status === 'verified' ? (
                  <CheckCircleFilled style={{ color: 'var(--primary)' }} />
                ) : panVerification.status === 'failed' ? (
                  <CloseCircleFilled style={{ color: '#DC3545' }} />
                ) : null
              }
            />
            {panVerification.status !== 'verified' && (
              <Button
                size="large"
                onClick={handleVerifyPAN}
                disabled={!panValidation.valid || !fullName.trim()}
                loading={panVerification.status === 'verifying'}
                style={{
                  background:
                    panValidation.valid && fullName.trim()
                      ? 'var(--cta-gradient)'
                      : 'var(--border)',
                  border: 'none',
                  color:
                    panValidation.valid && fullName.trim()
                      ? '#FFFFFF'
                      : '#9CA3AF',
                  borderRadius: '12px',
                  minWidth: '110px',
                  fontWeight: 600,
                }}
              >
                Verify PAN
              </Button>
            )}
          </div>
          {panVerification.status === 'verified' && (
            <p
              className="text-xs mt-1.5 flex items-center gap-1"
              style={{ color: 'var(--primary)' }}
            >
              <CheckCircleFilled /> Verified — {panVerification.verifiedName}
            </p>
          )}
          {panVerification.status === 'failed' && (
            <p className="text-xs mt-1.5" style={{ color: '#DC3545' }}>
              {panVerification.message}
            </p>
          )}
          {pan && !panValidation.valid && panVerification.status === 'idle' && (
            <p className="text-xs mt-1.5" style={{ color: '#DC3545' }}>
              {panValidation.message}
            </p>
          )}
        </div>

        {/* Aadhaar Number */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Aadhaar Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <Input
              value={aadhaar}
              onChange={(e) => {
                const formatted = formatAadhaar(e.target.value);
                setAadhaar(formatted);
                if (aadhaarVerification.status !== 'idle')
                  setAadhaarVerification({
                    status: 'idle',
                    otpSent: false,
                    mobileMismatch: false,
                  });
              }}
              placeholder="12-digit Aadhaar number"
              size="large"
              maxLength={12}
              className="kyc-input"
              disabled={aadhaarVerification.status === 'verified'}
              style={{
                backgroundColor: 'var(--surface)',
                borderColor:
                  aadhaarVerification.status === 'failed'
                    ? '#DC3545'
                    : aadhaarVerification.status === 'verified'
                      ? 'var(--primary)'
                      : 'var(--border)',
                color: 'var(--text)',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '15px',
                flex: 1,
              }}
              suffix={
                aadhaarVerification.status === 'verified' ? (
                  <CheckCircleFilled style={{ color: 'var(--primary)' }} />
                ) : null
              }
            />
            {aadhaarVerification.status !== 'verified' && (
              <Button
                size="large"
                onClick={handleVerifyAadhaar}
                disabled={!aadhaarValidation.valid}
                loading={aadhaarVerification.status === 'verifying'}
                style={{
                  background: aadhaarValidation.valid
                    ? 'var(--cta-gradient)'
                    : 'var(--border)',
                  border: 'none',
                  color: aadhaarValidation.valid ? '#FFFFFF' : '#9CA3AF',
                  borderRadius: '12px',
                  minWidth: '110px',
                  fontWeight: 600,
                }}
              >
                Verify Aadhaar
              </Button>
            )}
          </div>
          {aadhaar &&
            !aadhaarValidation.valid &&
            aadhaarVerification.status === 'idle' && (
              <p className="text-xs mt-1.5" style={{ color: '#DC3545' }}>
                {aadhaarValidation.message}
              </p>
            )}
          {aadhaarVerification.status === 'verified' && (
            <p
              className="text-xs mt-1.5 flex items-center gap-1"
              style={{ color: 'var(--primary)' }}
            >
              <CheckCircleFilled />{' '}
              {aadhaarVerification.linkMessage ||
                `Verified — ${aadhaarVerification.verifiedName}`}
            </p>
          )}
          {aadhaarVerification.status === 'failed' &&
            !aadhaarVerification.mobileMismatch &&
            aadhaarVerification.message && (
              <p className="text-xs mt-1.5" style={{ color: '#DC3545' }}>
                {aadhaarVerification.message}
              </p>
            )}

          {aadhaarVerification.mobileMismatch && (
            <div
              className="mt-4 p-4 rounded-xl space-y-3"
              style={{
                background: '#F8FAF9',
                border: '1px solid var(--border)',
              }}
            >
              {aadhaarVerification.message && (
                <p className="text-xs" style={{ color: '#B42318' }}>
                  {aadhaarVerification.message}
                </p>
              )}
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                Update account mobile
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Use the mobile number registered with your Aadhaar. We will send
                an OTP to confirm, refresh your session, then you can verify
                Aadhaar again.
              </p>
              <Input
                value={accountMobile}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setAccountMobile(v);
                }}
                placeholder="New 10-digit mobile"
                size="large"
                maxLength={10}
                className="kyc-input"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  borderRadius: '12px',
                }}
              />
              {!accountMobileValidation.valid && accountMobile.length > 0 && (
                <p className="text-xs" style={{ color: '#DC3545' }}>
                  {accountMobileValidation.message}
                </p>
              )}
              {!profileOtpSent ? (
                <Button
                  type="primary"
                  size="large"
                  loading={profileMobileLoading}
                  disabled={!accountMobileValidation.valid}
                  onClick={handleRequestProfileMobileOtp}
                  style={{
                    background:
                      'var(--cta-gradient)',
                    border: 'none',
                    borderRadius: '12px',
                  }}
                >
                  Send OTP to new number
                </Button>
              ) : (
                <div className="space-y-3">
                  <label
                    className="block text-xs font-medium"
                    style={{ color: 'var(--text)' }}
                  >
                    Enter OTP sent to {accountMobile.replace(/\d(?=\d{4})/g, '•')}
                  </label>
                  <Input.OTP
                    length={6}
                    value={profileOtp}
                    onChange={setProfileOtp}
                    size="large"
                    style={{ gap: 8 }}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="primary"
                      size="large"
                      loading={profileMobileLoading}
                      disabled={profileOtp.length !== 6}
                      onClick={handleConfirmProfileMobile}
                      style={{
                        background:
                          'var(--cta-gradient)',
                        border: 'none',
                        borderRadius: '12px',
                      }}
                    >
                      Confirm mobile
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        setProfileOtpSent(false);
                        setProfileOtp('');
                      }}
                    >
                      Change number
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <button
            type="button"
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
      `}</style>
    </div>
  );
}
