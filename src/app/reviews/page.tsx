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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="mb-0">Reviews</h1>

          <p className="mt-2 mb-0" style={{ maxWidth: '600px' }}>
            Share your thoughts about UH GameLink. Leave feedback on your experience
            using the platform, including features, usability, and overall satisfaction.
            Your input helps us improve the app for everyone.
          </p>
        </div>

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
      <div className="d-flex flex-column gap-3 mx-auto" style={{ maxWidth: '700px' }}>
        {reviews.map((review) => {
          const isOwner =
            session?.user?.id &&
            Number(session.user.id) === review.userId;

          return (
            <div key={review.id} className="custom-card-body p-3">
              {/* Row 1 */}
              <div className="d-flex justify-content-between align-items-center">
                <strong>
                  {review.user.profile?.username || review.user.email}
                </strong>
                <span>{'⭐'.repeat(review.rating)}</span>
              </div>

              {/* Row 2 */}
              <p className="mt-2 mb-2">{review.text}</p>

              {/* Row 3 */}
              <div className="d-flex justify-content-between align-items-center small opacity-75">
                <span>
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                {isOwner && (
                  <div className="d-flex gap-2">
                    <Link href={`/reviews/${review.id}/edit`}>
                      <button className="btn btn-sm btn-outline-light">
                        Edit
                      </button>
                    </Link>

                    <DeleteReviewButton id={review.id} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}