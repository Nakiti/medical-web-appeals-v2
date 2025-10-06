import {Router} from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { validate } from "../middleware/validate.js"
import { getUserProfileController, updateUserProfileController, deleteUserController } from "../controllers/user.controller.js"
import { updateUserSchema } from "../schemas/user.schemas.js"

const router = Router()

/**
 * @route GET /api/users/me
 * @desc Get current user's profile information
 * @access private
 */
router.get('/me', isAuthenticated, getUserProfileController)

/**
 * @route PUT /api/users/me
 * @desc Update current user's profile information
 * @access private
 */
router.put('/me', isAuthenticated, validate(updateUserSchema), updateUserProfileController)

/**
 * @route DELETE /api/users/me
 * @desc Permanently delete current user's account
 * @access private
 */
router.delete('/me', isAuthenticated, deleteUserController)

export default router
