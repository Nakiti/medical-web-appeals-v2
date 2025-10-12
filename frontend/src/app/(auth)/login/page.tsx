"use client"
import { PageLayout } from '@/components/shared/PageLayout';
import { LoginLayout } from '@/components/login/LoginLayout';
import { useSearchParams } from 'next/navigation';

const Login = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl');

  return (
    <PageLayout>
      <LoginLayout redirectUrl={redirectUrl || '/dashboard/home'}/>
    </PageLayout>
  );
};

export default Login;