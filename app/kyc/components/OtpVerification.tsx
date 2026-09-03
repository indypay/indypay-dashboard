'use client';

import { useState, useEffect } from 'react';
import { Input, Button } from 'antd';

import { useKycStore } from '../store/useKycStore';

export default function OtpVerification() {
  const { setCurrentStep } = useKycStore();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResendOtp = () => {
    setTimer(60);
    setOtp('');
  };

  const handleNext = () => {
    if (otp.length === 6) {
      setCurrentStep(3);
    }
  };

  return (
    <div>
      <h2 className="mb-8 text-xl font-semibold" style={{ color: 'var(--text)' }}>
        Step 2: OTP Verification
      </h2>
      <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
        Enter the OTP sent to your mobile number
      </p>

      <div className="space-y-8">
        <Input.OTP
          length={6}
          value={otp}
          onChange={setOtp}
          size="large"
          style={{ gap: 12 }}
        />

        <div className="text-center">
          {timer > 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Resend OTP in {timer}s
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-sm font-medium hover:underline"
              style={{
                color: 'var(--primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            size="large"
            onClick={() => setCurrentStep(1)}
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text)',
              background: 'var(--surface)',
            }}
          >
            Back
          </Button>
          <Button
            size="large"
            disabled={otp.length !== 6}
            onClick={handleNext}
            style={{
              background:
                otp.length === 6
                  ? 'var(--cta-gradient)'
                  : undefined,
              border: 'none',
              color: '#FFFFFF',
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
