import React from 'react';
import { Update } from '@/lib/services/updates.service';
import UpdateItem from './UpdateItem';

interface CategorizedUpdates {
  Today: Update[];
  Yesterday: Update[];
  'Last Week': Update[];
  Earlier: Update[];
}

interface UpdatesListProps {
  categorizedUpdates: CategorizedUpdates;
}

const UpdatesList: React.FC<UpdatesListProps> = ({ categorizedUpdates }) => {
  const sections = Object.keys(categorizedUpdates) as Array<keyof CategorizedUpdates>;

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        categorizedUpdates[section].length > 0 && (
          <div key={index} className="section-container mb-8">
            <h2 className="section-header text-lg font-semibold text-gray-800 border-l-4 pl-3 border-blue-500">
              {section}
            </h2>
            <div className="space-y-4 mt-4">
              {categorizedUpdates[section].map((update) => (
                <UpdateItem key={update.id} update={update} />
              ))}
            </div>
            {index < sections.length - 1 && (
              <div className="section-divider bg-gray-200 h-px my-6" />
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default UpdatesList;
