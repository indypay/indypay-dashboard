import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_DEV_PB_BASE_URL: z.string().url('Invalid API base URL'),
  NEXT_PUBLIC_AWS_S3_BUCKET_URL: z.string().optional(),
  NEXT_PUBLIC_FE_BASE_URL: z
    .string()
    .url('Invalid frontend base URL')
    .optional(),
  NEXT_PUBLIC_API_URL: z.string().url('Invalid API URL').optional(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url('Invalid API base URL').optional(),
  // Encryption configuration - must match backend app.config values
  NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_KEY: z.string().optional(), // Must match backend loginSignupEncryptionKey (exactly 32 characters)
  NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_IV: z.string().optional(), // Must match backend loginSignupEncryptionIV (exactly 16 characters)
});

// Parse and validate environment variables
const parseEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_DEV_PB_BASE_URL: process.env.NEXT_PUBLIC_DEV_PB_BASE_URL,
    NEXT_PUBLIC_AWS_S3_BUCKET_URL: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL,
    NEXT_PUBLIC_FE_BASE_URL: process.env.NEXT_PUBLIC_FE_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_KEY:
      process.env.NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_KEY,
    NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_IV:
      process.env.NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_IV,
  });

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    // In development, continue with warnings. In production, you might want to throw.
    return {
      NEXT_PUBLIC_DEV_PB_BASE_URL:
        process.env.NEXT_PUBLIC_DEV_PB_BASE_URL || '',
      NEXT_PUBLIC_AWS_S3_BUCKET_URL: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL,
      NEXT_PUBLIC_FE_BASE_URL: process.env.NEXT_PUBLIC_FE_BASE_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_KEY:
        process.env.NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_KEY,
      NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_IV:
        process.env.NEXT_PUBLIC_LOGIN_SIGNUP_ENCRYPTION_IV,
    };
  }

  return parsed.data;
};

export const env = parseEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
