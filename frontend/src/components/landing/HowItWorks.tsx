import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Upload Your Documents",
      description: "Securely upload your denial letter and related medical documents. Our system accepts various formats and ensures your data is protected."
    },
    {
      number: 2,
      title: "AI Drafts Your Appeal",
      description: "Our AI analyzes your documents, identifies the reason for denial, and drafts a compelling, evidence-based appeal letter for you to review."
    },
    {
      number: 3,
      title: "Review and Submit",
      description: "Make any edits you see fit, then submit your appeal directly through our platform or download it to send yourself. It's that simple."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">A Smarter Way to Appeal in 3 Steps</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">From denied claim to submitted appeal in minutes, not weeks.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
