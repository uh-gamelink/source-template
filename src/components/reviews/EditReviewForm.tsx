'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Review = {
  id: number;
  text: string;
  rating: number;
};

export default function EditReviewForm({ review }: { review: Review }) {
  const router = useRouter();

  const [text, setText] = useState<string>(review.text);
  const [rating, setRating] = useState<number>(review.rating);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch(`/api/reviews/${review.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, rating }),
    });

    router.push('/reviews');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3">
        <label className="form-label">Rating</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRating(Number(e.target.value))
          }
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Review</label>
        <textarea
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.target.value)
          }
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Save Changes
      </button>
    </form>
  );
}