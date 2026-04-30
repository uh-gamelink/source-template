'use client';

import { useState } from 'react';

export default function ReviewForm() {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, rating }),
      });

      if (!res.ok) {
        let errorMessage = 'Failed to submit review';

        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch {
          errorMessage = `Failed to submit review. Status: ${res.status}`;
        }

        alert(errorMessage);
        return;
      }

      window.location.href = '/reviews';
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Something went wrong while submitting the review.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="custom-card-body p-3">
      <textarea
        className="form-control mb-3"
        placeholder="Write your review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />

      <select
        className="form-control mb-3"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Stars
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
