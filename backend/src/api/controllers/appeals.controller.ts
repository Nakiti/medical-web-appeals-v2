import { type Request, type Response } from 'express';
import { getUserAppeals, getAppealById, updateAppeal, deleteAppealById, parseDenialLetter, generateAppealLetterText, saveAppeal, getDocumentsForAppeal, uploadDocumentsForAppeal } from '../services/appeals.service.js';
import { getAppealsQuerySchema, updateAppealSchema, uuidParamSchema, generateLetterSchema, createAppealSchema, type GetAppealsQueryInput, type UpdateAppealInput, type UuidParamInput, type GenerateLetterInput, type CreateAppealInput } from '../schemas/appeals.schemas.js';

/**
 * Handles the logic for getting all appeals for the authenticated user.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function getUserAppealsController(
  req: Request<{}, {}, {}, GetAppealsQueryInput>,
  res: Response
) {
  try {
    // Get the userId from the authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information not found' });
    }

    // Validate query parameters
    const validatedQuery = getAppealsQuerySchema.parse(req.query);
    
    // Build filters object from validated query
    const filters: any = {};
    if (validatedQuery.status) {
      filters.status = validatedQuery.status;
    }

    // Call the service to get user appeals
    const appeals = await getUserAppeals(userId, filters);

    // Send back the appeals array
    return res.status(200).json({
      message: 'Appeals retrieved successfully',
      appeals,
      count: appeals.length
    });
  } catch (error: any) {
    console.error('Error in getUserAppealsController:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid query parameters',
        errors: error.errors
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}

/**
 * Handles the logic for getting a single appeal by ID for the authenticated user.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function getAppealByIdController(
  req: Request<UuidParamInput>,
  res: Response
) {
  try {
    // Get the userId from the authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information not found' });
    }

    // Validate the UUID parameter
    const validatedParams = uuidParamSchema.parse(req.params);
    const appealId = validatedParams.id;

    // Call the service to get the appeal
    const appeal = await getAppealById(appealId, userId);

    if (!appeal) {
      return res.status(404).json({ message: 'Appeal not found' });
    }

    // Send back the appeal
    return res.status(200).json({
      message: 'Appeal retrieved successfully',
      appeal
    });
  } catch (error: any) {
    console.error('Error in getAppealByIdController:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid appeal ID format',
        errors: error.errors
      });
    }
    
    // Handle authorization errors
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}

/**
 * Handles the logic for updating an appeal for the authenticated user.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function updateAppealController(
  req: Request<UuidParamInput, {}, UpdateAppealInput>,
  res: Response
) {
  try {
    // No authentication required - userId is null for anonymous users
    const userId = null;

    // Validate the UUID parameter
    const validatedParams = uuidParamSchema.parse(req.params);
    const appealId = validatedParams.id;

    // Validate the update data
    const validatedUpdateData = updateAppealSchema.parse(req.body);

    // Call the service to update the appeal
    const updatedAppeal = await updateAppeal(appealId, userId, validatedUpdateData);

    if (!updatedAppeal) {
      return res.status(404).json({ message: 'Appeal not found' });
    }

    // Send back the updated appeal
    return res.status(200).json({
      message: 'Appeal updated successfully',
      appeal: updatedAppeal
    });
  } catch (error: any) {
    console.error('Error in updateAppealController:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: error.errors
      });
    }
    
    // Handle authorization errors
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}

/**
 * Handles the logic for deleting an appeal for the authenticated user.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function deleteAppealController(
  req: Request<UuidParamInput>,
  res: Response
) {
  try {
    // Get the userId from the authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information not found' });
    }

    // Validate the UUID parameter
    const validatedParams = uuidParamSchema.parse(req.params);
    const appealId = validatedParams.id;

    // Call the service to delete the appeal
    const deletedRows = await deleteAppealById(appealId, userId);

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Appeal not found' });
    }

    // Send back success response (204 No Content)
    return res.status(204).send();
  } catch (error: any) {
    console.error('Error in deleteAppealController:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid appeal ID format',
        errors: error.errors
      });
    }
    
    // Handle authorization errors
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}
