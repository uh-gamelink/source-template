import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ReviewsPage() {
  const session = await auth();

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Reviews</h1>

        <Link
          href={
            session?.user
              ? '/reviews/new'
              : '/auth/signin?callbackUrl=/reviews/new'
          }
        >
          <button className="btn btn-primary">
            Leave a Review
          </button>
        </Link>
      </div>

      <div className="d-flex flex-column gap-3">
        {reviews.map((review: any) => (
          <div key={review.id} className="custom-card-body p-3">
            <div className="d-flex justify-content-between">
              <strong>{review.user.email}</strong>
              <span>{'⭐'.repeat(review.rating)}</span>
            </div>

            <p className="mt-2 mb-0">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}