import { getAuthToken } from '@/lib/utils/auth';

interface UploadParams {
  fileName: string;
  fileType: string;
  folder?: string;
}

interface PresignedUrlResponse {
  url: string;
  fields: Record<string, string>;
}

export const getPresignedUrl = async ({
  fileName,
  fileType,
  folder = 'kyc',
}: UploadParams): Promise<PresignedUrlResponse> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DEV_PB_BASE_URL}/api/v1/kyc/document/presigned-url`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileName, fileType, folder }),
      credentials: 'include',
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Presigned URL Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });
    throw new Error('Failed to get presigned URL');
  }

  return response.json();
};

export const uploadToS3 = async (
  file: File,
  presignedData: PresignedUrlResponse,
): Promise<string> => {
  const formData = new FormData();
  Object.entries(presignedData.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);

  const uploadResponse = await fetch(presignedData.url, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    console.error('S3 Upload Error:', {
      status: uploadResponse.status,
      statusText: uploadResponse.statusText,
    });
    throw new Error('Failed to upload to S3');
  }

  const fileUrl = `${presignedData.url}/${presignedData.fields.key}`;
  return fileUrl;
};
