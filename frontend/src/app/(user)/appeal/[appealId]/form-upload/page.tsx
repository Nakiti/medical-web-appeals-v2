"use client"

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// TODO: Install react-icons package or use alternative icons
// import { FaUpload, FaPencilAlt } from "react-icons/fa";
import { useGetAppeal, useParseDenialLetter, useUpdateAppeal } from "@/hooks/useAppeals";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { documentUploadSchema, type DocumentUploadInput } from "@/lib/schemas/appeals.schema";

// TODO: Create DocumentDisplay component with TypeScript
// TODO: Create extractAppealDetails service
// TODO: Create document processing service

// Safely extract parsed data from the parseLetter response
function extractParsedData(response: unknown) {
  if (
    typeof response === "object" &&
    response !== null &&
    "parsedData" in response &&
    typeof (response as any).parsedData === "object" &&
    (response as any).parsedData !== null &&
    "parsedData" in (response as any).parsedData
  ) {
    return (response as any).parsedData.parsedData;
  }
  return undefined;
}

interface FormUploadPageProps {
  params: { appealId: string };
}

const FormUploadPage: React.FC<FormUploadPageProps> = ({ params }) => {
  const router = useRouter();
  const { appealId } = params;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<Array<{ id: number; file: File }>>([]);

  // 1. Fetch the current appeal data from the backend
  // const { appeal: appealData, isLoading, error } = useGetAppeal(appealId);

  // 2. Setup the mutation to save the form data
  const { mutate: updateAppeal, isPending: isUpdating } = useUpdateAppeal();
  const {mutate: parseLetter, isPending: isParsing} = useParseDenialLetter()
  // 3. Initialize react-hook-form to manage the form state with proper typing
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<DocumentUploadInput>({
    resolver: zodResolver(documentUploadSchema),
  });

  // 4. File upload hook
  const { 
    selectedFile, 
    filePreview, 
    validationError, 
    isUploading, 
    selectFile, 
    clearFile, 
    uploadFile 
  } = useFileUpload();

  const isBusy = isParsing || isUpdating || isUploading;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      selectFile(file);
      setDocuments(prev => [...prev, { id: Date.now(), file }]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleManualEntry = () => {
    router.push(`/appeal/${appealId}/appealer-details`);
  };

  const handleNext = async (formData: DocumentUploadInput) => {
    if (documents.length > 0) {
      const file = documents[0].file;
      
      // Call the mutate function
      parseLetter(file, {
        onSuccess: (response) => {
          // This callback runs after the parsing is successful
          console.log("Response from parsing:", response);
          const parsedData = extractParsedData(response);
          console.log("parsedData", parsedData)
          if (parsedData === undefined) {
            console.error("Unexpected parse response shape", response);
            return;
          }
  
          updateAppeal({
            id: appealId,
            data: { parsedData: parsedData } // Use the data from the first mutation
          }, {
            onSuccess: (res) => {
              // Navigate only after the final step succeeds
              console.log("Response from updating appeal:", res);
              router.push(`/appeal/${appealId}/appealer-details`);
            },
            onError: (err) => {
              console.error("Failed to update appeal:", err);
              // TODO: Show an error toast to the user
            }
          });
        },
        onError: (err) => {
          console.error("Error parsing document:", err);
          // TODO: Show an error toast to the user
        }
      });
    } else {
      // Handle case with no documents if needed
      router.push(`/appeal/${appealId}/appealer-details`);
    }
  };

  const handleRemove = (id: number) => {
    setDocuments(documents.filter(item => item.id !== id));
  };

  // UI state for loading and errors
  // if (isLoading) {
  //   return <div>Loading your draft...</div>;
  // }

  // if (error) {
  //   return <div>Error loading appeal data. Please try again.</div>;
  // }

  if (isBusy) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {isParsing ? "Parsing document..." : isUpdating ? "Updating appeal..." : "Uploading file..."}
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center px-4 py-4">
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
        <div className="mb-16">
          <p className="text-lg sm:text-xl text-left">Onto the Next Step!</p>
          <p className="text-2xl sm:text-3xl font-semibold text-left">
            Upload any forms/letters relevant to the appeal
          </p>
        </div>

        <form onSubmit={handleSubmit(handleNext)} className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            disabled={isBusy}
          />

          <Button
            type="button"
            onClick={handleUploadClick}
            className="flex items-center justify-center w-full rounded-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm sm:text-base"
            disabled={isBusy}
          >
            <span>📁</span>
            <span className="ml-3">Upload Files</span>
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-center w-full">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 font-semibold text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleManualEntry}
            className="flex items-center justify-center w-full rounded-full p-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold text-sm sm:text-base"
            disabled={isBusy}
          >
            <span>✏️</span>
            <span className="ml-3">Enter Details Manually</span>
          </Button>

          {/* File Preview */}
          {filePreview && (
            <div className="mt-4">
              <img src={filePreview} alt="File preview" className="max-w-full h-auto rounded-lg" />
            </div>
          )}

          {/* Validation Error */}
          {validationError && (
            <p className="text-red-600 text-sm mt-2">{validationError}</p>
          )}

          {/* Uploaded Files */}
          {documents.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <span className="text-sm">{item.file.name}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(item.id)}
                disabled={isBusy}
              >
                Remove
              </Button>
            </div>
          ))}

          {/* Next Button */}
          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full mt-16 flex-1 text-center rounded-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-base hover:opacity-90 transition duration-200 shadow-md"
          >
            {isUpdating ? "Saving..." : "Next"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FormUploadPage;