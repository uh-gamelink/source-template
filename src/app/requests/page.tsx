import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import RequestsContent from './RequestsContent';

const RequestsPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  return <RequestsContent />;
};

export default RequestsPage;