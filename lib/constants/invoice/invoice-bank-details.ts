export const INVOICE_BANK_DETAILS = {
  accountName: 'Rupeeflow Finance PVT, Ltd.',
  accountNumber: '1712020000000167',
  ifsc: 'UTKS0001712',
  bankName: 'Utkarsh Small Finance Bank',
} as const;

export function invoiceBankDetailsHtml(inline = false): string {
  const { accountName, accountNumber, ifsc, bankName } = INVOICE_BANK_DETAILS;
  return `
    <div class="bank-details-box${inline ? ' bank-details-inline' : ''}">
      <h4>Bank Account Details</h4>
      <p><strong>Name:</strong> ${accountName}</p>
      <p><strong>A/c No:</strong> ${accountNumber}</p>
      <p><strong>IFSC:</strong> ${ifsc}</p>
      <p><strong>Bank:</strong> ${bankName}</p>
    </div>
  `;
}
