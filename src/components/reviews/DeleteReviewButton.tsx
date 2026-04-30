'use client';

import { useRouter } from 'next/navigation';

export default function DeleteReviewButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      router.refresh(); // refresh list without full reload
    } else {
      alert('Failed to delete review');
    }
  }

  return (
    <button
      className="btn btn-sm btn-outline-danger"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
