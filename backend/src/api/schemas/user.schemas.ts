import { z } from 'zod';

/**
 * @openapi
 * components:
 * schemas:
 * UpdateUserInput:
 * type: object
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * minLength: 8
 * confirmPassword:
 * type: string
 */
export const updateUserSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      
      email: z
        .string()
        .email('Not a valid email')
        .optional(),

      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .optional(),

      confirmPassword: z.string().optional(),
    })
    .refine((data) => {
      // If password is provided, confirmPassword must also be provided and match
      if (data.password && !data.confirmPassword) {
        return false;
      }
      if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    }, {
      message: 'Password and confirmPassword must match',
      path: ['confirmPassword'],
    }),
});

// Type for a validated update user request body
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
