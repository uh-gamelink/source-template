'use client';

import { ArrowRight } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
} from 'react-bootstrap';
import Link from 'next/link';

type Request = {
  id: number;
  game: string;
  rank: string;
  notes?: string;
  receiverUsername?: string | null;
  status?: string;

  user: {
    email: string;
    profile?: {
      username?: string | null;
    } | null;
  };

  receiver?: {
    email: string;
    profile?: {
      username?: string | null;
    } | null;
  } | null;
};

export default function RequestsContent() {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, []);

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

      fetchRequests();
    } catch (err) {
      console.error(err);
      setError('Failed to delete request.');
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4 custom-title">Requests</h1>

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      <Row>
        <Col md={3}>
          <Card className="p-4 text-center h-100 custom-card-body pending-panel">
            <h4 className="mb-3">Pending Requests</h4>

            <div className="arrow-circle">
              <Link href="/requests/status">
                <ArrowRight size={28} />
              </Link>
            </div>
          </Card>
        </Col>

        <Col md={9}>
          <Row className="g-4">
            {requests.length === 0 ? (
              <p>No requests yet.</p>
            ) : (
              requests.map((req) => {
                const sender =
                  req.user.profile?.username ||
                  req.user.email.split('@')[0];

                const target =
                  req.receiver?.profile?.username ||
                  req.receiverUsername ||
                  'Open Request';

                return (
                  <Col md={4} key={req.id}>
                    <Card className="p-3 h-100 custom-card-body request-card">
                      <div className="request-label">
                        Request
                      </div>

                      <Card.Title>
                        {sender}
                      </Card.Title>

                      <Card.Text>
                        <small>@{sender}</small>
                      </Card.Text>

                      <Card.Text>
                        <strong>To:</strong> {target}
                      </Card.Text>

                      <Card.Text>
                        <strong>Rank:</strong> {req.rank}
                      </Card.Text>

                      <Card.Text>
                        <strong>Game:</strong> {req.game}
                      </Card.Text>

                      <Card.Text>
                        <strong>Status:</strong>{' '}
                        {req.status || 'PENDING'}
                      </Card.Text>

                      {req.notes && (
                        <Card.Text>
                          {req.notes}
                        </Card.Text>
                      )}

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleDelete(req.id)
                        }
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