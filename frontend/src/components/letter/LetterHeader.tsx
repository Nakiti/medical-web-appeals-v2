"use client";

import { FiRefreshCcw } from "react-icons/fi";

interface LetterHeaderProps {
  title: string;
  description: string;
  showRegenerateButton?: boolean;
  onRegenerate?: () => void;
  isLoading?: boolean;
  hasChanged?: boolean;
  writeUsage?: {
    remaining: number;
    limit: number;
  };
  disabled?: boolean;
  errorMessage?: string;
}

const LetterHeader: React.FC<LetterHeaderProps> = ({
  title,
  description,
  showRegenerateButton = false,
  onRegenerate,
  isLoading = false,
  hasChanged = false,
  writeUsage,
  disabled = false,
  errorMessage
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-white shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>

      {showRegenerateButton && (
        <div className="flex flex-col items-end">
          <button
            onClick={onRegenerate}
            disabled={isLoading || !hasChanged || disabled}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition ${
              isLoading || !hasChanged || disabled
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90"
            }`}
          >
            <FiRefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Generating..." : "Regenerate"}
          </button>

          {writeUsage && (
            <p className="text-xs text-slate-500 mt-2">
              Generates Left: <span className="font-semibold text-slate-700">{writeUsage.remaining}</span> / {writeUsage.limit}
            </p>
          )}

          {disabled && errorMessage && (
            <p className="text-xs mt-1 text-red-600">{errorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LetterHeader;

