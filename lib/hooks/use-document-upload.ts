import { useState, useEffect } from 'react';

import { kycService } from '../services/kyc.service';

import { useToast } from '@/lib/components/Toast/ToastContext';

type DocumentType =
  | 'panCard'
  | 'aadharNumber'
  | 'bankStatement'
  | 'addressProof'
  | 'moa'
  | 'aoa'
  | 'coi'
  | 'gstinCertificate'
  | 'companyPan'
  | 'companyCheque';

interface UploadState {
  [key: string]: {
    loading: boolean;
    preview: string | null;
    error: string | null;
    s3Url?: string;
    fileType: string;
  };
}

export const useDocumentUpload = (
  onUploadSuccess?: (
    documentType: DocumentType,
    s3Url: string,
    preview: string,
    directorId?: number,
  ) => void,
) => {
  const [uploadState, setUploadState] = useState<UploadState>({});
  const { showToast } = useToast();

  const uploadDocument = async (
    file: File,
    documentType: DocumentType,
    directorId?: number,
  ) => {
    let objectUrl: string | null = null;

    try {
      setUploadState((prev) => ({
        ...prev,
        [documentType]: {
          loading: true,
          preview: null,
          error: null,
          fileType: file.type,
        },
      }));

      // Create preview first
      objectUrl = URL.createObjectURL(file);

      // Set preview immediately so user can see the file
      setUploadState((prev) => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          preview: objectUrl,
          fileType: file.type,
        },
      }));

      // Get presigned URL
      const presignedData = await kycService.getPresignedUrl({
        fileName: file.name,
        fileType: file.type,
        documentType,
      });

      // Upload to S3
      const s3Url = await kycService.uploadToS3(file, presignedData);

      setUploadState((prev) => ({
        ...prev,
        [documentType]: {
          loading: false,
          preview: objectUrl,
          error: null,
          s3Url,
          fileType: file.type,
        },
      }));

      showToast(
        `${documentType
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase())} uploaded successfully`,
        'success',
      );

      if (onUploadSuccess) {
        onUploadSuccess(documentType, s3Url, objectUrl, directorId);
      }
    } catch (error) {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setUploadState((prev) => ({
        ...prev,
        [documentType]: {
          loading: false,
          preview: null,
          error: error instanceof Error ? error.message : 'Upload failed',
          fileType: '',
        },
      }));
      showToast(
        `Failed to upload ${documentType
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase())}`,
        'error',
      );
    }
  };

  // Cleanup function to revoke object URLs when component unmounts
  const cleanup = () => {
    Object.values(uploadState).forEach((state) => {
      if (state.preview) {
        URL.revokeObjectURL(state.preview);
      }
    });
  };

  // Use effect for cleanup
  useEffect(() => {
    return cleanup;
  }, []);

  return {
    uploadState,
    uploadDocument,
    cleanup,
  };
};
