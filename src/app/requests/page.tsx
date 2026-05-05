import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import RequestsContent from './RequestsContent';

const RequestsPage = async () => {
  const session = await auth();

  if (!session || !session?.user?.email) {
    redirect('/auth/signin');
  } 

  if (session?.user.role === 'ADMIN') {
    redirect('/admin/manage');
  }

  return <RequestsContent />;
};

export default RequestsPage;