"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Edit, FileText, Loader2, Send, ArrowLeft } from 'lucide-react';

// Assuming these are your actual imports
import { AuthContext } from "@/app/context/authContext";
import { FormContext } from "@/app/context/formContext";
import { writeAppealLetter } from "@/app/services/gptServices";
import DocumentDisplay from "../../components/documentDisplay";


// A dedicated loading state component
const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Crafting Your Appeal Letter</h2>
        <p className="text-slate-600 max-w-md">
            Our AI is analyzing your details to generate a personalized and persuasive appeal. This may take a moment.
        </p>
    </div>
);

// A reusable and improved component to display a section of the summary.
const SummaryItem = ({ title, fields, inputs, appealId }) => {
    const formatFieldName = (str) => str.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
    const detailsPath = title.split(' ')[0].toLowerCase().replace('details', '').trim();

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-5 flex justify-between items-center border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                <Link href={`/appeal/${appealId}/details/${detailsPath}`} className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    <Edit size={14} />
                    Edit
                </Link>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {fields.map(field => (
                    <div key={field}>
                        <p className="text-xs text-slate-500">{formatFieldName(field)}</p>
                        <p className="text-sm font-medium text-slate-700 break-words">{inputs[field] || "Not provided"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Summary = () => {
   const router = useRouter();
   const { currentUser } = useContext(AuthContext);
   const { inputs, appealId, documents, setAppealLetter, setAppealLetterUrl } = useContext(FormContext);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [disabled, setDisabled] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const sections = [
   { title: "Patient Details", fields: ["firstName", "lastName", "dob", "ssn"] },
   { title: "Letter Details", fields: ["insuranceProvider", "insuranceAddress", "physicianName", "physicianPhone", "physicianAddress", "physicianEmail"] },
   { title: "Procedure Details", fields: ["claimNumber", "procedureName", "denialReason"] },
   { title: "Additional Details", fields: ["additionalDetails"] },
   ];

   const handleCreate = async () => {
      setLoading(true);
      setError(""); // Clear previous errors
      let missingFields = [];
      Object.entries(inputs).forEach(([key, value]) => {
         if (!["dateFiled", "submitted", "status", "additionalDetails", "ssn", "notes"].includes(key)) {
               if (!value || /^\s*$/.test(value)) {
                  missingFields.push(key);
               }
         }
      });

      if (missingFields.length > 0) {
         const formatFieldName = str => str.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
         const formattedFields = missingFields.map(formatFieldName).join(", ");
         setError(`Please fill in all required fields: ${formattedFields}`);
         setLoading(false);
         window.scrollTo(0, 0); // Scroll to top to show error
         return;
      }

      try {
         const { file, url } = await writeAppealLetter(inputs);
         setAppealLetter(file);
         setAppealLetterUrl(url);
         router.push(`/appeal/${appealId}/review`);
      } catch (err) {
         console.error("Error submitting appeal:", err);
         setError("An error occurred while generating the appeal letter. Please try again.");
         setErrorMessage(`${err.error}. Resets at ${new Date(err.usage.resetsAt).toLocaleString("en-US")}`)
         setDisabled(true)
         setLoading(false);
         window.scrollTo(0, 0);
      }
   };

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
                              {documents.map((item, index) => (
                                 <li key={item.id || index}>
                                       <DocumentDisplay item={item} />
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

export default Summary;