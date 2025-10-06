"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAppeal, useUpdateAppeal } from "@/hooks/useAppeals";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { appealerDetailsSchema, type AppealerDetailsInput } from "@/lib/schemas/appeals.schema";

interface AppealerDetailsPageProps {
  params: { appealId: string };
}

const AppealerDetailsPage: React.FC<AppealerDetailsPageProps> = ({ params }) => {
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
  } = useForm<AppealerDetailsInput>({
    resolver: zodResolver(appealerDetailsSchema),
  });

  // Populate the form with data once it's fetched from the backend
  useEffect(() => {
    if (appealData?.parsedData) {
      // The `reset` function populates the form with the fetched data
      reset(appealData.parsedData as AppealerDetailsInput);
    }
  }, [appealData, reset]);

  // This function is called when the form is submitted
  const onSubmit = (formData: AppealerDetailsInput) => {
    updateAppeal({ 
      id: appealId, 
      data: { parsedData: formData as Record<string, any> } 
    }, {
      onSuccess: () => {
        console.log("Appealer details saved successfully");
      },
      onError: (err: Error) => {
        console.error("Failed to save appealer details:", err);
      },
    });
  };

  // UI state for loading and errors
  if (isLoading) {
    return <div>Loading appealer details...</div>;
  }

  if (error) {
    return <div>Error loading appeal data. Please try again.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-6">
      <h1 className="text-2xl font-light text-gray-900 mb-1">Appealer Details</h1>
      <h3 className="text-md text-gray-600 mb-4">Information About the Person Creating the Appeal</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            error={errors.appealerFirstName?.message}
          >
            <Input
              placeholder="Enter First Name"
              {...register("appealerFirstName")}
            />
          </FormField>

          <FormField
            label="Last Name"
            error={errors.appealerLastName?.message}
          >
            <Input
              placeholder="Enter Last Name"
              {...register("appealerLastName")}
            />
          </FormField>

          <FormField
            label="Address"
            error={errors.appealerAddress?.message}
          >
            <Input
              placeholder="Enter Address"
              {...register("appealerAddress")}
            />
          </FormField>

          <FormField
            label="Email Address"
            error={errors.appealerEmailAddress?.message}
          >
            <Input
              type="email"
              placeholder="Enter Email Address"
              {...register("appealerEmailAddress")}
            />
          </FormField>

          <FormField
            label="Phone Number"
            error={errors.appealerPhoneNumber?.message}
          >
            <Input
              placeholder="Enter Phone Number"
              {...register("appealerPhoneNumber")}
            />
          </FormField>

          <FormField
            label="Relation"
            error={errors.appealerRelation?.message}
          >
            <Input
              placeholder="Enter Appealer Relation"
              {...register("appealerRelation")}
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

export default AppealerDetailsPage;