import { useContext, useState, useRef, useEffect } from "react";
import { FormContext } from "@/app/context/formContext";
import { User, FileText, Shield, Stethoscope, UploadCloud, Sparkles, ChevronUp, ChevronDown, Trash2, Loader2 } from 'lucide-react';
import { createBatchFiles } from "@/app/services/createServices";
import { deleteFiles } from "@/app/services/deleteServices";
import { extractAppealDetails, getUsageStats } from "@/app/services/gptServices";


const FileUploadSection = () => {
   const fileInputRef = useRef();
   const { documents, setDocuments, setInputs, appealId } = useContext(FormContext);
   const [isParsing, setIsParsing] = useState(false);
   const [isUploading, setIsUploading] = useState(false);
   const [hasUnparsedFiles, setHasUnparsedFiles] = useState(false);
   const [isExpanded, setIsExpanded] = useState(true);
   const [usage, setUsage] = useState(null)
   const [errorMessage, setErrorMessage] = useState("")
   const [disabled, setDisabled] = useState(false)
   const maxFiles = 3;

   const handleFileChange = async (e) => {
      const fileObjects = Array.from(e.target.files);
      if (documents.length + fileObjects.length > maxFiles) {
         alert(`You can only upload a maximum of ${maxFiles} files.`);
         return;
      }
      
      setIsUploading(true);
      try {
         const newDocs = await createBatchFiles(appealId, fileObjects);
         setDocuments(prev => [...newDocs, ...prev]);
         setHasUnparsedFiles(true);
      } catch (err) {
         console.error("Upload error:", err);
      } finally {
         setIsUploading(false);
      }
   };

   const handleRemove = async (index) => {
      const fileToRemove = documents[index];
      // Optimistically update UI
      const updatedDocuments = documents.filter((_, i) => i !== index);
      setDocuments(updatedDocuments);
      setHasUnparsedFiles(true); // Assume changes require re-parsing
      
      // Perform deletion in the background
      if (fileToRemove?.id) {
         try {
            await deleteFiles([fileToRemove.id]);
         } catch (err) {
            console.error("Failed to delete file:", err);
            // Optionally revert UI change if deletion fails
            setDocuments(prev => [...prev, fileToRemove].sort(/* maintain order */));
         }
      }
   };

   const handleParse = async () => {
      setIsParsing(true);
      try {
         const {content, usage} = await extractAppealDetails(documents);
         setInputs(prev => ({ ...prev, ...content }));
         setHasUnparsedFiles(false);
         setUsage(usage)
      } catch (err) {
         setDisabled(true)
         setErrorMessage(`${err.error} Resets at ${new Date(err.usage.resetsAt).toLocaleString("en-US")}`)
         console.error("Parsing error:", err);
      }
      setIsParsing(false);
   };

   useEffect(() => {
      const fetchData = async() => {
         const response = await getUsageStats()
         console.log("usage ", response)
         setUsage(response?.parse)
         if (response.parse.remaining == 0) {
            setDisabled(true)
            setErrorMessage(`You have exceeded your daily limit of parse requests. Resets at ${response.parse.resetsAt && new Date(response.parse.resetsAt).toLocaleString("en-US")}`)
         }
      }

      fetchData()
   }, [])

   const isParseDisabled = disabled || isParsing || documents.length === 0 || usage && usage.remaining == 0;
   const atUploadLimit = documents.length >= maxFiles;

   return (
      <div className="max-w-6xl mx-auto mb-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
               <h3 className="text-lg font-semibold text-slate-800">AI Document Analysis</h3>
               <p className="text-sm text-slate-500">Upload documents to automatically fill in form details.</p>
            </div>
            <div>
               <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                     onClick={() => !atUploadLimit && fileInputRef.current.click()}
                     disabled={atUploadLimit || isUploading}
                     className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud size={16} />}
                     <span>{atUploadLimit ? "Limit Reached" : "Upload"}</span>
                  </button>
                  <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <button
                     onClick={handleParse}
                       disabled={isParseDisabled}
                     className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles size={16} />}
                     <span>{isParsing ? "Parsing..." : "Parse"}</span>
                  </button>
               </div>
               <div className="text-right">
                  {usage && 
                     <p className="text-xs text-slate-500 mt-2">
                        Parses Left: <span className="font-semibold text-slate-700">{usage.remaining}</span> / {usage.limit}
                     </p>
                  }

                  {disabled && (
                     <p className="text-xs mt-1 text-red-600">{errorMessage}</p>
                  )}
               </div>
            </div>
         </div>

         {documents.length > 0 && (
               <div className="border-t border-slate-200 pt-4 space-y-3">
                  <button onClick={() => setIsExpanded(prev => !prev)} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                     {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                     <span>{isExpanded ? `Hide ${documents.length} Uploaded Document(s)` : `Show ${documents.length} Uploaded Document(s)`}</span>
                  </button>
                  {isExpanded && (
                     <ul className="space-y-2">
                           {documents.map((file, idx) => (
                              <li key={file.id || idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                 <div className="flex items-center gap-3 overflow-hidden">
                                       <FileText size={18} className="text-slate-500 flex-shrink-0" />
                                       <a href={file.blob_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-800 truncate hover:underline" title={file.file_name}>
                                          {file.file_name}
                                       </a>
                                 </div>
                                 <button onClick={(e) => { e.stopPropagation(); handleRemove(idx); }} className="p-1.5 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors" title="Remove file">
                                       <Trash2 size={16} />
                                 </button>
                              </li>
                           ))}
                     </ul>
                  )}
               </div>
         )}
      </div>
   );
};

export default FileUploadSection