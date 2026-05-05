import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AddServerForm from './AddServerForm';

export default async function AddServerPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/not-authorized');
  }

  return <AddServerForm />;
}