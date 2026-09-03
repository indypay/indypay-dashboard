import { Image } from '@heroui/react';
import { KYCDocument } from '@/lib/interfaces/users.interface';
import { DocumentInfo } from '@/app/kyc/store/useKycStore';

/** API returns a short-lived signed URL in `url`; `documentUrl` is the private S3 path. */
export function kycDocumentViewUrl(document: KYCDocument): string | undefined {
  return document.url?.trim() || document.documentUrl?.trim() || undefined;
}

function fileExt(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.split('?')[0]?.split('.').at(-1)?.toLowerCase();
}

export const DocComponent = ({
  document,
  compact,
}: {
  document: KYCDocument;
  compact?: boolean;
}) => {
  const src = kycDocumentViewUrl(document);
  const ext = fileExt(src);
  const previewHeight = compact ? '120px' : '550px';

  if (!src) {
    return (
      <div
        className="flex items-center justify-center text-xs text-gray-500"
        style={{ height: previewHeight }}
      >
        No preview
      </div>
    );
  }

  return (
    <>
      {ext === 'pdf' ? (
        <div
          className="bg-gray-100 flex items-center justify-center w-full"
          style={{ height: previewHeight }}
        >
          <embed
            src={src}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={document.documentType}
          className={
            compact
              ? 'object-cover mb-2 h-full w-full max-h-[120px]'
              : 'object-cover mb-2 h-auto w-dvw'
          }
        />
      )}
    </>
  );
};

export const DirectorDocComponent = ({
  document,
  compact,
}: {
  document: DocumentInfo;
  compact?: boolean;
}) => {
  const src = document?.s3Url?.trim();
  const ext = fileExt(src);
  const previewHeight = compact ? '120px' : '550px';

  if (!src) {
    return (
      <div
        className="flex items-center justify-center text-xs text-gray-500"
        style={{ height: previewHeight }}
      >
        No preview
      </div>
    );
  }

  return (
    <>
      {ext === 'pdf' ? (
        <div
          className="bg-gray-100 flex items-center justify-center w-full"
          style={{ height: previewHeight }}
        >
          <embed
            src={src}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={document.docType}
          className={
            compact
              ? 'object-cover mb-2 h-full w-full max-h-[120px]'
              : 'object-cover mb-2 h-auto w-dvw'
          }
        />
      )}
    </>
  );
};
