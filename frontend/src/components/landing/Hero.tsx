import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Hero: React.FC = ({handleCreate} : any) => {
  return (
    <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 text-center bg-white">
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Turn Medical Claim <span className="text-indigo-600">Denials</span> into <span className="text-blue-500">Approvals</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          Navigating insurance appeals is complex and frustrating. Our AI-powered platform simplifies the entire process, helping you build a stronger case, faster. Stop fighting paperwork and start winning your appeals.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" onClick={handleCreate} className="px-8 py-3.5 rounded-full text-base font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
            Start Your Free Appeal
          </Button>
        </div>
      </div>
    </section>
  );
};
