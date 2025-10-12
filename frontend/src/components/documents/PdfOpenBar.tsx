"use client";

import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type PdfOpenBarProps = {
  url: string;
  className?: string;
};

const PdfOpenBar: React.FC<PdfOpenBarProps> = ({ url, className }) => {
  return (
    <div
      className={
        "w-full flex items-center justify-between gap-4 border border-indigo-200 bg-indigo-50 text-indigo-900 rounded-lg px-4 py-3 " +
        (className ?? "")
      }
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-md bg-white border border-indigo-200">
          <FileText className="text-indigo-600" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">Your PDF is ready</p>
          <p className="text-xs text-indigo-700 truncate">Open the generated letter in a new tab</p>
        </div>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0">
        <Button type="button" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
          <ExternalLink size={16} />
          Open PDF
        </Button>
      </a>
    </div>
  );
};

export default PdfOpenBar;


