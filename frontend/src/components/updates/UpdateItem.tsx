import React from 'react';
import { Update } from '@/lib/services/updates.service';

interface UpdateItemProps {
  update: Update;
}

const UpdateItem: React.FC<UpdateItemProps> = ({ update }) => {
  return (
    <div className="notification-card bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between mb-2">
        <h3 className="notification-title text-md font-medium text-gray-800">
          {update.title}
        </h3>
        <span className="notification-date text-sm text-gray-500">
          {new Date(update.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="notification-text text-sm text-gray-700">
        {update.content}
      </p>
    </div>
  );
};

export default UpdateItem;
