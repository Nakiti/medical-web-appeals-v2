"use client";

import { FileText } from "lucide-react";

interface Document {
  name: string;
  uploadedAt: string;
}

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="mt-2">
        <h4 className="text-sm font-medium text-slate-700 mb-2">Uploaded Documents</h4>
        <p className="text-sm text-slate-500 italic">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h4 className="text-sm font-medium text-slate-700 mb-2">Uploaded Documents</h4>
      <ul className="space-y-1">
        {documents.map((file, idx) => (
          <li
            key={idx}
            className="flex items-center text-sm text-gray-600 gap-2 border-b border-dashed border-slate-300 py-1"
          >
            <FileText size={16} />
            {file.name}
            <span className="ml-auto text-xs text-gray-400">
              Uploaded: {file.uploadedAt}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;

