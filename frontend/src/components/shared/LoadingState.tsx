"use client";

import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingStateProps {
  title?: string;
  description?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Crafting Your Appeal Letter",
  description = "Our AI is analyzing your details to generate a personalized and persuasive appeal. This may take a moment.",
}) => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
    <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
    <p className="text-slate-600 max-w-md">{description}</p>
  </div>
);

export default LoadingState;



