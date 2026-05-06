import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DeleteReviewButton from '@/components/reviews/DeleteReviewButton';

export default async function ReviewsPage() {
  const session = await auth();

  if (session?.user.role === 'ADMIN') {
    redirect('/admin/manage');
  }

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
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h1 className="mb-0">Reviews</h1>

          <p className="mt-2 mb-0" style={{ maxWidth: '650px' }}>
            Share your thoughts about UH GameLink. Leave feedback on your experience
             using the platform, including features, usability, and
            overall satisfaction. Your input helps us improve the app for
            everyone.
          </p>
        </div>

        <Link
          href={
            session?.user
              ? '/reviews/new'
              : '/auth/signin?callbackUrl=/reviews/new'
          }
        >
          <button className="btn btn-primary">Leave a Review</button>
        </Link>
      </div>

      <div className="row g-4 align-items-stretch">
        {reviews.map((review) => {
          const isOwner =
            session?.user?.id &&
            Number(session.user.id) === review.userId;

          return (
            <div key={review.id} className="col-12 col-lg-6">
              <div
                className="custom-card-body p-4 h-100 d-flex flex-column"
                style={{
                  minHeight: '240px',
                  wordBreak: 'break-word',
                }}
              >
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <strong className="text-break">
                    {review.user.profile?.username || review.user.email}
                  </strong>

                  <span className="flex-shrink-0">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>

                <p
                  className="mt-3 mb-4 text-break"
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    overflowWrap: 'anywhere',
                    whiteSpace: 'normal',
                  }}
                >
                  {review.text}
                </p>

                <div className="d-flex justify-content-between align-items-center small opacity-75 mt-auto gap-2 flex-wrap">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
