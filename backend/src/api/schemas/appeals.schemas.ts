import { z } from 'zod';
import { AppealStatus } from '../../models/appeal.model.js';

/**
 * Schema for validating appeal query parameters
 */
export const getAppealsQuerySchema = z.object({
  status: z.nativeEnum(AppealStatus).optional(),
});

/**
 * Schema for validating appeal update data
 */
export const updateAppealSchema = z.object({
  status: z.nativeEnum(AppealStatus).optional(),
  denialLetterUrl: z.string().url().optional(),
  parsedData: z.object({}).optional(),
  generatedLetter: z.string().optional(),
  generatedLetterUrl: z.string().url().optional(),
});

/**
 * Schema for validating UUID parameters
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid appeal ID format'),
});

/**
 * Type for the validated query parameters
 */
export type GetAppealsQueryInput = z.infer<typeof getAppealsQuerySchema>;

/**
 * Type for the validated update data
 */
export type UpdateAppealInput = z.infer<typeof updateAppealSchema>;

/**
 * Schema for validating generate letter request data
 */
export const generateLetterSchema = z.object({
  parsedData: z.object({
    patientName: z.string().min(1, 'Patient name is required'),
    policyId: z.string().min(1, 'Policy ID is required'),
    claimNumber: z.string().min(1, 'Claim number is required'),
    dateOfService: z.string().min(1, 'Date of service is required'),
    denialReason: z.string().min(1, 'Denial reason is required'),
    argument: z.string().min(1, 'Patient argument is required'),
  }),
});

/**
 * Schema for validating create appeal request data
 */
export const createAppealSchema = z.object({
  parsedData: z.object({}).passthrough(), // Allow any parsed data structure
  denialLetterUrl: z.string().url('Invalid denial letter URL'),
  generatedLetter: z.string().min(1, 'Generated letter is required'),
});

/**
 * Type for the validated UUID parameters
 */
export type UuidParamInput = z.infer<typeof uuidParamSchema>;

/**
 * Type for the validated generate letter data
 */
export type GenerateLetterInput = z.infer<typeof generateLetterSchema>;

/**
 * Type for the validated create appeal data
 */
export type CreateAppealInput = z.infer<typeof createAppealSchema>;
