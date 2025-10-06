"use client";

import { useParams } from "next/navigation";
import { useGetAppealDocuments, useAppeal } from "@/hooks";
import { FileUploadSection, DocumentsList } from "@/components/documents";

const DocumentsPage: React.FC = () => {
  const params = useParams();
  const appealId = params.appealId as string;
  const maxFiles = 3;

  // Get appeal data to check status
  const { appeal, isLoading: isAppealLoading } = useAppeal(appealId);
  
  // Get documents for this appeal
  const { documents, isLoading: isDocumentsLoading, isError, error } = useGetAppealDocuments(appealId);

  const handleDocumentRemove = (documentId: string) => {
    // The DocumentsList component handles the actual deletion
    // This is just a callback for any additional logic if needed
    console.log("Document removed:", documentId);
  };

  if (isAppealLoading || isDocumentsLoading) {
    return (
      <div className="p-10 bg-gradient-to-b from-white via-slate-50 to-slate-100 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg px-8 py-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 bg-gradient-to-b from-white via-slate-50 to-slate-100 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg px-8 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Documents</h1>
            <p className="text-gray-600">
              {error?.message || "Failed to load documents. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isDraft = appeal?.status === "draft";

  return (
    <div className="p-10 bg-gradient-to-b from-white via-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg px-8 py-10 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-light text-gray-900">Upload Documents</h1>
          <p className="text-sm text-gray-500">
            Submit medical records, letters, and supporting files for your appeal.
          </p>
        </div>

        {/* Upload Area */}
        <FileUploadSection
          appealId={appealId}
          maxFiles={maxFiles}
          currentFileCount={documents?.length || 0}
          isDraft={isDraft}
        />

        {/* Uploaded Documents */}
        <DocumentsList
          documents={documents || []}
          onDocumentRemove={handleDocumentRemove}
        />
      </div>
    </div>
  );
};

export default DocumentsPage;