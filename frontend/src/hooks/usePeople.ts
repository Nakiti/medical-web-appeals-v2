import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getAppealDoctors, 
  createAppealDoctor, 
  updateAppealDoctor, 
  deleteAppealDoctor 
} from '@/lib/services/people.service';
import { CreateDoctorRequest } from '@/lib/services/people.service';

/**
 * A custom React hook that fetches all doctors for a specific appeal.
 * It leverages TanStack Query's `useQuery` for handling loading, success, and error states automatically.
 *
 * @param {string} appealId - The appeal ID.
 * @returns An object containing:
 * - `data`: The doctors data if the request was successful.
 * - `isLoading`: A boolean indicating if the request is currently in progress.
 * - `isError`: A boolean indicating if the request failed.
 * - `error`: The error object if the request failed.
 * - `refetch`: A function to manually refetch the doctors data.
 */
export const useGetAppealDoctors = (appealId: string) => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['doctors', appealId],
    queryFn: () => getAppealDoctors(appealId),
    enabled: !!appealId, // Only run query if appealId is provided
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });

  return {
    doctors: data,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * A custom React hook that provides a function to create a doctor for an appeal and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the doctor creation. It takes the appeal ID and doctor data as arguments.
 * - `isPending`: A boolean indicating if the creation is currently in progress (loading state).
 * - `isError`: A boolean indicating if the creation failed.
 * - `error`: The error object if the creation failed.
 * - `isSuccess`: A boolean indicating if the creation was successful.
 */
export const useCreateAppealDoctor = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: create, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: ({ appealId, doctorData }: { appealId: string; doctorData: CreateDoctorRequest }) => 
      createAppealDoctor(appealId, doctorData),
    
    onSuccess: (data, variables) => {
      console.log('Doctor created successfully:', data.id);
      // Invalidate and refetch doctors data for this appeal
      queryClient.invalidateQueries({ queryKey: ['doctors', variables.appealId] });
      // Also invalidate the specific appeal data in case it includes doctor count
      queryClient.invalidateQueries({ queryKey: ['appeal', variables.appealId] });
    },
    onError: (error) => {
      console.error('Doctor creation failed:', error.message);
    },
  });

  return {
    createDoctor: create,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to update a doctor for an appeal and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the doctor update. It takes the appeal ID, doctor ID, and update data as arguments.
 * - `isPending`: A boolean indicating if the update is currently in progress (loading state).
 * - `isError`: A boolean indicating if the update failed.
 * - `error`: The error object if the update failed.
 * - `isSuccess`: A boolean indicating if the update was successful.
 */
export const useUpdateAppealDoctor = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: update, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: ({ appealId, doctorId, updateData }: { appealId: string; doctorId: string; updateData: Partial<CreateDoctorRequest> }) => 
      updateAppealDoctor(appealId, doctorId, updateData),
    
    onSuccess: (data, variables) => {
      console.log('Doctor updated successfully:', data.id);
      // Invalidate and refetch doctors data for this appeal
      queryClient.invalidateQueries({ queryKey: ['doctors', variables.appealId] });
    },
    onError: (error) => {
      console.error('Doctor update failed:', error.message);
    },
  });

  return {
    updateDoctor: update,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to delete a doctor for an appeal and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the doctor deletion. It takes the appeal ID and doctor ID as arguments.
 * - `isPending`: A boolean indicating if the deletion is currently in progress (loading state).
 * - `isError`: A boolean indicating if the deletion failed.
 * - `error`: The error object if the deletion failed.
 * - `isSuccess`: A boolean indicating if the deletion was successful.
 */
export const useDeleteAppealDoctor = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: deleteDoctor, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: ({ appealId, doctorId }: { appealId: string; doctorId: string }) => 
      deleteAppealDoctor(appealId, doctorId),
    
    onSuccess: (_, variables) => {
      console.log('Doctor deleted successfully:', variables.doctorId);
      // Invalidate and refetch doctors data for this appeal
      queryClient.invalidateQueries({ queryKey: ['doctors', variables.appealId] });
      // Also invalidate the specific appeal data in case it includes doctor count
      queryClient.invalidateQueries({ queryKey: ['appeal', variables.appealId] });
    },
    onError: (error) => {
      console.error('Doctor deletion failed:', error.message);
    },
  });

  return {
    deleteDoctor: deleteDoctor,
    isPending,
    isError,
    error,
    isSuccess
  };
};

