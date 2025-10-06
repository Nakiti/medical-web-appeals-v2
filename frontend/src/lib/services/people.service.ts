import apiClient from '../apiClient';

// Define the expected shape of the Document object
export interface Document {
  name: string;
  uploadedAt: string;
}

// Define the expected shape of the Doctor object
export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

// Define the shape of the doctors response
export interface DoctorsResponse {
  message: string;
  doctors: Doctor[];
  count: number;
}

// Define the shape of the create doctor request
export interface CreateDoctorRequest {
  name: string;
  email: string;
  specialty: string;
}

// Define the shape of the create doctor response
export interface CreateDoctorResponse {
  message: string;
  doctor: Doctor;
}

/**
 * Makes an API call to get all doctors for a specific appeal.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} appealId - The appeal ID.
 * @returns {Promise<Doctor[]>} A promise that resolves with the doctors array.
 */
export const getAppealDoctors = async (appealId: string): Promise<Doctor[]> => {
  const response = await apiClient.get<DoctorsResponse>(`/appeals/${appealId}/doctors`);
  return response.data.doctors;
};

/**
 * Makes an API call to create a new doctor for a specific appeal.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} appealId - The appeal ID.
 * @param {CreateDoctorRequest} doctorData - The doctor data to create.
 * @returns {Promise<Doctor>} A promise that resolves with the created doctor.
 */
export const createAppealDoctor = async (appealId: string, doctorData: CreateDoctorRequest): Promise<Doctor> => {
  const response = await apiClient.post<CreateDoctorResponse>(`/appeals/${appealId}/doctors`, doctorData);
  return response.data.doctor;
};

/**
 * Makes an API call to update a doctor for a specific appeal.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} appealId - The appeal ID.
 * @param {string} doctorId - The doctor ID.
 * @param {Partial<CreateDoctorRequest>} updateData - The doctor data to update.
 * @returns {Promise<Doctor>} A promise that resolves with the updated doctor.
 */
export const updateAppealDoctor = async (appealId: string, doctorId: string, updateData: Partial<CreateDoctorRequest>): Promise<Doctor> => {
  const response = await apiClient.put<CreateDoctorResponse>(`/appeals/${appealId}/doctors/${doctorId}`, updateData);
  return response.data.doctor;
};

/**
 * Makes an API call to delete a doctor for a specific appeal.
 * Error handling is managed by the central Axios client's interceptor.
 *
 * @param {string} appealId - The appeal ID.
 * @param {string} doctorId - The doctor ID.
 * @returns {Promise<void>} A promise that resolves when the doctor is deleted.
 */
export const deleteAppealDoctor = async (appealId: string, doctorId: string): Promise<void> => {
  await apiClient.delete(`/appeals/${appealId}/doctors/${doctorId}`);
};

