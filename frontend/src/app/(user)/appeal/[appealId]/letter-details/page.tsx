"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAppeal, useUpdateAppeal } from "@/hooks/useAppeals";
import NavigationButtons from "@/components/appealForm/NavigationButtons";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { letterDetailsSchema, type LetterDetailsInput } from "@/lib/schemas/appeals.schema";

interface LetterDetailsPageProps {
  params: { appealId: string };
}

const LetterDetailsPage: React.FC<LetterDetailsPageProps> = ({ params }) => {
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
  } = useForm<LetterDetailsInput>({
    resolver: zodResolver(letterDetailsSchema),
  });

  // 4. Populate the form with data once it's fetched from the backend
  useEffect(() => {
    if (appealData) {
      // The `reset` function populates the form with the fetched data
      reset(appealData.appeal.parsedData as LetterDetailsInput);
    }
  }, [appealData, reset]);

  // 5. This function is called when the form is submitted
  const onSubmit = (formData: LetterDetailsInput) => {
    updateAppeal({ 
      id: appealId, 
      data: { parsedData: formData as Record<string, any> } 
    }, {
      onSuccess: () => {
        // Only navigate to the next step after the data is successfully saved
        router.push(`/appeal/${appealId}/procedure-details`);
      },
      onError: (err: Error) => {
        console.error("Failed to save letter details:", err);
        // Optionally, show an error toast to the user
      },
    });
  };

  return (
    <div className="w-full flex items-center justify-center px-4 py-4">
      <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2">
        <div className="mb-4">
          <p className="text-lg sm:text-xl text-left">Verify Details</p>
          <p className="text-2xl sm:text-3xl font-semibold text-left">
            Fill In The Letter's Details
          </p>
        </div>

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
              label="Physician Phone Number"
              error={errors.physicianPhone?.message}
            >
              <Input
                placeholder="Enter Phone Number"
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

          <NavigationButtons
            backHref={`/appeal/${appealId}/patient-details`}
            nextHref={`/appeal/${appealId}/procedure-details`}
            isLoading={isSaving}
          />
        </form>
      </div>
    </div>
  );
}

export default LetterDetailsPage