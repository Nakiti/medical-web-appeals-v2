"use client";

import { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { useUploadAppealDocuments } from "@/hooks/useDocuments";

interface FileUploadSectionProps {
  appealId: string;
  maxFiles: number;
  currentFileCount: number;
  isDraft: boolean;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  appealId,
  maxFiles,
  currentFileCount,
  isDraft
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const { uploadDocuments, isPending, isError, error } = useUploadAppealDocuments();

  const atUploadLimit = currentFileCount >= maxFiles;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (currentFileCount + files.length > maxFiles) {
      return;
    }
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      await uploadDocuments({ appealId, files: selectedFiles });
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  if (!isDraft) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => !atUploadLimit && fileInputRef.current?.click()}
          className={`w-full sm:w-1/2 px-6 py-4 border-2 border-dashed rounded-md text-sm flex items-center justify-center transition ${
            atUploadLimit
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-slate-400 text-slate-600 hover:bg-slate-50"
          }`}
          disabled={atUploadLimit}
        >
          <FiUploadCloud size={20} className="mr-2" />
          {atUploadLimit ? "Max Uploads Reached" : "Click to Upload Files"}
        </button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected files:</p>
          {selectedFiles.map((file, index) => (
            <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {file.name}
            </div>
          ))}
          <button
            onClick={handleUpload}
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      )}

      {isError && (
        <div className="text-red-600 text-sm">
          Upload failed: {error?.message || "Unknown error"}
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;

