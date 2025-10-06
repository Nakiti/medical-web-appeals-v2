"use client";
import { use } from "react";
import { useGetAppealUpdates } from "@/hooks/useUpdates";
import { UpdatesPage } from "@/components/updates";

interface UpdatesPageProps {
  params: Promise<{ appealId: string }>;
}

const Updates: React.FC<UpdatesPageProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const appealId = unwrappedParams.appealId;
  
  const { updates, isLoading, isError, error } = useGetAppealUpdates(appealId);

  return (
    <UpdatesPage 
      updates={updates || []} 
      isLoading={isLoading} 
      isError={isError} 
      error={error} 
    />
  );
};

export default Updates;