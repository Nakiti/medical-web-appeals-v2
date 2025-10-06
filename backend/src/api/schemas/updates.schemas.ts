import { z } from 'zod';

/**
 * Schema for validating create update request data
 */
export const createUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required and cannot be empty'),
  content: z.string().min(1, 'Content is required and cannot be empty'),
});

/**
 * Schema for validating update update request data
 */
export const updateUpdateSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  content: z.string().min(1, 'Content cannot be empty').optional(),
});

/**
 * Schema for validating UUID parameters for updates
 */
export const updateUuidParamSchema = z.object({
  updateId: z.string().uuid('Invalid update ID format'),
});

/**
 * Type for the validated create update data
 */
export type CreateUpdateInput = z.infer<typeof createUpdateSchema>;

/**
 * Type for the validated update update data
 */
export type UpdateUpdateInput = z.infer<typeof updateUpdateSchema>;

/**
 * Type for the validated UUID parameters for updates
 */
export type UpdateUuidParamInput = z.infer<typeof updateUuidParamSchema>;

