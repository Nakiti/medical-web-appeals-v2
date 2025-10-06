import { z } from 'zod';
import apiClient from '../apiClient';
import { registerUserSchema, loginUserSchema } from '@/lib/schemas/auth.schema'

// Define the types for the form inputs based on Zod schemas for type safety
type RegisterUserInput = z.infer<typeof registerUserSchema>;
type LoginUserInput = z.infer<typeof loginUserSchema>;

// Define the expected shape of the User object
interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define the shape of the session response
interface SessionResponse {
  message: string;
  user: User;
}

// Define the shape of the login response
interface LoginResponse {
  message: string;
  token: string;
}

// Define the shape of the register response
interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/**
 * Makes an API call to register a new user.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {RegisterUserInput} userData - The user's registration data.
 * @returns {Promise<RegisterResponse>} A promise that resolves with the new user's data.
 */
export const registerUser = async (userData: RegisterUserInput): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
  return response.data;
};

/**
 * Makes an API call to login a user.
 * For cookie-based auth, we don't need to handle the token manually.
 * The server will set the httpOnly cookie automatically.
 *
 * @param {LoginUserInput} credentials - The user's login credentials.
 * @returns {Promise<LoginResponse>} A promise that resolves with the login response.
 */
export const loginUser = async (credentials: LoginUserInput): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

/**
 * Makes an API call to get the current user's session.
 * This will work with the httpOnly cookie set by the server.
 *
 * @returns {Promise<SessionResponse>} A promise that resolves with the session data.
 */
export const getSession = async (): Promise<SessionResponse> => {
  const response = await apiClient.get<SessionResponse>('/auth/session');
  return response.data;
};

/**
 * Logs out the user by clearing the session.
 * For cookie-based auth, we might need a logout endpoint.
 *
 * @returns {Promise<void>} A promise that resolves when logout is complete.
 */
export const logoutUser = async (): Promise<void> => {
  // For cookie-based auth, we might need a logout endpoint
  // that clears the httpOnly cookie on the server side
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Even if the logout endpoint fails, we can still clear local state
    console.log('Logout request failed, but continuing with local logout');
  }
};

/**
 * Initializes the auth client.
 * For cookie-based auth, we don't need to set tokens manually.
 */
export const initializeAuth = (): void => {
  // For cookie-based auth, initialization is handled automatically
  // by the withCredentials: true setting in the axios client
  console.log('Auth initialized for cookie-based authentication');
};