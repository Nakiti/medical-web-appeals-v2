import React from 'react';
import { useRouter } from 'next/navigation';
import { FilePenLine, CheckCircle2 } from 'lucide-react';

interface NavbarActionsProps {
  appealId: string;
  status: string;
  onComplete: () => void;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ 
  appealId, 
  status, 
  onComplete 
}) => {
  const router = useRouter();

  if (status !== "draft") {
    return null;
  }

  return (
    <div className="flex flex-shrink-0 gap-3 self-start md:self-center">
      <button
        onClick={() => router.push(`/appeal/${appealId}/patient-details`)}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 text-white hover:bg-slate-600 rounded-md transition-colors"
      >
        <FilePenLine size={16} />
        Guided Form
      </button>
      <button 
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 rounded-md transition-colors shadow-md"
        onClick={onComplete}
        type="submit"
      >
        <CheckCircle2 size={16} />
        Mark Completed
      </button>
    </div>
  );
};

export default NavbarActions;
