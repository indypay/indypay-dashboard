// Shared in-memory store for payment links
// In production, replace this with a database (MongoDB, PostgreSQL, etc.)

interface PaymentLinkStoreEntry {
  encryptedData: string;
  expiryTime: string;
}

export const paymentLinksStore = new Map<string, PaymentLinkStoreEntry>();
