"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAppeal, useUpdateAppeal } from "@/hooks/useAppeals";
import NavigationButtons from "@/components/appealForm/NavigationButtons";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { appealerDetailsSchema, type AppealerDetailsInput } from "@/lib/schemas/appeals.schema";

interface AppealerDetailsPageProps {
  params: { appealId: string };
}

const AppealerDetailsPage: React.FC<AppealerDetailsPageProps> = ({ params }) => {
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
  } = useForm<AppealerDetailsInput>({
    resolver: zodResolver(appealerDetailsSchema),
  });

  // 4. Populate the form with data once it's fetched from the backend
  useEffect(() => {
    console.log("appealData", appealData)
    if (appealData) {
      // The `reset` function populates the form with the fetched data
      reset(appealData.appeal.parsedData as AppealerDetailsInput);
    }
  }, [appealData, reset]);

  // 5. This function is called when the form is submitted
  const onSubmit = (formData: AppealerDetailsInput) => {
    console.log("formData", formData)
    updateAppeal({ 
      id: appealId, 
      data: { parsedData: formData as Record<string, any> } 
    }, {
      onSuccess: () => {
        // Only navigate to the next step after the data is successfully saved
        router.push(`/appeal/${appealId}/patient-details`);
      },
      onError: (err: Error) => {
        console.error("Failed to save appealer details:", err);
        // Optionally, show an error toast to the user
      },
    });
  };

  return (
    <div className="w-full flex items-center justify-center px-4 py-4">
      <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2">
        <div className="mb-4">
          <p className="text-lg sm:text-xl text-left">First, Your Details</p>
          <p className="text-2xl sm:text-3xl font-semibold text-left">
            Fill In Appealer Details
          </p>
        </div>

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
                placeholder="Enter Relation"
                {...register("appealerRelation")}
              />
            </FormField>
          </div>

          <NavigationButtons
            backHref={`/appeal/${appealId}/form-upload`}
            nextHref={`/appeal/${appealId}/patient-details`}
            isLoading={isSaving}
          />
        </form>
      </div>
    </div>
  );
}

export default AppealerDetailsPage