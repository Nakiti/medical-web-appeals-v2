/**
 * File upload service for handling denial letters and other file uploads.
 * This service provides utilities for file validation and preparation.
 */

// Define allowed file types for denial letters
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/tiff'
] as const;

// Define file size limits (10MB in bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates if a file meets the requirements for denial letter uploads.
 *
 * @param {File} file - The file to validate.
 * @returns {object} An object containing validation result and error message if invalid.
 */
export const validateDenialLetterFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only PDF and image files (JPEG, PNG, TIFF) are allowed.'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size too large. Maximum file size is 10MB.'
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty. Please select a valid file.'
    };
  }

  return { isValid: true };
};

/**
 * Formats file size in a human-readable format.
 *
 * @param {number} bytes - The file size in bytes.
 * @returns {string} Formatted file size string.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets the file extension from a filename.
 *
 * @param {string} filename - The filename.
 * @returns {string} The file extension (without the dot).
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Checks if a file type is supported for denial letter uploads.
 *
 * @param {string} mimeType - The MIME type of the file.
 * @returns {boolean} True if the file type is supported.
 */
export const isSupportedFileType = (mimeType: string): boolean => {
  return ALLOWED_FILE_TYPES.includes(mimeType as any);
};

/**
 * Creates a preview URL for image files.
 * Note: Remember to revoke the URL when done to prevent memory leaks.
 *
 * @param {File} file - The file to create a preview for.
 * @returns {string} The preview URL.
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a file preview URL to free up memory.
 *
 * @param {string} url - The URL to revoke.
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
