'use client';

import { useState } from 'react';
import { Input, Button } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  BankOutlined,
} from '@ant-design/icons';

import { useKycStore } from '../store/useKycStore';
import {
  validateBankAccount,
  validateIFSC,
  formatIFSC,
} from '@/lib/constants/kyc/kyc-validation.constants';

export default function BankVerification() {
  const {
    bankData,
    setBankData,
    bankVerification,
    setBankVerification,
    personalInfo,
    setCurrentStep,
  } = useKycStore();

  const [accountNumber, setAccountNumber] = useState(
    bankData.accountNumber || '',
  );
  const [confirmAccount, setConfirmAccount] = useState('');
  const [ifscCode, setIfscCode] = useState(bankData.ifscCode || '');
  const [ifscLookupDone, setIfscLookupDone] = useState(false);

  const accountValidation = validateBankAccount(accountNumber);
  const ifscValidation = validateIFSC(ifscCode);
  const accountsMatch =
    accountNumber === confirmAccount && accountNumber.length > 0;

  const handleIFSCLookup = async () => {
    if (!ifscValidation.valid) return;
    try {
      // TODO: GET /api/kyc/ifsc-lookup/:ifsc
      await new Promise((r) => setTimeout(r, 600));
      setBankVerification({
        bankName: 'HDFC Bank',
        branch: 'Branch from IFSC lookup',
        message: '',
      });
      setIfscLookupDone(true);
    } catch {
      setBankVerification({ bankName: undefined, branch: undefined });
      setIfscLookupDone(false);
    }
  };

  const handlePennyDrop = async () => {
    if (
      !accountsMatch ||
      !ifscValidation.valid ||
      bankVerification.status === 'verified'
    )
      return;
    setBankVerification({ status: 'verifying', message: '' });
    try {
      // TODO: POST /api/kyc/penny-drop { accountNumber, ifscCode }
      // Uses Razorpay penny drop — sends ₹1 and verifies beneficiary name
      await new Promise((r) => setTimeout(r, 2000));
      setBankVerification({
        status: 'verified',
        accountHolderName: personalInfo.fullName || 'Account Holder from Bank',
        message: '',
      });
      setBankData({ accountNumber, ifscCode });
    } catch {
      setBankVerification({
        status: 'failed',
        message: 'Penny drop failed. Please check account details.',
      });
    }
  };

  const canContinue = bankVerification.status === 'verified';

  const handleContinue = () => {
    if (!canContinue) return;
    setBankData({ accountNumber, ifscCode });
    setCurrentStep(5);
  };

  return (
    <div>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        We send ₹1 to verify your account — it's credited back instantly.
      </p>

      <div className="space-y-5 max-w-lg">
        {/* Account Number */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Bank Account Number <span className="text-red-500">*</span>
          </label>
          <Input
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 18));
              if (bankVerification.status !== 'idle')
                setBankVerification({ status: 'idle' });
            }}
            placeholder="Enter account number"
            size="large"
            disabled={bankVerification.status === 'verified'}
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
          {accountNumber && !accountValidation.valid && (
            <p className="text-xs mt-1.5" style={{ color: '#DC3545' }}>
              {accountValidation.message}
            </p>
          )}
        </div>

        {/* Confirm Account Number */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            Confirm Account Number <span className="text-red-500">*</span>
          </label>
          <Input
            value={confirmAccount}
            onChange={(e) =>
              setConfirmAccount(e.target.value.replace(/\D/g, '').slice(0, 18))
            }
            placeholder="Re-enter account number"
            size="large"
            disabled={bankVerification.status === 'verified'}
            className="kyc-input"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor:
                confirmAccount && !accountsMatch
                  ? '#DC3545'
                  : accountsMatch
                    ? 'var(--primary)'
                    : 'var(--border)',
              color: 'var(--text)',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '15px',
            }}
            suffix={
              confirmAccount && accountsMatch ? (
                <CheckCircleFilled style={{ color: 'var(--primary)' }} />
              ) : confirmAccount && !accountsMatch ? (
                <CloseCircleFilled style={{ color: '#DC3545' }} />
              ) : null
            }
          />
          {confirmAccount && !accountsMatch && (
            <p className="text-xs mt-1.5" style={{ color: '#DC3545' }}>
              Account numbers do not match
            </p>
          )}
        </div>

        {/* IFSC Code */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text)' }}
          >
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <Input
              value={ifscCode}
              onChange={(e) => {
                const formatted = formatIFSC(e.target.value);
                setIfscCode(formatted);
                setIfscLookupDone(false);
                setBankVerification({ bankName: undefined, branch: undefined });
              }}
              placeholder="HDFC0001234"
              size="large"
              maxLength={11}
              disabled={bankVerification.status === 'verified'}
              className="kyc-input"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: ifscLookupDone ? 'var(--primary)' : 'var(--border)',
                color: 'var(--text)',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '15px',
                flex: 1,
              }}
            />
            <Button
              size="large"
              onClick={handleIFSCLookup}
              disabled={
                !ifscValidation.valid || bankVerification.status === 'verified'
              }
              icon={<BankOutlined />}
              style={{
                background: ifscValidation.valid ? 'var(--primary-soft-bg)' : '#F9FAFB',
                border: ifscValidation.valid
                  ? '1px solid var(--primary)'
                  : '1px solid var(--border)',
                color: ifscValidation.valid ? 'var(--primary)' : '#9CA3AF',
                borderRadius: '12px',
                minWidth: '110px',
                fontWeight: 600,
              }}
            >
              Lookup
            </Button>
          </div>
          {ifscLookupDone && bankVerification.bankName && (
            <p
              className="text-xs mt-1.5 flex items-center gap-1"
              style={{ color: 'var(--primary)' }}
            >
              <CheckCircleFilled /> {bankVerification.bankName} —{' '}
              {bankVerification.branch}
            </p>
          )}
          {ifscCode && !ifscValidation.valid && (
            <p className="text-xs mt-1.5" style={{ color: '#DC3545' }}>
              {ifscValidation.message}
            </p>
          )}
        </div>

        {/* Penny Drop Button */}
        {bankVerification.status !== 'verified' && (
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--primary-soft-bg)', border: '1px solid var(--border)' }}
          >
            <p
              className="text-sm font-medium mb-1"
              style={{ color: 'var(--secondary)' }}
            >
              ₹1 Penny Drop Verification
            </p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              We'll send ₹1 to your account and verify the beneficiary name
              matches your KYC. The ₹1 stays in your account.
            </p>
            <Button
              size="large"
              onClick={handlePennyDrop}
              loading={bankVerification.status === 'verifying'}
              disabled={
                !accountsMatch || !ifscValidation.valid || !ifscLookupDone
              }
              style={{
                background:
                  accountsMatch && ifscValidation.valid && ifscLookupDone
                    ? 'var(--cta-gradient)'
                    : 'var(--border)',
                border: 'none',
                color:
                  accountsMatch && ifscValidation.valid && ifscLookupDone
                    ? '#FFFFFF'
                    : '#9CA3AF',
                borderRadius: '10px',
                fontWeight: 600,
                height: 44,
              }}
            >
              {bankVerification.status === 'verifying'
                ? 'Sending ₹1...'
                : 'Send ₹1 Penny Drop'}
            </Button>
          </div>
        )}

        {/* Verified state */}
        {bankVerification.status === 'verified' && (
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'var(--primary-soft-bg)', border: '1px solid var(--primary)' }}
          >
            <CheckCircleFilled style={{ color: 'var(--primary)', fontSize: 24 }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--secondary)' }}>
                Bank Account Verified
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {bankVerification.accountHolderName} ·{' '}
                {bankVerification.bankName}
              </p>
            </div>
          </div>
        )}

        {bankVerification.status === 'failed' && (
          <p className="text-sm" style={{ color: '#DC3545' }}>
            {bankVerification.message}
          </p>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
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
