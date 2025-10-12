import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { RegisterUserInput, LoginUserInput } from '../schemas/auth.schemas.js';
import * as userRepository from '../repositories/user.repository.js';
import { User } from '../../models/user.model.js';

/**
 * Handles the business logic for creating a new user.
 * Hashes the password and saves the user to the database.
 *
 * @param userData - The validated user registration data.
 * @returns The newly created user object.
 * @throws Will throw an error if the database operation fails.
 */
export async function registerUser(
  userData: RegisterUserInput
): Promise<User> {
  const { name, email, password } = userData;

  // 1. Hash the password
  // A salt round of 12 is a strong, recommended value.
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 2. Prepare user data for storage
  const newUserPayload = {
    name,
    email,
    password: hashedPassword,
  };

  // 3. Call the repository to create the user in the database
  const createdUser = await userRepository.createUser(newUserPayload);
  
  return createdUser;
}

/**
 * Handles the business logic for authenticating a user.
 * Verifies credentials and generates a JWT token.
 *
 * @param credentials - The login credentials (email and password).
 * @returns The JWT token if authentication is successful, otherwise null.
 * @throws Will throw an error if the database operation fails.
 */
export async function loginUser(
  credentials: LoginUserInput
): Promise<string | null> {
  const { email, password } = credentials;

  try {
    // 1. Find the user by email
    const user = await userRepository.findUserByEmail(email);
    
    // 2. If no user found, return null
    if (!user) {
      return null;
    }

    const userData = user.toJSON()

    // 3. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    
    // 4. If password doesn't match, return null
    if (!isPasswordValid) {
      return null; 
    }

    // 5. Create JWT payload
    const payload = {
      id: userData.id,
      email: userData.email,
    };

    // 6. Sign the token with JWT_SECRET
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '24h', // Token expires in 24 hours
    });
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return {  
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error('Error in loginUser service:', error);
    throw new Error('Failed to authenticate user');
  }
}
