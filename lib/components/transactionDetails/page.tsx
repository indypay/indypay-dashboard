import React, { useEffect, useState } from 'react';
import { Modal, ModalContent } from '@heroui/react';
import { CardHeader, Card, CardFooter, CardBody } from '@heroui/react';
import { UseQueryResult } from '@tanstack/react-query';
import { Skeleton } from '@heroui/react';

import { getMerchantCollectionByUserId } from '@/lib/hooks/use-collections';
import { MerchantDetailsRes } from '@/lib/interfaces/transactions.interface';
import { safeAny } from '@/lib/interfaces/global.interface';

const MerchantTransactionDetails = ({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) => {
  const [merchantDetails, setMerchantDetails] = useState<safeAny>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const merchantData = getMerchantCollectionByUserId(
    userId,
  ) as unknown as UseQueryResult<MerchantDetailsRes | null, Error>;

  useEffect(() => {
    if (merchantData?.data) {
      if (Array.isArray(merchantData.data) && merchantData.data.length > 0) {
        setMerchantDetails(merchantData.data[0].data || []);
      } else {
        setMerchantDetails([]);
      }
      setIsLoading(false);
    }
  }, [merchantData]);

  const {
    amount,
    createdAt,
    orderId,
    status,
    txnRefId,
    netPayableAmount,
    user,
  } = merchantDetails || {};

  const formatDate = (date: string) => {
    return new Date(date)
      .toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(',', '');
  };

  //   const checkAccountStatus = (status: string) => {
  //     if (status === '1') {
  //       return 'Active';
  //     } else if (status === '2') {
  //       return 'Inactive';
  //     } else if (status === '3') {
  //       return 'Suspended';
  //     } else if (status === '4') {
  //       return 'Blocked';
  //     } else if (status === '5') {
  //       return 'Deleted';
  //     } else if (status === '6') {
  //       return 'Pending';
  //     }
  //   };

  const InfoSection = ({
    title,
    data,
  }: {
    title: string;
    data: { label: string; value: string }[];
  }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-purple-800 mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index}>
            <p className="text-sm font-medium text-gray-500">
              {item.label || '-'}
            </p>
            <p className="text-lg text-gray-900">{item.value || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonSection = ({
    title,
    count,
  }: {
    title: string;
    count: number;
  }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <Skeleton className="w-1/3 h-6 mb-2" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(count)].map((_, index) => (
          <div key={index}>
            <Skeleton className="w-1/2 h-4 mb-1" />
            <Skeleton className="w-3/4 h-6" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      size="4xl"
      isOpen={true}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton={true}
      className="mb-2 w-full"
    >
      <ModalContent>
        <Card className="bg-white p-6 w-full max-w-4xl mx-auto">
          <CardHeader className="pb-4 border-b border-purple-300">
            <h2 className="text-3xl font-bold text-purple-800 text-center">
              {isLoading ? (
                <Skeleton className="w-3/4 h-8" />
              ) : (
                `Transaction Details ${txnRefId}`
              )}
            </h2>
          </CardHeader>
          <CardBody className="mt-6 space-y-6">
            {isLoading ? (
              <>
                <SkeletonSection title="User Information" count={4} />
                <SkeletonSection title="Payment Information" count={5} />
              </>
            ) : (
              <>
                {user && (
                  <InfoSection
                    title="User Information"
                    data={[
                      { label: 'Name', value: user.fullName },
                      { label: 'Email', value: user.email },
                      { label: 'Mobile', value: user.mobile },
                      {
                        label: 'Account Staus',
                        value:
                          user.accountStatus === 1
                            ? 'Active'
                            : user.accountStatus === 2
                              ? 'Inactive'
                              : user.accountStatus === 3
                                ? 'Suspended'
                                : user.accountStatus === 4
                                  ? 'Blocked'
                                  : user.accountStatus === 5
                                    ? 'Deleted'
                                    : user.accountStatus === 6
                                      ? 'Pending'
                                      : '-',
                      },
                    ]}
                  />
                )}
                <InfoSection
                  title="Payment Information"
                  data={[
                    {
                      label: 'Transaction created at',
                      value: formatDate(createdAt),
                    },
                    { label: 'Amount', value: amount },
                    { label: 'Order Id', value: orderId },
                    { label: 'Status', value: status },
                    { label: 'Net Payable Amount', value: netPayableAmount },
                  ]}
                />
              </>
            )}
          </CardBody>
          <CardFooter className="mt-6 pt-4 border-t border-purple-300">
            <button
              onClick={onClose}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </CardFooter>
        </Card>
      </ModalContent>
    </Modal>
  );
};

export default MerchantTransactionDetails;
