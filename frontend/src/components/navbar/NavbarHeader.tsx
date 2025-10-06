import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Appeal } from '@/lib/services/appeals.service';
import StatusBadge from './StatusBadge';

interface NavbarHeaderProps {
  appeal: Appeal;
  status: string;
  back: string;
}

const NavbarHeader: React.FC<NavbarHeaderProps> = ({ appeal, status, back }) => {
  const router = useRouter();

  return (
    <div className="flex items-start gap-4">
      <button 
        onClick={() => router.push(back)} 
        className="mt-1.5 p-1.5 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
      </button>
      <div>
        <h1 className="text-2xl font-bold text-white">
          {/* TODO: Add claim_number field to Appeal interface when available */}
          Claim #: {appeal.id}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {status === "submitted"
            ? `Filed: ${new Date(appeal.createdAt).toLocaleDateString("en-US")}`
            : `Created: ${new Date(appeal.createdAt).toLocaleDateString("en-US")}`}
        </p>
        <div className="mt-3">
          <StatusBadge status={status} appeal={appeal} />
        </div>
      </div>
    </div>
  );
};

export default NavbarHeader;
