import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AddServerForm from './AddServerForm';

export default async function AddServerPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <AddServerForm />;
}