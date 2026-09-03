'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Button, Table, Modal, Input, Spin, Empty } from 'antd';
import { PlusOutlined, BankOutlined } from '@ant-design/icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TableColumnsType } from 'antd';

import { IBankDetails } from '@/lib/interfaces/bank-details.interface';
import { callAddBankDetails, getBankList } from '@/lib/hooks/use-bankDetails';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { BankList } from '@/lib/interfaces/banks.interface';
import { safeAny } from '@/lib/interfaces/global.interface';

// Define form validation schema
const bankFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(10, 'Phone number cannot exceed 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  bankName: z.string().min(2, 'Bank name must be at least 2 characters'),
  accountNumber: z
    .string()
    .min(8, 'Account number must be at least 8 digits')
    .max(20, 'Account number cannot exceed 20 digits')
    .regex(/^\d+$/, 'Account number must contain only digits'),
  bankIFSC: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
});

type BankFormData = z.infer<typeof bankFormSchema>;

const BankDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bankList, setBankList] = useState<BankList[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const { mutateAsync: addBankDetails } = callAddBankDetails();
  const {
    data: BankListData,
    isLoading: isBankListLoading,
    refetch,
  } = getBankList();
  const { showToast } = useToast();

  useEffect(() => {
    if (
      Array.isArray(BankListData?.[0]?.data) &&
      BankListData?.[0]?.data.length > 0
    ) {
      setBankList(BankListData?.[0]?.data || []);
    }
  }, [BankListData?.[0]?.data]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BankFormData>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      bankName: '',
      bankIFSC: '',
      accountNumber: '',
    },
  });

  const onSubmit = async (data: BankFormData) => {
    try {
      setIsLoading(true);
      const bankData: IBankDetails = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        bankIFSC: data.bankIFSC,
      };

      const [response, error] = await addBankDetails(bankData);

      if (response && !error) {
        showToast('Bank Details Added Successfully', 'success');
        handleCloseModal();
        refetch();
      } else {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong';
        showToast(errorMessage, 'error');
      }
    } catch (error: safeAny) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to add bank details';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    reset({
      name: '',
      email: '',
      mobile: '',
      bankName: '',
      bankIFSC: '',
      accountNumber: '',
    });
    setOpenModal(false);
  };

  const columns: TableColumnsType<IBankDetails> = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ color: 'var(--text)' }}>{text || '-'}</span>,
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span style={{ color: 'var(--text)' }}>{text || '-'}</span>,
    },
    {
      title: 'BANK NAME',
      dataIndex: 'bankName',
      key: 'bankName',
      render: (text) => (
        <span style={{ color: 'var(--secondary)', fontWeight: 500 }}>{text || '-'}</span>
      ),
    },
    {
      title: 'ACCOUNT NUMBER',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      render: (text) => <span style={{ color: 'var(--text)' }}>{text || '-'}</span>,
    },
    {
      title: 'IFSC CODE',
      dataIndex: 'bankIFSC',
      key: 'bankIFSC',
      render: (text) => <span style={{ color: 'var(--text)' }}>{text || '-'}</span>,
    },
  ];

  return (
    <>
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
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                style={{
                  color: 'var(--text)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                <BankOutlined style={{ marginRight: '12px' }} />
                Bank Details
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  marginTop: '8px',
                  marginBottom: 0,
                }}
              >
                Add or manage your bank account details
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setOpenModal(true)}
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 600,
              }}
            >
              Add Bank Details
            </Button>
          </div>

          {/* Table */}
          <div
            style={{
              background: 'var(--background)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            <Spin spinning={isBankListLoading} tip="Loading bank details...">
              <Table
                columns={columns}
                dataSource={bankList}
                rowKey="email"
                pagination={false}
                locale={{
                  emptyText: (
                    <Empty
                      description={
                        <span style={{ color: 'var(--text-muted)' }}>
                          No bank details added yet
                        </span>
                      }
                      style={{ padding: '40px 0' }}
                    />
                  ),
                }}
                style={{
                  background: 'var(--background)',
                }}
                className="bank-details-table"
              />
            </Spin>
          </div>
        </Card>
      </div>

      {/* Add Bank Modal */}
      <Modal
        title={
          <span
            style={{ color: 'var(--text)', fontSize: '1.25rem', fontWeight: 600 }}
          >
            <BankOutlined style={{ marginRight: '8px' }} />
            Add Bank Details
          </span>
        }
        open={openModal}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
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
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '24px' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Name Field */}
            <div>
              <label
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Name *
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Enter account holder name"
                    status={errors.name ? 'error' : undefined}
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: errors.name ? '#D51C44' : 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                )}
              />
              {errors.name && (
                <div
                  style={{
                    color: '#D51C44',
                    fontSize: '0.75rem',
                    marginTop: '4px',
                  }}
                >
                  {errors.name.message}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Email *
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    type="email"
                    placeholder="Enter email address"
                    status={errors.email ? 'error' : undefined}
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: errors.email ? '#D51C44' : 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                )}
              />
              {errors.email && (
                <div
                  style={{
                    color: '#D51C44',
                    fontSize: '0.75rem',
                    marginTop: '4px',
                  }}
                >
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Phone Number *
              </label>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Enter 10-digit mobile number"
                    status={errors.mobile ? 'error' : undefined}
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: errors.mobile ? '#D51C44' : 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                )}
              />
              {errors.mobile && (
                <div
                  style={{
                    color: '#D51C44',
                    fontSize: '0.75rem',
                    marginTop: '4px',
                  }}
                >
                  {errors.mobile.message}
                </div>
              )}
            </div>

            {/* Bank Name Field */}
            <div>
              <label
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Bank Name *
              </label>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Enter bank name"
                    status={errors.bankName ? 'error' : undefined}
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: errors.bankName ? '#D51C44' : 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                )}
              />
              {errors.bankName && (
                <div
                  style={{
                    color: '#D51C44',
                    fontSize: '0.75rem',
                    marginTop: '4px',
                  }}
                >
                  {errors.bankName.message}
                </div>
              )}
            </div>

            {/* Account Number Field */}
            <div>
              <label
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Account Number *
              </label>
              <Controller
                name="accountNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Enter account number"
                    status={errors.accountNumber ? 'error' : undefined}
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: errors.accountNumber ? '#D51C44' : 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                )}
              />
              {errors.accountNumber && (
                <div
                  style={{
                    color: '#D51C44',
                    fontSize: '0.75rem',
                    marginTop: '4px',
                  }}
                >
                  {errors.accountNumber.message}
                </div>
              )}
            </div>

            {/* IFSC Code Field */}
            <div>
              <label
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                IFSC Code *
              </label>
              <Controller
                name="bankIFSC"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Enter IFSC code (e.g., SBIN0001234)"
                    status={errors.bankIFSC ? 'error' : undefined}
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: errors.bankIFSC ? '#D51C44' : 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                )}
              />
              {errors.bankIFSC && (
                <div
                  style={{
                    color: '#D51C44',
                    fontSize: '0.75rem',
                    marginTop: '4px',
                  }}
                >
                  {errors.bankIFSC.message}
                </div>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '32px',
            }}
          >
            <Button
              size="large"
              onClick={handleCloseModal}
              style={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isLoading}
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                border: 'none',
                color: 'var(--background)',
                fontWeight: 600,
              }}
            >
              Add Bank
            </Button>
          </div>
        </form>
      </Modal>

      <style jsx global>{`
        .bank-details-table .ant-table {
          background: var(--background) !important;
        }

        .bank-details-table .ant-table-thead > tr > th {
          background: #ffffff !important;
          color: var(--text-muted) !important;
          border-bottom: 1px solid var(--border) !important;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .bank-details-table .ant-table-tbody > tr {
          background: var(--background) !important;
        }

        .bank-details-table .ant-table-tbody > tr:hover > td {
          background: #ffffff !important;
        }

        .bank-details-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid var(--border) !important;
        }

        .bank-details-table .ant-spin-container {
          min-height: 200px;
        }
      `}</style>
    </>
  );
};

export default function BankPage() {
  return <BankDetails />;
}
