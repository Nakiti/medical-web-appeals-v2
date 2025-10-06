import { z } from 'zod';

/**
 * Enum for appeal status values
 */
export const AppealStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  DENIED: 'denied',
} as const;

export type AppealStatus = typeof AppealStatus[keyof typeof AppealStatus];

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
  parsedData: z.record(z.any()).optional(),
  generatedLetter: z.string().optional(),
});

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
 * Schema for validating patient details form data
 */
export const patientDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  dob: z.string().min(1, 'Date of birth is required'),
});

/**
 * Schema for validating appealer details form data
 */
export const appealerDetailsSchema = z.object({
  appealerFirstName: z.string().min(1, 'First name is required'),
  appealerLastName: z.string().min(1, 'Last name is required'),
  appealerAddress: z.string().min(1, 'Address is required'),
  appealerEmailAddress: z.string().email('Invalid email address'),
  appealerPhoneNumber: z.string().min(1, 'Phone number is required'),
  appealerRelation: z.string().min(1, 'Relation is required'),
});

/**
 * Schema for validating claim number form data
 */
export const claimNumberSchema = z.object({
  claimNumber: z.string().min(1, 'Claim number is required'),
  appealDeadline: z.string().min(1, 'Appeal deadline is required'),
});

/**
 * Schema for validating letter details form data
 */
export const letterDetailsSchema = z.object({
  insuranceProvider: z.string().min(1, 'Insurance provider is required'),
  insuranceAddress: z.string().min(1, 'Insurance address is required'),
  physicianName: z.string().min(1, 'Physician name is required'),
  physicianPhone: z.string().min(1, 'Physician phone is required'),
  physicianAddress: z.string().min(1, 'Physician address is required'),
  physicianEmail: z.string().email('Invalid email address'),
});

/**
 * Schema for validating procedure details form data
 */
export const procedureDetailsSchema = z.object({
  procedureName: z.string().min(1, 'Procedure name is required'),
  denialReason: z.string().min(1, 'Denial reason is required'),
});

/**
 * Schema for validating additional details form data
 */
export const additionalDetailsSchema = z.object({
  additionalDetails: z.string().optional(),
});

/**
 * Schema for validating document upload form data
 */
export const documentUploadSchema = z.object({
  documents: z.array(z.object({
    id: z.number(),
    file: z.instanceof(File),
  })).optional(),
});

/**
 * Schema for validating review form data
 */
export const reviewSchema = z.object({
  appealLetter: z.string().optional(),
  appealLetterUrl: z.string().url().optional(),
  status: z.enum(['draft', 'submitted']).default('draft'),
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
 * Schema for validating UUID parameters
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid appeal ID format'),
});

// Type definitions
export type GetAppealsQueryInput = z.infer<typeof getAppealsQuerySchema>;
export type UpdateAppealInput = z.infer<typeof updateAppealSchema>;
export type GenerateLetterInput = z.infer<typeof generateLetterSchema>;
export type CreateAppealInput = z.infer<typeof createAppealSchema>;
export type UuidParamInput = z.infer<typeof uuidParamSchema>;
export type PatientDetailsInput = z.infer<typeof patientDetailsSchema>;
export type AppealerDetailsInput = z.infer<typeof appealerDetailsSchema>;
export type ClaimNumberInput = z.infer<typeof claimNumberSchema>;
export type LetterDetailsInput = z.infer<typeof letterDetailsSchema>;
export type ProcedureDetailsInput = z.infer<typeof procedureDetailsSchema>;
export type AdditionalDetailsInput = z.infer<typeof additionalDetailsSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
