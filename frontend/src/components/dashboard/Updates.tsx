import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type UpdateItem = {
   id: string | number;
   appeal_id: string | number;
   title: string;
   internal_name: string;
   text: string;
};

type UpdatesProps = {
   data: UpdateItem[];
};

const Updates = ({ data }: UpdatesProps) => {
   return (
      <div className="flex flex-col space-y-4 w-full">
         <div className="bg-white rounded-md p-4 md:p-6 shadow-sm">
            <Link href={`/user/dashboard/updates`} className="flex items-center mb-2">
               <h2 className="text-lg font-semibold text-gray-800 mr-2">Updates</h2>
               <ArrowRight size={16} />
            </Link>

            {(data ?? []).map((item) => (
               <Link
                  href={`/user/dashboard/appeals/${item.appeal_id}/updates`}
                  key={item.id}
               >
                  <div className="border-b border-gray-300 mb-4 p-2 hover:bg-gray-100 cursor-pointer">
                     <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                        <p className="text-sm text-gray-800">{item.internal_name}</p>
                     </div>
                     <p className="text-xs text-gray-700">{item.text}</p>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   );
};

export default Updates;



