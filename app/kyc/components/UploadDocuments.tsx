'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Trash2, Upload } from 'lucide-react';
import { useKycStore } from '../store/useKycStore';
import { CustomButton } from '@/lib/components/ButtonComponent/CustomButton';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { useDocumentUpload } from '@/lib/hooks/use-document-upload';
import {
  kycService,
  DocumentType as KycDocumentType,
} from '@/lib/services/kyc.service';

interface DocumentType {
  key: KycDocumentType;
  label: string;
}

const documentTypes: DocumentType[] = [
  { key: 'bankStatement', label: 'BANK STATEMENT' },
  { key: 'addressProof', label: 'ADDRESS PROOF' },
  { key: 'moa', label: 'MEMORANDUM OF ASSOCIATION (MOA)' },
  { key: 'aoa', label: 'ARTICLES OF ASSOCIATION (AOA)' },
  { key: 'coi', label: 'Certificate of Incorporation' },
  { key: 'gstinCertificate', label: 'GSTIN CERTIFICATE' },
  { key: 'companyPan', label: 'COMPANY PAN CARD' },
  { key: 'companyCheque', label: 'CANCELLED CHEQUE (COMPANY)' },
];

export default function UploadDocuments() {
  const {
    setDocuments,
    documents,
    personalInfo,
    businessStructure,
    kybData,
  } = useKycStore();
  const router = useRouter();
  const { showToast } = useToast();

  const { uploadState, uploadDocument } = useDocumentUpload(
    (documentType: KycDocumentType, s3Url: string, preview: string | null) => {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: {
          preview: preview || '',
          s3Url,
          docType: documentType,
        },
      }));
    },
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], type: KycDocumentType) => {
      const file = acceptedFiles[0];
      if (file) {
        uploadDocument(file, type);
      }
    },
    [uploadDocument],
  );

  const handleDelete = (docType: KycDocumentType) => {
    // Revoke the object URL before deleting the document
    if (uploadState[docType]?.preview) {
      URL.revokeObjectURL(uploadState[docType].preview!);
    }

    setDocuments((prev) => {
      const newDocs = { ...prev };
      if (docType in newDocs) {
        delete newDocs[docType];
      }
      return newDocs;
    });

    if (uploadState[docType]) {
      uploadState[docType] = {
        loading: false,
        preview: null,
        error: null,
        fileType: '',
      };
    }

    showToast('Document deleted successfully', 'success');
  };

  const validateDocuments = () => {
    const requiredDocs: KycDocumentType[] = [
      // 'panCard',
      // 'aadharNumber',
      'bankStatement',
      'addressProof',
      'moa',
      'aoa',
      'coi',
      'gstinCertificate',
      'companyPan',
      'companyCheque',
    ];
    const missingDocs = requiredDocs.filter((doc) => !documents[doc]?.s3Url);

    if (missingDocs.length > 0) {
      showToast(
        `Please upload required documents: ${missingDocs.join(', ')}`,
        'error',
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateDocuments()) {
      return;
    }

    try {
      const formattedDocuments = Object.entries(documents).reduce(
        (acc, [key, doc]) => {
          if (doc.s3Url) {
            acc[key as KycDocumentType] = {
              url: doc.s3Url,
              docType: doc.docType,
              name: `${key}_${Date.now()}`,
            };
          }
          return acc;
        },
        {} as Record<
          KycDocumentType,
          { url: string; docType: string; name: string }
        >,
      );

      const response = await kycService.submitKyc({
        documents: formattedDocuments,
        personalInfo,
        kybInfo: kybData,
        businessStructure,
      });

      if (response.message) {
        showToast('KYC submitted successfully', 'success');
        router.push('/pending-approval');
      } else {
        throw new Error(response.message || 'Failed to submit KYC');
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to submit KYC',
        'error',
      );
    }
  };

  const handleSendLater = () => {
    if (!validateDocuments()) {
      return;
    }

    // Data is already saved in the store (persisted), so we just need to show a message
    showToast(
      'KYC data saved. You can submit it later from this page.',
      'success',
    );
    // Optionally, you could add a flag to indicate it's saved but not submitted
    // For now, the data persists in localStorage via the store
  };

  const getDropzone = (type: DocumentType['key']) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (files) => onDrop(files, type),
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png'],
        'application/pdf': ['.pdf'],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
      multiple: false,
    });

    return { getRootProps, getInputProps };
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentTypes.map((docType) => {
          const { getRootProps, getInputProps } = getDropzone(docType.key);
          const docState = uploadState[docType.key];
          const doc = documents[docType.key];

          return (
            <div key={docType.key} className="p-4 border rounded-lg bg-white">
              <h3 className="text-lg font-semibold mb-2">{docType.label}</h3>

              {doc?.preview ? (
                <div className="relative">
                  {docState?.fileType === 'application/pdf' ? (
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      <embed
                        src={doc.preview}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                      />
                    </div>
                  ) : (
                    <Image
                      src={doc.preview}
                      alt={docType.label}
                      width={300}
                      height={200}
                      className="object-cover rounded"
                      unoptimized
                    />
                  )}
                  <CustomButton
                    type="default"
                    onPress={() => handleDelete(docType.key)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </CustomButton>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[var(--primary)] transition-colors"
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {docState?.loading
                      ? 'Uploading...'
                      : 'Drag & drop or click to upload'}
                  </p>
                  {docState?.error && (
                    <p className="mt-2 text-sm text-red-500">
                      {docState.error}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-4">
        <CustomButton
          type="default"
          className="px-6 py-2 rounded-lg font-semibold transition-all"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
          onClick={handleSendLater}
        >
          Send Later
        </CustomButton>
        <CustomButton
          type="default"
          className="px-6 py-2 text-white rounded-lg font-semibold transition-all"
          style={{
            background: 'var(--cta-gradient)',
            border: 'none',
          }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
          }
          htmlType="submit"
        >
          Submit KYC
        </CustomButton>
      </div>
    </form>
  );
}
