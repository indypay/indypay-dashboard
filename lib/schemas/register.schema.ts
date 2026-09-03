import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .regex(
        /^[a-zA-Z\s-']+$/,
        'First name can only contain letters, spaces, hyphens, and apostrophes',
      ),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .regex(
        /^[a-zA-Z\s-']+$/,
        'Last name can only contain letters, spaces, hyphens, and apostrophes',
      ),
    email: z.string().email('Please enter a valid email address'),
    mobileNumber: z
      .string()
      .regex(
        /^\+?([0-9]{2})?[0-9]{10}$/,
        'Please enter a valid 10-digit mobile number',
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /(?=.*[a-z])/,
        'Password must contain at least one lowercase letter',
      )
      .regex(
        /(?=.*[A-Z])/,
        'Password must contain at least one uppercase letter',
      )
      .regex(/(?=.*\d)/, 'Password must contain at least one number')
      .regex(
        /(?=.*[!@#$%^&*(),.?":{}|<>])/,
        'Password must contain at least one special character',
      ),
    confirmPassword: z.string(),
    termsAccepted: z
      .boolean()
      .refine(
        (val) => val === true,
        'You must accept the terms and conditions',
      ),
    whatsappAlerts: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
