import { INVOICE_BANK_DETAILS } from '@/lib/constants/invoice/invoice-bank-details';

type InvoiceBankDetailsProps = {
  /** Sits beside totals summary — no extra top margin */
  variant?: 'default' | 'inline';
};

export default function InvoiceBankDetails({
  variant = 'default',
}: InvoiceBankDetailsProps) {
  const { accountName, accountNumber, ifsc, bankName } = INVOICE_BANK_DETAILS;
  const isInline = variant === 'inline';

  return (
    <div
      style={{
        marginTop: isInline ? 0 : 24,
        padding: isInline ? '12px 16px' : '16px 20px',
        background: '#F8FAF9',
        borderRadius: 8,
        border: '1px solid #E0E0E0',
        height: isInline ? '100%' : undefined,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: '#999999',
          fontWeight: 600,
          letterSpacing: '0.5px',
          marginBottom: 12,
        }}
      >
        BANK ACCOUNT DETAILS
      </div>
      <div
        style={{
          fontSize: isInline ? 13 : 14,
          color: '#333333',
          lineHeight: 1.7,
        }}
      >
        <div>
          <strong>Name:</strong> {accountName}
        </div>
        <div>
          <strong>A/c No:</strong> {accountNumber}
        </div>
        <div>
          <strong>IFSC:</strong> {ifsc}
        </div>
        <div>
          <strong>Bank:</strong> {bankName}
        </div>
      </div>
    </div>
  );
}
