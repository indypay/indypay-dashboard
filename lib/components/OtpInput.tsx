import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';
import { Input, InputRef } from 'antd';

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  className?: string;
  inputClassName?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  className = '',
  inputClassName = '',
  isDisabled = false,
  isInvalid = false,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(InputRef | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every((val) => val !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedArray = pastedData.slice(0, length).split('');

    if (pastedArray.every((char) => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedArray.forEach((value, index) => {
        if (index < length) {
          newOtp[index] = value;
        }
      });
      setOtp(newOtp);

      if (newOtp.every((val) => val !== '') && onComplete) {
        onComplete(newOtp.join(''));
      }
    }
  };

  return (
    <div className={`flex gap-4 justify-center ${className}`}>
      {otp.map((value, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={isDisabled}
          status={isInvalid ? 'error' : undefined}
          className={`w-12 min-w-[48px] h-12 text-center text-lg p-0 !bg-transparent ${inputClassName}`}
          style={{ textAlign: 'center' }}
        />
      ))}
    </div>
  );
};

export default OtpInput;
