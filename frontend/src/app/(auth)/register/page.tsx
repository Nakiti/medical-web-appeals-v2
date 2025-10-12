"use client"
import { PageLayout } from '@/components/shared/PageLayout';
import { useSearchParams } from 'next/navigation';
import { RegisterLayout } from '@/components/register';

const Register = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl');

  return (
    <PageLayout className="min-h-screen flex justify-center items-start bg-gray-50">
      <RegisterLayout redirectUrl={redirectUrl}/>
    </PageLayout>
  );
};

export default Register;