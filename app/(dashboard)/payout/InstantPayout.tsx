'use client';

import { Button, Modal, ModalContent } from '@heroui/react';
import { Input, InputNumber } from 'antd';
import { FiSend } from 'react-icons/fi';
import { BiReset } from 'react-icons/bi';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { Select, SelectItem } from '@heroui/react';

import { TRANSFER_MODE } from '@/lib/constants/TransferMode/TransferMode.constant';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { postManualPayout } from '@/lib/hooks/use-manual-payout';
import { IManualPayout, ManualPayout } from '@/lib/interfaces/payout.interface';
import { safeAny } from '@/lib/interfaces/global.interface';

interface FormData extends IManualPayout {
  selectedBeneficiaryId: string;
  selectedBankId: string;
}

interface InstantPayoutProps {
  onClose: () => void;
  refetch: () => Promise<safeAny>;
}

const InstantPayout: React.FC<InstantPayoutProps> = ({ onClose, refetch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync } = postManualPayout();
  const { showToast } = useToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      amount: 0,
      purpose: '',
      beneficiaryName: '',
      accountNumber: '',
      ifscCode: '',
      remarks: '',
      paymentMode: 'IMPS',
      bankName: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const payoutData: ManualPayout = {
        data: [
          {
            amount: +data.amount,
            beneficiaryName: data.beneficiaryName,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
            remarks: data.remarks,
            paymentMode: 'IMPS',
            purpose: data.purpose,
            bankName: data.bankName,
            payoutId:
              'payout_' +
              Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15), // Generating a random payout ID
            beneficiaryMobile: data.beneficiaryMobile, // Assuming purpose field is used for mobile number as per the form
          },
        ],
      };

      const [success, error] = await mutateAsync(payoutData);

      if (success) {
        showToast('Manual Payout Created Successfully', 'success', 5000);
        reset(); // Reset form after successful submission
        await refetch();
        onClose();
      } else {
        showToast(error?.message || 'Something went wrong', 'error');
      }
    } catch (e: safeAny) {
      showToast(e?.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Modal
      size="5xl"
      isOpen={true}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      className="mb-2 w-full"
      onClose={onClose}
      hideCloseButton={false}
    >
      <ModalContent className="bg-white p-6 w-full max-w-5xl mx-auto">
        <div className="pb-4 border-b border-purple-300">
          <h2 className="text-3xl font-bold text-purple-800 text-center">
            Instant Payout
          </h2>
        </div>
        <div className="mt-6 space-y-6">
          <form
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium">
                Amount (₹)
              </label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: 'Amount is required',
                  min: {
                    value: 1,
                    message: 'Amount must be greater than 0',
                  },
                  validate: {
                    isNumber: (value) =>
                      !isNaN(Number(value)) || 'Amount must be a valid number',
                    isPositive: (value) =>
                      Number(value) > 0 || 'Amount must be greater than 0',
                  },
                }}
                render={({ field: { onChange, value, ...field } }) => (
                  <InputNumber
                    {...field}
                    placeholder="Enter amount"
                    value={value}
                    onChange={onChange}
                    disabled={isLoading}
                    prefix="₹"
                    className="w-full"
                    status={errors.amount ? 'error' : ''}
                    min={0}
                  />
                )}
              />
              <p className="text-red-500 text-xs h-5 mt-2">
                {errors.amount?.message}
              </p>
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium">
                Beneficiary Name
              </label>
              <Controller
                name="beneficiaryName"
                control={control}
                rules={{
                  required: 'Beneficiary Name is required',
                  minLength: {
                    value: 8,
                    message:
                      'Beneficiary Name should be greater than 8 characters',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={isLoading}
                    status={errors.beneficiaryName ? 'error' : ''}
                  />
                )}
              />
              <p className="text-red-500 text-xs h-5 mt-2">
                {errors.beneficiaryName?.message}
              </p>
            </div>

            <div className="w-full">
              <label className="block mb-1 text-sm font-medium">
                Bank Name
              </label>
              <Controller
                name="bankName"
                control={control}
                rules={{
                  required: 'Bank Name is required',
                  min: {
                    value: 1,
                    message: 'Bank Name is should be in correct format',
                  },
                }}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    {...field}
                    value={value?.toString()}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLoading}
                    status={errors.bankName ? 'error' : ''}
                  />
                )}
              />
              <p className="text-red-500 text-xs h-5 mt-2">
                {errors.bankName?.message}
              </p>
            </div>

            <div className="w-full">
              <label className="block mb-1 text-sm font-medium">
                Bank Account Number
              </label>
              <Controller
                name="accountNumber"
                control={control}
                rules={{
                  required: 'Account Number is required',
                  minLength: {
                    value: 8,
                    message:
                      'Account Number should be greater than 8 characters',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={isLoading}
                    status={errors.accountNumber ? 'error' : ''}
                  />
                )}
              />
              <p className="text-red-500 text-xs h-5 mt-2">
                {errors.accountNumber?.message}
              </p>
            </div>

            <div className="w-full">
              <label className="block mb-1 text-sm font-medium">
                IFSC Code
              </label>
              <Controller
                name="ifscCode"
                control={control}
                rules={{
                  required: 'IFSC Code is required',
                  minLength: {
                    value: 8,
                    message: 'IFSC Code should be greater than 8 characters',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={isLoading}
                    status={errors.ifscCode ? 'error' : ''}
                  />
                )}
              />
              <p className="text-red-500 text-xs h-5 mt-2">
                {errors.ifscCode?.message}
              </p>
            </div>
            <div className="w-full">
              <Controller
                name="paymentMode"
                control={control}
                rules={{ required: 'Transfer Mode is required' }}
                render={({ field }) => (
                  <Select {...field} label="Transfer Mode" disabled={isLoading}>
                    {TRANSFER_MODE.map((mode) => (
                      <SelectItem key={mode.key}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <p className="text-red-500 text-xs h-5 mt-2">
                {errors.paymentMode?.message}
              </p>
            </div>

            <div className="w-full">
              <label className="block mb-1 text-sm font-medium">Remarks</label>
              <Controller
                name="remarks"
                control={control}
                rules={{
                  required: 'Remarks is required',
                  minLength: {
                    value: 4,
                    message: 'Remarks should be at least 4 characters',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={isLoading}
                    status={errors.remarks ? 'error' : ''}
                  />
                )}
              />
              <p className="text-red-500 text-xs h-5 mt-2">
                {errors.remarks?.message}
              </p>
            </div>

            <div className="w-full">
              <label className="block mb-1 text-sm font-medium">
                Beneficiary Mobile
              </label>
              <Controller
                name="purpose"
                control={control}
                rules={{
                  required: 'Beneficiary Mobile is required',
                  minLength: {
                    value: 10,
                    message: 'Mobile number should be 10 digits',
                  },
                  maxLength: {
                    value: 10,
                    message: 'Mobile number should be 10 digits',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={isLoading}
                    status={errors.purpose ? 'error' : ''}
                  />
                )}
              />
              <p className="text-red-500 text-xs h-5 mt-2">
                {errors.purpose?.message}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                disabled={isLoading}
                type="submit"
                size="lg"
                startContent={<FiSend className="text-sm" />}
                className="bg-purple-600 text-white px-4 py-2 text-sm"
              >
                Submit
              </Button>
              <Button
                disabled={isLoading}
                type="button"
                size="lg"
                startContent={<BiReset className="text-sm" />}
                className="bg-[#ff4267] text-white px-4 py-2 text-sm"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </form>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default InstantPayout;
