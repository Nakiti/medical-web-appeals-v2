import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from './RegisterForm';
import { SuccessMessage } from './SuccessMessage';

export const RegisterLayout: React.FC = ({redirectUrl}) => {
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) {
    return <SuccessMessage />;
  }

  return (
    <Card className="w-full mt-8 max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Create Your Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm redirectUrl={redirectUrl}/>
      </CardContent>
    </Card>
  );
};
