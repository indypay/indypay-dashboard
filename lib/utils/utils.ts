import { ulid } from 'ulid';
import dayjs from 'dayjs';
import { ACCOUNT_STATUS, INVOICE_STATUS, USERS_ROLE } from '../enum';
import { ONBOARDING_STATUS } from '../enum/index';
import { ChipProps } from '@heroui/react';

export const generateULID = (prefix = '') =>
  `${prefix ? prefix + '_' : ''}${ulid()}`;

export const formatAmount = (
  amount: number | string | undefined,
  currency = 'INR',
  float = 2,
) => {
  if (!amount || isNaN(parseFloat(amount.toString()))) {
    return '₹ 0.00';
  }

  const numericAmount = parseFloat(amount.toString());
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: float,
    maximumFractionDigits: float,
  }).format(numericAmount);

  return `₹ ${formattedNumber}`;
};

export const formatNumber = (amount: number | string | undefined) => {
  const parsedAmount =
    typeof amount === 'number' ? amount : parseFloat(amount || '0');

  if (isNaN(parsedAmount)) return '0';

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsedAmount);
};

export const isAdmin = (role: string) => {
  return [USERS_ROLE.ADMIN, USERS_ROLE.OWNER].includes(role as USERS_ROLE);
};

export const isSuperAdmin = (role: string) => {
  const roleLevel = parseInt(role) || 0;
  return [USERS_ROLE.OWNER].includes(role as USERS_ROLE) || roleLevel >= 6;
};

export const isMerchant = (role: string) => {
  return [USERS_ROLE.MERCHANT].includes(role as USERS_ROLE);
};

export const isOps = (role: string) => {
  return [USERS_ROLE.OPS].includes(role as USERS_ROLE);
};

export const isChannelPartner = (role: string) => {
  return [USERS_ROLE.CHANNEL_PARTNER].includes(role as USERS_ROLE);
};

export const viewOnlyAdmin = (role: string) => {
  return [USERS_ROLE.VIEW_ONLY_ADMIN].includes(role as USERS_ROLE);
};

export const getFormattedTime = (value?: Date | undefined) =>
  dayjs(value).format('DD MMM, YYYY hh:mm A');

export const formatStatus = (status: string | undefined) => {
  if (!status) return 'N/A';
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatColorStatus = (status: string) => {
  status = status.toUpperCase();

  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'FAILED':
      return 'danger';
    default:
      return 'primary';
  }
};

export const formatTransactionColorStatus = (
  status: string,
): ChipProps['color'] => {
  switch (status.toUpperCase()) {
    case 'SUCCESS':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'FAILED':
    case 'DENIED':
    case 'TAMPERED':
      return 'danger';
    case 'REFUNDED':
      return 'secondary';
    case 'DUPLICATE':
      return 'primary';
    default:
      return 'default';
  }
};

export const formatAccountStatus = (status: ACCOUNT_STATUS) => {
  switch (status) {
    case ACCOUNT_STATUS.ACTIVE:
      return 'Active';
    case ACCOUNT_STATUS.INACTIVE:
      return 'Inactive';
    case ACCOUNT_STATUS.SUSPENDED:
      return 'Suspended';
    case ACCOUNT_STATUS.BLOCKED:
      return 'Blocked';
    case ACCOUNT_STATUS.DELETED:
      return 'Deleted';
    case ACCOUNT_STATUS.TEST_DELETED:
      return 'Test Deleted';
  }
};

export const formatOnboardingStatus = (status: ONBOARDING_STATUS) => {
  switch (status) {
    case ONBOARDING_STATUS.NOT_STARTED:
      return { label: 'Not Started', color: 'primary' as ChipProps['color'] };
    case ONBOARDING_STATUS.SIGN_UP:
      return { label: 'Sign Up', color: 'default' as ChipProps['color'] };
    case ONBOARDING_STATUS.KYC_PENDING:
      return { label: 'KYC Pending', color: 'danger' as ChipProps['color'] };
    case ONBOARDING_STATUS.KYC_ON_HOLD:
      return { label: 'KYC On Hold', color: 'warning' as ChipProps['color'] };
    case ONBOARDING_STATUS.KYC_REJECTED:
      return {
        label: 'KYC Rejected',
        color: 'danger' as ChipProps['color'],
      };
    case ONBOARDING_STATUS.KYC_VERIFIED:
      return {
        label: 'KYC Verified',
        color: 'success' as ChipProps['color'],
      };
  }
};

export const formatRole = (role: string) => {
  switch (role) {
    case USERS_ROLE.MERCHANT:
      return 'Merchant';
    case USERS_ROLE.CHANNEL_PARTNER:
      return 'Channel Partner';
    case USERS_ROLE.OPS:
      return 'Operations';
    case USERS_ROLE.ADMIN:
      return 'Admin';
    case USERS_ROLE.OWNER:
      return 'Owner';
  }
};

export const formatInvoiceStatus = (status: INVOICE_STATUS): string => {
  switch (status) {
    case INVOICE_STATUS.DRAFT:
      return 'Draft';
    case INVOICE_STATUS.SENT:
      return 'Sent';
    case INVOICE_STATUS.FAILED:
      return 'Failed';
    case INVOICE_STATUS.VIEWED:
      return 'Viewed';
    case INVOICE_STATUS.PAID:
      return 'Paid';
    case INVOICE_STATUS.OVERDUE:
      return 'Overdue';
    case INVOICE_STATUS.CANCELLED:
      return 'Cancelled';
    default:
      return 'Draft';
  }
};
export const toWords = (number: number) => {
  if (number == 0) {
    return 'Zero';
  }

  const belowTwenty = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  const tens = [
    ' ',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const thousands = ['', 'thousand', 'million', 'billion', 'trillion'];

  function helper(n: number): string {
    if (n === 0) return '';
    if (n < 20) return belowTwenty[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
    return belowTwenty[Math.floor(n / 100)] + ' hundred ' + helper(n % 100);
  }

  let result = '';
  let groupIndex = 0;

  while (number > 0) {
    if (number % 1000 !== 0) {
      result = helper(number % 1000) + thousands[groupIndex] + ' ' + result;
    }
    number = Math.floor(number / 1000);
    groupIndex++;
  }

  return result.trim();
};
export const numberToWords = (number: number) => {
  return toWords(number);
};

export const calculateOriginalAmountFromNetPayable = ({
  netPayableAmount,
  commissionInPercentage,
  gstInPercentage,
}: {
  netPayableAmount: number;
  commissionInPercentage: number;
  gstInPercentage: number;
}) => {
  const commissionRate = commissionInPercentage / 100;
  const gstRate = (commissionRate * gstInPercentage) / 100;

  const totalDeductionRate = commissionRate + gstRate;

  if (totalDeductionRate >= 1) {
    throw new Error(
      'Invalid rates: Total deduction cannot be equal or greater than 1.',
    );
  }

  const originalAmount = netPayableAmount / (1 - totalDeductionRate);
  return originalAmount;
};

export const getTagStyle = (status: string): React.CSSProperties => {
  const colorStatus = formatColorStatus(status);
  const colorMap: Record<string, { bg: string; text: string; border: string }> =
    {
      success: { bg: '#0DD25F15', text: '#0DD25F', border: '#0DD25F40' },
      warning: { bg: '#F5A52415', text: '#F5A524', border: '#F5A52440' },
      danger: { bg: '#D51C4415', text: '#D51C44', border: '#D51C4440' },
      default: { bg: '#30F3BC15', text: '#30F3BC', border: '#30F3BC40' },
    };
  const colors = colorMap[colorStatus] || colorMap.default;
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    padding: '4px 12px',
    fontWeight: 500,
  };
};

/**
 * Decode HTML entities so that e.g. "&lt;b&gt;hi&lt;/b&gt;" becomes "<b>hi</b>".
 * Use when the backend returns escaped HTML and you need to render it as real HTML (bold, italic, etc.).
 */
export function decodeHtmlEntities(html: string): string {
  if (!html || typeof html !== 'string') return html;
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  }
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}
