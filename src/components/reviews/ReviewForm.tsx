'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Container, Form, Button } from 'react-bootstrap';

export default function ReviewForm() {
  const { data: session } = useSession(); // ✅ get user
  const username = session?.user?.name || 'Anonymous';

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
        body: JSON.stringify({
          text,
          rating,
          username, 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to submit review');
        return;
      }

      window.location.href = '/reviews';
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card
        className="custom-card-body shadow-lg"
        style={{ maxWidth: '700px', width: '100%' }}
      >
        <Card.Body className="p-4">
          <h3 className="mb-3 text-center">Write a Review</h3>


          <p className="text-center mb-4">
            Posting as <strong>{username}</strong>
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write your review..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Select
              className="mb-3"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </Form.Select>

            <div className="d-grid">
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}