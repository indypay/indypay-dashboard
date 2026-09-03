import { z } from 'zod';
import { GSTIN_REGEX, PHONE_REGEX } from '@/lib/utils/validators-regex';

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  contactNumber: z.string().regex(PHONE_REGEX, 'Invalid phone number'),
  gstin: z.string().regex(GSTIN_REGEX, 'Invalid GSTIN'),
  // Address fields are optional — only collected when "Add Billing Address" is checked
  addressLine1: z
    .union([
      z.literal(''),
      z.string().min(10, 'Minimum 10 characters required'),
    ])
    .optional(),
  addressLine2: z.string().optional(),
  pincode: z
    .union([z.literal(''), z.string().regex(/^\d{6}$/, 'Invalid PIN code')])
    .optional(),
  city: z
    .union([z.literal(''), z.string().min(1, 'City is required')])
    .optional(),
  state: z.string().optional(),
  country: z.string().default('India'),
});

export type CustomerSchema = z.infer<typeof customerSchema>;
