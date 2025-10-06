import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const SuccessMessage: React.FC = () => {
  return (
    <Card className="w-full max-w-md text-center">
      <CardContent className="p-8">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registration Successful!</h2>
        <p className="text-gray-600 mb-6">Your account has been created successfully.</p>
        <Link href="/login">
          <Button className="px-6 py-2">
            Go to Login
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
