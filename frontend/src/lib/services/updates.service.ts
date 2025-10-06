import apiClient from '../apiClient';

// Define the expected shape of the Update object
export interface Update {
  id: string;
  appealId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Define the shape of the updates response
export interface UpdatesResponse {
  message: string;
  updates: Update[];
  count: number;
}

// Define the shape of the create update request
export interface CreateUpdateRequest {
  title: string;
  content: string;
}

// Define the shape of the create update response
export interface CreateUpdateResponse {
  message: string;
  update: Update;
}

// Define the shape of the update update request
export interface UpdateUpdateRequest {
  title?: string;
  content?: string;
}

// Define the shape of the update update response
export interface UpdateUpdateResponse {
  message: string;
  update: Update;
}

/**
 * Makes an API call to get all updates for a specific appeal.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} appealId - The appeal ID.
 * @returns {Promise<Update[]>} A promise that resolves with the updates array.
 */
export const getAppealUpdates = async (appealId: string): Promise<Update[]> => {
  const response = await apiClient.get<UpdatesResponse>(`/appeals/${appealId}/updates`);
  return response.data.updates;
};

/**
 * Makes an API call to create a new update for a specific appeal.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} appealId - The appeal ID.
 * @param {CreateUpdateRequest} updateData - The update data.
 * @returns {Promise<Update>} A promise that resolves with the created update.
 */
export const createAppealUpdate = async (appealId: string, updateData: CreateUpdateRequest): Promise<Update> => {
  const response = await apiClient.post<CreateUpdateResponse>(`/appeals/${appealId}/updates`, updateData);
  return response.data.update;
};

/**
 * Makes an API call to update an existing update.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} updateId - The update ID.
 * @param {UpdateUpdateRequest} updateData - The update data.
 * @returns {Promise<Update>} A promise that resolves with the updated update.
 */
export const updateAppealUpdate = async (updateId: string, updateData: UpdateUpdateRequest): Promise<Update> => {
  const response = await apiClient.put<UpdateUpdateResponse>(`/updates/${updateId}`, updateData);
  return response.data.update;
};

/**
 * Makes an API call to delete a specific update.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} updateId - The update ID.
 * @returns {Promise<void>} A promise that resolves when the update is deleted.
 */
export const deleteAppealUpdate = async (updateId: string): Promise<void> => {
  await apiClient.delete(`/updates/${updateId}`);
};

