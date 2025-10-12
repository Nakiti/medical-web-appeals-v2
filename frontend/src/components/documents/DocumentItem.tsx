"use client";

import { FileText, Trash2 } from "lucide-react";
import { Document } from "@/lib/services/documents.service";
import { useDeleteDocument } from "@/hooks/useDocuments";

interface DocumentItemProps {
  document: Document;
  onRemove: (documentId: string) => void;
  isDeleting?: boolean;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  onRemove,
  isDeleting = false
}) => {
  const handleRemove = () => {
    onRemove(document.id);
  };

  const handleView = () => {
    window.open(document.fileUrl, "_blank");
  };

  return (
    <div className="flex items-center text-sm text-slate-700 bg-slate-50 p-4 border rounded-md hover:bg-slate-100">
      <FileText size={18} className="mr-2 text-slate-500" />
      <span
        className="truncate cursor-pointer flex-1"
        onClick={handleView}
        title={document.fileName}
      >
        {document.fileName}
      </span>
      <span className="ml-auto text-xs text-gray-400 mr-4">
        {new Date(document.createdAt).toLocaleDateString()}
      </span>
      <button
        onClick={handleRemove}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
        title="Delete document"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default DocumentItem;

