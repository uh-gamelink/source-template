import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DeleteReviewButton from '@/components/reviews/DeleteReviewButton';

export default async function ReviewsPage() {
  const session = await auth();

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
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
        {reviews.map((review) => {
          const isOwner =
            session?.user?.id &&
            Number(session.user.id) === review.userId;

          return (
            <div key={review.id} className="custom-card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>
                  {review.user.profile?.username ||
                    review.user.email}
                </strong>

                <div className="d-flex align-items-center gap-2">
                  <span>{'⭐'.repeat(review.rating)}</span>

                  {isOwner && (
                    <DeleteReviewButton id={review.id} />
                  )}
                </div>
              </div>

              <p className="mt-2 mb-0">{review.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}