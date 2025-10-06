import { z } from 'zod';

/**
 * Schema for validating user registration data.
 * It checks for name, a valid email, and a password with a minimum length.
 * It also includes a refinement to ensure the password and confirmPassword fields match.
 */
export const registerUserSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // This message will be attached to the `confirmPassword` field if validation fails.
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

/**
 * Schema for validating user login data.
 * It checks for a valid email and a non-empty password.
 */
export const loginUserSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

