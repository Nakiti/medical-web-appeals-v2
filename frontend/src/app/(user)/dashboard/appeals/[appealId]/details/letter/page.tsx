"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAppeal, useUpdateAppeal } from "@/hooks/useAppeals";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { letterDetailsSchema, type LetterDetailsInput } from "@/lib/schemas/appeals.schema";

interface LetterDetailsPageProps {
  params: { appealId: string };
}

const LetterDetailsPage: React.FC<LetterDetailsPageProps> = ({ params }) => {
  const { appealId } = params;

  // Fetch the current appeal data from the backend
  const { appeal: appealData, isLoading, error } = useGetAppeal(appealId);

  // Setup the mutation to save the form data
  const { updateAppeal, isPending: isSaving } = useUpdateAppeal();

  // Initialize react-hook-form to manage the form state with proper typing
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<LetterDetailsInput>({
    resolver: zodResolver(letterDetailsSchema),
  });

  // Populate the form with data once it's fetched from the backend
  useEffect(() => {
    if (appealData?.parsedData) {
      // The `reset` function populates the form with the fetched data
      reset(appealData.parsedData as LetterDetailsInput);
    }
  }, [appealData, reset]);

  // This function is called when the form is submitted
  const onSubmit = (formData: LetterDetailsInput) => {
    updateAppeal({ 
      id: appealId, 
      data: { parsedData: formData as Record<string, any> } 
    }, {
      onSuccess: () => {
        console.log("Letter details saved successfully");
      },
      onError: (err: Error) => {
        console.error("Failed to save letter details:", err);
      },
    });
  };

  // UI state for loading and errors
  if (isLoading) {
    return <div>Loading letter details...</div>;
  }

  if (error) {
    return <div>Error loading appeal data. Please try again.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-6">
      <h1 className="text-2xl font-light text-gray-900 mb-1">Letter Details</h1>
      <h3 className="text-md text-gray-600 mb-4">Information About the Letter</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Insurance Provider"
            error={errors.insuranceProvider?.message}
          >
            <Input
              placeholder="Enter Insurance Provider"
              {...register("insuranceProvider")}
            />
          </FormField>

          <FormField
            label="Insurance Address"
            error={errors.insuranceAddress?.message}
          >
            <Input
              placeholder="Enter Insurance Address"
              {...register("insuranceAddress")}
            />
          </FormField>

          <FormField
            label="Physician Name"
            error={errors.physicianName?.message}
          >
            <Input
              placeholder="Enter Physician Name"
              {...register("physicianName")}
            />
          </FormField>

          <FormField
            label="Physician Phone"
            error={errors.physicianPhone?.message}
          >
            <Input
              placeholder="Enter Physician Phone"
              {...register("physicianPhone")}
            />
          </FormField>

          <FormField
            label="Physician Address"
            error={errors.physicianAddress?.message}
          >
            <Input
              placeholder="Enter Physician Address"
              {...register("physicianAddress")}
            />
          </FormField>

          <FormField
            label="Physician Email"
            error={errors.physicianEmail?.message}
          >
            <Input
              type="email"
              placeholder="Enter Physician Email"
              {...register("physicianEmail")}
            />
          </FormField>
        </div>

        <div className="w-full flex flex-row mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className={`ml-auto px-6 py-3 w-40 rounded-md shadow-sm text-md text-white transition cursor-pointer
              ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
            `}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LetterDetailsPage;