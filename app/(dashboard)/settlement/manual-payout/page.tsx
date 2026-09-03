'use client';

import { Button, Card } from '@heroui/react';
import { Input, InputNumber, Select } from 'antd';
import { FiSend } from 'react-icons/fi';
import { BiReset } from 'react-icons/bi';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';

const { Option } = Select;

import { TRANSFER_MODE } from '@/lib/constants/TransferMode/TransferMode.constant';
import { EMAIL_REGEX } from '@/shared/regular-expressions';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { ISettlement, postSettlement } from '@/lib/hooks/use-manual-payout';
import { getMerchantList } from '@/lib/hooks/merchant-list';
import { IMerchantList } from '@/lib/interfaces/merchant-list.interface';
import { BankList, IBankDetails } from '@/lib/interfaces/banks.interface';
import {
  callGetAllBankList,
  callGetBankDetailsByBankId,
} from '@/lib/services/bank-service';
import { safeAny } from '@/lib/interfaces/global.interface';

interface FormData extends ISettlement {
  selectedBeneficiaryId: string;
  selectedBankId: string;
}

const ManualPayoutPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync } = postSettlement();
  const { showToast } = useToast();
  const [beneficiaryList, setBeneficiaryList] = useState<IMerchantList[]>([]);
  const [bankList, setBankList] = useState<BankList[]>([]);
  const [bankDetails, setBankDetails] = useState<IBankDetails | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      // orderId: "",
      amount: '',
      accountNumber: '',
      ifscCode: '',
      beneficiaryName: '',
      bankName: '',
      beneficiaryMobile: '',
      beneficiaryEmail: '',
      beneficiaryAddress: '',
      transferMode: 'IMPS',
      selectedBeneficiaryId: '',
      selectedBankId: '',
      remarks: '',
    },
  });

  const selectedBeneficiaryId = watch('selectedBeneficiaryId');
  const selectedBankId = watch('selectedBankId');

  const merchantListQuery = getMerchantList();
  const {
    data: merchantList,
    isLoading: isMerchantListLoading,
    error: merchantListError,
  } = merchantListQuery || {};

  console.log('=== QUERY DEBUG ===');
  console.log('Query Object:', merchantListQuery);
  console.log(
    'Query Enabled:',
    merchantListQuery?.isSuccess,
    merchantListQuery?.isFetching,
  );

  useEffect(() => {
    console.log('=== BENEFICIARY LIST DEBUG ===');
    console.log('Merchant List Data:', merchantList);
    console.log('Is Loading:', isMerchantListLoading);
    console.log('Error:', merchantListError);
    console.log('Current Beneficiary List:', beneficiaryList);
    console.log('Beneficiary List Length:', beneficiaryList.length);

    if (merchantList && Array.isArray(merchantList)) {
      const [responseData, error] = merchantList;
      console.log('Response Data:', responseData);
      console.log('Error from response:', error);

      if (
        responseData?.data &&
        Array.isArray(responseData.data) &&
        responseData.data.length > 0
      ) {
        console.log('✅ Setting beneficiary list:', responseData.data);
        setBeneficiaryList(responseData.data);
      } else if (error) {
        console.error('❌ Error fetching merchant list:', error);
        showToast('Failed to load beneficiary list', 'error');
      } else if (responseData?.data && responseData.data.length === 0) {
        console.log('⚠️ Beneficiary list is empty');
        showToast('No beneficiaries found', 'hint');
      }
    }
    console.log('=== END DEBUG ===');
  }, [merchantList, showToast, isMerchantListLoading, merchantListError]);

  useEffect(() => {
    if (selectedBeneficiaryId) {
      const fetchBankList = async () => {
        const [data, error] = await callGetAllBankList(selectedBeneficiaryId);
        if (data && Array.isArray(data?.data)) {
          setBankList(data?.data);
        } else if (error) {
          console.error('Error fetching bank list:', error);
          showToast('Failed to load bank list', 'error');
          setBankList([]);
        }
      };
      fetchBankList();
    } else {
      setBankList([]);
    }
  }, [selectedBeneficiaryId, showToast]);

  useEffect(() => {
    if (selectedBankId) {
      const fetchBankDetails = async () => {
        const [data, error] = await callGetBankDetailsByBankId(selectedBankId);
        if (data?.data) {
          setBankDetails(data.data);
          // Update form values with bank details
          setValue('accountNumber', data.data.accountNumber || '');
          setValue('ifscCode', data.data.bankIFSC || '');
          setValue('bankName', data.data.bankName || '');
          setValue('beneficiaryName', data.data.name || '');
          setValue('beneficiaryEmail', data.data.email || '');
          setValue('beneficiaryMobile', data.data.mobile || '');
        } else if (error) {
          console.error('Error fetching bank details:', error);
          showToast('Failed to load bank details', 'error');
          setBankDetails(null);
        }
      };
      fetchBankDetails();
    } else {
      setBankDetails(null);
    }
  }, [selectedBankId, setValue, showToast]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const payoutData: ISettlement = {
        amount: String(data.amount),
        userId: data.selectedBeneficiaryId,
        bankId: data.selectedBankId,
        transferMode: data.transferMode,
        remarks: data.remarks,
      };

      const [success, error] = await mutateAsync(payoutData);
      if (success) {
        showToast('Manual Payout Created Successfully', 'success');
        reset(); // Reset form after successful submission
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
    setBankDetails(null);
    setBankList([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
        Manual Payout
      </h1>

      <Card className="p-6 md:p-8 shadow-xl border border-gray-100">
        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Beneficiary Name
              {isMerchantListLoading && (
                <span className="text-blue-500 ml-2 text-xs font-normal">
                  (Loading...)
                </span>
              )}
              {!isMerchantListLoading && beneficiaryList.length > 0 && (
                <span className="text-primary-mint ml-2 text-xs font-normal">
                  ({beneficiaryList.length} available)
                </span>
              )}
            </label>
            <Controller
              name="selectedBeneficiaryId"
              control={control}
              rules={{ required: 'Beneficiary Name is required' }}
              render={({ field }) => {
                console.log('🎯 Beneficiary Select Render:', {
                  isLoading,
                  isMerchantListLoading,
                  beneficiaryListLength: beneficiaryList.length,
                  disabled: isLoading || isMerchantListLoading,
                  fieldValue: field.value,
                });
                return (
                  <Select
                    {...field}
                    placeholder={
                      isMerchantListLoading
                        ? 'Loading...'
                        : beneficiaryList.length === 0
                          ? 'No beneficiaries available'
                          : 'Select beneficiary'
                    }
                    disabled={isLoading || isMerchantListLoading}
                    className="w-full"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as string)
                        ?.toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    status={errors.selectedBeneficiaryId ? 'error' : ''}
                  >
                    {beneficiaryList.map((beneficiary) => (
                      <Option key={beneficiary.id} value={beneficiary.id}>
                        {beneficiary.fullName}
                      </Option>
                    ))}
                  </Select>
                );
              }}
            />
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.selectedBeneficiaryId?.message}
            </p>
            {isMerchantListLoading && (
              <p className="text-blue-500 text-xs mt-1">
                ⏳ Loading beneficiaries...
              </p>
            )}
            {!isMerchantListLoading && beneficiaryList.length === 0 && (
              <p className="text-orange-500 text-xs mt-1">
                ⚠️ No beneficiaries found. Query may be disabled due to role
                restrictions.
              </p>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Bank Name
            </label>
            <Controller
              name="selectedBankId"
              control={control}
              rules={{ required: 'Bank selection is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={
                    !selectedBeneficiaryId
                      ? 'Select beneficiary first'
                      : bankList.length === 0
                        ? 'No banks available'
                        : 'Select bank'
                  }
                  disabled={
                    isLoading || !selectedBeneficiaryId || bankList.length === 0
                  }
                  className="w-full"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as string)
                      ?.toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  status={errors.selectedBankId ? 'error' : ''}
                >
                  {bankList.map((bank) => (
                    <Option key={bank.id} value={bank.id}>
                      {bank.bankName}
                    </Option>
                  ))}
                </Select>
              )}
            />
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.selectedBankId?.message}
            </p>
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
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
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.amount?.message}
            </p>
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Transfer Mode
            </label>
            <Controller
              name="transferMode"
              control={control}
              rules={{ required: 'Transfer Mode is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select transfer mode"
                  disabled={isLoading}
                  className="w-full"
                  status={errors.transferMode ? 'error' : ''}
                >
                  {TRANSFER_MODE.map((mode) => (
                    <Option key={mode.key} value={mode.key}>
                      {mode.label}
                    </Option>
                  ))}
                </Select>
              )}
            />
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.transferMode?.message}
            </p>
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Bank Account Number
            </label>
            <Controller
              name="accountNumber"
              control={control}
              rules={{
                required: 'Account Number is required',
                minLength: {
                  value: 8,
                  message: 'Account Number should be greater than 8 characters',
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
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.accountNumber?.message}
            </p>
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
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
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.ifscCode?.message}
            </p>
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Beneficiary Email
            </label>
            <Controller
              name="beneficiaryEmail"
              control={control}
              rules={{
                required: 'Beneficiary Email is required',
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'Invalid email format',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={isLoading}
                  status={errors.beneficiaryEmail ? 'error' : ''}
                />
              )}
            />
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.beneficiaryEmail?.message}
            </p>
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Beneficiary Mobile
            </label>
            <Controller
              name="beneficiaryMobile"
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
                  status={errors.beneficiaryMobile ? 'error' : ''}
                />
              )}
            />
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.beneficiaryMobile?.message}
            </p>
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Beneficiary Address
            </label>
            <Controller
              name="beneficiaryAddress"
              control={control}
              rules={{
                required: 'Beneficiary Address is required',
                minLength: {
                  value: 4,
                  message: 'Address should be at least 4 characters',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={isLoading}
                  status={errors.beneficiaryAddress ? 'error' : ''}
                />
              )}
            />
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.beneficiaryAddress?.message}
            </p>
          </div>
          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Remarks
            </label>
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
            <p className="text-red-500 text-sm h-5 mt-2">
              {errors.remarks?.message}
            </p>
          </div>

          <div className="flex gap-4 mt-6 col-span-1 md:col-span-2 lg:col-span-3 justify-center">
            <Button
              disabled={isLoading}
              type="submit"
              size="lg"
              startContent={<FiSend className="text-base" />}
              style={{
                background: isLoading
                  ? '#9CA3AF'
                  : 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
              className="px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg min-w-[140px]"
            >
              Submit
            </Button>
            <Button
              disabled={isLoading}
              type="button"
              size="lg"
              startContent={<BiReset className="text-base" />}
              className="bg-[#ff4267] text-white px-8 py-3 text-base shadow-lg hover:shadow-xl hover:bg-[#e63952] transition-all duration-300 rounded-lg min-w-[140px]"
              onPress={handleReset}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ManualPayoutPage;
