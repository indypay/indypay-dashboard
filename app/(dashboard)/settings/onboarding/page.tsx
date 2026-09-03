'use client';

import { Table, Button, Input, Card, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from '@ant-design/icons';

import { useOnboardMerchant } from '@/lib/hooks/auth-verification';
import { queryClient } from '@/app/api/query-client';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { safeAny } from '@/lib/interfaces/global.interface';

const formSchema = z
  .object({
    mobile: z
      .string()
      .min(10, 'Mobile number must be 10 digits')
      .max(10, 'Mobile number must be 10 digits')
      .regex(/^[0-9]+$/, 'Must contain only numbers'),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(100, 'Name cannot exceed 100 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

interface MerchantRecord {
  id: number;
  mobile: string;
  fullName: string;
  email: string;
}

const mockData: MerchantRecord[] = [
  {
    id: 1,
    mobile: '0636622689',
    fullName: 'WorldSec Payments Limited',
    email: 'm.viznuik@settlepay.net',
  },
];

const inputWrapperStyle = (hasError: boolean) => ({
  backgroundColor: 'var(--background)',
  borderColor: hasError ? '#D51C44' : 'var(--border)',
  borderRadius: '8px',
});

const inputInnerStyle = {
  backgroundColor: 'var(--background)',
  color: 'var(--text)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  color: 'var(--text-muted)',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.01em',
};

const errorStyle: React.CSSProperties = {
  color: '#E8526A',
  fontSize: '12px',
  marginTop: '5px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--secondary)',
        margin: '0 0 16px 0',
      }}
    >
      {children}
    </p>
  );
}

export default function OnboardingPage() {
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: registerMerchant } = useOnboardMerchant();

  const onSubmit = (data: FormData) => {
    registerMerchant(data, {
      onSuccess: (data: [safeAny, safeAny]) => {
        queryClient.invalidateQueries({ queryKey: ['merchant-onboarded'] });
        const [response, error] = data;
        if (error) {
          showToast(error?.message, 'error');
          return;
        }
        if (response) {
          showToast('Merchant onboarded successfully', 'success');
          reset();
        }
      },
      onError: (error: safeAny) => {
        showToast(error?.message || 'An error occurred', 'error');
      },
    });
  };

  const columns: ColumnsType<MerchantRecord> = [
    { title: 'FULL NAME', dataIndex: 'fullName', key: 'fullName' },
    { title: 'EMAIL', dataIndex: 'email', key: 'email' },
    { title: 'MOBILE', dataIndex: 'mobile', key: 'mobile' },
  ];

  return (
    <div className="space-y-5">
      {/* Form Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
          borderRadius: '14px',
          padding: '1.5px',
        }}
      >
        <Card
          style={{
            background: '#FFFFFF',
            borderRadius: '13px',
            border: 'none',
          }}
          styles={{ body: { padding: '28px 32px' } }}
        >
          {/* Card Header */}
          <div style={{ marginBottom: '28px' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                margin: 0,
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em',
              }}
            >
              Merchant Onboarding
            </h2>
            <p
              style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}
            >
              Register a new merchant account on the platform
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information Section */}
            <SectionHeading>Personal Information</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
              {/* First Name */}
              <div>
                <label style={labelStyle}>First Name</label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="John"
                      prefix={
                        <UserOutlined
                          style={{ color: '#3D5C56', marginRight: '4px' }}
                        />
                      }
                      status={errors.firstName ? 'error' : undefined}
                      style={inputWrapperStyle(!!errors.firstName)}
                      styles={{ input: inputInnerStyle }}
                      className="onboarding-input"
                    />
                  )}
                />
                {errors.firstName && (
                  <p style={errorStyle}>· {errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label style={labelStyle}>Last Name</label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="Doe"
                      prefix={
                        <UserOutlined
                          style={{ color: '#3D5C56', marginRight: '4px' }}
                        />
                      }
                      status={errors.lastName ? 'error' : undefined}
                      style={inputWrapperStyle(!!errors.lastName)}
                      styles={{ input: inputInnerStyle }}
                      className="onboarding-input"
                    />
                  )}
                />
                {errors.lastName && (
                  <p style={errorStyle}>· {errors.lastName.message}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="10-digit number"
                      maxLength={10}
                      prefix={
                        <PhoneOutlined
                          style={{ color: '#3D5C56', marginRight: '4px' }}
                        />
                      }
                      status={errors.mobile ? 'error' : undefined}
                      style={inputWrapperStyle(!!errors.mobile)}
                      styles={{ input: inputInnerStyle }}
                      className="onboarding-input"
                    />
                  )}
                />
                {errors.mobile && (
                  <p style={errorStyle}>· {errors.mobile.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="john@example.com"
                      prefix={
                        <MailOutlined
                          style={{ color: '#3D5C56', marginRight: '4px' }}
                        />
                      }
                      status={errors.email ? 'error' : undefined}
                      style={inputWrapperStyle(!!errors.email)}
                      styles={{ input: inputInnerStyle }}
                      className="onboarding-input"
                    />
                  )}
                />
                {errors.email && (
                  <p style={errorStyle}>· {errors.email.message}</p>
                )}
              </div>
            </div>

            <Divider style={{ borderColor: 'var(--border)', margin: '4px 0 20px' }} />

            {/* Account Security Section */}
            <SectionHeading>Account Security</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      size="large"
                      placeholder="Min. 8 characters"
                      prefix={
                        <LockOutlined
                          style={{ color: '#3D5C56', marginRight: '4px' }}
                        />
                      }
                      status={errors.password ? 'error' : undefined}
                      style={inputWrapperStyle(!!errors.password)}
                      styles={{ input: inputInnerStyle }}
                      className="onboarding-input"
                    />
                  )}
                />
                {errors.password && (
                  <p style={errorStyle}>· {errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      size="large"
                      placeholder="Re-enter password"
                      prefix={
                        <LockOutlined
                          style={{ color: '#3D5C56', marginRight: '4px' }}
                        />
                      }
                      status={errors.confirmPassword ? 'error' : undefined}
                      style={inputWrapperStyle(!!errors.confirmPassword)}
                      styles={{ input: inputInnerStyle }}
                      className="onboarding-input"
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p style={errorStyle}>· {errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <Button
                size="large"
                onClick={() => reset()}
                style={{
                  background: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
              >
                Reset
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  background: 'linear-gradient(to right, var(--border), var(--primary))',
                  border: 'none',
                  color: 'var(--background)',
                  fontWeight: 700,
                  borderRadius: '8px',
                  paddingInline: '32px',
                  letterSpacing: '0.01em',
                }}
              >
                Onboard Merchant
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Records Table Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
          borderRadius: '14px',
          padding: '1.5px',
        }}
      >
        <Card
          style={{
            background: '#FFFFFF',
            borderRadius: '13px',
            border: 'none',
          }}
          styles={{ body: { padding: '28px 32px' } }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                margin: 0,
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em',
              }}
            >
              Merchant Records
            </h2>
            <p
              style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}
            >
              Recently onboarded merchants
            </p>
          </div>

          <Table
            columns={columns}
            dataSource={mockData}
            rowKey="id"
            pagination={false}
            className="onboarding-table"
          />
        </Card>
      </div>

      <style jsx global>{`
        /* Input base */
        .onboarding-input.ant-input-affix-wrapper,
        .onboarding-input.ant-input {
          background-color: var(--background) !important;
          border-color: var(--border) !important;
          border-radius: 8px !important;
        }

        .onboarding-input.ant-input-affix-wrapper:hover,
        .onboarding-input.ant-input:hover {
          border-color: var(--primary) !important;
        }

        .onboarding-input.ant-input-affix-wrapper:focus-within,
        .onboarding-input.ant-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(0, 135, 90, 0.12) !important;
        }

        .onboarding-input .ant-input {
          background-color: var(--background) !important;
          color: var(--text) !important;
        }

        .onboarding-input .ant-input-password-icon,
        .onboarding-input .anticon-eye,
        .onboarding-input .anticon-eye-invisible {
          color: var(--text-muted) !important;
        }

        .onboarding-input .ant-input-password-icon:hover,
        .onboarding-input .anticon-eye:hover,
        .onboarding-input .anticon-eye-invisible:hover {
          color: var(--primary) !important;
        }

        /* Table */
        .onboarding-table .ant-table {
          background: #ffffff !important;
          border-radius: 8px;
        }

        .onboarding-table .ant-table-thead > tr > th {
          background: var(--background) !important;
          color: var(--text-muted) !important;
          border-bottom: 1px solid var(--border) !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 0.07em !important;
          text-transform: uppercase !important;
        }

        .onboarding-table .ant-table-tbody > tr > td {
          background: #ffffff !important;
          border-bottom: 1px solid var(--border) !important;
          color: var(--text) !important;
          font-size: 14px !important;
        }

        .onboarding-table .ant-table-tbody > tr:hover > td {
          background: var(--background) !important;
        }

        .onboarding-table .ant-table-placeholder,
        .onboarding-table .ant-empty-description {
          background: #ffffff !important;
          color: var(--text-muted) !important;
        }
      `}</style>
    </div>
  );
}
