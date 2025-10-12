"use client";

import Link from "next/link";
import { Edit } from "lucide-react";
import React from "react";

interface SummaryItemProps {
  title: string;
  fields: string[];
  inputs: Record<string, any>;
  appealId: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ title, fields, inputs, appealId }) => {
  const formatFieldName = (str: string) => str.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
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
        {fields.map((field) => (
          <div key={field}>
            <p className="text-xs text-slate-500">{formatFieldName(field)}</p>
            <p className="text-sm font-medium text-slate-700 break-words">{inputs?.[field] || "Not provided"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryItem;



