import { z } from 'zod';
import apiClient from '../apiClient';

// Define the expected shape of the User object
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Define the update user input type (based on backend schema)
interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * Makes an API call to get the current user's profile.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @returns {Promise<User>} A promise that resolves with the user's profile data.
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
};

/**
 * Makes an API call to update the current user's profile.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {UpdateUserInput} userData - The user's updated profile data.
 * @returns {Promise<User>} A promise that resolves with the updated user's data.
 */
export const updateUserProfile = async (userData: UpdateUserInput): Promise<User> => {
  const response = await apiClient.put<User>('/users/me', userData);
  return response.data;
};

/**
 * Makes an API call to delete the current user's account.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @returns {Promise<void>} A promise that resolves when the account is deleted.
 */
export const deleteUserAccount = async (): Promise<void> => {
  await apiClient.delete('/users/me');
};
