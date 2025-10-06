import React from 'react';
import { CalendarDays, Circle, CircleDot } from 'lucide-react';
import { Appeal } from '@/lib/services/appeals.service';

interface StatusBadgeProps {
  status: string;
  appeal: Appeal;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, appeal }) => {
  if (status === "draft") {
    return (
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full">
          <Circle className="w-3 h-3" />
          Draft
        </span>
        {/* TODO: Add appeal_deadline field to Appeal interface when available */}
        <span className="inline-flex items-center gap-1.5 text-red-400 text-xs font-medium">
          <CalendarDays className="w-3.5 h-3.5" />
          Appeal Deadline: {new Date().toLocaleDateString("en-US")}
        </span>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
      <CircleDot className="w-3 h-3" />
      {status}
    </span>
  );
};

export default StatusBadge;
