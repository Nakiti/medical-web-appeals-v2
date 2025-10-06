import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  currentStep: string;
}

const steps = ["Create Appeal", "Submitted", "In Review", "Decision Made"];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStepIndex >= index;
          const isCurrent = currentStepIndex === index;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-slate-700 border-slate-500 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <span className="font-bold text-sm">{index + 1}</span>
                  )}
                </div>
                <p className={`mt-2 text-xs font-medium ${
                  isCompleted ? 'text-white' : 'text-slate-400'
                }`}>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${
                  isCompleted ? 'bg-indigo-600' : 'bg-slate-600'
                }`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
