import apiClient from '../apiClient';
import { AppealStatus, GetAppealsQueryInput, UpdateAppealInput, GenerateLetterInput, CreateAppealInput } from '../schemas/appeals.schema';

// Define the expected shape of the Appeal object
export interface Appeal {
  id: string;
  userId: string;
  denialLetterUrl: string | null;
  parsedData: object | null;
  generatedLetter: string | null;
  status: AppealStatus;
  createdAt: string;
  updatedAt: string;
}

// Define the shape of the parsed letter response
export interface ParsedLetterResponse {
  parsedData: object;
  message: string;
}

// Define the shape of the generated letter response
export interface GeneratedLetterResponse {
  generatedLetter: string;
  message: string;
}

/**
 * Makes an API call to get all appeals for the authenticated user.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {GetAppealsQueryInput} query - Optional query parameters to filter appeals.
 * @returns {Promise<Appeal[]>} A promise that resolves with the user's appeals.
 */
export const getUserAppeals = async (query?: GetAppealsQueryInput): Promise<Appeal[]> => {
  const response = await apiClient.get<Appeal[]>('/appeals', { params: query });
  console.log("appeals ", response.data)
  return response.data;
};

/**
 * Makes an API call to get a single appeal by ID for the authenticated user.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} id - The appeal ID.
 * @returns {Promise<Appeal>} A promise that resolves with the appeal data.
 */
export const getAppealById = async (id: string): Promise<Appeal> => {
  const response = await apiClient.get<Appeal>(`/appeals/${id}`);
  return response.data;
};

/**
 * Makes an API call to update an appeal for the authenticated user.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} id - The appeal ID.
 * @param {UpdateAppealInput} updateData - The updated appeal data.
 * @returns {Promise<Appeal>} A promise that resolves with the updated appeal data.
 */
export const updateAppeal = async (id: string, updateData: UpdateAppealInput): Promise<Appeal> => {
  console.log("updateData", updateData)
  const response = await apiClient.put<Appeal>(`/appeals/${id}`, updateData);
  return response.data;
};

/**
 * Makes an API call to delete an appeal for the authenticated user.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} id - The appeal ID.
 * @returns {Promise<void>} A promise that resolves when the appeal is deleted.
 */
export const deleteAppeal = async (id: string): Promise<void> => {
  await apiClient.delete(`/appeals/${id}`);
};

/**
 * Makes an API call to parse a denial letter using Azure Document Intelligence.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {File} file - The denial letter file to parse.
 * @returns {Promise<ParsedLetterResponse>} A promise that resolves with the parsed data.
 */
export const parseDenialLetter = async (file: File): Promise<ParsedLetterResponse> => {
  const formData = new FormData();
  formData.append('denialLetter', file);
  
  const response = await apiClient.post<ParsedLetterResponse>('/appeals/parse', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log("response from backend ", response)
  return response.data;
};

/**
 * Makes an API call to generate an appeal letter using OpenAI.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {GenerateLetterInput} data - The data needed to generate the letter.
 * @returns {Promise<GeneratedLetterResponse>} A promise that resolves with the generated letter.
 */
export const generateAppealLetter = async (data: GenerateLetterInput): Promise<GeneratedLetterResponse> => {
  const response = await apiClient.post<GeneratedLetterResponse>(`/appeals/generate-letter/${data.appealId}`, data);
  return response.data;
};

export const generatePDFForAppeal = async (data): Promise<GeneratedLetterResponse> => {
  const response = await apiClient.post<GeneratedLetterResponse>(`/appeals/generate-pdf/${data.appealId}`, { letterText: data.letterText });
  console.log("response from backend ", response)
  return response.data;
};


/**
 * Makes an API call to save a complete appeal with generated PDF.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {CreateAppealInput} data - The appeal data to save.
 * @returns {Promise<Appeal>} A promise that resolves with the created appeal data.
 */
export const createAppeal = async (data: CreateAppealInput): Promise<Appeal> => {
  const response = await apiClient.post<Appeal>('/appeals', data);
  return response.data;
};
