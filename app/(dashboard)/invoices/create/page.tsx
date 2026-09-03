'use client';

import { Button, Card, Row, Col, Switch, Divider, Select } from 'antd';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import {
  CheckOutlined,
  SaveOutlined,
  DeleteOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Logo } from '@/lib/components/Logo';
import { useTenant } from '@/context/TenantContext';

import { CustomerModal } from '../components/CustomerModal';
import { EditCustomerModal } from '../components/EditCustomerModal';
import { numberToWords } from '@/lib/utils/utils';
import {
  getCustomersList,
  addCustomer,
  getCustomer,
  createInvoice,
  getInvoiceDetails,
  getItems,
  finalizeInvoice,
  deleteInvoice,
  updateInvoiceItemPrice,
  // updateCustomer,
} from '@/lib/hooks/use-invoice';
import {
  ICustomer,
  ICustomerDetails,
} from '@/lib/interfaces/customer.interface';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { InvoiceItems } from '../components/InvoiceItems';
import { getUserProfiles } from '@/lib/hooks/user-profile';
import { useSearchParams } from 'next/navigation';
import { useHandleForm, invoiceSchema } from '@/lib/formHandler';
import { IInvoiceItems } from '@/lib/interfaces/invoice.interface';
import { useRouter } from 'next/navigation';
import { INVOICE_STATUS } from '@/lib/enum';
import { normalizeInvoiceItemsForApi } from '@/lib/utils/invoice.utils';
import { BillingAddressModal } from '../components/BillingAddressModal';

const { TextArea } = Input;

export default function CreateInvoicePage() {
  const { tenantConfig } = useTenant();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerEntryDetails, setCustomerEntryDetails] =
    useState<ICustomerDetails | null>(null);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<IInvoiceItems[]>([]);
  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const [billingAddress, setBillingAddress] = useState<string | null>(null);
  const router = useRouter();

  const { data: itemsData } = getItems();
  const {
    data: customerData,
    refetch,
    isLoading: isLoadingCustomers,
    error: customerError,
  } = getCustomersList();

  // Debug customer query state
  useEffect(() => {
    console.log('Customer Query State:', {
      isLoading: isLoadingCustomers,
      hasData: !!customerData,
      error: customerError,
    });
  }, [isLoadingCustomers, customerData, customerError]);
  const { mutateAsync: addCustomerMutation } = addCustomer();
  const { mutateAsync: customerDetails } = getCustomer();
  const { data } = getUserProfiles();
  const [profile] = data || [];
  const { mutateAsync: createInvoiceMutation } = createInvoice();
  const { mutateAsync: finalizeInvoiceMutation } = finalizeInvoice();
  const { mutateAsync: deleteInvoiceMutation } = deleteInvoice();
  const { mutateAsync: updateInvoiceItemPriceMutation } = updateInvoiceItemPrice();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoiceId') || '';

  const { fullName } = profile?.data || {};

  useEffect(() => {
    // console.log('=== Customer Data Debug ===');
    // console.log('Full customerData:', customerData);
    // console.log('customerData type:', typeof customerData);
    // console.log('customerData is array?', Array.isArray(customerData));

    if (customerData && Array.isArray(customerData)) {
      // console.log('customerData[0]:', customerData[0]);
      // console.log('customerData[1] (error):', customerData[1]);

      if (customerData[0]) {
        // console.log('customerData[0] type:', typeof customerData[0]);
        // console.log('customerData[0].data:', customerData[0].data);

        if (customerData[0].data && Array.isArray(customerData[0].data)) {
          // console.log('Number of customers:', customerData[0].data.length);
          // console.log('Customer list:', customerData[0].data);
          setCustomers(customerData[0].data);
        } else {
          console.log('customerData[0].data is not an array or is undefined');
        }
      } else {
        console.log(
          'customerData[0] is null/undefined, error:',
          customerData[1],
        );
      }
    } else {
      console.log('customerData is not in expected tuple format');
    }
    console.log('=== End Customer Data Debug ===');
  }, [customerData]);

  useEffect(() => {
    const businessAddress = profile?.data?.businessDetails?.businessAddress;
    if (businessAddress && !billingAddress) {
      setBillingAddress(businessAddress);
    }
  }, [profile, billingAddress]);

  const { values, setValue, errors, clearErrors, trigger } = useHandleForm({
    schema: invoiceSchema,
    initialValues: {
      invoiceNumber: '',
      description: '',
      customer: '',
      issueDate: '',
      expiryDate: '',
      items: [],
      totalAmount: 0,
      customerNotes: '',
      termsAndServices: '',
      billingAddress: '',
      shippingAddress: '',
      gstEnabled: false,
      partialPayments: false,
      includeBankDetails: false,
    },
  });

  const { data: invoiceDetails } = getInvoiceDetails(invoiceId || '');
  const invoiceStatus =
    invoiceDetails?.[0]?.data?.status || INVOICE_STATUS.DRAFT;

  useEffect(() => {
    if (!invoiceDetails?.[0]) return;
    const fetchInvoiceDetails = async () => {
      const { data } = invoiceDetails?.[0] || {};
      if (data) {
        setSelectedCustomer(data?.customer?.id || '');
        setValue('invoiceNumber', data?.invoiceNumber || '');
        setValue('description', data?.description || '');
        setValue(
          'issueDate',
          data?.issueDate
            ? new Date(data?.issueDate).toISOString().split('T')[0]
            : '',
        );
        setValue(
          'expiryDate',
          data?.expiryDate
            ? new Date(data?.expiryDate).toISOString().split('T')[0]
            : '',
        );
        setValue('customerNotes', data?.customerNotes || '');
        setValue('termsAndServices', data?.termsAndServices || '');
        setValue('billingAddress', data?.billingAddress || '');
        setValue('includeBankDetails', data?.includeBankDetails ?? false);

        if (data?.billingAddress !== billingAddress && data?.billingAddress) {
          setBillingAddress(data?.billingAddress || '');
        }
        setInvoiceItems(
          Array.isArray(data?.items)
            ? data.items.map((invItem) => ({
                id: invItem.item?.id || invItem.id || '',
                invoiceItemId: invItem.id || '',
                quantity: Number(invItem.quantity) || 1,
                price: Number(invItem.rate ?? invItem.item?.price ?? 0) || 0,
                gstRate: Number(invItem.gstRate ?? invItem.item?.gstRate ?? 18),
              }))
            : [],
        );
        setTotalAmount(data?.totalAmount || 0);
        const customerId = data?.customer?.id;
        if (customerId) {
          const [response] = await customerDetails(customerId);
          setCustomerEntryDetails(response?.data || null);
        } else {
          setCustomerEntryDetails(null);
        }
      }
    };

    fetchInvoiceDetails();
  }, [invoiceDetails, setValue, customerDetails, billingAddress]);

  useEffect(() => {
    // Only update invoice items and total when they change
    setValue(
      'items',
      invoiceItems.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
      })),
    );
    setValue('totalAmount', totalAmount || 0);
  }, [invoiceItems, totalAmount, setValue]);

  useEffect(() => {
    // Update customer field separately to avoid affecting other form values
    if (selectedCustomer) {
      setValue('customer', selectedCustomer);
    }
  }, [selectedCustomer, setValue]);

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  const handleCustomerSelect = async (value: string) => {
    if (value === 'new') {
      setIsCustomerModalOpen(true);
    } else {
      // Update selected customer immediately to prevent UI flicker
      setSelectedCustomer(value);
      setValue('customer', value);

      const [response, error] = await customerDetails(value);

      if (response && !error) {
        setCustomerEntryDetails(response?.data || null);
        showToast('Customer details fetched Successfully', 'success');

        // Auto-populate billing address if customer has address
        const customerData = response?.data;
        if (customerData?.addressLine1) {
          const customerBillingAddress = `${customerData.addressLine1}, ${customerData.addressLine2 || ''}, ${customerData.pincode}, ${customerData.city}, ${customerData.state}, ${customerData.country}`;
          setBillingAddress(customerBillingAddress);
        }
      } else {
        setCustomerEntryDetails(null);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong';
        showToast(errorMessage, 'error');
      }
    }
  };

  const handleCreateCustomer = async (data: ICustomerDetails) => {
    const [response, error] = await addCustomerMutation({
      name: data.name,
      email: data.email,
      gstin: data.gstin,
      contactNumber: data.contactNumber,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      country: data.country,
    });
    if (response && !error) {
      showToast('Customer Added Successfully', 'success');
      setIsCustomerModalOpen(false);

      // Refresh customer list to get the newly created customer
      const refreshResult = await refetch();
      console.log('Refetched customer list after creation:', refreshResult);

      // After refetch, the new customer should be in the list
      // Since we don't have the ID from response, we'll need to wait for the
      // customerData to update via the useEffect, or we can find the newest customer
      // For now, just refresh - the user can select the customer manually
    } else {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
      showToast(errorMessage, 'error');
    }
  };

  const handleUpdateCustomer = async (
    customerId: string,
    data: Partial<ICustomerDetails>,
  ) => {
    // For now, just show a toast - you'll need to implement the API call
    showToast('Customer update functionality to be implemented', 'success');
    setIsEditCustomerModalOpen(false);

    // Refresh customer details
    const [response] = await customerDetails(customerId);
    if (response?.data) {
      setCustomerEntryDetails(response.data);
    }
    await refetch();
  };

  const handleBillingAddressSubmit = (updatedAddress: string) => {
    setBillingAddress(updatedAddress);
    setShowBillingAddress(false);
  };

  const handleFinalizeAndIssue = async () => {
    const isValid = await trigger(undefined, {
      shouldFocus: true,
    });
    if (!isValid) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    const [response, error] = await finalizeInvoiceMutation({
      customerId: selectedCustomer || '',
      invoiceNumber: values.invoiceNumber || '',
      description: values.description || '',
      issueDate: values.issueDate ? new Date(values.issueDate) : new Date(),
      expiryDate: values.expiryDate ? new Date(values.expiryDate) : new Date(),
      totalAmount: Number(totalAmount) || 0,
      customerNotes: values.customerNotes || '',
      termsAndServices: values.termsAndServices || '',
      billingAddress: billingAddress || '',
      items: normalizeInvoiceItemsForApi(invoiceItems),
      id: invoiceId || '',
      includeBankDetails: values.includeBankDetails ?? false,
    });

    if (response && !error) {
      showToast('Invoice Finalized and Issued Successfully', 'success');
      router.push('/invoices');
    } else {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
      showToast(errorMessage, 'error');
    }
  };

  const handleDeleteInvoice = async () => {
    const [response, error] = await deleteInvoiceMutation(invoiceId || '');

    if (response && !error) {
      showToast('Invoice Deleted Successfully', 'success');
      router.push('/invoices');
    } else {
      showToast('Invoice Deletion Failed', 'error');
    }
  };

  const handleSaveInvoice = async () => {
    const isValid = await trigger(undefined, {
      shouldFocus: true,
    });
    if (!isValid) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    const [response, error] = await createInvoiceMutation({
      customerId: selectedCustomer || '',
      invoiceNumber: values.invoiceNumber || '',
      description: values.description || '',
      issueDate: values.issueDate ? new Date(values.issueDate) : new Date(),
      expiryDate: values.expiryDate ? new Date(values.expiryDate) : undefined,
      totalAmount: Number(totalAmount) || 0,
      customerNotes: values.customerNotes || '',
      termsAndServices: values.termsAndServices || '',
      billingAddress: billingAddress || '',
      items: normalizeInvoiceItemsForApi(invoiceItems),
      id: invoiceId || '',
      includeBankDetails: values.includeBankDetails ?? false,
    });

    if (response && !error) {
      showToast('Invoice Saved Successfully', 'success');
      router.push('/invoices');
    } else {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
      showToast(errorMessage, 'error');
    }
  };

  const handleTotalUpdate = (total: number) => {
    setTotalAmount(total);
  };

  const handleUpdateInvoiceItemPrice = async (
    invoiceItemId: string,
    price: number,
  ) => {
    if (!invoiceId) return;
    const [response, error] = await updateInvoiceItemPriceMutation({
      invoiceId,
      invoiceItemId,
      price,
    });
    if (response && !error) {
      showToast('Item price updated successfully', 'success');
    } else {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Price update failed';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto p-8"
      style={{ background: '#F5F5F5', minHeight: '100vh', marginTop: '60px' }}
    >
      <Row gutter={24}>
        <Col span={16}>
          <div
            style={{
              background: 'var(--cta-gradient)',
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
              bodyStyle={{ padding: '32px' }}
            >
              <div className="flex justify-between items-start mb-8">
                <div style={{ flex: 1 }}>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: '#1A1A1A', marginBottom: '8px' }}
                  >
                    {tenantConfig.name}
                  </h1>
                  {billingAddress && (
                    <div style={{ color: '#666666', fontSize: '14px' }}>
                      {billingAddress}
                    </div>
                  )}
                  {invoiceStatus === INVOICE_STATUS.DRAFT ? (
                    <div className="mt-4 w-full">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '8px',
                        }}
                      >
                        <label
                          style={{
                            color: '#333333',
                            fontWeight: 600,
                            fontSize: '16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Invoice #
                        </label>
                        <Input
                          placeholder="Enter Invoice Number"
                          value={values.invoiceNumber || ''}
                          onChange={(e) => {
                            setValue('invoiceNumber', e.target.value);
                          }}
                          onBlur={() => trigger('invoiceNumber')}
                          status={errors.invoiceNumber ? 'error' : undefined}
                          variant="borderless"
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: errors.invoiceNumber
                              ? '2px solid #D51C44'
                              : '2px solid #D0D0D0',
                            borderRadius: 0,
                            color: '#333333',
                            fontSize: '15px',
                            padding: '4px 0',
                          }}
                        />
                      </div>
                      {errors.invoiceNumber && (
                        <div
                          className="text-sm mt-1"
                          style={{ color: '#D51C44' }}
                        >
                          {errors.invoiceNumber.message}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p
                      className="text-md font-medium m-4"
                      style={{ color: '#333333' }}
                    >
                      Invoice: {values.invoiceNumber}
                    </p>
                  )}
                  {invoiceStatus === INVOICE_STATUS.DRAFT ? (
                    <div className="mt-6 w-full">
                      <Input
                        placeholder="Enter a Brief Description or Summary"
                        value={values.description || ''}
                        onChange={(e) => {
                          setValue('description', e.target.value);
                        }}
                        onBlur={() => trigger('description')}
                        status={errors.description ? 'error' : undefined}
                        variant="borderless"
                        style={{
                          backgroundColor: 'transparent',
                          borderBottom: errors.description
                            ? '2px solid #D51C44'
                            : '2px solid #D0D0D0',
                          borderRadius: 0,
                          color: '#333333',
                          fontSize: '15px',
                          padding: '8px 0',
                        }}
                      />
                      {errors.description && (
                        <div
                          className="text-sm mt-1"
                          style={{ color: '#D51C44' }}
                        >
                          {errors.description.message}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p
                      className="text-md font-medium m-4"
                      style={{ color: '#333333' }}
                    >
                      Description: {values.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end justify-center text-right max-w-[140px] overflow-hidden shrink-0">
                  <Logo isCollapsed={false} compact />
                  <div
                    className="text-sm mt-2"
                    style={{ color: '#999999', fontSize: '12px' }}
                  >
                    Invoicing and payments
                    <br />
                    powered by {tenantConfig.name}
                  </div>
                </div>
              </div>

              <Row gutter={24} className="mb-8">
                <Col span={12}>
                  <h3
                    className="font-semibold mb-4"
                    style={{
                      color: '#666666',
                      fontSize: '12px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    BILLING TO
                  </h3>
                  {invoiceStatus === INVOICE_STATUS.DRAFT ? (
                    <div className="mb-6">
                      <Select
                        placeholder={
                          isLoadingCustomers
                            ? 'Loading customers...'
                            : 'Select a customer'
                        }
                        value={selectedCustomer}
                        onChange={handleCustomerSelect}
                        onBlur={() => trigger('customer')}
                        status={errors.customer ? 'error' : undefined}
                        loading={isLoadingCustomers}
                        style={{
                          width: '100%',
                        }}
                        size="large"
                        options={[
                          ...customers.map((c) => ({
                            label: c.name,
                            value: c.id,
                          })),
                          {
                            label: '+ Create new customer',
                            value: 'new',
                            className: 'border-t mt-2 pt-2',
                          },
                        ]}
                      />
                      {errors.customer && (
                        <div
                          className="text-sm mt-1"
                          style={{ color: '#D51C44' }}
                        >
                          {errors.customer.message}
                        </div>
                      )}

                      {selectedCustomer && customerEntryDetails && (
                        <div className="mt-4 space-y-2">
                          <p
                            style={{
                              color: '#666666',
                              fontSize: '14px',
                              margin: 0,
                            }}
                          >
                            {customerEntryDetails.contactNumber}
                          </p>
                          <p
                            style={{
                              color: '#666666',
                              fontSize: '14px',
                              margin: 0,
                            }}
                          >
                            {customerEntryDetails.email}
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsEditCustomerModalOpen(true)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--secondary)',
                              fontSize: '14px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              padding: 0,
                              marginTop: '8px',
                            }}
                          >
                            Edit Customer
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p
                      className="text-md font-medium mb-4"
                      style={{ color: '#333333' }}
                    >
                      {customerEntryDetails?.name}
                    </p>
                  )}

                  <div className="space-y-4">
                    {invoiceStatus === INVOICE_STATUS.DRAFT ? (
                      <>
                        <div>
                          <label
                            className="block text-sm mb-2"
                            style={{
                              color: '#666666',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            ISSUE DATE
                          </label>
                          <Input
                            type="date"
                            value={values.issueDate}
                            onChange={(e) =>
                              setValue('issueDate', e.target.value)
                            }
                            onBlur={() => trigger('issueDate')}
                            status={errors.issueDate ? 'error' : undefined}
                            size="large"
                            style={{
                              backgroundColor: '#FAFAFA',
                              borderColor: errors.issueDate
                                ? '#D51C44'
                                : '#D0D0D0',
                              color: '#333333',
                            }}
                          />
                          {errors.issueDate && (
                            <div
                              className="text-sm mt-1"
                              style={{ color: '#D51C44' }}
                            >
                              {errors.issueDate.message}
                            </div>
                          )}
                        </div>
                        <div>
                          <label
                            className="block text-sm mb-2"
                            style={{
                              color: '#666666',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            EXPIRY DATE
                          </label>
                          <Input
                            type="date"
                            value={values.expiryDate}
                            onChange={(e) =>
                              setValue('expiryDate', e.target.value)
                            }
                            onBlur={() => trigger('expiryDate')}
                            status={errors.expiryDate ? 'error' : undefined}
                            size="large"
                            style={{
                              backgroundColor: '#FAFAFA',
                              borderColor: errors.expiryDate
                                ? '#D51C44'
                                : '#D0D0D0',
                              color: '#333333',
                            }}
                          />
                          {errors.expiryDate && (
                            <div
                              className="text-sm mt-1"
                              style={{ color: '#D51C44' }}
                            >
                              {errors.expiryDate.message}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          className="text-md font-medium"
                          style={{ color: '#333333' }}
                        >
                          Issue Date: {formatDate(values.issueDate)}
                        </p>
                        <p
                          className="text-md font-medium"
                          style={{ color: '#333333' }}
                        >
                          Expiry Date: {formatDate(values.expiryDate)}
                        </p>
                      </>
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <h3
                    className="font-semibold mb-4"
                    style={{
                      color: '#666666',
                      fontSize: '12px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    BILLING ADDRESS
                  </h3>
                  {billingAddress ? (
                    <div>
                      <div
                        style={{
                          color: '#333333',
                          fontSize: '14px',
                          marginBottom: '8px',
                        }}
                      >
                        {billingAddress}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowBillingAddress(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--secondary)',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowBillingAddress(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--secondary)',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      + Add Billing Address
                    </button>
                  )}

                  <h3
                    className="font-semibold mt-8 mb-4"
                    style={{
                      color: '#666666',
                      fontSize: '12px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    SHIPPING ADDRESS
                  </h3>
                  <p style={{ color: '#666666' }}>
                    {selectedCustomer && customerEntryDetails
                      ? `${customerEntryDetails.addressLine1},
                       ${customerEntryDetails.addressLine2},
                       ${customerEntryDetails.pincode},
                       ${customerEntryDetails.city},
                       ${customerEntryDetails.state},
                       ${customerEntryDetails.country}`
                      : 'Select customer to add Shipping Address'}
                  </p>
                </Col>
              </Row>

              <InvoiceItems
                invoiceId={invoiceId}
                items={itemsData?.[0]?.data?.data || []}
                selectedItems={invoiceItems}
                onItemsChange={setInvoiceItems}
                onTotalChange={handleTotalUpdate}
                invoiceStatus={invoiceStatus}
                errors={errors}
                clearErrors={clearErrors}
                onUpdateInvoiceItemPrice={handleUpdateInvoiceItemPrice}
              />

              <Divider style={{ borderColor: '#E0E0E0', margin: '32px 0' }} />

              <div className="mt-8">
                <div className="flex justify-between items-center text-xl font-semibold mb-2">
                  <span style={{ color: '#333333' }}>Total Amount</span>
                  <span style={{ color: 'var(--primary)' }}>
                    ₹
                    {(totalAmount || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <p style={{ color: '#666666' }}>
                  {numberToWords(totalAmount || 0)}{' '}
                  {totalAmount && totalAmount > 1
                    ? 'Rupees only'
                    : 'Rupee only'}
                </p>
              </div>

              <Divider style={{ borderColor: '#E0E0E0', margin: '32px 0' }} />

              <div className="mt-8 space-y-4">
                <div>
                  <h3
                    className="font-semibold mb-2"
                    style={{
                      color: '#666666',
                      fontSize: '12px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    CUSTOMER NOTES
                  </h3>
                  <TextArea
                    placeholder="Add Customer Notes"
                    rows={3}
                    value={values.customerNotes}
                    onChange={(e) => setValue('customerNotes', e.target.value)}
                    onBlur={() => trigger('customerNotes')}
                    status={errors.customerNotes ? 'error' : undefined}
                    style={{
                      backgroundColor: '#FAFAFA',
                      borderColor: errors.customerNotes ? '#D51C44' : '#D0D0D0',
                      color: '#333333',
                    }}
                  />
                  {errors.customerNotes && (
                    <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                      {errors.customerNotes.message}
                    </div>
                  )}
                </div>
                <div>
                  <h3
                    className="font-semibold mb-2"
                    style={{
                      color: '#666666',
                      fontSize: '12px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    TERMS AND CONDITIONS
                  </h3>
                  <TextArea
                    placeholder="Add Terms and Conditions"
                    rows={3}
                    value={values.termsAndServices}
                    onChange={(e) =>
                      setValue('termsAndServices', e.target.value)
                    }
                    onBlur={() => trigger('termsAndServices')}
                    status={errors.termsAndServices ? 'error' : undefined}
                    style={{
                      backgroundColor: '#FAFAFA',
                      borderColor: errors.termsAndServices
                        ? '#D51C44'
                        : '#D0D0D0',
                      color: '#333333',
                    }}
                  />
                  {errors.termsAndServices && (
                    <div className="text-sm mt-1" style={{ color: '#D51C44' }}>
                      {errors.termsAndServices.message}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </Col>

        <Col span={8}>
          <div className="space-y-4">
            {invoiceStatus === INVOICE_STATUS.DRAFT ? (
              <>
                <Button
                  size="large"
                  icon={<CheckOutlined />}
                  onClick={handleFinalizeAndIssue}
                  style={{
                    width: '100%',
                    background: 'var(--cta-gradient)',
                    border: 'none',
                    color: 'var(--background)',
                    fontWeight: 600,
                    height: '48px',
                  }}
                >
                  Finalize and Issue
                </Button>

                <Button
                  size="large"
                  icon={<SaveOutlined />}
                  onClick={handleSaveInvoice}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    borderColor: '#D0D0D0',
                    color: '#333333',
                    fontWeight: 600,
                    height: '48px',
                  }}
                >
                  Save Invoice
                </Button>

                <Button
                  size="large"
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteInvoice}
                  style={{
                    width: '100%',
                    background: '#DC3545',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    height: '48px',
                  }}
                >
                  Delete Invoice
                </Button>
              </>
            ) : null}

            <div
              style={{
                background: 'var(--cta-gradient)',
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
                bodyStyle={{ padding: '24px' }}
              >
                <h3
                  className="font-semibold mb-4"
                  style={{
                    color: '#666666',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                  }}
                >
                  SETTINGS
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: '#333333', fontSize: '14px' }}
                      >
                        Create GST Enabled Invoices
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: '#666666', fontSize: '12px' }}
                      >
                        Add your GST number
                      </div>
                    </div>
                    <Switch
                      checked={values.gstEnabled}
                      onChange={(checked) => setValue('gstEnabled', checked)}
                      style={{
                        backgroundColor: values.gstEnabled
                          ? 'var(--primary)'
                          : '#D0D0D0',
                      }}
                    />
                  </div>

                  <Divider
                    style={{ borderColor: '#E0E0E0', margin: '16px 0' }}
                  />

                  <div className="flex justify-between items-center">
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: '#333333', fontSize: '14px' }}
                      >
                        Enable Partial Payments
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: '#666666', fontSize: '12px' }}
                      >
                        Allow accepting multiple payments
                      </div>
                    </div>
                    <Switch
                      checked={values.partialPayments}
                      onChange={(checked) =>
                        setValue('partialPayments', checked)
                      }
                      style={{
                        backgroundColor: values.partialPayments
                          ? 'var(--primary)'
                          : '#D0D0D0',
                      }}
                    />
                  </div>

                  <Divider
                    style={{ borderColor: '#E0E0E0', margin: '16px 0' }}
                  />

                  <div className="flex justify-between items-center">
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: '#333333', fontSize: '14px' }}
                      >
                        Include bank account on invoice
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: '#666666', fontSize: '12px' }}
                      >
                        Show {tenantConfig.name} bank details for offline payment
                      </div>
                    </div>
                    <Switch
                      checked={values.includeBankDetails}
                      onChange={(checked) =>
                        setValue('includeBankDetails', checked)
                      }
                      style={{
                        backgroundColor: values.includeBankDetails
                          ? 'var(--primary)'
                          : '#D0D0D0',
                      }}
                    />
                  </div>

                  <Divider
                    style={{ borderColor: '#E0E0E0', margin: '16px 0' }}
                  />

                  <div className="flex justify-between items-center">
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: '#333333', fontSize: '14px' }}
                      >
                        Change Invoice Label
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: '#666666', fontSize: '12px' }}
                      >
                        Invoices will be issued under this label
                      </div>
                    </div>
                    <Button
                      type="text"
                      icon={<RightOutlined />}
                      style={{ color: '#666666' }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Col>
      </Row>

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSubmit={(data) => handleCreateCustomer(data as ICustomerDetails)}
      />

      <EditCustomerModal
        isOpen={isEditCustomerModalOpen}
        onClose={() => setIsEditCustomerModalOpen(false)}
        customer={customerEntryDetails}
        onUpdate={handleUpdateCustomer}
      />

      {showBillingAddress && (
        <BillingAddressModal
          isOpen={showBillingAddress}
          onClose={() => setShowBillingAddress(false)}
          onSubmit={handleBillingAddressSubmit}
          initialAddress={billingAddress || undefined}
        />
      )}
    </div>
  );
}
