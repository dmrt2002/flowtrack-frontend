import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z
    .string()
    .max(50, 'Name is too long')
    .trim()
    .optional()
    .or(z.literal('')),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
