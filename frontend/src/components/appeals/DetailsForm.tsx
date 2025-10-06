"use client";
import { useState, useEffect, useContext, useMemo } from "react";
import { updateAppeal } from "@/app/services/updateServices";
import FormInput from "./input";
import { FormContext } from "@/app/context/formContext";

const DetailsForm = ({ title, subtitle, fields, onSave }) => {
   const { inputs, handleInputsChange, appealId, documents, status } = useContext(FormContext);
   const [initialInputs, setInitialInputs] = useState({});
   const [isSaving, setIsSaving] = useState(false);

   useEffect(() => {
      setInitialInputs(inputs); // set baseline when component mounts
   }, []);

   const isChanged = useMemo(() => {
      return JSON.stringify(inputs) !== JSON.stringify(initialInputs);
   }, [inputs, initialInputs]);

   const handleSave = async () => {
      setIsSaving(true);
      await updateAppeal(appealId, inputs, documents);
      setInitialInputs(inputs); // update baseline after save
      setIsSaving(false);
      if (onSave) onSave(); // trigger optional callback
   };

   return (
      <div className="w-full max-w-4xl mx-auto py-4 px-6">
         <h1 className="text-2xl font-light text-gray-900 mb-1">{title}</h1>
         <h3 className="text-md text-gray-600 mb-4">{subtitle}</h3>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {fields.map((field) => (
               <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value={inputs[field.name]}
                  onChange={handleInputsChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  type={field.type}
               />
            ))}
         </div>

         <div className="w-full flex flex-row mt-6">
            <button
               onClick={handleSave}
               disabled={!isChanged || isSaving || status != "draft"}
               className={`ml-auto px-6 py-3 w-40 rounded-md shadow-sm text-md text-white transition 
                  ${!isChanged || isSaving || status != "draft" ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
               `}
            >
               {isSaving ? "Saving..." : status !== "draft" ? "Submitted" : "Save"}
            </button>
         </div>
      </div>
   );
};

export default DetailsForm;