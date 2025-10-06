/**
 * TypeScript types for document management in appeals
 */

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

export interface DocumentUploadResponse {
  id: string;
  appealId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadRequest {
  appealId: string;
  files: File[];
}

export interface DocumentDeleteRequest {
  documentIds: string[];
}

export interface DocumentUploadState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  isUploading: boolean;
}

export interface DocumentUploadProps {
  appealId: string;
  maxFiles?: number;
  onDocumentsChange?: (documents: Document[]) => void;
}

export interface DocumentListProps {
  documents: Document[];
  onRemove: (index: number) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  canEdit?: boolean;
}

export interface UploadAreaProps {
  onFileSelect: (files: File[]) => void;
  maxFiles: number;
  currentCount: number;
  disabled?: boolean;
}
