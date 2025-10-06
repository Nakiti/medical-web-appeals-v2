import { useState, useCallback } from 'react';
import { useParseDenialLetter } from './useAppeals';
import { validateDenialLetterFile, createFilePreview, revokeFilePreview } from '@/lib/services/fileUpload.service';

/**
 * A custom React hook for handling file uploads, specifically for denial letters.
 * It provides file validation, preview functionality, and integration with the appeals parsing service.
 *
 * @returns An object containing:
 * - `selectedFile`: The currently selected file.
 * - `filePreview`: The preview URL for the selected file.
 * - `validationError`: Any validation error for the selected file.
 * - `isUploading`: A boolean indicating if a file is currently being uploaded/parsed.
 * - `selectFile`: Function to select a file with validation.
 * - `clearFile`: Function to clear the selected file.
 * - `uploadFile`: Function to upload and parse the selected file.
 * - `parseLetter`: The mutation function from useParseDenialLetter.
 * - `isPending`: Loading state from the parse mutation.
 * - `isError`: Error state from the parse mutation.
 * - `error`: Error object from the parse mutation.
 * - `isSuccess`: Success state from the parse mutation.
 */
export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    parseLetter,
    isPending: isUploading,
    isError,
    error,
    isSuccess
  } = useParseDenialLetter();

  /**
   * Selects a file and validates it.
   * Clears any previous validation errors and creates a preview if it's an image.
   */
  const selectFile = useCallback((file: File) => {
    // Clear previous file and preview
    if (filePreview) {
      revokeFilePreview(filePreview);
    }

    // Validate the file
    const validation = validateDenialLetterFile(file);
    
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid file');
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    // Clear validation error and set the file
    setValidationError(null);
    setSelectedFile(file);

    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const preview = createFilePreview(file);
      setFilePreview(preview);
    } else {
      setFilePreview(null);
    }
  }, [filePreview]);

  /**
   * Clears the selected file and any preview.
   */
  const clearFile = useCallback(() => {
    if (filePreview) {
      revokeFilePreview(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setValidationError(null);
  }, [filePreview]);

  /**
   * Uploads and parses the selected file.
   * Returns early if no file is selected or if there's a validation error.
   */
  const uploadFile = useCallback(() => {
    if (!selectedFile || validationError) {
      return;
    }

    parseLetter(selectedFile);
  }, [selectedFile, validationError, parseLetter]);

  return {
    selectedFile,
    filePreview,
    validationError,
    isUploading,
    selectFile,
    clearFile,
    uploadFile,
    parseLetter,
    isPending: isUploading,
    isError,
    error,
    isSuccess
  };
};
