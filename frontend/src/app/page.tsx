"use client"
import React from 'react';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { useCreateAppeal } from '@/hooks';
import { useRouter } from 'next/navigation';


// Main Landing Page Component
export default function LandingPage() {
  const router = useRouter()

  const navLinks = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  const { createAppeal, isPending, isError, error, isSuccess } = useCreateAppeal()

  const handleCreateAppeal = () => {
    createAppeal({
      parsedData: {},
      denialLetterUrl: '',
      generatedLetter: ''
    }, {
      onSuccess: (data) => {
        // Navigate to the new appeal page when creation is successful
        if (data?.appealId) {
          router.push(`/appeal/${data.appealId}/claim-number`)
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans">
      <Header navLinks={navLinks} />
      
      <main>
        <Hero handleCreate={handleCreateAppeal}/>
        <HowItWorks />
        <Features />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}