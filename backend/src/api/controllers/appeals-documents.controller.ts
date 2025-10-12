import { type Request, type Response } from 'express';
import { getDocumentsForAppeal, uploadDocumentsForAppeal } from '../services/appeals.service.js';
import { uuidParamSchema, type UuidParamInput } from '../schemas/appeals.schemas.js';

/**
 * Handles the logic for getting all documents for a specific appeal.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function getAppealDocumentsController(
  req: Request<UuidParamInput>,
  res: Response
) {
  try {
    // Get the userId from the authenticated user
    const userId = req.user?.id;

    // if (!userId) {
    //   return res.status(401).json({ message: 'Unauthorized: User information not found' });
    // }

    // Validate the UUID parameter
    const validatedParams = uuidParamSchema.parse(req.params);
    const appealId = validatedParams.id;

    // Call the service to get documents for the appeal
    const documents = await getDocumentsForAppeal(appealId, userId);

    // Send back the documents array
    return res.status(200).json({
      message: 'Documents retrieved successfully',
      documents,
      count: documents.length
    });
  } catch (error: any) {
    console.error('Error in getAppealDocumentsController:', error);
    
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
 * Handles the logic for uploading documents to a specific appeal.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function uploadAppealDocumentsController(
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

    // Check if files were uploaded
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Call the service to upload documents
    const documents = await uploadDocumentsForAppeal(appealId, userId, req.files);

    // Send back the created documents
    return res.status(201).json({
      message: 'Documents uploaded successfully',
      documents,
      count: documents.length
    });
  } catch (error: any) {
    console.error('Error in uploadAppealDocumentsController:', error);
    
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
