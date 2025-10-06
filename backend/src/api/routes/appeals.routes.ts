import { Router } from 'express';
import { getUserAppealsController, getAppealByIdController, updateAppealController, deleteAppealController } from '../controllers/appeals.controller.js';
import { parseLetterController, generateLetterController, createAppealController } from '../controllers/appeals-additional.controller.js';
import { getAppealDocumentsController, uploadAppealDocumentsController } from '../controllers/appeals-documents.controller.js';
import { getAppealUpdatesController, createAppealUpdateController } from '../controllers/updates.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { validate } from '../middleware/validate.js';
import { updateAppealSchema, generateLetterSchema, createAppealSchema } from '../schemas/appeals.schemas.js';
import { createUpdateSchema } from '../schemas/updates.schemas.js';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF and image files
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/tiff'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and image files are allowed.'));
    }
  }
});

/**
 * GET /api/appeals
 * Get all appeals for the authenticated user
 * Protected route - requires authentication
 */
router.get('/', isAuthenticated, getUserAppealsController);

/**
 * GET /api/appeals/:id
 * Get a single appeal by ID for the authenticated user
 * Protected route - requires authentication
 */
router.get('/:id', getAppealByIdController);

/**
 * PUT /api/appeals/:id
 * Update an appeal (no authentication required)
 */
router.put('/:id', updateAppealController);

/**
 * DELETE /api/appeals/:id
 * Delete an appeal for the authenticated user
 * Protected route - requires authentication
 */
router.delete('/:id', isAuthenticated, deleteAppealController);

/**
 * POST /api/appeals/parse
 * Parse a denial letter using Azure Document Intelligence
 * Protected route - requires authentication and file upload
 */
router.post('/parse', upload.single('denialLetter'), parseLetterController);


/**
 * POST /api/appeals/generate-letter
 * Generate an appeal letter using OpenAI
 * Protected route - requires authentication and validation
 */
router.post('/generate-letter', validate(generateLetterSchema), generateLetterController);

/**
 * POST /api/appeals
 * Save a complete appeal with generated PDF (no authentication required)
 */
router.post('/', createAppealController);

/**
 * GET /api/appeals/:id/documents
 * Get all documents for a specific appeal
 * Protected route - requires authentication
 */
router.get('/:id/documents', getAppealDocumentsController);

/**
 * POST /api/appeals/:id/documents
 * Upload documents to a specific appeal
 * Protected route - requires authentication and file upload
 */
router.post('/:id/documents', upload.array('documents', 3), uploadAppealDocumentsController);

/**
 * GET /api/appeals/:id/updates
 * Get all updates for a specific appeal
 * Protected route - requires authentication
 */
router.get('/:id/updates', isAuthenticated, getAppealUpdatesController);

/**
 * POST /api/appeals/:id/updates
 * Create a new update for a specific appeal
 * Protected route - requires authentication and validation
 */
router.post('/:id/updates', isAuthenticated, validate(createUpdateSchema), createAppealUpdateController);

export default router;