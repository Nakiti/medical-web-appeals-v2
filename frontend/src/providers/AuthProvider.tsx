'use client'; // This is a client-side component

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  loginUser, 
  logoutUser, 
  getSession, 
  initializeAuth 
} from '@/lib/services/auth.service';

// Define the shape of the User object
interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define the shape of the context's value
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * The provider component that wraps the application and manages authentication state.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const router = useRouter();

  useEffect(() => {
    /**
     * Checks for an existing session when the app loads.
     */
    const checkUserSession = async () => {
      try {
        // Initialize the Axios client for cookie-based auth
        initializeAuth();
        
        // Try to fetch the current user's session data
        const sessionResponse = await getSession();
        setUser(sessionResponse.user);
      } catch (error) {
        // If getSession fails (e.g., no valid session), clear user state
        console.log('No active session found.');
        setUser(null);
      } finally {
        // We're done loading, whether we found a user or not
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []); // The empty dependency array ensures this runs only once on mount

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // Login and get session data
      await loginUser(credentials);
      
      // Fetch user data after successful login
      const sessionResponse = await getSession();
      setUser(sessionResponse.user);
      
      // Redirect to a protected route on successful login
      router.push('/'); 
    } catch (error) {
      // The hook/component calling this function can handle displaying the error
      console.error('Login failed:', error);
      throw error; // Re-throw the error so the component can catch it
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      // Redirect to the login page on logout
      router.push('/login');
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for consuming the AuthContext.
 * Provides a clean way to access auth state and functions in components.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
