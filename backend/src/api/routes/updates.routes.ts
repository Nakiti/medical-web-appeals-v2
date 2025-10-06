import { Router } from 'express';
import { updateAppealUpdateController, deleteAppealUpdateController } from '../controllers/updates.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { validate } from '../middleware/validate.js';
import { updateUpdateSchema } from '../schemas/updates.schemas.js';

const router = Router();

/**
 * PUT /api/updates/:updateId
 * Update an existing update
 * Protected route - requires authentication and validation
 */
router.put('/:updateId', isAuthenticated, validate(updateUpdateSchema), updateAppealUpdateController);

/**
 * DELETE /api/updates/:updateId
 * Delete an update
 * Protected route - requires authentication
 */
router.delete('/:updateId', isAuthenticated, deleteAppealUpdateController);

export default router;

