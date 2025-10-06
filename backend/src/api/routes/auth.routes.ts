import {Router} from "express"
import { validate } from "../middleware/validate.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { registerUserSchema, loginUserSchema } from "../schemas/auth.schemas.js"
import { registerUserController, loginUserController, getSessionController } from "../controllers/auth.controller.js"

const router = Router()

/**
 * @route POST /api/auth/register
 * @desc Create a new user
 * @access public
 */
router.post('/register', validate(registerUserSchema), registerUserController)

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT token
 * @access public
 */
router.post('/login', validate(loginUserSchema), loginUserController)

/**
 * @route GET /api/auth/session
 * @desc Get current user session information
 * @access private
 */
router.get('/session', isAuthenticated, getSessionController)

export default router