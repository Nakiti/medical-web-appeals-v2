import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getAppealUpdates, 
  createAppealUpdate, 
  updateAppealUpdate, 
  deleteAppealUpdate,
  type CreateUpdateRequest,
  type UpdateUpdateRequest
} from '@/lib/services/updates.service';

/**
 * A custom React hook that fetches all updates for a specific appeal.
 * It leverages TanStack Query's `useQuery` for handling loading, success, and error states automatically.
 *
 * @param {string} appealId - The appeal ID.
 * @returns An object containing:
 * - `data`: The updates data if the request was successful.
 * - `isLoading`: A boolean indicating if the request is currently in progress.
 * - `isError`: A boolean indicating if the request failed.
 * - `error`: The error object if the request failed.
 * - `refetch`: A function to manually refetch the updates data.
 */
export const useGetAppealUpdates = (appealId: string) => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['updates', appealId],
    queryFn: () => getAppealUpdates(appealId),
    enabled: !!appealId, // Only run query if appealId is provided
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });

  return {
    updates: data,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * A custom React hook that provides a function to create a new update for an appeal and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the update creation. It takes the appeal ID and update data as arguments.
 * - `isPending`: A boolean indicating if the creation is currently in progress (loading state).
 * - `isError`: A boolean indicating if the creation failed.
 * - `error`: The error object if the creation failed.
 * - `isSuccess`: A boolean indicating if the creation was successful.
 */
export const useCreateAppealUpdate = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: create, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: ({ appealId, updateData }: { appealId: string; updateData: CreateUpdateRequest }) => 
      createAppealUpdate(appealId, updateData),
    
    onSuccess: (data, variables) => {
      console.log('Update created successfully:', data.id);
      // Invalidate and refetch updates data for this appeal
      queryClient.invalidateQueries({ queryKey: ['updates', variables.appealId] });
      // Also invalidate the specific appeal data in case it includes update count
      queryClient.invalidateQueries({ queryKey: ['appeal', variables.appealId] });
    },
    onError: (error) => {
      console.error('Update creation failed:', error.message);
    },
  });

  return {
    createUpdate: create,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to update an existing update and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the update. It takes the update ID and update data as arguments.
 * - `isPending`: A boolean indicating if the update is currently in progress (loading state).
 * - `isError`: A boolean indicating if the update failed.
 * - `error`: The error object if the update failed.
 * - `isSuccess`: A boolean indicating if the update was successful.
 */
export const useUpdateAppealUpdate = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: update, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: ({ updateId, updateData }: { updateId: string; updateData: UpdateUpdateRequest }) => 
      updateAppealUpdate(updateId, updateData),
    
    onSuccess: (data, variables) => {
      console.log('Update updated successfully:', data.id);
      // Invalidate all updates queries since we don't know which appeal this update belonged to
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      // Also invalidate appeals data in case it includes update counts
      queryClient.invalidateQueries({ queryKey: ['appeals'] });
    },
    onError: (error) => {
      console.error('Update update failed:', error.message);
    },
  });

  return {
    updateUpdate: update,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to delete an update and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the update deletion. It takes the update ID as an argument.
 * - `isPending`: A boolean indicating if the deletion is currently in progress (loading state).
 * - `isError`: A boolean indicating if the deletion failed.
 * - `error`: The error object if the deletion failed.
 * - `isSuccess`: A boolean indicating if the deletion was successful.
 */
export const useDeleteAppealUpdate = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: deleteUpdate, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: deleteAppealUpdate,
    
    onSuccess: (_, updateId) => {
      console.log('Update deleted successfully:', updateId);
      // Invalidate all updates queries since we don't know which appeal this update belonged to
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      // Also invalidate appeals data in case it includes update counts
      queryClient.invalidateQueries({ queryKey: ['appeals'] });
    },
    onError: (error) => {
      console.error('Update deletion failed:', error.message);
    },
  });

  return {
    deleteUpdate,
    isPending,
    isError,
    error,
    isSuccess
  };
};

