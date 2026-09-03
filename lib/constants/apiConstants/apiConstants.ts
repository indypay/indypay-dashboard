export const restrictedAPIs = [
  'api/v1/auth/admin/register',
  'api/v1/users/admin/secret',
  'api/v1/users/secret',
  'api/v1/transactions/admin',
  'api/v1/transactions/stats/admin',
  'api/v1/users/merchant/status',
  'api/v1/transactions/admin/merchant',
  'api/v1/transactions/admin',
  'api/v1/auth/admin/register',
  'api/v1/users/address/admin',
  'api/v1/users/whitelist-ips/admin',
  'api/v1/users/whitelist-ips/admin',
];

// Authentication
export const REGISTER_USER = 'api/v1/auth/admin/register';
export const LOGIN_USER = 'api/v1/auth/login';
export const REFRESH_TOKEN = 'api/v1/auth/refresh-token';
export const CHANGE_PASSWORD = 'api/v1/users/change-password';
export const LOGOUT_USER = 'api/v1/auth/logout';

// Users
export const USERS_PROFILE = 'api/v1/users/profile';
export const DELETE_USER = 'api/v1/users/secret';
export const VIEW_PROFILE = 'api/v1/users';

// Address
export const UPDATE_ADDRESS_ADMIN = 'api/v1/users/address/admin';
export const GET_ADDRESS_LIST = 'api/v1/users/address';
export const UPDATE_ADDRESS_MERCHANT = 'api/v1/users/address';
export const GET_MERCHANT_ADDRESS_LIST = 'api/v1/users/address';

// business details
export const ADD_MERCHNAT_BUSINESS_DETAILS = 'api/v1/users/business-details';

// Client id & client secret
export const ADMIN_GENERATE_SECRET_KEY = 'api/v1/users/admin/secret';
export const MERCHANT_GENERATE_SECRET_KEY = 'api/v1/users/secret';
export const DELETE_SECRET_KEY = 'api/v1/users/secret';

// Whitelist-api's
export const WHITELIST_API = '/api/v1/users/whitelist-ips';
export const GET_WHITELIST_IPS = '/api/v1/users/whitelist-ips';
export const DELETE_WHITELIST_IPS = '/api/v1/users/whitelist-ips/';

// Genrate webhopok urls
export const GENERATE_WEBHOOK_URL = 'api/v1/users/webhook-url';
export const GET_WEBHOOK_URL = 'api/v1/users/webhook-url';

//  Payment API'S
export const INITIATE_PAYIN_PAYMENT = 'api/v1/payments/payin/create';
export const INITIATE_PAYOUT_PAYMENT = 'api/v1/payments/payout/create';
export const GET_PAYIN_PAYMENT_STATUS = 'api/v1/payments/payin/status';

// Instant Payout API'S & Manual Payout API'S
export const INITIATE_PAYOUT = 'api/v1/payments/payout/dashboard';
export const CHECK_MANUAL_PAYOUT_STATUS = 'api/v1/payout/status';
export const GET_ALL_PAYOUT_BY_ADMIN = 'api/v1/payout/admin';
export const GET_ALL_PAYOUT_BY_MERCHANT = 'api/v1/payout/admin';
export const GET_ALL_PAYOUT_BY_CHANNEL_PARTNER = 'api/v1/payout/cp';
export const GET_PAYOUT_BY_MERCHANT = 'api/v1/payout';
export const GET_PAYOUT_BY_PAYOUT_ID = 'api/v1/payout/';
export const CHECK_PAYOUT_STATUS = 'api/v1/payments/payout/status/ruaanya';

// Payment Link API'S
export const GET_PAYMENT_LINKS = 'api/v1/payments/payment-link';
export const GET_PAYMENT_LINK_BY_ID = 'api/v1/payments/payment-link';
export const CREATE_PAYMENT_LINK_BACKEND =
  'api/v1/payments/payment-link/create';
export const CREATE_PAYMENT_LINK = '/api/v1/payment-links/create';
export const GET_PAYMENT_LINK_DETAILS = '/api/v1/payment-links';

// Checkout Pages API'S
export const CHECKOUT_PAGES = 'api/v1/payments/checkout-pages';
export const CHECKOUT_PAGES_BY_ID = 'api/v1/payments/checkout-pages';
export const CHECKOUT_PAGES_PUBLISH = 'api/v1/payments/checkout-pages';
export const CHECKOUT_PAGES_LOGO_UPLOAD_URL =
  'api/v1/payments/checkout-pages/logo-upload-url';
export const CHECKOUT_PAGES_PUBLIC = 'api/v1/payments/checkout-pages';
export const CHECKOUT_PAGES_PAY = 'api/v1/payments/checkout-pages';

// Transactions API'S
export const VIEW_TRANSACTIONS_ADMIN = 'api/v1/transactions/admin';
export const VIEW_TRANSACTIONS_MERCHANT = 'api/v1/transactions/merchant';
export const DOWNLOAD_MERCHANT_TRANSACTION_CSV =
  'api/v1/transactions/download-csv/merchant';
export const DOWNLOAD_ADMIN_TRANSACTION_CSV =
  'api/v1/transactions/download-csv/admin';

// STATS API'S
export const GET_STATS_ADMIN = 'api/v1/transactions/stats/admin';
export const GET_STATS_MERCHANT = 'api/v1/transactions/stats';
export const GET_STATS_CHANNEL_PARTNER = 'api/v1/cp/stats';

// Transaction's api for merchant
export const VALIDATE_API_KEY = 'api/v1/users/api-key';
export const VIEW_SPECIFIC_TRANSACTIONS_MERCHANT =
  'api/v1/transactions/admin/merchant';
export const ADMIN_TRANSACTION_DETAILS = 'api/v1/transactions/admin';
export const MERCHANT_TRANSACTION_DETAILS = 'api/v1/transactions/merchant';

// Transaction disputes (admin / merchant)
export const TRANSACTION_DISPUTES_ADMIN_BASE = 'api/v1/transactions/admin';
export const TRANSACTION_DISPUTES_MERCHANT_BASE =
  'api/v1/transactions/merchant';

// Collections API's

export const ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: ['*'], // Admin can access all APIs
  [ROLES.MERCHANT]: ['/merchant/*'], // Merchant can access only merchant APIs
};

// Collection Api's

export const GET_ALL_MERCHNAT_COLLECTIONS_STATS = 'api/v1/collections/admin';
export const GET_MERCHANT_COLLECTIONS_BY_ID = 'api/v1/collections/admin'; //userId
export const GET_MERCHANT_DETAILS_BY_ID = 'api/v1/collections/admin/payin'; //payInId
export const GET_ALL_MERCHANT_DETAILS = 'api/v1/collections';
export const GET_MERCHANT_TRANSACTIONS_BY_ID = 'api/v1/collections'; //userId
export const GET_CHANNEL_PARTNER_TRANSACTIONS = 'api/v1/cp/collections';
export const GET_CHANNEL_PARTNER_TRANSACTIONS_BY_ID =
  'api/v1/cp/collections/merchants';

// Manual Payout API's

export const INITIATE_SETTLEMENTS = 'api/v1/settlements/initiate';

// Settlements API's
export const GET_SETTLEMENTS_TRANSACTIONS = 'api/v1/settlements';
export const GET_SETTLEMENTS_STATS = 'api/v1/settlements/list';
export const CHECK_SETTLEMENT_STATUS = 'api/v1/settlements/status';

/** Bank CSV (OPS|ADMIN|OWNER). Full URL: {NEXT_PUBLIC_DEV_PB_BASE_URL}/api/settlements/bank-report/... */
export const SETTLEMENTS_BANK_REPORT_BASE = 'api/v1/settlements/bank-report';

// Settlements API's Channel Partner

export const GET_SETTLEMENTS_TRANSACTIONS_CHANNEL_PARTNER =
  'api/v1/cp/settlements';
export const CHECK_SETTLEMENT_STATUS_CHANNEL_PARTNER =
  'api/v1/cp/settlements/status';

// Bank Details API's

export const ADD_BANK_DETAILS = 'api/v1/banks';
export const GET_ALL_BANK_LIST = 'api/v1/banks';
export const BANK_DETAILS_BY_BANK_ID = 'api/v1/banks/details/';
export const GET_LIST_OF_BANK_DETAILS_BY_MERCHANT = '/api/v1/banks/{userId}';
export const DELETE_BANK_DETAILS = 'api/v1/banks/manage/{bankId}';

// Operations API's

export const GET_ALL_OPERATIONS_BY_MERCHANT = 'api/v1/users/merchants';
export const GET_OPERATIONS_STATS = 'api/v1/settlements/stats';
export const GET_UNSETTLED_COLLECTIONS = 'api/v1/settlements/unsettled';

// Channel Partner API's

export const GET_MERCHANT_LIST_CHANNEL_PARTNER = 'api/v1/cp/merchants';
export const GET_MERCHANT_LIST_ADMIN = 'api/v1/users/list';
export const GET_KYC_DETAILS = 'api/v1/kyc/documents';
export const GET_KYC_PENDING = 'api/v1/kyc/pending';
export const CHANGE_KYC_STATUS = 'api/v1/users/change-onboarding-status';
export const EDIT_COUNT = 'api/v1/users/count';

// Commission API's
export const COMMISSIONS_BASE = 'api/v1/commissions';
export const COMMISSIONS_USERS = 'api/v1/commissions/users';
export const COMMISSIONS_SLABS = 'api/v1/commissions/slabs';

// Multi Auth API's
export const ENABLE_MULTI_AUTH = '/api/v1/auth/2fa';
export const VERIFY_MULTI_AUTH = '/api/v1/auth/verify-2fa';
// Payout Wallet API's
export const GET_ALL_WALLET_LISTS = '/api/v1/wallets/admin/wallet-list';
export const GET_CHANNEL_PARTNER_WALLET_LISTS =
  '/api/v1/wallets/cp/wallet-list';
export const GET_WALLETS_DETAILS_BY_ID = '/api/v1/wallets/admin/wallet-list';
export const GET_MERCHANT_WALLET_LISTS = '/api/v1/wallets/merchant/wallet-list';
export const TOP_UP_WALLETS = '/api/v1/wallets/top-up';
export const REFUND_WALLETS = '/api/v1/wallets/refund';

// Payin reports API's
export const GET_PAYIN_REPORTS = '/api/v1/reports/payin';
export const GET_PAYOUT_REPORTS = '/api/v1/reports/payout';
export const GET_SETTLEMENT_REPORTS = '/api/v1/reports/settlements';

export const GET_DOWNLOAD_HISTORY = '/api/v1/reports/download-history';
export const GET_PAYIN_PAYOUT_REPORTS = '/api/v1/reports/payin-payout';
export const GET_COMBINED_REPORTS = '/api/v1/reports/combined';
export const GET_PAYMENT_LINK_REPORTS = '/api/v1/reports/payment-links';
export const GET_CHECKOUT_REPORTS = '/api/v1/reports/checkouts';
export const GET_CHECKOUT_PAGE_REPORTS = '/api/v1/reports/checkout-pages';
export const GET_INVOICE_REPORTS = '/api/v1/reports/invoices';
// Invoices API's
export const GET_ALL_CUSTOMERS_MERCHANT = 'api/v1/customers/list';
export const GET_ALL_CUSTOMERS_ADMIN = 'api/v1/customers/all';
export const ADD_CUSTOMER = 'api/v1/customers';
export const GET_CUSTOMER = 'api/v1/customers';
export const CREATE_INVOICE = 'api/v1/invoices/draft';
export const FINALIZE_INVOICE = 'api/v1/invoices/finalize';
export const GET_INVOICES = 'api/v1/invoices';
export const MARK_INVOICE_PAID = 'api/v1/invoices'; // PATCH /:id/mark-paid
export const SEND_INVOICE_REMINDER = 'api/v1/invoices'; // POST /:id/send-reminder
export const MARK_INVOICE_VIEWED = 'api/v1/invoices'; // POST /:id/viewed
export const UPDATE_INVOICE_ITEM_PRICE = 'api/v1/invoices'; // PATCH /:invoiceId/items/:invoiceItemId/price
export const GET_ITEMS = 'api/v1/items';
export const CREATE_ITEM = 'api/v1/items/create';

// Notifications API's
export const GET_NOTIFICATIONS = 'api/v1/notifications';
export const MARK_NOTIFICATION_AS_READ = 'api/v1/notifications/read';
export const MARK_ALL_NOTIFICATIONS_AS_READ = 'api/v1/notifications/read-all';
/** Admin: push / in-app broadcast to all users (BroadcastNotificationDto) */
export const BROADCAST_NOTIFICATION = 'api/v1/notifications/broadcast-active';

// Analytics Api's
// export const GET_BUSINESS_TRENDS = 'api/v1/transactions/stats';
// export const GET_BUSINESS_TRENDS_CHANNEL_PARTNER = 'api/v1/cp/stats';
export const GET_ANALYTICS_BUSINESS_TRENDS_ADMIN =
  '/api/v1/analytics/admin/business-trend';
export const GET_ANALYTICS_BUSINESS_TRENDS_CHANNEL_PARTNER =
  '/api/v1/cp/business-trend';
export const GET_ANALYTICS_BUSINESS_TRENDS_MERCHANT =
  '/api/v1/analytics/merchant/business-trend';
export const GET_ANALYTICS_ADMIN_CONVERSION_RATE =
  '/api/v1/analytics/admin/coversion-rate';
export const GET_ANALYTICS_CHANNEL_PARTNER_CONVERSION_RATE =
  '/api/v1/cp/conversion-rate';
export const GET_ANALYTICS_MERCHANT_CONVERSION_RATE =
  '/api/v1/analytics/merchant/conversion-rate';
export const GET_ANALYTICS_ADMIN_PAYMENT_FAILURE =
  '/api/v1/analytics/admin/failure';
export const GET_ANALYTICS_CHANNEL_PARTNER_PAYMENT_FAILURE =
  '/api/v1/cp/failure';
export const GET_ANALYTICS_MERCHANT_PAYMENT_FAILURE =
  '/api/v1/analytics/merchant/failure';
export const GET_ADMIN_ANALYTICS_SUCCESS = '/api/v1/analytics/admin/success';
export const GET_ANALYTICS_CHANNEL_PARTNER_PAYMENT_SUCCESS =
  '/api/v1/cp/success';
export const GET_MERCHANT_ANALYTICS_SUCCESS =
  '/api/v1/analytics/merchant/success';

export const CURL_COMMANDS = {
  INITIATE_PAYIN_PAYMENT: `curl --location 'https://api.bulkpe.in/client/initiatepayout' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer <token>' \\
--data '{"amount":0,"account_number":"","payment_mode":"","reference_id":"","transcation_note":"","beneficiaryName":"","ifsc":"","upi":""}'`,

  INITIATE_PAYOUT_PAYMENT: `curl --location 'https://api.bulkpe.in/client/initiatepayout' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer <token>' \\
--data '{"amount":0,"account_number":"","payment_mode":"","reference_id":"","transcation_note":"","beneficiaryName":"","ifsc":"","upi":""}'`,

  // Add more cURL commands for other APIs
};

// ─── UMS (User Management System) ─────────────────────────────────────────
export const UMS_ROLES = 'api/v1/ums/roles';
export const UMS_ROLE_BY_CODE = 'api/v1/ums/roles'; // + /:code
export const UMS_ROLE_PERMISSIONS = 'api/v1/ums/roles'; // + /:code/permissions
export const UMS_UPDATE_ROLE_PERMISSION = 'api/v1/ums/roles/permissions';
export const UMS_BULK_UPDATE_PERMISSIONS = 'api/v1/ums/roles/permissions/bulk';
export const UMS_PERMISSIONS = 'api/v1/ums/permissions';
export const UMS_ASSIGN_ROLE = 'api/v1/ums/users/roles/assign';
export const UMS_REVOKE_ROLE = 'api/v1/ums/users/roles/revoke';
export const UMS_USER_ROLES = 'api/v1/ums/users'; // + /:userId/roles
export const UMS_USER_PERMISSIONS = 'api/v1/ums/users'; // + /:userId/permissions
export const UMS_TENANTS = 'api/v1/ums/tenants';
export const UMS_TENANT_MEMBERS = 'api/v1/ums/tenants/members';
export const UMS_SESSIONS_VALIDATE = 'api/v1/ums/sessions/validate'; // + /:jti
export const UMS_SESSIONS_REVOKE = 'api/v1/ums/sessions/revoke';
export const UMS_USER_SESSIONS = 'api/v1/ums/sessions'; // + /:userId
export const UMS_AUDIT_LOGS = 'api/v1/ums/audit-logs';

// ─── Integrations ─────────────────────────────────────────────────────────
export const API_HIT_LOGS = 'api/v1/integrations/user/api-hit-logs';

// ─── Platform Billing ─────────────────────────────────────────────────────
export const PLATFORM_BILLING_INVOICES       = 'api/v1/admin/platform-billing/invoices';
export const PLATFORM_BILLING_SUMMARY        = 'api/v1/admin/platform-billing/summary';
export const PLATFORM_BILLING_PREVIEW        = 'api/v1/admin/platform-billing/invoices/preview';
export const PLATFORM_BILLING_GENERATE       = 'api/v1/admin/platform-billing/invoices/generate';
export const PLATFORM_BILLING_SEND           = 'api/v1/admin/platform-billing/invoices';
export const PLATFORM_BILLING_RECONCILE_UPLOAD       = 'api/v1/admin/platform-billing/reconcile';
export const PLATFORM_BILLING_RECONCILE_RUN          = 'api/v1/admin/platform-billing/reconcile';
export const PLATFORM_BILLING_RECONCILE_GET          = 'api/v1/admin/platform-billing/reconcile';
export const PLATFORM_BILLING_RECONCILE_TAX_INVOICES = 'api/v1/admin/platform-billing/reconcile';
