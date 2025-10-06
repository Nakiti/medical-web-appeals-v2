import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

interface ProgressBarProps {
   appealId: string;
}

const ProgressBar = ({appealId}: ProgressBarProps) => {
   const pathname = usePathname();
   let keyword = pathname.split("/")[3];
   if (keyword === "login-account" || keyword === "create-account") {
      keyword = "account";
   }
   const router = useRouter()

   const paths = [
      `/appeal/${appealId}/claim-number`,
      `/appeal/${appealId}/account`,
      `/appeal/${appealId}/form-upload`,
      `/appeal/${appealId}/appealer-details`,
      `/appeal/${appealId}/patient-details`,
      `/appeal/${appealId}/letter-details`,
      `/appeal/${appealId}/procedure-details`,
      `/appeal/${appealId}/additional-details`,
      `/appeal/${appealId}/summary`,
      `/appeal/${appealId}/review`
   ];

   const currentIndex = paths.findIndex(path => path.includes(keyword));
   const progressPercentage = ((currentIndex + 1) / paths.length) * 100;
   const handleBack = () => {
      router.push("/")
   }

   const handleSave = () => {
      // Simple save functionality - just show an alert for now
      alert("Form saved successfully!");
   }

   return (
      <div className="flex flex-row items-center gap-4 p-4 sm:w-11/12 md:w-7/12 self-center mx-auto">
         <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
            onClick={handleBack}
         >
            <ArrowLeft size={20} />
         </button>

         <div className="w-full">
            <div className="h-2 bg-gray-200 rounded-full">
               <div
               className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300 rounded-full"
               style={{ width: `${progressPercentage}%` }}
               ></div>
                       <div className="mt-1 text-right text-xs text-gray-500 font-medium">
          Step {currentIndex + 1} of {paths.length}
        </div>
            </div>
         </div>

         {currentIndex !== 0 && (
            <button
               className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
               onClick={handleSave}
            >
               <Save size={16} />
               Save
            </button>
         )}
      </div>
   );
}

export default ProgressBar