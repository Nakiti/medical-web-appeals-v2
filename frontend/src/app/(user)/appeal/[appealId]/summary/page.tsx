"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Edit, Send, ArrowLeft } from 'lucide-react';
import { useGetAppeal } from "@/hooks/useAppeals";
import { useGetAppealDocuments } from "@/hooks/useDocuments";
import LoadingState from "@/components/shared/LoadingState";
import SummaryItem from "@/components/appeals/SummaryItem";
import DocumentDisplay from "@/components/documents/DocumentDisplay";
import { useGenerateAppealLetter } from "@/hooks/useAppeals";
import { useAuth } from "@/providers/AuthProvider";
import AuthModal from "@/components/appealForm/AuthModal";


interface SummaryPageProps {
    params: { appealId: string };
}

const Summary: React.FC<SummaryPageProps> = ({ params }) => {
   const router = useRouter();
   const { appealId } = params;
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [disabled, setDisabled] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const { appeal, isLoading: isAppealLoading } = useGetAppeal(appealId);
   const { documents, isLoading: isDocumentsLoading } = useGetAppealDocuments(appealId);
   const { generateLetter, isPending: isGenerating } = useGenerateAppealLetter()
   const { isAuthenticated } = useAuth();
   const [showAuthModal, setShowAuthModal] = useState(false);


   const inputs = useMemo<Record<string, any>>(() => {
      return (appeal?.appeal.parsedData as Record<string, any>) || {};
   }, [appeal]);

   const sections = [
     { title: "Patient Details", fields: ["firstName", "lastName", "dob", "ssn"] },
     { title: "Letter Details", fields: ["insuranceProvider", "insuranceAddress", "physicianName", "physicianPhone", "physicianAddress", "physicianEmail"] },
     { title: "Procedure Details", fields: ["claimNumber", "procedureName", "denialReason"] },
     { title: "Additional Details", fields: ["additionalDetails"] },
   ];

   const handleCreate = async () => {
      console.log(isAuthenticated)
      if (isAuthenticated) {
         setLoading(true);
         setError("");

         const missingFields: string[] = [];
         Object.entries(inputs).forEach(([key, value]) => {
            if (!["dateFiled", "submitted", "status", "additionalDetails", "ssn", "notes", "userId"].includes(key)) {
               if (!value || /^\s*$/.test(String(value))) {
                  missingFields.push(key);
               }
            }
         });

         if (missingFields.length > 0) {
            const formatFieldName = (str: string) => str.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
            const formattedFields = missingFields.map(formatFieldName).join(", ");
            setError(`Please fill in all required fields: ${formattedFields}`);
            setLoading(false);
            window.scrollTo(0, 0);
            return;
         }

         generateLetter({parsedData: inputs, appealId}, {
            onSuccess: () => {
               router.push(`/appeal/${appealId}/review`);
               console.log("Appeal letter generated successfully");
            },
            onError: (err: Error) => {
               console.error("Error generating appeal letter:", err);
         }})
         setLoading(false);
   } else {
      setShowAuthModal(true);
   };
   }

   if (loading) {
      return <LoadingState />;
   }

   return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
         <div className="space-y-8">
               {/* Header */}
               <div>
                  <h1 className="text-3xl font-bold text-slate-900">Review & Generate Appeal</h1>
                  <p className="mt-1 text-slate-600">
                     Please review all the details below. If everything is correct, proceed to generate your appeal letter.
                  </p>
               </div>

               {/* Error Message */}
               {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                     <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                     <div>
                           <h3 className="font-semibold text-red-800">Missing Information</h3>
                           <p className="text-sm text-red-700">{error}</p>
                     </div>
                  </div>
               )}

              <AuthModal
                 showModal={showAuthModal}
                 onClose={() => setShowAuthModal(false)}
                 redirectUrl={`/appeal/${appealId}/summary`}
              />

               {disabled && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                     <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                     <div>
                           <h3 className="font-semibold text-red-800">Too Many Requests</h3>
                           <p className="text-sm text-red-700">{errorMessage}</p>
                     </div>
                  </div>
               )}

               {/* Summary Sections */}
               <div className="space-y-6">
                  {sections.map(({ title, fields }, index) => (
                     <SummaryItem title={title} fields={fields} inputs={inputs} appealId={appealId} key={index} />
                  ))}
               </div>

               {/* Files Section */}
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="p-5 border-b border-slate-200">
                     <h3 className="text-lg font-semibold text-slate-800">Supporting Documents</h3>
                  </div>
                  <div className="p-5">
                     {documents && documents.length > 0 ? (
                           <ul className="space-y-3">
                              {documents.map((doc) => (
                                 <li key={doc.id}>
                                       <DocumentDisplay document={doc} />
                                 </li>
                              ))}
                           </ul>
                     ) : (
                           <p className="text-sm text-slate-500">No documents have been uploaded.</p>
                     )}
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
                  <button
                     onClick={handleCreate}
                     className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                  >
                     <Send size={18} />
                     Generate Appeal Letter
                  </button>
                  <Link
                     href={`/appeal/${appealId}/additional-details`}
                     className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-base font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
                  >
                     <ArrowLeft size={18} />
                     Back
                  </Link>
               </div>
         </div>
      </div>
   );
};

export default Summary