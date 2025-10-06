import { type Request, type Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service.js';
import { type RegisterUserInput, type LoginUserInput } from '../schemas/auth.schemas.js';
import { findUserByEmail, getUserProfile } from '../services/user.service.js';

/**
 * Handles the logic for user registration.
 *
 * @param req - The Express request object, containing the validated user data in the body.
 * @param res - The Express response object used to send back the result.
 */
export async function registerUserController(
  req: Request<{}, {}, RegisterUserInput>,
  res: Response
) {
  try {
    const { email } = req.body;

    // 1. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    // 2. Call the service to create the new user
    // We only pass the necessary data to the service
    const newUser = await registerUser(req.body);

    // 3. Send back a successful response
    // It's good practice to not send back the password hash
    return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
    });
  } catch (error: any) {
    console.error('Error in registerUserController:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

/**
 * Handles the logic for user login.
 *
 * @param req - The Express request object, containing the validated login credentials in the body.
 * @param res - The Express response object used to send back the result.
 */
export async function loginUserController(
  req: Request<{}, {}, LoginUserInput>,
  res: Response
) {
  try {
    // Call the service to authenticate the user
    const token = await loginUser(req.body);

    // If no token returned, credentials are invalid
    if (!token) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send back the token
    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error: any) {
    console.error('Error in loginUserController:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

/**
 * Handles the logic for getting current user session information.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information attached by isAuthenticated middleware.
 * @param res - The Express response object used to send back the result.
 */
export async function getSessionController(
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

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the user's profile data (password is already excluded by the repository)
    return res.status(200).json({
      message: 'Session information retrieved successfully',
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error in getSessionController:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
