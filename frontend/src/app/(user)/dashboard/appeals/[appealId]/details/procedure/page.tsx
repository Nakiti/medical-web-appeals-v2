"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAppeal, useUpdateAppeal } from "@/hooks/useAppeals";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { procedureDetailsSchema, type ProcedureDetailsInput } from "@/lib/schemas/appeals.schema";

interface ProcedureDetailsPageProps {
  params: { appealId: string };
}

const ProcedureDetailsPage: React.FC<ProcedureDetailsPageProps> = ({ params }) => {
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
  } = useForm<ProcedureDetailsInput>({
    resolver: zodResolver(procedureDetailsSchema),
  });

  // Populate the form with data once it's fetched from the backend
  useEffect(() => {
    if (appealData?.parsedData) {
      // The `reset` function populates the form with the fetched data
      reset(appealData.parsedData as ProcedureDetailsInput);
    }
  }, [appealData, reset]);

  // This function is called when the form is submitted
  const onSubmit = (formData: ProcedureDetailsInput) => {
    updateAppeal({ 
      id: appealId, 
      data: { parsedData: formData as Record<string, any> } 
    }, {
      onSuccess: () => {
        console.log("Procedure details saved successfully");
      },
      onError: (err: Error) => {
        console.error("Failed to save procedure details:", err);
      },
    });
  };

  // UI state for loading and errors
  if (isLoading) {
    return <div>Loading procedure details...</div>;
  }

  if (error) {
    return <div>Error loading appeal data. Please try again.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-6">
      <h1 className="text-2xl font-light text-gray-900 mb-1">Procedure Details</h1>
      <h3 className="text-md text-gray-600 mb-4">Information About the Procedure</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Procedure Name"
          error={errors.procedureName?.message}
        >
          <Input
            placeholder="Enter Procedure Name"
            {...register("procedureName")}
          />
        </FormField>

        <FormField
          label="Denial Reason"
          error={errors.denialReason?.message}
        >
          <Textarea
            rows={4}
            placeholder="Enter the reason for the denial"
            {...register("denialReason")}
            className="resize-none"
          />
        </FormField>

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

export default ProcedureDetailsPage;