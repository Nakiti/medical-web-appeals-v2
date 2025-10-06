import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = 'min-h-screen flex justify-center bg-gray-50 p-6',
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
