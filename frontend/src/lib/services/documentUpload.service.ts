import apiClient from '../apiClient';
import { DocumentUploadResponse, DocumentUploadRequest, DocumentDeleteRequest } from '../../types/documents';

/**
 * Uploads multiple documents for an appeal
 * @param appealId - The ID of the appeal
 * @param files - Array of files to upload
 * @returns Promise with uploaded document data
 */
export const uploadDocuments = async (
  appealId: string, 
  files: File[]
): Promise<DocumentUploadResponse[]> => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append(`documents`, file);
  });
  
  const response = await apiClient.post<{ documents: DocumentUploadResponse[] }>(
    '/appeals/upload-documents',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data.documents;
};

/**
 * Deletes documents by their IDs
 * @param documentIds - Array of document IDs to delete
 * @returns Promise that resolves when deletion is complete
 */
export const deleteDocuments = async (documentIds: string[]): Promise<void> => {
  await apiClient.delete('/appeals/documents', {
    data: { documentIds }
  });
};

/**
 * Gets documents for a specific appeal
 * @param appealId - The ID of the appeal
 * @returns Promise with document data
 */
export const getAppealDocuments = async (appealId: string): Promise<DocumentUploadResponse[]> => {
  const response = await apiClient.get<{ documents: DocumentUploadResponse[] }>(
    `/appeals/${appealId}/documents`
  );
  
  return response.data.documents;
};
