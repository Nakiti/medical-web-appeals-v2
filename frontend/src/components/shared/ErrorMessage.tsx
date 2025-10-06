import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = 'mt-4',
}) => {
  return (
    <Alert className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded ${className}`}>
      <AlertDescription className="text-sm">{message}</AlertDescription>
    </Alert>
  );
};
