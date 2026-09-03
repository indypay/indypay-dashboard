/** Custom field for checkout page (API shape) */
export interface CheckoutPageCustomField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select';
  required: boolean;
  /** Options list — only when type = 'select' */
  options?: string[];
}

/** Create/Update request body */
export interface CheckoutPagePayload {
  name?: string;
  logoUrl?: string;
  title: string;
  /** HTML string for bold, italic, lists, etc. Rendered as-is when viewing the page. */
  pageDescription?: string;
  /** Brand hex colour for the pay button, header accent, and links. E.g. "#6366F1" */
  primaryColor?: string;
  /** Label on the primary pay button. E.g. "Pay Now", "Donate", "Subscribe". */
  buttonText?: string;
  contactMobile?: string;
  contactEmail?: string;
  termsAndConditions?: string;
  amountType: 'USER_ENTERED' | 'FIXED';
  fixedAmount?: number | null;
  /** Minimum amount customer can enter (USER_ENTERED only). */
  minimumAmount?: number | null;
  /** When true, checkout form collects a delivery address. */
  collectAddress?: boolean;
  customFields?: CheckoutPageCustomField[];
  /** Redirect URL after a successful payment. */
  successRedirectUrl?: string | null;
  /** Redirect URL after a failed or cancelled payment. */
  failureRedirectUrl?: string | null;
  /** Custom thank-you message shown on success screen (when successRedirectUrl is not set). */
  successMessage?: string | null;
  status?: 'DRAFT' | 'PUBLISHED';
}

/** Single checkout page (API response item / get by id) */
export interface CheckoutPageRecord {
  id: string;
  name?: string;
  logoUrl?: string;
  title: string;
  pageDescription?: string;
  primaryColor?: string;
  buttonText?: string;
  contactMobile?: string;
  contactEmail?: string;
  termsAndConditions?: string;
  amountType: 'USER_ENTERED' | 'FIXED';
  fixedAmount?: number | null;
  minimumAmount?: number | null;
  collectAddress?: boolean;
  customFields?: CheckoutPageCustomField[];
  successRedirectUrl?: string | null;
  failureRedirectUrl?: string | null;
  successMessage?: string | null;
  status: string;
  /** Shareable page URL returned after publish. */
  pageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** List response (paginated) */
export interface CheckoutPagesListResponse {
  data: CheckoutPageRecord[];
  pagination?: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
}
