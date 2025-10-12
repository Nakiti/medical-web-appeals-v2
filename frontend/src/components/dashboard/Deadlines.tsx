import Link from "next/link";

export type DeadlineItem = {
   id: string | number;
   claim_number: string;
   appeal_deadline: string;
};

type DeadlinesProps = {
   data: DeadlineItem[];
};

const Deadlines = ({ data }: DeadlinesProps) => {
   const sorted = [...(data ?? [])].sort(
      (a, b) => new Date(a.appeal_deadline).getTime() - new Date(b.appeal_deadline).getTime()
   );

   return (
      <div className="flex flex-col space-y-4 w-full">
         <div className="bg-white rounded-md p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mr-4 mb-2">Upcoming Deadlines</h2>
            {sorted.slice(0, 8).map((item) => (
               <Link
                  href={`/user/dashboard/appeals/${item.id}/details/patient`}
                  key={item.id}
               >
                  <div className="border-b border-gray-300 py-2 px-2 hover:bg-gray-100 cursor-pointer">
                     <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700 mb-1">Claim #: {item.claim_number}</p>
                     </div>
                     <p className="text-xs text-gray-700">{new Date(item.appeal_deadline).toLocaleDateString("en-US")}</p>
                  </div>
               </Link>
            ))}

            {sorted.length === 0 && (
               <p className="text-sm text-center my-24">No Upcoming Deadlines</p>
            )}
         </div>
      </div>
   );
};

export default Deadlines;



