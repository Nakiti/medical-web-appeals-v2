"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAppeal, useUpdateAppeal } from "@/hooks/useAppeals";
import NavigationButtons from "@/components/appealForm/NavigationButtons";
import { FormField } from "@/components/shared/FormField";
import { Textarea } from "@/components/ui/textarea";
import { additionalDetailsSchema, type AdditionalDetailsInput } from "@/lib/schemas/appeals.schema";

interface AdditionalDetailsPageProps {
  params: { appealId: string };
}

const AdditionalDetailsPage: React.FC<AdditionalDetailsPageProps> = ({ params }) => {
  const router = useRouter();
  const { appealId } = params;

  // 1. Fetch the current appeal data from the backend
  const { appeal: appealData, isLoading, error } = useGetAppeal(appealId);

  // 2. Setup the mutation to save the form data
  const { mutate: updateAppeal, isPending: isSaving } = useUpdateAppeal();

  // 3. Initialize react-hook-form to manage the form state with proper typing
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<AdditionalDetailsInput>({
    resolver: zodResolver(additionalDetailsSchema),
  });

  // 4. Populate the form with data once it's fetched from the backend
  useEffect(() => {
    if (appealData) {
      // The `reset` function populates the form with the fetched data
      reset(appealData.appeal.parsedData as AdditionalDetailsInput);
    }
  }, [appealData, reset]);

  // 5. This function is called when the form is submitted
  const onSubmit = (formData: AdditionalDetailsInput) => {
    updateAppeal({ 
      id: appealId, 
      data: { parsedData: formData as Record<string, any> } 
    }, {
      onSuccess: () => {
        // Only navigate to the next step after the data is successfully saved
        router.push(`/appeal/${appealId}/summary`);
      },
      onError: (err: Error) => {
        console.error("Failed to save appeal details:", err);
        // Optionally, show an error toast to the user
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
    <div className="w-full flex items-center justify-center px-4 py-4">
      <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2">
        <div className="mb-4">
          <p className="text-lg sm:text-xl text-left">Anything Else?</p>
          <p className="text-2xl sm:text-3xl font-semibold text-left">
            Provide Any Details Relevant to Your Appeal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Additional Details"
            error={errors.additionalDetails?.message}
          >
            <Textarea
              className="w-full h-56"
              placeholder="Enter Additional Details"
              {...register("additionalDetails")}
            />
          </FormField>

          <NavigationButtons
            backHref={`/appeal/${appealId}/procedure-details`}
            nextHref={`/appeal/${appealId}/summary`}
            isLoading={isSaving}
          />
        </form>
      </div>
    </div>
  );
}

export default AdditionalDetailsPage