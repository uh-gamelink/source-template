import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ReviewForm from '@/components/reviews/ReviewForm';

export default async function NewReviewPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/reviews/new');
  }

  if (session?.user.role === 'ADMIN') {
    redirect('/admin/manage');
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Write a Review</h1>

      <ReviewForm />
    </div>
  );
}
