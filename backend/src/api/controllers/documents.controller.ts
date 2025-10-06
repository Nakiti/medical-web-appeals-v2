import { type Request, type Response } from 'express';
import { deleteDocument } from '../services/documents.service.js';
import { uuidParamSchema, type UuidParamInput } from '../schemas/appeals.schemas.js';

/**
 * Handles the logic for deleting a document.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function deleteDocumentController(
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
    const documentId = validatedParams.id;

    // Call the service to delete the document
    const deletedRows = await deleteDocument(documentId, userId);

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Send back success response (204 No Content)
    return res.status(204).send();
  } catch (error: any) {
    console.error('Error in deleteDocumentController:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid document ID format',
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
