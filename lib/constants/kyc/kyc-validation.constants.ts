/**
 * KYC Validation Constants
 * Client-side format validation before hitting Karza/GST/MCA APIs
 */

// ─── Regex Patterns ───────────────────────────────────────────────────────────

/** PAN: 5 uppercase letters + 4 digits + 1 uppercase letter (e.g. ABCDE1234F) */
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/** Aadhaar: 12 digits, first digit 2-9 (Govt. specification) */
export const AADHAAR_REGEX = /^[2-9]{1}[0-9]{11}$/;

/** GSTIN: 15-character Goods & Services Tax Identification Number */
export const GST_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/** CIN: Corporate Identification Number (L/U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits) */
export const CIN_REGEX = /^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

/** IFSC: 4 letters + 0 + 6 alphanumeric */
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

/** Bank Account: 9–18 digits */
export const BANK_ACCOUNT_REGEX = /^[0-9]{9,18}$/;

/** 6-digit OTP */
export const OTP_REGEX = /^[0-9]{6}$/;

/** Indian mobile: 10 digits, starts with 6–9 */
export const INDIAN_MOBILE_REGEX = /^[6-9][0-9]{9}$/;

// ─── Validation Helpers ────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validateIndianMobile(mobile: string): ValidationResult {
  const clean = mobile.replace(/\D/g, '');
  if (!clean) return { valid: false, message: 'Mobile number is required' };
  if (!INDIAN_MOBILE_REGEX.test(clean))
    return {
      valid: false,
      message: 'Enter a valid 10-digit Indian mobile number',
    };
  return { valid: true, message: '' };
}

export function validatePAN(pan: string): ValidationResult {
  if (!pan) return { valid: false, message: 'PAN number is required' };
  const upper = pan.toUpperCase();
  if (upper.length !== 10)
    return { valid: false, message: 'PAN must be exactly 10 characters' };
  if (!PAN_REGEX.test(upper))
    return {
      valid: false,
      message: 'Invalid PAN format — expected ABCDE1234F',
    };
  return { valid: true, message: 'Valid PAN format' };
}

export function validateAadhaar(aadhaar: string): ValidationResult {
  const clean = aadhaar.replace(/\s/g, '');
  if (!clean) return { valid: false, message: 'Aadhaar number is required' };
  if (!/^[0-9]+$/.test(clean))
    return { valid: false, message: 'Aadhaar must contain only digits' };
  if (clean.length !== 12)
    return { valid: false, message: 'Aadhaar must be 12 digits' };
  if (!AADHAAR_REGEX.test(clean))
    return {
      valid: false,
      message: 'Invalid Aadhaar — first digit cannot be 0 or 1',
    };
  return { valid: true, message: 'Valid Aadhaar format' };
}

export function validateGST(gst: string): ValidationResult {
  if (!gst) return { valid: false, message: 'GST number is required' };
  const upper = gst.toUpperCase();
  if (upper.length !== 15)
    return { valid: false, message: 'GSTIN must be exactly 15 characters' };
  if (!GST_REGEX.test(upper))
    return {
      valid: false,
      message: 'Invalid GSTIN format (e.g. 29ABCDE1234F1Z5)',
    };
  return { valid: true, message: 'Valid GSTIN format' };
}

export function validateCIN(cin: string): ValidationResult {
  if (!cin)
    return { valid: false, message: 'CIN is required for Pvt Ltd companies' };
  const upper = cin.toUpperCase();
  if (!CIN_REGEX.test(upper))
    return {
      valid: false,
      message: 'Invalid CIN format (e.g. U64990KA2025PTC209485)',
    };
  return { valid: true, message: 'Valid CIN format' };
}

export function validateIFSC(ifsc: string): ValidationResult {
  if (!ifsc) return { valid: false, message: 'IFSC code is required' };
  const upper = ifsc.toUpperCase();
  if (upper.length !== 11)
    return { valid: false, message: 'IFSC must be 11 characters' };
  if (!IFSC_REGEX.test(upper))
    return { valid: false, message: 'Invalid IFSC format (e.g. HDFC0001234)' };
  return { valid: true, message: 'Valid IFSC format' };
}

export function validateBankAccount(account: string): ValidationResult {
  if (!account) return { valid: false, message: 'Account number is required' };
  if (!BANK_ACCOUNT_REGEX.test(account))
    return { valid: false, message: 'Account number must be 9–18 digits' };
  return { valid: true, message: 'Valid account number format' };
}

export function validateOTP(otp: string): ValidationResult {
  if (!otp) return { valid: false, message: 'OTP is required' };
  if (!OTP_REGEX.test(otp))
    return { valid: false, message: 'OTP must be exactly 6 digits' };
  return { valid: true, message: '' };
}

/** Single full name from PAN verify API (`name` or composed from name parts). */
export function panRecordFullName(parts: {
  name?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
}): string {
  const n = parts.name?.trim();
  if (n) return n;
  const segments = [parts.firstName, parts.middleName, parts.lastName]
    .map((s) => s?.trim())
    .filter((s): s is string => !!s && s.length > 0);
  return segments.join(' ');
}

function normalizeKycPersonName(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, ' ');
}

/**
 * Case- and whitespace-insensitive match; word order may differ
 * (e.g. "Test Name" vs "Name Test").
 */
export function kycEnteredNameMatchesPanRecord(
  enteredName: string,
  panRecordName: string,
): boolean {
  const a = normalizeKycPersonName(enteredName);
  const b = normalizeKycPersonName(panRecordName);
  if (!a || !b) return false;
  if (a === b) return true;
  const sorted = (s: string) => s.split(' ').filter(Boolean).sort().join(' ');
  return sorted(a) === sorted(b);
}

// ─── Formatter Helpers ─────────────────────────────────────────────────────────

/** Force uppercase + trim to 10 chars */
export function formatPAN(pan: string): string {
  return pan
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10);
}

/** Remove non-digits, limit to 12 */
export function formatAadhaar(aadhaar: string): string {
  return aadhaar.replace(/\D/g, '').slice(0, 12);
}

/** Mask Aadhaar for display: XXXX XXXX 4321 */
export function maskAadhaar(aadhaar: string): string {
  const clean = aadhaar.replace(/\s/g, '');
  if (clean.length !== 12) return aadhaar;
  return `XXXX XXXX ${clean.slice(8)}`;
}

/** Force uppercase + trim to 15 chars */
export function formatGST(gst: string): string {
  return gst
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 15);
}

/** Force uppercase + trim to 21 chars */
export function formatCIN(cin: string): string {
  return cin
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 21);
}

/** Force uppercase + trim to 11 chars */
export function formatIFSC(ifsc: string): string {
  return ifsc
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 11);
}

// ─── Business Type Constants ───────────────────────────────────────────────────
// Keys match BUSINESS_TYPES enum in RegisterForm.constants.ts:
//   PUBLIC_PRIVATE_LTD = 4, LLP = 6

/** Numeric BUSINESS_TYPES enum values that require CIN (MCA registration) */
export const CIN_REQUIRED_TYPES: number[] = [4, 6]; // PUBLIC_PRIVATE_LTD, LLP

/**
 * Returns true when the selected business type requires a CIN.
 * Accepts either the numeric enum value or its string representation.
 */
export function requiresCIN(businessType: string | number): boolean {
  const n =
    typeof businessType === 'string'
      ? parseInt(businessType, 10)
      : businessType;
  return !isNaN(n) && (CIN_REQUIRED_TYPES as number[]).includes(n);
}

/** Document sets per BUSINESS_TYPES enum value */
export const REQUIRED_DOCS_BY_TYPE: Record<number | string, string[]> = {
  4: [
    'bankStatement',
    'addressProof',
    'moa',
    'aoa',
    'coi',
    'gstinCertificate',
    'companyPan',
    'companyCheque',
  ], // Public/Private Ltd
  6: [
    'bankStatement',
    'addressProof',
    'coi',
    'gstinCertificate',
    'companyPan',
    'companyCheque',
  ], // LLP
  3: [
    'bankStatement',
    'addressProof',
    'gstinCertificate',
    'companyPan',
    'companyCheque',
  ], // Partnership
  2: ['bankStatement', 'addressProof', 'gstinCertificate'], // Sole Proprietorship
  1: ['bankStatement', 'addressProof', 'gstinCertificate'], // Individual
  default: [
    'bankStatement',
    'addressProof',
    'gstinCertificate',
    'companyPan',
    'companyCheque',
  ],
};

export function getRequiredDocs(businessType: string | number): string[] {
  const key =
    typeof businessType === 'string'
      ? parseInt(businessType, 10)
      : businessType;
  return REQUIRED_DOCS_BY_TYPE[key] ?? REQUIRED_DOCS_BY_TYPE.default;
}
