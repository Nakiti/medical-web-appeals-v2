import React from 'react';
import { Update } from '@/lib/services/updates.service';
import UpdatesList from './UpdatesList';

interface UpdatesPageProps {
  updates: Update[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
}

const UpdatesPage: React.FC<UpdatesPageProps> = ({ 
  updates, 
  isLoading, 
  isError, 
  error 
}) => {
  const categorizeUpdates = (updates: Update[]) => {
    const categorized = {
      Today: [] as Update[],
      Yesterday: [] as Update[],
      'Last Week': [] as Update[],
      Earlier: [] as Update[]
    };

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    updates.forEach((update) => {
      const updateDate = new Date(update.createdAt);
      const differenceInDays = Math.floor((today.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));

      if (differenceInDays === 0) {
        categorized.Today.push(update);
      } else if (differenceInDays === 1) {
        categorized.Yesterday.push(update);
      } else if (differenceInDays <= 7) {
        categorized['Last Week'].push(update);
      } else {
        categorized.Earlier.push(update);
      }
    });

    return categorized;
  };

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 bg-gradient-to-b from-white via-indigo-50 to-slate-100">
        <div className="container mx-auto md:px-8 bg-white p-6 rounded-md shadow-sm min-h-96">
          <h1 className="text-2xl text-gray-900 mb-6 font-semibold">Updates</h1>
          <div className="flex justify-center items-center min-h-48">
            <div className="text-gray-500">Loading updates...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 bg-gradient-to-b from-white via-indigo-50 to-slate-100">
        <div className="container mx-auto md:px-8 bg-white p-6 rounded-md shadow-sm min-h-96">
          <h1 className="text-2xl text-gray-900 mb-6 font-semibold">Updates</h1>
          <div className="flex justify-center items-center min-h-48">
            <div className="text-red-500">
              Error loading updates: {error?.message || 'Unknown error'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categorizedUpdates = categorizeUpdates(updates);

  return (
    <div className="p-8 min-h-screen bg-gray-50 bg-gradient-to-b from-white via-indigo-50 to-slate-100">
      <div className="container mx-auto md:px-8 bg-white p-6 rounded-md shadow-sm min-h-96">
        <h1 className="text-2xl text-gray-900 mb-6 font-semibold">Updates</h1>
        {updates.length > 0 ? (
          <UpdatesList categorizedUpdates={categorizedUpdates} />
        ) : (
          <div className="flex justify-center items-center min-h-48">
            <p className="text-gray-500">No updates available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatesPage;
