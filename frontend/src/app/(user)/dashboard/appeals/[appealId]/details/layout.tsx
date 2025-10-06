"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { User, FileText, Shield, Stethoscope } from 'lucide-react';
import { useGetAppeal } from "@/hooks/useAppeals";
import FileUploadSection from "@/components/appeals/FileUploadSection";

interface DetailsLayoutProps {
  params: { appealId: string };
  children: React.ReactNode;
}

const DetailsLayout: React.FC<DetailsLayoutProps> = ({ params, children }) => {
  const { appealId } = params;
  const pathName = usePathname();
  
  // Fetch appeal data to check status
  const { appeal, isLoading } = useGetAppeal(appealId);

  const links = [
    { title: "Patient", path: `/user/dashboard/appeals/${appealId}/details/patient`, icon: User },
    { title: "Letter", path: `/user/dashboard/appeals/${appealId}/details/letter`, icon: FileText },
    { title: "Appealer", path: `/user/dashboard/appeals/${appealId}/details/appealer`, icon: Shield },
    { title: "Procedure", path: `/user/dashboard/appeals/${appealId}/details/procedure`, icon: Stethoscope },
  ];

  const renderLinks = (isMobile = false) => {
    const mobileClasses = "flex-shrink-0 px-4 py-2.5 rounded-md text-sm font-medium";
    const desktopClasses = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium";

    return links.map((item) => {
      const isActive = pathName === item.path;
      return (
        <Link
          key={item.path}
          href={item.path}
          className={`transition-all duration-200 ${isMobile ? mobileClasses : desktopClasses} ${
            isActive
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
          }`}
        >
          <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
          <span>{item.title}</span>
        </Link>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] p-6 sm:p-8 flex items-center justify-center">
            <div>Loading appeal details...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Conditional Upload Section */}
      {/* {appeal?.status === "draft" && <FileUploadSection />} */}

      {/* Main Layout Container */}
      <div className="max-w-6xl mx-auto">
        {/* Mobile/Tablet Tab Navigation */}
        <div className="md:hidden mb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                {renderLinks(true)}
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5">
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 sticky top-24">
                    <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Sections
                    </h3>
                    <nav className="flex flex-col space-y-1">
                        {renderLinks()}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="w-full md:w-3/4 lg:w-4/5">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] p-6 sm:p-8">
                    {children}
                </div>
            </main>
        </div>
      </div>
    </div>
  );
};

export default DetailsLayout;