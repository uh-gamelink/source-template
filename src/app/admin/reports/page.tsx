import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminReportsPage from './AdminReportsPage';

export const dynamic = 'force-dynamic';

export default async function AdminManagePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <AdminReportsPage />;
}
