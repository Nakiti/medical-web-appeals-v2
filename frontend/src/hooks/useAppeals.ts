import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getUserAppeals, 
  getAppealById, 
  updateAppeal, 
  deleteAppeal, 
  parseDenialLetter, 
  generateAppealLetter, 
  createAppeal 
} from '@/lib/services/appeals.service';
import { GetAppealsQueryInput, UpdateAppealInput, GenerateLetterInput, CreateAppealInput } from '@/lib/schemas/appeals.schema';

/**
 * A custom React hook that fetches all appeals for the authenticated user.
 * It leverages TanStack Query's `useQuery` for handling loading, success, and error states automatically.
 *
 * @param {GetAppealsQueryInput} query - Optional query parameters to filter appeals.
 * @returns An object containing:
 * - `data`: The appeals data if the request was successful.
 * - `isLoading`: A boolean indicating if the request is currently in progress.
 * - `isError`: A boolean indicating if the request failed.
 * - `error`: The error object if the request failed.
 * - `refetch`: A function to manually refetch the appeals data.
 */
export const useGetAppeals = (query?: GetAppealsQueryInput) => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['appeals', query],
    queryFn: () => getUserAppeals(query),
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });

  return {
    appeals: data,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * A custom React hook that fetches a single appeal by ID.
 * It leverages TanStack Query's `useQuery` for handling loading, success, and error states automatically.
 *
 * @param {string} id - The appeal ID.
 * @returns An object containing:
 * - `data`: The appeal data if the request was successful.
 * - `isLoading`: A boolean indicating if the request is currently in progress.
 * - `isError`: A boolean indicating if the request failed.
 * - `error`: The error object if the request failed.
 * - `refetch`: A function to manually refetch the appeal data.
 */
export const useGetAppeal = (id: string) => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['appeal', id],
    queryFn: () => getAppealById(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });

  return {
    appeal: data,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * A custom React hook that provides a function to update an appeal and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the appeal update. It takes the appeal ID and update data as arguments.
 * - `isPending`: A boolean indicating if the update is currently in progress (loading state).
 * - `isError`: A boolean indicating if the update failed.
 * - `error`: The error object if the update failed.
 * - `isSuccess`: A boolean indicating if the update was successful.
 */
export const useUpdateAppeal = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: update, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppealInput }) => updateAppeal(id, data),
    
    onSuccess: (data, variables) => {
      console.log('Appeal updated successfully:', data.id);
      // Invalidate and refetch appeals data
      queryClient.invalidateQueries({ queryKey: ['appeals'] });
      queryClient.invalidateQueries({ queryKey: ['appeal', variables.id] });
    },
    onError: (error) => {
      console.error('Appeal update failed:', error.message);
    },
  });

  return {
    updateAppeal: update,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to delete an appeal and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the appeal deletion. It takes the appeal ID as an argument.
 * - `isPending`: A boolean indicating if the deletion is currently in progress (loading state).
 * - `isError`: A boolean indicating if the deletion failed.
 * - `error`: The error object if the deletion failed.
 * - `isSuccess`: A boolean indicating if the deletion was successful.
 */
export const useDeleteAppeal = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: deleteAppealMutation, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: deleteAppeal,
    
    onSuccess: (_, id) => {
      console.log('Appeal deleted successfully:', id);
      // Invalidate and refetch appeals data
      queryClient.invalidateQueries({ queryKey: ['appeals'] });
      queryClient.removeQueries({ queryKey: ['appeal', id] });
    },
    onError: (error) => {
      console.error('Appeal deletion failed:', error.message);
    },
  });

  return {
    deleteAppeal: deleteAppealMutation,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to parse a denial letter and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the letter parsing. It takes the file as an argument.
 * - `isPending`: A boolean indicating if the parsing is currently in progress (loading state).
 * - `isError`: A boolean indicating if the parsing failed.
 * - `error`: The error object if the parsing failed.
 * - `isSuccess`: A boolean indicating if the parsing was successful.
 */
export const useParseDenialLetter = () => {
  const { 
    mutate: parseLetter, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: parseDenialLetter,
    
    onSuccess: (data) => {
      console.log('Letter parsed successfully:', data.message);
    },
    onError: (error) => {
      console.error('Letter parsing failed:', error.message);
    },
  });

  return {
    parseLetter,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to generate an appeal letter and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the letter generation. It takes the generation data as an argument.
 * - `isPending`: A boolean indicating if the generation is currently in progress (loading state).
 * - `isError`: A boolean indicating if the generation failed.
 * - `error`: The error object if the generation failed.
 * - `isSuccess`: A boolean indicating if the generation was successful.
 */
export const useGenerateAppealLetter = () => {
  const { 
    mutate: generateLetter, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: generateAppealLetter,
    
    onSuccess: (data) => {
      console.log('Letter generated successfully:', data.message);
    },
    onError: (error) => {
      console.error('Letter generation failed:', error.message);
    },
  });

  return {
    generateLetter,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to create a new appeal and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the appeal creation. It takes the appeal data as an argument.
 * - `isPending`: A boolean indicating if the creation is currently in progress (loading state).
 * - `isError`: A boolean indicating if the creation failed.
 * - `error`: The error object if the creation failed.
 * - `isSuccess`: A boolean indicating if the creation was successful.
 */
export const useCreateAppeal = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: create, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: createAppeal,
    
    onSuccess: (data) => {
      console.log('Appeal created successfully:', data.appealId);
      // Invalidate and refetch appeals data
      queryClient.invalidateQueries({ queryKey: ['appeals'] });
    },
    onError: (error) => {
      console.error('Appeal creation failed:', error.message);
    },
  });

  return {
    createAppeal: create,
    isPending,
    isError,
    error,
    isSuccess
  };
};
