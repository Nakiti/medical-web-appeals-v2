import { Router } from 'express';
import { deleteDocumentController } from '../controllers/documents.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = Router();

/**
 * DELETE /api/documents/:documentId
 * Delete a specific document
 * Protected route - requires authentication
 */
router.delete('/:documentId', isAuthenticated, deleteDocumentController);

export default router;
