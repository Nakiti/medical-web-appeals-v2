import { Clock, FolderOpen, CheckCircle } from "lucide-react";

export type SummaryData = {
   submittedCount: number;
   draftCount: number;
   dueSoonCount: number;
   approvedCount?: number;
};

type SummaryBarProps = {
   data: SummaryData;
};

const SummaryBar = ({ data }: SummaryBarProps) => {
   const stats = [
      {
         label: "Appeals Submitted",
         value: data.submittedCount,
         icon: <CheckCircle className="text-green-500" size={20} />,
      },
      {
         label: "Drafts",
         value: data.draftCount,
         icon: <FolderOpen className="text-blue-500" size={20} />,
      },
      {
         label: "Appeals Due Soon",
         value: data.dueSoonCount,
         icon: <Clock className="text-yellow-500" size={20} />,
      },
   ];

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 bg-white rounded-xl py-4 shadow-sm">
         {stats.map((stat, idx) => (
            <div
               key={idx}
               className={`flex flex-col items-start p-5 ${idx !== 0 ? "border-l-2 border-slate-200" : ""}`}
            >
               <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl">{stat.icon}</div>
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
               </div>
               <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
            </div>
         ))}
      </div>
   );
};

export default SummaryBar;



