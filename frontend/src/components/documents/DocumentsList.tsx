"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Document } from "@/lib/services/documents.service";
import DocumentItem from "./DocumentItem";
import { useDeleteDocument } from "@/hooks/useDocuments";

interface DocumentsListProps {
  documents: Document[];
  onDocumentRemove: (documentId: string) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onDocumentRemove
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { deleteDocument, isPending } = useDeleteDocument();

  const handleRemove = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      onDocumentRemove(documentId);
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Uploaded Files</h2>
        {documents.length > 0 && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center text-sm text-indigo-600 hover:underline"
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
            {isExpanded ? "Hide Files" : "Show Files"}
          </button>
        )}
      </div>
      
      {documents.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No documents uploaded yet.</p>
      ) : (
        isExpanded && (
          <div className="space-y-2">
            {documents.map((document) => (
              <DocumentItem
                key={document.id}
                document={document}
                onRemove={handleRemove}
                isDeleting={isPending}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default DocumentsList;

