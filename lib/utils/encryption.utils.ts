/**
 * Encryption utility for frontend
 * Matches the backend AuthEncryptionService using AES-256-GCM
 *
 * Output format: Buffer.concat([iv(12 bytes), authTag(16 bytes), ciphertext]) → base64
 * Key source:    NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_KEY (must be exactly 32 chars, matching backend)
 */

const KEY_LENGTH = 32; // 256-bit key for AES-256

// ─── Key ──────────────────────────────────────────────────────────────────────

const getEncryptionKey = (): Uint8Array => {
  const envKey = process.env.NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_KEY;
  if (!envKey) {
    throw new Error(
      'NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_KEY is not set. It must match the backend loginSignupEncryptionKey.',
    );
  }
  if (envKey.length !== KEY_LENGTH) {
    throw new Error(
      `NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_KEY must be exactly ${KEY_LENGTH} characters. Current length: ${envKey.length}`,
    );
  }
  return new TextEncoder().encode(envKey);
};

const getCryptoKey = async (keyBytes: Uint8Array): Promise<CryptoKey> => {
  return crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
};

// ─── Encrypt ──────────────────────────────────────────────────────────────────

/**
 * Encrypts a string using AES-256-GCM.
 *
 * Returns base64 of: iv(12 bytes) + authTag(16 bytes) + ciphertext
 * This matches the backend AuthEncryptionService.encrypt() format exactly.
 */
export const encrypt = async (data: string): Promise<string> => {
  try {
    const keyBytes = getEncryptionKey();
    const cryptoKey = await getCryptoKey(keyBytes);

    // GCM requires a random 12-byte IV per encryption
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const dataBuffer = new TextEncoder().encode(data);

    // Web Crypto AES-GCM returns: ciphertext + authTag(16 bytes) concatenated
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer,
    );

    const encryptedArray = new Uint8Array(encryptedBuffer);
    // Split: last 16 bytes = authTag, rest = ciphertext
    const ciphertext = encryptedArray.slice(0, encryptedArray.length - 16);
    const authTag = encryptedArray.slice(encryptedArray.length - 16);

    // Backend format: iv(12) + authTag(16) + ciphertext
    const combined = new Uint8Array(12 + 16 + ciphertext.length);
    combined.set(iv, 0);
    combined.set(authTag, 12);
    combined.set(ciphertext, 28);

    return btoa(String.fromCharCode(...Array.from(combined)));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// ─── Decrypt ──────────────────────────────────────────────────────────────────

/**
 * Decrypts a base64 string produced by the backend AuthEncryptionService.
 *
 * Expects base64 of: iv(12 bytes) + authTag(16 bytes) + ciphertext
 */
export const decrypt = async (encryptedData: string): Promise<string> => {
  try {
    const keyBytes = getEncryptionKey();
    const cryptoKey = await getCryptoKey(keyBytes);

    const combined = Uint8Array.from(atob(encryptedData), (c) =>
      c.charCodeAt(0),
    );

    // Unpack: iv(12) + authTag(16) + ciphertext
    const iv = combined.slice(0, 12);
    const authTag = combined.slice(12, 28);
    const ciphertext = combined.slice(28);

    // Web Crypto AES-GCM expects: ciphertext + authTag appended
    const ciphertextWithTag = new Uint8Array(ciphertext.length + 16);
    ciphertextWithTag.set(ciphertext, 0);
    ciphertextWithTag.set(authTag, ciphertext.length);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      ciphertextWithTag,
    );

    return new TextDecoder('utf-8').decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. Invalid encrypted format.');
  }
};

// ─── Class wrapper (for backward compat) ─────────────────────────────────────

export class AuthEncryptionService {
  async encrypt(text: string): Promise<string> {
    return encrypt(text);
  }
  async decrypt(encryptedText: string): Promise<string> {
    return decrypt(encryptedText);
  }
}
