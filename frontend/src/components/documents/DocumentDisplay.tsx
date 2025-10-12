"use client";

import React from "react";
import { FileText } from "lucide-react";
import type { Document } from "@/lib/services/documents.service";

interface DocumentDisplayProps {
  document: Document;
}

const DocumentDisplay: React.FC<DocumentDisplayProps> = ({ document }) => {
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
      <span className="ml-auto text-xs text-gray-400">
        {new Date(document.createdAt).toLocaleDateString()}
      </span>
    </div>
  );
};

export default DocumentDisplay;


