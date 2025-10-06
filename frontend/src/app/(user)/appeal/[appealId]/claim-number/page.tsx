"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAppeal, useUpdateAppeal } from "@/hooks/useAppeals";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { claimNumberSchema, type ClaimNumberInput } from "@/lib/schemas/appeals.schema";
import { useSession } from "@/hooks/useAuth";

interface ClaimNumberPageProps {
  params: { appealId: string };
}

const ClaimNumberPage: React.FC<ClaimNumberPageProps> = ({ params }) => {
  const router = useRouter();
  const { appealId } = params;
  const { user } = useSession();
  const [claimStatus, setClaimStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch the current appeal data from the backend
  // const { appeal: appealData, isLoading, error: fetchError } = useGetAppeal(appealId);

  // 2. Setup the mutation to save the form data
  const { updateAppeal, isPending: isSaving } = useUpdateAppeal();

  // 3. Initialize react-hook-form to manage the form state with proper typing
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors },
    watch
  } = useForm<ClaimNumberInput>({
    resolver: zodResolver(claimNumberSchema),
  });

  // 4. Populate the form with data once it's fetched from the backend
  // useEffect(() => {
  //   if (appealData?.parsedData) {
  //     // The `reset` function populates the form with the fetched data
  //     reset(appealData.parsedData as ClaimNumberInput);
  //   }
  // }, [appealData, reset]);

  // 5. This function is called when the form is submitted
  const onSubmit = async (formData: ClaimNumberInput) => {
    setError("");
    setLoading(true);

    try {
      // For now, we'll skip the claim number check and proceed directly
      // Save the form data first
      updateAppeal({ 
        id: appealId, 
        data: { parsedData: formData as Record<string, any> } 
      }, {
        onSuccess: () => {
          router.push(`/appeal/${appealId}/form-upload`);
        },
        onError: (err: Error) => {
          console.error("Failed to save claim details:", err);
          setError("Failed to save data. Please try again.");
        },
      });
    } catch (err) {
      console.error("Error saving claim details:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // UI state for loading and errors
  // if (isLoading) {
  //   return <div>Loading your draft...</div>;
  // }

  // if (fetchError) {
  //   return <div>Error loading appeal data. Please try again.</div>;
  // }

  return (
    <div className="w-full px-4">
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto py-4">
        <p className="text-lg sm:text-xl">Let's Get You Started!</p>
        <p className="text-2xl sm:text-3xl font-semibold">Enter Your Claim Number below:</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
          <FormField
            label="Claim Number"
            error={errors.claimNumber?.message}
          >
            <Input
              placeholder="Enter Claim Number"
              {...register("claimNumber")}
            />
          </FormField>

          <FormField
            label="Appeal Deadline"
            error={errors.appealDeadline?.message}
          >
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              {...register("appealDeadline")}
            />
          </FormField>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="mt-6 flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={loading || isSaving}
              className="w-full rounded-full px-6 py-3 sm:py-4 font-bold text-base sm:text-lg shadow-md transition duration-200"
            >
              {loading || isSaving ? "Saving..." : "Next"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimNumberPage;