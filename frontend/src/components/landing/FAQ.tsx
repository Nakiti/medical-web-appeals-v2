"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800"
      >
        <span>{question}</span>
        <ChevronDown className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? '-rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Is my personal health information secure?",
      answer: "Absolutely. We use bank-level, end-to-end encryption for all data you upload and store. Your privacy and security are our top priorities. We never share your data without your explicit consent."
    },
    {
      question: "What is the success rate of appeals using your platform?",
      answer: "While we cannot guarantee a specific outcome, our platform significantly increases your chances by ensuring your appeal is thorough, well-documented, and professionally written. Our AI identifies the most effective arguments based on data from thousands of successful cases."
    },
    {
      question: "What if I need to include additional information?",
      answer: "Our platform makes it easy. The AI-generated draft is fully editable. You can add, remove, or modify any part of the appeal letter before you finalize and submit it."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};
