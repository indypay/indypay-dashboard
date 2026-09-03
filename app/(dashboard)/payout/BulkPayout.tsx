import React, { useState } from 'react';
import { Modal, ModalContent, Progress } from '@heroui/react';
import { Alert } from '@heroui/react';
import {
  Upload,
  FileText,
  X,
  AlertCircleIcon,
  CheckCircle,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { IManualPayout, ManualPayout } from '@/lib/interfaces/payout.interface';
import { safeAny } from '@/lib/interfaces/global.interface';
import { postManualPayout } from '@/lib/hooks/use-manual-payout';
import { CustomButton } from '@/lib/components/ButtonComponent/CustomButton';

interface BulkPayoutProps {
  onClose: () => void;
  refetch: () => Promise<safeAny>;
}

const BulkPayout: React.FC<BulkPayoutProps> = ({ onClose, refetch }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { mutateAsync } = postManualPayout();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const getUploadStatusColor = (progress: number) => {
    if (progress === 0) return 'default';
    if (progress < 50) return 'warning';
    if (progress < 100) return 'primary';
    return 'success';
  };

  const getUploadStatusText = (progress: number) => {
    if (progress === 0) return '';
    if (progress <= 25) return 'Validating file...';
    if (progress <= 50) return 'Processing data...';
    if (progress <= 75) return 'Uploading...';
    if (progress < 100) return 'Almost done...';
    return 'Upload complete!';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile?.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload only XLSX files');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (
        uploadedFile.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        setFile(uploadedFile);
        setError(null);
      } else {
        setError('Please upload only XLSX files');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    setIsLoading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setProgress(25);
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setProgress(50);
        const transformedData = (jsonData as IManualPayout[]).map((item) => ({
          amount: item.amount,
          purpose: item.purpose,
          beneficiaryName: item.beneficiaryName,
          accountNumber: String(item.accountNumber),
          ifscCode: String(item.ifscCode),
          remarks: item.remarks,
          bankName: item.bankName,
          paymentMode: item.paymentMode || 'IMPS',
          payoutId: item.payoutId,
          beneficiaryMobile: item.beneficiaryMobile,
        }));
        const payoutData: ManualPayout = { data: transformedData };
        setProgress(75);
        const [success, error] = await mutateAsync(payoutData);
        setProgress(100);

        if (success) {
          showToast('Manual Payout Created Successfully', 'success');
          setTimeout(() => {
            onClose();
          }, 1000);
          await refetch();
        } else {
          throw new Error(error.message || 'Something went wrong');
        }
      } catch (e: safeAny) {
        setError(e?.message || 'Something went wrong');
        showToast(e?.message || 'Something went wrong', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      const response = await fetch('/Bulk-Payout-Example.xlsx');
      if (!response.ok) throw new Error('Template download failed');

      const reader = response.body?.getReader();
      const contentLength = Number(response.headers.get('Content-Length')) || 0;
      let receivedLength = 0;
      const chunks = [];

      while (true && reader) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        const progress = (receivedLength / contentLength) * 100;
        setDownloadProgress(Math.round(progress));
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Bulk-Payout-Example.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('Template downloaded successfully', 'success');
      setTimeout(() => {
        setDownloadProgress(0);
        setIsDownloading(false);
      }, 1000);
    } catch (err) {
      console.error('Download error:', err);
      showToast('Failed to download template. Please try again.', 'error');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <Modal
      size="2xl"
      isOpen={true}
      isDismissable={!isLoading}
      isKeyboardDismissDisabled={isLoading}
      hideCloseButton={true}
      onClose={onClose}
    >
      <ModalContent className="bg-white p-6 w-full max-w-2xl mx-auto">
        <div className="relative pb-4">
          {!isLoading && (
            <button
              onClick={onClose}
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          )}

          <h2 className="text-3xl font-bold text-purple-800 text-center mb-6">
            Bulk Payout Upload
          </h2>

          <div className="flex flex-col items-center space-y-6">
            <div
              className={`border-dashed border-2 ${
                isDragging
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300'
              } rounded-lg p-8 w-full transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <FileText size={40} className="text-purple-600 mb-4" />
                <p className="text-lg mb-2">
                  {isDragging
                    ? 'Drop your file here'
                    : 'Drag and Drop your XLSX file here'}
                </p>
                <p className="text-sm text-gray-500">
                  or <span className="text-purple-600 font-medium">browse</span>{' '}
                  to choose a file
                </p>
                {file && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-md flex items-center">
                    <FileText size={20} className="text-purple-600 mr-2" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                )}
              </label>
            </div>

            {error && (
              <Alert variant="solid" description={error}>
                <AlertCircleIcon className="h-4 w-4" />
                <div>{error}</div>
              </Alert>
            )}

            <div className="bg-gray-50 p-6 rounded-lg w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Download Template
                  </h3>
                  <p className="text-sm text-gray-600">
                    Use our template as a starting point for your bulk payout
                    file
                  </p>
                </div>
                <CustomButton
                  className="bg-white border border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={handleDownloadTemplate}
                  startContent={<FileText size={18} />}
                  disabled={isLoading}
                >
                  Download Template
                </CustomButton>
              </div>
            </div>

            {isLoading && (
              <div className="w-full space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {getUploadStatusText(progress)}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {progress}%
                  </span>
                </div>
                <Progress
                  value={progress}
                  color={getUploadStatusColor(progress)}
                  className="w-full h-2"
                  showValueLabel={false}
                />
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {progress === 100 && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            )}

            <CustomButton
              className="bg-purple-600 text-white w-full max-w-md"
              onClick={handleUpload}
              startContent={<Upload size={18} />}
              disabled={!file || isLoading}
              isLoading={isLoading}
            >
              {isLoading ? 'Processing...' : 'Upload File'}
            </CustomButton>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default BulkPayout;
