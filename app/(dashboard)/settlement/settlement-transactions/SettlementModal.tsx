import { ISettlementData } from '@/lib/interfaces/settlement.interface';
import {
  formatColorStatus,
  formatNumber,
  formatStatus,
  getFormattedTime,
} from '@/lib/utils/utils';
import { Button } from '@heroui/button';

interface SettlementModalProps {
  rowData: ISettlementData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SettlementModal = ({
  rowData,
  isOpen,
  onClose,
}: SettlementModalProps) => {
  if (!isOpen || !rowData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border border-gray-300">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-700">
            Settlement Receipt
          </h2>
          <p className="text-sm text-gray-500">Transaction Summary</p>
        </div>

        {/* Receipt Body */}
        <div className="border border-gray-300 rounded-md p-4">
          <div className="mb-2">
            <p className="text-gray-600 text-sm">Transaction ID:</p>
            <p className="font-mono text-lg font-semibold">
              {rowData.transferId || '-'}
            </p>
          </div>

          <div className="mb-2">
            <p className="text-gray-600 text-sm">Amount:</p>
            <p className="font-mono text-lg font-bold text-green-600">
              INR {formatNumber(rowData.amountAfterDeduction)}
            </p>
          </div>

          <hr className="my-2 border-gray-300" />

          <div className="text-sm">
            <p>
              <strong>Beneficiary Name:</strong>{' '}
              {rowData.bankDetails?.name || '-'}
            </p>
            <p>
              <strong>Bank Name:</strong> {rowData.bankDetails?.bankName || '-'}
            </p>
            <p>
              <strong>Account Number:</strong>{' '}
              {rowData.bankDetails?.accountNumber || '-'}
            </p>
            <p>
              <strong>IFSC Code:</strong> {rowData.bankDetails?.bankIFSC || '-'}
            </p>
          </div>

          <hr className="my-2 border-gray-300" />

          <div className="text-sm">
            <p>
              <strong>Transfer Mode:</strong> {rowData.transferMode || '-'}
            </p>
            <p>
              <strong>UTR:</strong> {rowData.utr || '-'}
            </p>
            <p>
              <strong>Status:</strong> {formatStatus(rowData.status) || '-'}
            </p>
            <p>
              <strong>Remarks:</strong> {rowData.remarks || '-'}
            </p>
          </div>

          <hr className="my-2 border-gray-300" />

          <div className="text-sm">
            <p>
              <strong>Date:</strong>{' '}
              {getFormattedTime(new Date(rowData.createdAt)) || '-'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between">
          <Button
            // className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Close
          </Button>

          <Button
            variant="solid"
            className="bg-purple-600 text-white"
            onClick={() => window.print()} // Print feature
          >
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};
