import React from 'react';
import { Sparkles, FileText, ShieldCheck } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Our AI is trained on thousands of successful appeals. It identifies weaknesses in the insurer's denial and highlights the strongest points for your case."
    },
    {
      icon: FileText,
      title: "Automated Letter Generation",
      description: "Save hours of writing. Get a professionally structured, well-reasoned appeal letter drafted in seconds, complete with relevant policy citations."
    },
    {
      icon: ShieldCheck,
      title: "Bank-Level Security",
      description: "Your privacy is our priority. We use end-to-end encryption to protect your sensitive health information at all times."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Advantages</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need for a Successful Appeal
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            We leverage technology to give you an edge over the traditional, manual process.
          </p>
        </div>
        <div className="mt-12">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
