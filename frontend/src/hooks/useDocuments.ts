import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getAppealDocuments, 
  uploadAppealDocuments, 
  deleteDocument 
} from '@/lib/services/documents.service';

/**
 * A custom React hook that fetches all documents for a specific appeal.
 * It leverages TanStack Query's `useQuery` for handling loading, success, and error states automatically.
 *
 * @param {string} appealId - The appeal ID.
 * @returns An object containing:
 * - `data`: The documents data if the request was successful.
 * - `isLoading`: A boolean indicating if the request is currently in progress.
 * - `isError`: A boolean indicating if the request failed.
 * - `error`: The error object if the request failed.
 * - `refetch`: A function to manually refetch the documents data.
 */
export const useGetAppealDocuments = (appealId: string) => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['documents', appealId],
    queryFn: () => getAppealDocuments(appealId),
    enabled: !!appealId, // Only run query if appealId is provided
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });

  return {
    documents: data,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * A custom React hook that provides a function to upload documents to an appeal and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the document upload. It takes the appeal ID and files array as arguments.
 * - `isPending`: A boolean indicating if the upload is currently in progress (loading state).
 * - `isError`: A boolean indicating if the upload failed.
 * - `error`: The error object if the upload failed.
 * - `isSuccess`: A boolean indicating if the upload was successful.
 */
export const useUploadAppealDocuments = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: upload, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: ({ appealId, files }: { appealId: string; files: File[] }) => 
      uploadAppealDocuments(appealId, files),
    
    onSuccess: (data, variables) => {
      console.log('Documents uploaded successfully:', data.length, 'files');
      // Invalidate and refetch documents data for this appeal
      queryClient.invalidateQueries({ queryKey: ['documents', variables.appealId] });
      // Also invalidate the specific appeal data in case it includes document count
      queryClient.invalidateQueries({ queryKey: ['appeal', variables.appealId] });
    },
    onError: (error) => {
      console.error('Document upload failed:', error.message);
    },
  });

  return {
    uploadDocuments: upload,
    isPending,
    isError,
    error,
    isSuccess
  };
};

/**
 * A custom React hook that provides a function to delete a document and manages the state of the API call.
 * It leverages TanStack Query's `useMutation` for handling loading, success, and error states automatically.
 *
 * @returns An object containing:
 * - `mutate`: The function to call to trigger the document deletion. It takes the document ID as an argument.
 * - `isPending`: A boolean indicating if the deletion is currently in progress (loading state).
 * - `isError`: A boolean indicating if the deletion failed.
 * - `error`: The error object if the deletion failed.
 * - `isSuccess`: A boolean indicating if the deletion was successful.
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  
  const { 
    mutate: deleteDoc, 
    isPending, 
    isError, 
    error,
    isSuccess 
  } = useMutation({
    mutationFn: deleteDocument,
    
    onSuccess: (_, documentId) => {
      console.log('Document deleted successfully:', documentId);
      // Invalidate all document queries since we don't know which appeal this document belonged to
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      // Also invalidate appeals data in case it includes document counts
      queryClient.invalidateQueries({ queryKey: ['appeals'] });
    },
    onError: (error) => {
      console.error('Document deletion failed:', error.message);
    },
  });

  return {
    deleteDocument: deleteDoc,
    isPending,
    isError,
    error,
    isSuccess
  };
};
