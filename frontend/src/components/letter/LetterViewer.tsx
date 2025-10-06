"use client";

interface LetterViewerProps {
  letterUrl?: string;
  isLoading?: boolean;
  noLetterMessage?: string;
}

const LetterViewer: React.FC<LetterViewerProps> = ({
  letterUrl,
  isLoading = false,
  noLetterMessage = "No letter available yet. Click Regenerate to create one."
}) => {
  if (letterUrl && !isLoading) {
    return (
      <iframe 
        src={letterUrl} 
        title="Appeal Letter" 
        className="w-full h-full" 
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 text-slate-500 text-center px-4">
        <p className="text-md">Generating appeal letter...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full bg-slate-50 text-slate-500 text-center px-4">
      <p className="text-md">
        {noLetterMessage}
      </p>
    </div>
  );
};

export default LetterViewer;

