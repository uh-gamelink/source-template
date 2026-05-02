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
      <h1 className="mb-0">Reviews</h1>

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

      {/* Reviews */}
      <div className="d-flex flex-column gap-3" style={{ maxWidth: '450px' }}>
        {reviews.map((review) => {
          const isOwner =
            session?.user?.id &&
            Number(session.user.id) === review.userId;

          return (
            <div
              key={review.id}
              className="custom-card-body p-3"
            >
              {/* Row 1: User + Stars */}
              <div className="d-flex justify-content-between align-items-center">
                <strong>
                  {review.user.profile?.username ||
                    review.user.email}
                </strong>

                <span>{'⭐'.repeat(review.rating)}</span>
              </div>

              {/* Row 2: Description */}
              <p className="mt-2 mb-2">
                {review.text}
              </p>

              {/* Row 3: Date + Delete */}
              <div className="d-flex justify-content-between align-items-center small opacity-75">
                <span>
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                {isOwner && (
                  <DeleteReviewButton id={review.id} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}