'use client';

import { useForm } from 'react-hook-form';
import { Input } from 'antd';

import { useKycStore } from '../store/useKycStore';

import { CustomButton } from '@/lib/components/ButtonComponent/CustomButton';

interface MobileVerificationForm {
  mobile: string;
}

export default function MobileVerification() {
  const { setCurrentStep } = useKycStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MobileVerificationForm>({
    defaultValues: {
      mobile: '',
    },
  });

  const onSubmit = (data: MobileVerificationForm) => {
    setCurrentStep(2);
  };

  return (
    <div>
      <h2 className="mb-8 text-xl">Step 1: Mobile Verification</h2>
      <p className="mb-6 text-gray-600">
        To complete your KYC verification, please provide your mobile number:
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label className="block text-sm mb-1">Mobile Number</label>
          <Input
            {...register('mobile', {
              required: 'Mobile number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit mobile number',
              },
            })}
            type="tel"
            placeholder="Enter your mobile number"
            className="text-base border-gray-300"
            status={errors.mobile ? 'error' : undefined}
          />
          {errors.mobile && (
            <div className="text-red-500 text-sm mt-1">
              {errors.mobile.message}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <CustomButton
            type="default"
            className="bg-[#47266E] text-white h-12 rounded-md px-8"
          >
            Continue
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
