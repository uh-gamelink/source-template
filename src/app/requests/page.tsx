'use client';

import { ArrowRight } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';

type Request = {
  id: number;
  game: string;
  rank: string;
  notes?: string;
  user: {
    email: string;
    profile?: {
      username?: string | null;
    } | null;
  };
};

export default function RequestsPage() {
  const params = useSearchParams();

  const [game, setGame] = useState(params.get('game') || '');
  const [rank, setRank] = useState(params.get('rank') || '');
  const [notes, setNotes] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to load requests.');
        return;
      }

      setRequests(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load requests.');
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchRequests();
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, rank, notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to create request.');
        return;
      }

      setGame('');
      setRank('');
      setNotes('');
      await fetchRequests();
    } catch (err) {
      console.error(err);
      setError('Failed to create request.');
    }
  };

  const handleDelete = async (id: number) => {
    setError('');

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to delete request.');
        return;
      }

      await fetchRequests();
    } catch (err) {
      console.error(err);
      setError('Failed to delete request.');
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4 custom-title">Requests</h1>

      <Form onSubmit={handleSubmit} className="mb-5 requests-form">
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              placeholder="Game"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              required
            />
          </Col>

          <Col md={3}>
            <Form.Control
              placeholder="Rank"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              required
            />
          </Col>

          <Col md={4}>
            <Form.Control
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Col>

          <Col md={1}>
            <Button type="submit" className="w-100">
              Create
            </Button>
          </Col>
        </Row>
      </Form>

      {error && (
        <div className="alert alert-danger mb-4">{error}</div>
      )}

      <Row>
        <Col md={3}>
          <Card className="p-4 text-center h-100 custom-card-body pending-panel">
            <h4 className="mb-3">Pending Requests</h4>
            <div className="arrow-circle">
              <ArrowRight size={28} />
            </div>
          </Card>
        </Col>

        <Col md={9}>
          <Row className="g-4">
            {requests.length === 0 ? (
              <p>No requests yet.</p>
            ) : (
              requests.map((req) => {
                const username =
                  req.user.profile?.username ||
                  req.user.email.split('@')[0];

                return (
                  <Col md={4} key={req.id}>
                    <Card className="p-3 h-100 custom-card-body request-card">
                      <div className="request-label">Request</div>

                      <Card.Title>{username}</Card.Title>

                      <Card.Text>
                        <small className="text-muted">@{username}</small>
                      </Card.Text>

                      <Card.Text>
                        <strong>Rank:</strong> {req.rank}
                      </Card.Text>

                      <Card.Text>
                        <strong>Game:</strong> {req.game}
                      </Card.Text>

                      {req.notes && <Card.Text>{req.notes}</Card.Text>}

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(req.id)}
                      >
                        Delete
                      </Button>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}