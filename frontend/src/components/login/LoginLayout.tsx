import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from './LoginForm';

export const LoginLayout: React.FC = () => {
  return (
    <Card className="w-full mt-16 h-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
};
