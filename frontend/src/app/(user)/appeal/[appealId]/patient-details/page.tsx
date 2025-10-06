"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAppeal, useUpdateAppeal } from "@/hooks/useAppeals";
import NavigationButtons from "@/components/appealForm/NavigationButtons";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { patientDetailsSchema, type PatientDetailsInput } from "@/lib/schemas/appeals.schema";

interface PatientDetailsPageProps {
  params: { appealId: string };
}

const PatientDetailsPage: React.FC<PatientDetailsPageProps> = ({ params }) => {
  const router = useRouter();
  const { appealId } = params;

  // 1. Fetch the current appeal data from the backend
  const { appeal: appealData, isLoading, error } = useGetAppeal(appealId);

  // 2. Setup the mutation to save the form data
  const { updateAppeal, isPending: isSaving } = useUpdateAppeal();

  // 3. Initialize react-hook-form to manage the form state with proper typing
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<PatientDetailsInput>({
    resolver: zodResolver(patientDetailsSchema),
  });

  // 4. Populate the form with data once it's fetched from the backend
  useEffect(() => {
    if (appealData?.parsedData) {
      // The `reset` function populates the form with the fetched data
      reset(appealData.parsedData as PatientDetailsInput);
    }
  }, [appealData, reset]);

  // 5. This function is called when the form is submitted
  const onSubmit = (formData: PatientDetailsInput) => {
    updateAppeal({ 
      id: appealId, 
      data: { parsedData: formData as Record<string, any> } 
    }, {
      onSuccess: () => {
        // Only navigate to the next step after the data is successfully saved
        router.push(`/appeal/${appealId}/letter-details`);
      },
      onError: (err: Error) => {
        console.error("Failed to save patient details:", err);
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
          <p className="text-lg sm:text-xl text-left">Verify Details</p>
          <p className="text-2xl sm:text-3xl font-semibold text-left">
            Fill In Patient Details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              error={errors.firstName?.message}
            >
              <Input
                placeholder="Enter First Name"
                {...register("firstName")}
              />
            </FormField>

            <FormField
              label="Last Name"
              error={errors.lastName?.message}
            >
              <Input
                placeholder="Enter Last Name"
                {...register("lastName")}
              />
            </FormField>

            <FormField
              label="Policy Number"
              error={errors.policyNumber?.message}
            >
              <Input
                placeholder="Enter Policy Number"
                {...register("policyNumber")}
              />
            </FormField>

            <FormField
              label="Date of Birth"
              error={errors.dob?.message}
            >
              <Input
                type="date"
                {...register("dob")}
              />
            </FormField>
          </div>

          <NavigationButtons
            backHref={`/appeal/${appealId}/appealer-details`}
            nextHref={`/appeal/${appealId}/letter-details`}
            isLoading={isSaving}
          />
        </form>
      </div>
    </div>
  );
}

export default PatientDetailsPage