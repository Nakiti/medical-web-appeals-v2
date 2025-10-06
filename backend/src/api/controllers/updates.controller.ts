import { type Request, type Response } from 'express';
import { getUpdatesForAppeal, createUpdateForAppeal, updateUserNote, deleteUserNote } from '../services/updates.service.js';
import { createUpdateSchema, updateUpdateSchema, updateUuidParamSchema, type CreateUpdateInput, type UpdateUpdateInput, type UpdateUuidParamInput } from '../schemas/updates.schemas.js';
import { uuidParamSchema, type UuidParamInput } from '../schemas/appeals.schemas.js';

/**
 * Handles the logic for getting all updates for a specific appeal.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function getAppealUpdatesController(
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

    // Call the service to get updates for the appeal
    const updates = await getUpdatesForAppeal(appealId, userId);

    // Send back the updates array
    return res.status(200).json({
      message: 'Updates retrieved successfully',
      updates,
      count: updates.length
    });
  } catch (error: any) {
    console.error('Error in getAppealUpdatesController:', error);
    
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
    
    // Handle not found errors
    if (error.message.includes('Not Found')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}

/**
 * Handles the logic for creating a new update for a specific appeal.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function createAppealUpdateController(
  req: Request<UuidParamInput, {}, CreateUpdateInput>,
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

    // Validate the request body
    const validatedBody = createUpdateSchema.parse(req.body);
    const { title, content } = validatedBody;

    // Call the service to create the update
    const newUpdate = await createUpdateForAppeal(appealId, userId, title, content);

    // Send back the newly created update
    return res.status(201).json({
      message: 'Update created successfully',
      update: newUpdate
    });
  } catch (error: any) {
    console.error('Error in createAppealUpdateController:', error);
    
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
    
    // Handle not found errors
    if (error.message.includes('Not Found')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}

/**
 * Handles the logic for updating an existing update.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function updateAppealUpdateController(
  req: Request<UpdateUuidParamInput, {}, UpdateUpdateInput>,
  res: Response
) {
  try {
    // Get the userId from the authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information not found' });
    }

    // Validate the UUID parameter
    const validatedParams = updateUuidParamSchema.parse(req.params);
    const updateId = validatedParams.updateId;

    // Validate the request body
    const validatedBody = updateUpdateSchema.parse(req.body);

    // Call the service to update the update
    const updatedUpdate = await updateUserNote(updateId, userId, validatedBody);

    // Send back the updated update
    return res.status(200).json({
      message: 'Update updated successfully',
      update: updatedUpdate
    });
  } catch (error: any) {
    console.error('Error in updateAppealUpdateController:', error);
    
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
    
    // Handle not found errors
    if (error.message.includes('Not Found')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}

/**
 * Handles the logic for deleting an update.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function deleteAppealUpdateController(
  req: Request<UpdateUuidParamInput>,
  res: Response
) {
  try {
    // Get the userId from the authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information not found' });
    }

    // Validate the UUID parameter
    const validatedParams = updateUuidParamSchema.parse(req.params);
    const updateId = validatedParams.updateId;

    // Call the service to delete the update
    const deletedRows = await deleteUserNote(updateId, userId);

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Update not found' });
    }

    // Send back success response (204 No Content)
    return res.status(204).send();
  } catch (error: any) {
    console.error('Error in deleteAppealUpdateController:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid update ID format',
        errors: error.errors
      });
    }
    
    // Handle authorization errors
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ message: error.message });
    }
    
    // Handle not found errors
    if (error.message.includes('Not Found')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}

