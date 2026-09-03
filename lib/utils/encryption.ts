import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

// Get encryption key from environment or use a default for development
// IMPORTANT: In production, set PAYMENT_LINK_ENCRYPTION_KEY as an environment variable
// Generate a key: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
function getEncryptionKey(): Buffer {
  const keyString = process.env.PAYMENT_LINK_ENCRYPTION_KEY;

  if (!keyString) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'PAYMENT_LINK_ENCRYPTION_KEY environment variable must be set in production',
      );
    }
    // For development, use a default key (not secure, but works for testing)
    // In production, this should never be used
    return crypto.scryptSync(
      'default-dev-key-change-in-production',
      'salt',
      32,
    );
  }

  return Buffer.from(keyString, 'hex');
}

export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      key as unknown as crypto.CipherKey,
      iv as unknown as crypto.BinaryLike,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    throw new Error('Encryption failed');
  }
}

export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted format');
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key as unknown as crypto.CipherKey,
      iv as unknown as crypto.BinaryLike,
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed');
  }
}
