"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAppeal, useUpdateAppeal, useCreateAppeal } from "@/hooks/useAppeals";
import { useSession } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { reviewSchema, type ReviewInput } from "@/lib/schemas/appeals.schema";

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
  const [appealLetter, setAppealLetter] = useState<string>("");
  const [appealLetterUrl, setAppealLetterUrl] = useState<string>("");
  const [documents, setDocuments] = useState<Array<{ id: number; file: File }>>([]);

  // 1. Fetch the current appeal data from the backend
  const { appeal: appealData, isLoading, error } = useGetAppeal(appealId);

  // 2. Setup the mutations
  const { updateAppeal, isPending: isUpdating } = useUpdateAppeal();
  const { createAppeal, isPending: isCreating } = useCreateAppeal();
  const { user } = useSession();

  // 3. Initialize react-hook-form to manage the form state with proper typing
  const { 
    register, 
    handleSubmit: formHandleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<ReviewInput>();

  // 4. Populate the form with data once it's fetched from the backend
  useEffect(() => {
    if (appealData?.parsedData) {
      reset(appealData.parsedData as ReviewInput);
    }
  }, [appealData, reset]);

  const handleSave = async (formData: ReviewInput) => {
    const appealData = {
      userId: user?.id,
      ...formData,
      status: "draft" as const,
    };

    try {
      if (appealId !== "new") {
        updateAppeal({ 
          id: appealId, 
          data: { 
            parsedData: appealData as Record<string, any>,
            denialLetterUrl: formData.appealLetterUrl || "",
            generatedLetter: formData.appealLetter || ""
          } 
        }, {
          onSuccess: () => {
            router.push(`/user/dashboard/appeals/${appealId}/details/patient`);
          },
          onError: (err: Error) => {
            console.error("Failed to save appeal:", err);
          },
        });
      } else {
        createAppeal({
          parsedData: appealData as Record<string, any>,
          denialLetterUrl: formData.appealLetterUrl || "",
          generatedLetter: formData.appealLetter || ""
        }, {
          onSuccess: (data) => {
            router.push(`/user/dashboard/appeals/${data.id}/details/patient`);
          },
          onError: (err: Error) => {
            console.error("Failed to create appeal:", err);
          },
        });
      }
    } catch (err) {
      console.error("Error processing appeal:", err);
    }
  };

  const handleSubmitAppeal = async (formData: ReviewInput) => {
    const appealData = {
      userId: user?.id,
      ...formData,
      dateFiled: new Date().toISOString().slice(0, 19).replace("T", " "),
      status: "submitted" as const,
    };

    try {
      if (appealId !== "new") {
        updateAppeal({ 
          id: appealId, 
          data: { 
            parsedData: appealData as Record<string, any>,
            denialLetterUrl: formData.appealLetterUrl || "",
            generatedLetter: formData.appealLetter || ""
          } 
        }, {
          onSuccess: () => {
            setShowSubmitDialog(false);
            router.push("/user/dashboard/home");
          },
          onError: (err: Error) => {
            console.error("Failed to submit appeal:", err);
          },
        });
      } else {
        createAppeal({
          parsedData: appealData as Record<string, any>,
          denialLetterUrl: formData.appealLetterUrl || "",
          generatedLetter: formData.appealLetter || ""
        }, {
          onSuccess: () => {
            setShowSubmitDialog(false);
            router.push("/user/dashboard/home");
          },
          onError: (err: Error) => {
            console.error("Failed to submit appeal:", err);
          },
        });
      }
    } catch (err) {
      console.error("Error submitting appeal:", err);
    }
  };

  const handleEdit = () => {
    router.push(`/appeal/${appealId}/appealer-details`);
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

      {appealLetterUrl ? (
        <iframe
          src={appealLetterUrl}
          className="w-full h-[600px] border border-gray-300 rounded-lg mb-6"
        />
      ) : (
        <div className="w-full h-[600px] bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center mb-6">
          <p className="text-gray-500">PDF document preview will appear here</p>
        </div>
      )}

      <div className="flex flex-col gap-4 w-3/4 mx-auto mt-8">
        <Button 
          type="button"
          className="w-full rounded-full py-3 sm:py-4 bg-indigo-600 text-white font-semibold text-base sm:text-lg hover:bg-indigo-700 transition duration-200"
          onClick={() => setShowSubmitDialog(true)}
        >
          Submit
        </Button>

        <Button 
          type="button"
          disabled={isUpdating || isCreating}
          onClick={() => handleSave({ status: "draft" })}
          className="w-full rounded-full py-3 sm:py-4 bg-indigo-600 text-white font-semibold text-base sm:text-lg hover:bg-indigo-500 transition duration-200"
        >
          {isUpdating || isCreating ? "Saving..." : "Save & Exit"}
        </Button>

        <Button 
          type="button"
          variant="secondary"
          className="w-full rounded-full py-3 sm:py-4 bg-gray-200 border border-gray-300 text-gray-700 font-semibold text-base sm:text-lg hover:bg-gray-100 transition duration-200"
          onClick={handleEdit}
        >
          Edit
        </Button>
      </div>

      {showSubmitDialog && (
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
                onClick={() => handleSubmitAppeal({ status: "submitted" })}
                className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Confirm & Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;