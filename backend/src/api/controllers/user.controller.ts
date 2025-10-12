import { type Request, type Response } from 'express';
import { getUserProfile, updateUserProfile, findUserByEmail, deleteUser } from '../services/user.service.js';
import { type UpdateUserInput } from '../schemas/user.schemas.js';

/**
 * Handles the logic for getting the current user's profile information.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function getUserProfileController(
  req: Request,
  res: Response
) {
  try {
    // The isAuthenticated middleware has already verified the JWT and attached user info to req.user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information not found' });
    }

    // Get the user's profile information
    const userProfile = await getUserProfile(userId);

    const userData = userProfile?.toJSON()

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the user's profile data (password is already excluded by the repository)
    return res.status(200).json({
      message: 'User profile retrieved successfully',
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error in getUserProfileController:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

/**
 * Handles the logic for updating the current user's profile information.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function updateUserProfileController(
  req: Request<{}, {}, UpdateUserInput>,
  res: Response
) {
  try {
    // The isAuthenticated middleware has already verified the JWT and attached user info to req.user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information not found' });
    }

    const updateData = req.body;

    // Business Rule Check: If email is being updated, check if it's already in use
    if (updateData.email) {
      const existingUser = await findUserByEmail(updateData.email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({ message: 'Email is already in use by another account' });
      }
    }

    // Update the user's profile
    const updatedUser = await updateUserProfile(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the updated user's profile data (password is already excluded by the repository)
    return res.status(200).json({
      message: 'User profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error in updateUserProfileController:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

/**
 * Handles the logic for permanently deleting the current user's account.
 * This is a destructive action that cannot be undone.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function deleteUserController(
  req: Request,
  res: Response
) {
  try {
    // The isAuthenticated middleware has already verified the JWT and attached user info to req.user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information not found' });
    }

    // Delete the user account
    const deletedRows = await deleteUser(userId);

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send 204 No Content response (standard for successful DELETE requests with no body)
    return res.status(204).send();
  } catch (error: any) {
    console.error('Error in deleteUserController:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
