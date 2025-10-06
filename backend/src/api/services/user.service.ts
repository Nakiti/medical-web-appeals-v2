import bcrypt from 'bcryptjs';
import { User } from '../../models/user.model.js';
import * as userRepository from '../repositories/user.repository.js';

/**
 * Service for user-related operations.
 * Handles business logic for user queries and operations.
 */

/**
 * Finds a user by their email address.
 * 
 * @param email - The email address to search for.
 * @returns The user object if found, otherwise null.
 * @throws Will throw an error if the database operation fails.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await userRepository.findUserByEmail(email);
    return user;
  } catch (error) {
    console.error('Error in findUserByEmail service:', error);
    throw new Error('Failed to find user by email');
  }
}

/**
 * Retrieves a user's profile information by their ID.
 * 
 * @param userId - The ID of the user to retrieve.
 * @returns The user profile object if found, otherwise null.
 * @throws Will throw an error if the database operation fails.
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const user = await userRepository.findUserById(userId);
    return user;
  } catch (error) {
    console.error('Error in getUserProfile service:', error);
    throw new Error('Failed to get user profile');
  }
}

/**
 * Updates a user's profile information.
 * Handles password hashing if password is being updated.
 * 
 * @param userId - The ID of the user to update.
 * @param updateData - The data to update the user with.
 * @returns The updated user profile object if found, otherwise null.
 * @throws Will throw an error if the database operation fails.
 */
export async function updateUserProfile(
  userId: string, 
  updateData: { name?: string; email?: string; password?: string }
): Promise<User | null> {
  try {
    // Prepare the update data
    const updatePayload: { name?: string; email?: string; password?: string } = {};

    // Copy name and email if provided
    if (updateData.name !== undefined) {
      updatePayload.name = updateData.name;
    }
    if (updateData.email !== undefined) {
      updatePayload.email = updateData.email;
    }

    // Handle password hashing if password is being updated
    if (updateData.password) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);
      updatePayload.password = hashedPassword;
    }

    // Update the user in the database
    const updatedUser = await userRepository.updateUser(userId, updatePayload);
    
    return updatedUser;
  } catch (error) {
    console.error('Error in updateUserProfile service:', error);
    throw new Error('Failed to update user profile');
  }
}

/**
 * Permanently deletes a user account.
 * This is a destructive action that cannot be undone.
 * 
 * @param userId - The ID of the user to delete.
 * @returns The number of rows deleted (1 if successful, 0 if user not found).
 * @throws Will throw an error if the database operation fails.
 */
export async function deleteUser(userId: string): Promise<number> {
  try {
    // Call the repository to delete the user
    const deletedRows = await userRepository.deleteUser(userId);
    
    // Future Enhancement: This service could also be responsible for:
    // - Deleting related data (files in Azure Blob Storage, etc.)
    // - Sending deletion confirmation emails
    // - Logging the deletion for audit purposes
    
    return deletedRows;
  } catch (error) {
    console.error('Error in deleteUser service:', error);
    throw new Error('Failed to delete user account');
  }
}
