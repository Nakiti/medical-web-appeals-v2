// Auth schemas
export { registerUserSchema, loginUserSchema } from './auth.schema';

// Appeals schemas
export { 
  AppealStatus,
  getAppealsQuerySchema,
  updateAppealSchema,
  generateLetterSchema,
  createAppealSchema,
  uuidParamSchema,
  type GetAppealsQueryInput,
  type UpdateAppealInput,
  type GenerateLetterInput,
  type CreateAppealInput,
  type UuidParamInput
} from './appeals.schema';
