import { PageLayout } from '@/components/shared/PageLayout';
import { RegisterLayout } from '@/components/register/RegisterLayout';

const Register = () => {
  return (
    <PageLayout className="min-h-screen flex justify-center items-start bg-gray-50">
      <RegisterLayout />
    </PageLayout>
  );
};

export default Register;