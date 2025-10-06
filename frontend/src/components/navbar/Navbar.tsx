import React from 'react';
import { useGetAppeal, useUpdateAppeal } from '@/hooks/useAppeals';
import NavbarHeader from './NavbarHeader';
import NavbarActions from './NavbarActions';
import NavbarTabs from './NavbarTabs';

interface NavLink {
  title: string;
  pathName: string;
}

interface NavbarProps {
  appealId: string;
  links: NavLink[];
  back: string;
  status?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  appealId, 
  links = [], 
  back = "/",
  status = "draft"
}) => {
  const { appeal, isLoading, isError, error } = useGetAppeal(appealId);
  const { updateAppeal } = useUpdateAppeal();

  const handleComplete = async () => {
    try {
      await updateAppeal({ 
        id: appealId, 
        data: { status: 'submitted' } 
      });
      // TODO: Replace location.reload() with proper state management
      window.location.reload();
    } catch (err) {
      console.error('Failed to complete appeal:', err);
    }
  };

  if (isLoading) {
    return <div className="bg-slate-900 h-[220px] animate-pulse"></div>;
  }

  if (isError || !appeal) {
    return (
      <div className="bg-slate-900 text-white border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-red-400">
            Error loading appeal: {error?.message || 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Row: Info and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <NavbarHeader appeal={appeal} status={status} back={back} />
          <NavbarActions 
            appealId={appealId} 
            status={status} 
            onComplete={handleComplete} 
          />
        </div>

        {/* Progress Bar Section - Currently commented out */}
        {/* {status !== "draft" && (
          <div className="px-0 md:px-8">
            <ProgressBar currentStep={progress} />
          </div>
        )} */}
      </div>

      {/* Tab Navigation */}
      <NavbarTabs links={links} />
    </div>
  );
};

export default Navbar;
