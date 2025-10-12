"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetAppeal, useUpdateAppeal, useCreateAppeal } from "@/hooks/useAppeals";
import { useSession } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import type { ReviewInput } from "@/lib/schemas/appeals.schema";
import { useGeneratePDFForAppeal } from "@/hooks/useAppeals";
import { PdfOpenBar } from "@/components/documents";

// TODO: Create createAppealLetter service
// TODO: Create createFile service  
// TODO: Create createBatchFiles service
// TODO: Create updateAppeal service

interface ReviewPageProps {
  params: { appealId: string };
}

const ReviewPage: React.FC<ReviewPageProps> = ({ params }) => {
  const router = useRouter();
  const { appealId } = params;
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [letterText, setLetterText] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  // 1. Fetch the current appeal data from the backend
  const { appeal: appealData, isLoading, error } = useGetAppeal(appealId);

  // 2. Setup the mutations
  const { mutate: updateAppeal, isPending: isUpdating } = useUpdateAppeal();
  const { createAppeal, isPending: isCreating } = useCreateAppeal();
  const { generatePDF, isPending: isGeneratingPDF } = useGeneratePDFForAppeal();
  const { user } = useSession();

  // Populate the editor with the generated letter once it's fetched
  useEffect(() => {
    console.log("appealData", appealData)
    if (!appealData) return;
    const initial = (appealData as any).appeal.generatedLetter;
    setLetterText(typeof initial === "string" ? initial : "");
  }, [appealData]);

  const handleSave = async () => {
    router.push("/dashboard/home")
  };

  const handleGeneratePDF = async () => {
    generatePDF({ appealId: appealId, letterText: letterText }, {
      onSuccess: (data: any) => {
        console.log("data ", data)
        const url = (data && (data.sasUrl || (data.data && data.data.sasUrl))) ?? null;
        if (url) setPdfUrl(url);
      },
      onError: (err: Error) => {
        console.error("Failed to generate PDF:", err);
      },
    });
  };



  // UI state for loading and errors
  if (isLoading) {
    return <div>Loading your draft...</div>;
  }

  if (error) {
    return <div>Error loading appeal data. Please try again.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Review Your Claim</h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-5 lg:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Letter Editor</h2>
            <span className="text-xs text-gray-500">Autosave on Save & Exit</span>
          </div>
          <textarea
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            className="w-full h-[600px] border border-gray-300 rounded-lg p-4 bg-white text-gray-800 font-mono whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Start editing your letter..."
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Characters: {letterText.length}</span>
            <span>Words: {letterText.trim() ? letterText.trim().split(/\s+/).length : 0}</span>
          </div>
          {pdfUrl && (
            <div className="mt-4">
              <PdfOpenBar url={pdfUrl} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-3/4 mx-auto mt-8">
        <Button 
          type="button"
          className="w-full rounded-full py-3 sm:py-4 bg-indigo-600 text-white font-semibold text-base sm:text-lg hover:bg-indigo-700 transition duration-200"
          onClick={handleGeneratePDF}
        >
          Generate PDF
        </Button>

        <Button 
          type="button"
          disabled={isUpdating || isCreating}
          onClick={handleSave}
          className="w-full rounded-full py-3 sm:py-4 bg-indigo-600 text-white font-semibold text-base sm:text-lg hover:bg-indigo-500 transition duration-200 shadow-sm"
        >
          Save & Exit
        </Button>
      </div>

      {/* {showSubmitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Confirm Submission
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to submit your claim? You won't be able to make changes after submitting.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowSubmitDialog(false)}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitAppeal}
                className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Confirm & Submit
              </Button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ReviewPage;