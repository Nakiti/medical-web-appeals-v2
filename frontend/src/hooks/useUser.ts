import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '@/lib/services/user.service';

/**
 * A custom React hook that fetches the current user's profile.
 * It leverages TanStack Query's `useQuery` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `data`: The user profile data if the request was successful.
 * - `isLoading`: A boolean indicating if the profile request is currently in progress.
 * - `isError`: A boolean indicating if the profile request failed.
 * - `error`: The error object if the profile request failed.
 * - `refetch`: A function to manually refetch the profile data.
 */
export const useGetUserProfile = () => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return {
    user: data,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * A custom React hook that provides a function to update the user's profile and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the profile update. It takes the updated user data as an argument.
 * - `isPending`: A boolean indicating if the update is currently in progress (loading state).
 * - `isError`: A boolean indicating if the update failed.
 * - `error`: The error object if the update failed.
 * - `isSuccess`: A boolean indicating if the update was successful.
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: updateProfile, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: updateUserProfile,
    
    onSuccess: (data) => {
      console.log('Profile updated successfully for:', data.email);
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onError: (error) => {
      console.error('Profile update failed:', error.message);
    },
  });

  return {
    updateProfile,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to delete the user's account and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the account deletion.
 * - `isPending`: A boolean indicating if the deletion is currently in progress (loading state).
 * - `isError`: A boolean indicating if the deletion failed.
 * - `error`: The error object if the deletion failed.
 * - `isSuccess`: A boolean indicating if the deletion was successful.
 */
export const useDeleteUserAccount = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: deleteAccount, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: deleteUserAccount,
    
    onSuccess: () => {
      console.log('Account deleted successfully');
      // Clear all user-related data from the cache
      queryClient.clear();
      // You might want to redirect to a different page or show a confirmation
    },
    onError: (error) => {
      console.error('Account deletion failed:', error.message);
    },
  });

  return {
    deleteAccount,
    isPending,
    isError,
    error,
    isSuccess
  };
};
