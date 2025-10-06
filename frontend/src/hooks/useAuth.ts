import { useMutation, useQuery } from '@tanstack/react-query';
import { registerUser, loginUser, getSession, logoutUser } from '@/lib/services/auth.service';

/**
 * A custom React hook that provides a function to register a user and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the registration. It takes the user data as an argument.
 * - `isPending`: A boolean indicating if the registration is currently in progress (loading state).
 * - `isError`: A boolean indicating if the registration failed.
 * - `error`: The error object if the registration failed.
 * - `isSuccess`: A boolean indicating if the registration was successful.
 */
export const useRegister = () => {
  const { 
    mutate: register, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    // `mutationFn` is the function that will be called when `mutate` is executed.
    // It must return a promise.
    mutationFn: registerUser,
    
    // Optional: You can add side effects for different outcomes.
    onSuccess: (data) => {
      // This function will be called if the mutation is successful.
      // You could redirect the user, show a success toast, or store user data.
      console.log('Registration successful for:', data.email);
      // For example: router.push('/login');
    },
    onError: (error) => {
      // This function will be called if the mutation fails.
      // You could log the error or show an error toast to the user.
      console.error('Registration failed:', error.message);
    },
  });

  return {
    register,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to login a user and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 * For cookie-based auth, the session is automatically managed by the server.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the login. It takes the user credentials as an argument.
 * - `isPending`: A boolean indicating if the login is currently in progress (loading state).
 * - `isError`: A boolean indicating if the login failed.
 * - `error`: The error object if the login failed.
 * - `isSuccess`: A boolean indicating if the login was successful.
 */
export const useLogin = () => {
  const { 
    mutate: login, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: loginUser,
    
    onSuccess: (data) => {
      console.log('Login successful:', data.message);
      // For cookie-based auth, the session is automatically managed
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });

  return {
    login,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that fetches the current user's session.
 * It leverages TanStack Query's `useQuery` for handling loading, success, and error states automatically.
 * For cookie-based auth, this will work with the httpOnly cookie set by the server.
 *
 * @returns An object containing:
 * - `data`: The session data if the request was successful.
 * - `isLoading`: A boolean indicating if the session request is currently in progress.
 * - `isError`: A boolean indicating if the session request failed.
 * - `error`: The error object if the session request failed.
 * - `refetch`: A function to manually refetch the session data.
 */
export const useSession = () => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    retry: false, // Don't retry on auth failures
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return {
    user: data?.user,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * A custom React hook that provides a function to logout a user.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 * For cookie-based auth, this will clear the httpOnly cookie on the server.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the logout.
 * - `isPending`: A boolean indicating if the logout is currently in progress (loading state).
 * - `isError`: A boolean indicating if the logout failed.
 * - `error`: The error object if the logout failed.
 * - `isSuccess`: A boolean indicating if the logout was successful.
 */
export const useLogout = () => {
  const { 
    mutate: logout, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: logoutUser,
    
    onSuccess: () => {
      console.log('Logout successful');
      // For cookie-based auth, the session is automatically cleared
    },
    onError: (error) => {
      console.error('Logout failed:', error.message);
    },
  });

  return {
    logout,
    isPending,
    isError,
    error,
    isSuccess
  };
};
