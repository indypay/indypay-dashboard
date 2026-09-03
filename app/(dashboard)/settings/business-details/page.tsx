'use client';

import { Button, Card, Modal, Select, Input } from 'antd';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';

import { useAddBusinessDetails } from '@/lib/hooks/use-businessDetails';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { IBusinessDetails } from '@/lib/interfaces/business-details.interface';
import {
  businessEntityTypes,
  industries,
  turnoverRanges,
} from '@/lib/constants/BusinessDetails/BusinessDetails';

const formSchema = z.object({
  businessEntityType: z.number().min(1, 'Please select a business entity type'),
  businessName: z.string().min(1, 'Business name is required').max(100),
  designation: z.string().min(1, 'Designation is required'),
  turnover: z.number().min(1, 'Please select turnover range'),
  industry: z.number().min(1, 'Please select an industry'),
});

type FormData = z.infer<typeof formSchema>;

export default function BusinessDetails() {
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: addBusinessDetails } = useAddBusinessDetails();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessEntityType: 0,
      businessName: '',
      designation: '',
      turnover: 0,
      industry: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const businessData: IBusinessDetails = {
        businessEntityType: Number(data.businessEntityType),
        businessName: data.businessName,
        designation: data.designation,
        turnover: Number(data.turnover),
        industry: Number(data.industry),
      };

      const [response, error] = await addBusinessDetails(businessData);
      if (response && !error) {
        showToast('Business Details Added Successfully', 'success');
      } else {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error(error);
    }
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-4 px-8 py-8">
      <div
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: '12px',
          padding: '2px',
        }}
      >
        <Card
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: 'none',
          }}
          styles={{
            body: { padding: '48px 24px' },
          }}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--text)',
              }}
            >
              Complete Your Merchant Business details
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}
            >
              Set up your business profile to start accepting payments
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => setIsOpen(true)}
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 600,
                padding: '0 24px',
              }}
            >
              Enter Business Details
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        title={
          <span style={{ color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>
            Merchant Onboarding
          </span>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        width={700}
        styles={{
          content: {
            background: '#FFFFFF',
            borderRadius: '12px',
          },
          header: {
            background: '#FFFFFF',
            borderBottom: '1px solid var(--border)',
          },
          body: {
            background: '#FFFFFF',
          },
          footer: {
            background: '#FFFFFF',
            borderTop: '1px solid var(--border)',
          },
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsOpen(false)}
            style={{
              borderColor: '#D51C44',
              color: '#D51C44',
              background: 'transparent',
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              const values = getValues();
              onSubmit(values);
            }}
            style={{
              background: 'linear-gradient(to right, var(--border), var(--primary))',
              border: 'none',
              color: 'var(--background)',
              fontWeight: 600,
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Business Entity Type
            </label>
            <Controller
              name="businessEntityType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  placeholder="Select business type"
                  status={errors.businessEntityType ? 'error' : undefined}
                  style={{
                    width: '100%',
                  }}
                  onChange={(value) => field.onChange(value)}
                  options={businessEntityTypes.map((type) => ({
                    label: type.label,
                    value: type.key,
                  }))}
                />
              )}
            />
            {errors.businessEntityType && (
              <div
                style={{ color: '#D51C44', fontSize: '12px', marginTop: '4px' }}
              >
                {errors.businessEntityType.message}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Business Name
            </label>
            <Controller
              name="businessName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="Enter your business name"
                  status={errors.businessName ? 'error' : undefined}
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: errors.businessName ? '#D51C44' : 'var(--border)',
                    color: 'var(--text)',
                  }}
                  styles={{
                    input: { color: 'var(--text)' },
                  }}
                />
              )}
            />
            {errors.businessName && (
              <div
                style={{ color: '#D51C44', fontSize: '12px', marginTop: '4px' }}
              >
                {errors.businessName.message}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Designation
            </label>
            <Controller
              name="designation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="Enter your designation"
                  status={errors.designation ? 'error' : undefined}
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: errors.designation ? '#D51C44' : 'var(--border)',
                    color: 'var(--text)',
                  }}
                  styles={{
                    input: { color: 'var(--text)' },
                  }}
                />
              )}
            />
            {errors.designation && (
              <div
                style={{ color: '#D51C44', fontSize: '12px', marginTop: '4px' }}
              >
                {errors.designation.message}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Annual Turnover
            </label>
            <Controller
              name="turnover"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  placeholder="Select turnover range"
                  status={errors.turnover ? 'error' : undefined}
                  style={{
                    width: '100%',
                  }}
                  onChange={(value) => field.onChange(value)}
                  options={turnoverRanges.map((range) => ({
                    label: range.label,
                    value: range.key,
                  }))}
                />
              )}
            />
            {errors.turnover && (
              <div
                style={{ color: '#D51C44', fontSize: '12px', marginTop: '4px' }}
              >
                {errors.turnover.message}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Industry
            </label>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  placeholder="Select your industry"
                  status={errors.industry ? 'error' : undefined}
                  style={{
                    width: '100%',
                  }}
                  onChange={(value) => field.onChange(value)}
                  options={industries.map((industry) => ({
                    label: industry.label,
                    value: industry.key,
                  }))}
                />
              )}
            />
            {errors.industry && (
              <div
                style={{ color: '#D51C44', fontSize: '12px', marginTop: '4px' }}
              >
                {errors.industry.message}
              </div>
            )}
          </div>
        </form>
      </Modal>

      <style jsx global>{`
        .ant-select-dropdown {
          background: #ffffff !important;
          border: 1px solid var(--border);
        }

        .ant-select-item {
          color: var(--text) !important;
          background: #ffffff !important;
        }

        .ant-select-item-option-selected {
          background: var(--background) !important;
        }

        .ant-select-item-option-active {
          background: var(--background) !important;
        }

        .ant-select-selection-item {
          color: var(--text) !important;
        }

        .ant-select-selector {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
        }

        .ant-select-arrow {
          color: var(--text) !important;
        }

        .ant-modal-mask {
          background-color: rgba(0, 0, 0, 0.7) !important;
        }
      `}</style>
    </div>
  );
}
