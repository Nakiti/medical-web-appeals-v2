"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppeal, useGetAppealDocuments, useGenerateAppealLetter } from "@/hooks";
import { LetterHeader, LetterViewer } from "@/components/letter";

interface UsageStats {
  letter: {
    remaining: number;
    limit: number;
    resetsAt?: string;
  };
}

interface AppealLetter {
  appealId: string;
  blob_url: string;
  file_id: string;
}

interface LetterInputs {
  [key: string]: any;
}

const LetterPage: React.FC = () => {
  const params = useParams();
  const appealId = params.appealId as string;
  
  // Get appeal data
  const { appeal, isLoading: isAppealLoading } = useAppeal(appealId);
  
  // Get documents for this appeal
  const { documents, isLoading: isDocumentsLoading } = useGetAppealDocuments(appealId);
  
  // Generate letter mutation
  const { generateLetter, isPending: isGenerating, isError, error } = useGenerateAppealLetter();
  
  // Local state
  const [loading, setLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [writeUsage, setWriteUsage] = useState<UsageStats['letter'] | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [appealLetterUrl, setAppealLetterUrl] = useState<string | null>(null);
  const [appealLetter, setAppealLetter] = useState<AppealLetter | null>(null);
  
  // Store last used inputs to generate the letter
  const lastUsedInputsRef = useRef<LetterInputs | null>(null);
  
  // Mock inputs - TODO: Get from actual appeal data
  const inputs: LetterInputs = {
    // This should come from the appeal data
    patientName: "John Doe",
    // Add other input fields as needed
  };

  // Compare current inputs to the last-used ones
  useEffect(() => {
    if (!lastUsedInputsRef.current) {
      setHasChanged(true); // first load
    } else {
      const current = JSON.stringify(inputs);
      const previous = JSON.stringify(lastUsedInputsRef.current);
      setHasChanged(current !== previous);
    }

    // TODO: Implement getUsageStats service
    const fetchData = async () => {
      try {
        // Mock usage stats - replace with actual service call
        const mockUsage: UsageStats = {
          letter: {
            remaining: 5,
            limit: 10,
            resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        };
        setWriteUsage(mockUsage.letter);
        
        if (mockUsage.letter.remaining === 0) {
          setDisabled(true);
          setErrorMessage(`You have exceeded your daily limit of parse requests. Resets at ${new Date(mockUsage.letter.resetsAt!).toLocaleString("en-US")}`);
        }
      } catch (err) {
        console.error("Failed to fetch usage stats:", err);
      }
    };

    fetchData();
  }, [inputs]);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      // TODO: Implement the actual letter generation logic
      // This is a placeholder implementation
      console.log("Generating letter with inputs:", inputs);
      console.log("Available documents:", documents);
      
      // Mock letter generation
      const mockLetterUrl = "data:text/html,<h1>Generated Appeal Letter</h1><p>This is a placeholder for the generated letter.</p>";
      setAppealLetterUrl(mockLetterUrl);
      
      // Update usage stats
      if (writeUsage) {
        setWriteUsage(prev => prev ? { ...prev, remaining: prev.remaining - 1 } : null);
      }
      
      lastUsedInputsRef.current = { ...inputs };
      
    } catch (err: any) {
      console.error("Error regenerating letter:", err);
      setDisabled(true);
      setErrorMessage(`${err.error || "Unknown error"}. Please try again later.`);
    }
    setLoading(false);
  };

  if (isAppealLoading || isDocumentsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 p-10">
        <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200"></div>
            <div className="h-96 bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  const isDraft = appeal?.status === "draft";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 p-10">
      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        <LetterHeader
          title="Appeal Letter"
          description="Generate a letter using all the documents, details, and notes you have inputted!"
          showRegenerateButton={isDraft}
          onRegenerate={handleRegenerate}
          isLoading={loading}
          hasChanged={hasChanged}
          writeUsage={writeUsage || undefined}
          disabled={disabled}
          errorMessage={errorMessage}
        />

        <div className="h-[80vh] w-full">
          <LetterViewer
            letterUrl={appealLetterUrl || undefined}
            isLoading={loading}
            noLetterMessage="No letter available yet. Click Regenerate to create one."
          />
        </div>
      </div>
    </div>
  );
};

export default LetterPage;