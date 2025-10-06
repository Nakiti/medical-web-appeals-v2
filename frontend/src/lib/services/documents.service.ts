import apiClient from '../apiClient';

// Define the expected shape of the Document object
export interface Document {
  id: string;
  appealId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

// Define the shape of the documents response
export interface DocumentsResponse {
  message: string;
  documents: Document[];
  count: number;
}

// Define the shape of the upload response
export interface UploadDocumentsResponse {
  message: string;
  documents: Document[];
  count: number;
}

/**
 * Makes an API call to get all documents for a specific appeal.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} appealId - The appeal ID.
 * @returns {Promise<Document[]>} A promise that resolves with the documents array.
 */
export const getAppealDocuments = async (appealId: string): Promise<Document[]> => {
  const response = await apiClient.get<DocumentsResponse>(`/appeals/${appealId}/documents`);
  return response.data.documents;
};

/**
 * Makes an API call to upload documents to a specific appeal.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} appealId - The appeal ID.
 * @param {File[]} files - Array of files to upload.
 * @returns {Promise<Document[]>} A promise that resolves with the uploaded documents.
 */
export const uploadAppealDocuments = async (appealId: string, files: File[]): Promise<Document[]> => {
  const formData = new FormData();
  
  // Append each file to the form data
  files.forEach((file) => {
    formData.append('documents', file);
  });
  
  const response = await apiClient.post<UploadDocumentsResponse>(`/appeals/${appealId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.documents;
};

/**
 * Makes an API call to delete a specific document.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} documentId - The document ID.
 * @returns {Promise<void>} A promise that resolves when the document is deleted.
 */
export const deleteDocument = async (documentId: string): Promise<void> => {
  await apiClient.delete(`/documents/${documentId}`);
};
