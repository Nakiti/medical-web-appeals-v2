import { z } from 'zod';

/**
 * @openapi
 * components:
 * schemas:
 * RegisterUserInput:
 * type: object
 * required:
 * - email
 * - password
 * - confirmPassword
 * - name
 */
export const registerUserSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: 'Name is required',
      }).min(1, 'Name cannot be empty'),
      
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Not a valid email'),

      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(8, 'Password must be at least 8 characters long'),

      confirmPassword: z.string({
        required_error: 'Password confirmation is required',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'], // Path of the error
    }),
});

/**
 * @openapi
 * components:
 * schemas:
 * LoginUserInput:
 * type: object
 * required:
 * - email
 * - password
 */
export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Not a valid email'),

    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

// Type for a validated registration request body
export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];

// Type for a validated login request body
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];
