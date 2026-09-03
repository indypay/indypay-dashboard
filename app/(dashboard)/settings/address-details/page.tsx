'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, Input, Button, Select } from 'antd';

import { getMerchantList } from '@/lib/hooks/merchant-list';
import { safeAny } from '@/lib/interfaces/global.interface';
import { isAdmin } from '@/lib/utils/utils';
import { IMerchantList } from '@/lib/interfaces/merchant-list.interface';
import {
  updateAdminAddress,
  updateMerchantAddress,
  getAdminAddressList,
  getMerchantAddressList,
} from '@/lib/hooks/user-profile';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { AddressListData } from '@/lib/interfaces/users.interface';
import { queryClient } from '@/app/api/query-client';
import { useRole } from '@/lib/components/Role/RoleContext';

const addressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 characters'),
  userId: z.string().min(1, 'User ID is required'),
});

type FormData = z.infer<typeof addressSchema>;

export default function AddressDetails() {
  const { showToast } = useToast();
  const { role } = useRole();
  const [showAddForm, setShowAddForm] = useState(true);
  const [merchantList, setMerchantList] = useState<IMerchantList[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');
  const [allAddressList, setAllAddressList] = useState<AddressListData>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      userId: '',
    },
  });

  const { data: merchantData } = getMerchantList();
  const { mutate: mutation } = isAdmin(role)
    ? updateAdminAddress()
    : updateMerchantAddress();

  // Get address list based on role
  const { data: addressList, refetch } = isAdmin(role)
    ? getAdminAddressList(selectedMerchant)
    : getMerchantAddressList();

  useEffect(() => {
    if (merchantData?.[0]?.data) {
      setMerchantList(merchantData[0].data);
    }
  }, [merchantData]);

  useEffect(() => {
    if (addressList?.[0]?.data) {
      setAllAddressList(addressList[0].data);
      setShowAddForm(false);
    } else {
      setAllAddressList(undefined);
      setShowAddForm(true);
    }
  }, [addressList]);

  const onSubmit = async (values: FormData) => {
    mutation(values, {
      onSuccess: (data: [safeAny, safeAny]) => {
        queryClient.invalidateQueries({ queryKey: ['address-updated'] });
        const [response, error] = data;

        if (error) {
          showToast(error?.message, 'error');
          return;
        }
        if (response) {
          showToast(response?.message, 'success');
          refetch();
        }
      },
      onError: (error: safeAny) => {
        showToast(error?.message || 'An error occurred', 'error');
      },
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text)',
          }}
        >
          Address Details
        </h1>
        {!allAddressList && (
          <Button
            size="large"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              background: 'linear-gradient(to right, var(--border), var(--primary))',
              border: 'none',
              color: 'var(--background)',
              fontWeight: 600,
            }}
          >
            {showAddForm ? 'Hide Form' : 'Add Address'}
          </Button>
        )}
      </div>

      {showAddForm && (
        <div
          style={{
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
            marginBottom: '24px',
          }}
        >
          <Card
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              border: 'none',
            }}
            styles={{
              body: { padding: '24px' },
              header: {
                background: '#FFFFFF',
                borderBottom: '1px solid var(--border)',
              },
            }}
            title={
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: 0,
                }}
              >
                Add New Address
              </h4>
            }
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isAdmin(role) && (
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
                    Select Merchant
                  </label>
                  <Controller
                    name="userId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="large"
                        placeholder="Select a merchant"
                        status={errors.userId ? 'error' : undefined}
                        style={{
                          width: '100%',
                        }}
                        onChange={(value) => {
                          field.onChange(value);
                          setSelectedMerchant(value);
                          refetch();
                        }}
                        options={merchantList?.map(
                          (merchant: IMerchantList) => ({
                            label: merchant.fullName,
                            value: merchant.id,
                          }),
                        )}
                      />
                    )}
                  />
                  {errors.userId && (
                    <div
                      style={{
                        color: '#D51C44',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}
                    >
                      {errors.userId.message}
                    </div>
                  )}
                </div>
              )}

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
                  Address
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="Enter address"
                      status={errors.address ? 'error' : undefined}
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: errors.address ? '#D51C44' : 'var(--border)',
                        color: 'var(--text)',
                      }}
                      styles={{
                        input: { color: 'var(--text)' },
                      }}
                    />
                  )}
                />
                {errors.address && (
                  <div
                    style={{
                      color: '#D51C44',
                      fontSize: '12px',
                      marginTop: '4px',
                    }}
                  >
                    {errors.address.message}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    City
                  </label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        placeholder="Enter city"
                        status={errors.city ? 'error' : undefined}
                        style={{
                          backgroundColor: 'var(--background)',
                          borderColor: errors.city ? '#D51C44' : 'var(--border)',
                          color: 'var(--text)',
                        }}
                        styles={{
                          input: { color: 'var(--text)' },
                        }}
                      />
                    )}
                  />
                  {errors.city && (
                    <div
                      style={{
                        color: '#D51C44',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}
                    >
                      {errors.city.message}
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
                    State
                  </label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        placeholder="Enter state"
                        status={errors.state ? 'error' : undefined}
                        style={{
                          backgroundColor: 'var(--background)',
                          borderColor: errors.state ? '#D51C44' : 'var(--border)',
                          color: 'var(--text)',
                        }}
                        styles={{
                          input: { color: 'var(--text)' },
                        }}
                      />
                    )}
                  />
                  {errors.state && (
                    <div
                      style={{
                        color: '#D51C44',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}
                    >
                      {errors.state.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    Country
                  </label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        placeholder="Enter country"
                        status={errors.country ? 'error' : undefined}
                        style={{
                          backgroundColor: 'var(--background)',
                          borderColor: errors.country ? '#D51C44' : 'var(--border)',
                          color: 'var(--text)',
                        }}
                        styles={{
                          input: { color: 'var(--text)' },
                        }}
                      />
                    )}
                  />
                  {errors.country && (
                    <div
                      style={{
                        color: '#D51C44',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}
                    >
                      {errors.country.message}
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
                    Pincode
                  </label>
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        placeholder="Enter pincode"
                        status={errors.pincode ? 'error' : undefined}
                        style={{
                          backgroundColor: 'var(--background)',
                          borderColor: errors.pincode ? '#D51C44' : 'var(--border)',
                          color: 'var(--text)',
                        }}
                        styles={{
                          input: { color: 'var(--text)' },
                        }}
                      />
                    )}
                  />
                  {errors.pincode && (
                    <div
                      style={{
                        color: '#D51C44',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}
                    >
                      {errors.pincode.message}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  background: 'linear-gradient(to right, var(--border), var(--primary))',
                  border: 'none',
                  color: 'var(--background)',
                  fontWeight: 600,
                }}
              >
                {addressList ? 'Update' : 'Add Address'}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {allAddressList && (
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
              body: { padding: '24px' },
              header: {
                background: '#FFFFFF',
                borderBottom: '1px solid var(--border)',
              },
            }}
            title={
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: 0,
                }}
              >
                Saved Addresses
              </h4>
            }
          >
            <div className="space-y-4">
              <div
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <p style={{ color: 'var(--text)', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Address:</strong>{' '}
                  {allAddressList?.address}
                </p>
                <p style={{ color: 'var(--text)', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>City:</strong>{' '}
                  {allAddressList?.city}
                </p>
                <p style={{ color: 'var(--text)', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>State:</strong>{' '}
                  {allAddressList?.state}
                </p>
                <p style={{ color: 'var(--text)', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Country:</strong>{' '}
                  {allAddressList?.country}
                </p>
                <p style={{ color: 'var(--text)', marginBottom: 0 }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Pincode:</strong>{' '}
                  {allAddressList?.pincode}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

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
          background: var(--sidebar-active-bg) !important;
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
          color: var(--text-muted) !important;
        }

        .ant-card-head {
          background: #ffffff;
          border-bottom: 1px solid var(--border);
        }

        .ant-card-head-title {
          color: var(--text);
        }
      `}</style>
    </div>
  );
}
