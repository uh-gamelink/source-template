import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import EditReviewForm from '@/components/reviews/EditReviewForm';

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  if (session?.user.role === 'ADMIN') {
    redirect('/admin/manage');
  }

  const reviewId = Number(id);

  if (Number.isNaN(reviewId)) {
    redirect('/reviews');
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== Number(session.user.id)) {
    redirect('/reviews');
  }

  return (
    <div className="container py-5">
      <h1>Edit Review</h1>
      <EditReviewForm review={review} />
    </div>
  );
}