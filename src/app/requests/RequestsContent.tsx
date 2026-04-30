'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
} from 'react-bootstrap';

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
  const [requests, setRequests] =
    useState<Request[]>([]);

  const [error, setError] =
    useState('');

  const router = useRouter();

  const fetchRequests =
    async () => {
      try {
        const res =
          await fetch(
            '/api/requests',
          );

        const data =
          await res.json();

        if (!res.ok) {
          setError(
            data?.error ||
              'Failed to load requests.',
          );

          return;
        }

        setRequests(data);
      } catch (err) {
        console.error(err);

        setError(
          'Failed to load requests.',
        );
      }
    };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, []);

  const handleDelete =
    async (id: number) => {
      setError('');

      try {
        const res =
          await fetch(
            `/api/requests/${id}`,
            {
              method:
                'DELETE',
            },
          );

        const data =
          await res.json();

        if (!res.ok) {
          setError(
            data?.error ||
              'Failed to delete request.',
          );

          return;
        }

        fetchRequests();
      } catch (err) {
        console.error(err);

        setError(
          'Failed to delete request.',
        );
      }
    };

  const updateStatus =
    async (
      id: number,
      status:
        | 'ACCEPTED'
        | 'REJECTED',
    ) => {
      await fetch(
        `/api/requests/${id}`,
        {
          method:
            'PATCH',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(
            {
              status,
            },
          ),
        },
      );

      fetchRequests();
      router.refresh();
    };

  const incomingRequests =
    requests.filter(
      (req) =>
        req.receiver,
    );

  const outgoingRequests =
    requests.filter(
      (req) =>
        req.user,
    );

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <h1 className="custom-title mb-0">
          Requests
        </h1>

        <Link href="/findplayers">
          <Button
            className="custom-tag-btn px-4 py-2"
            style={{
              borderRadius: '12px',
              minWidth: '190px',
              fontWeight: 700,
              fontSize: '1.05rem',
            }}
          >
            ← Find Players
          </Button>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      <Row className="g-4">
        {/* Incoming */}
        <Col lg={6}>
          <Card className="h-100 custom-card-body p-4">
            <h3 className="mb-4">
              Incoming Requests
            </h3>

            <Table
              striped
              bordered
              hover
              responsive
              className="status-table mb-0"
            >
              <thead>
                <tr>
                  <th>
                    Username
                  </th>
                  <th>
                    Game
                  </th>
                  <th>
                    Rank
                  </th>
                  <th>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {incomingRequests.length >
                0 ? (
                  incomingRequests.map(
                    (
                      req,
                    ) => {
                      const sender =
                        req.user
                          .profile
                          ?.username ||
                        req.user.email.split(
                          '@',
                        )[0];

                      return (
                        <tr
                          key={
                            req.id
                          }
                        >
                          <td>
                            {
                              sender
                            }
                          </td>

                          <td>
                            {
                              req.game
                            }
                          </td>

                          <td>
                            {
                              req.rank
                            }
                          </td>

                          <td>
                            {req.status ===
                            'PENDING' ? (
                              <div className="d-flex flex-column gap-2">
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() =>
                                    updateStatus(
                                      req.id,
                                      'ACCEPTED',
                                    )
                                  }
                                >
                                  Accept
                                </Button>

                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    updateStatus(
                                      req.id,
                                      'REJECTED',
                                    )
                                  }
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              req.status
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={
                        4
                      }
                      className="text-center"
                    >
                      No incoming
                      requests right
                      now.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Col>

        {/* Outgoing */}
        <Col lg={6}>
          <Card className="h-100 custom-card-body p-4">
            <h3 className="mb-4">
              Outgoing Requests
            </h3>

            <Row className="g-3">
              {outgoingRequests.length >
              0 ? (
                outgoingRequests.map(
                  (
                    req,
                  ) => {
                    const sender =
                      req.user
                        .profile
                        ?.username ||
                      req.user.email.split(
                        '@',
                      )[0];

                    const target =
                      req
                        .receiver
                        ?.profile
                        ?.username ||
                      req.receiverUsername ||
                      'Open Request';

                    return (
                      <Col
                        md={
                          12
                        }
                        key={
                          req.id
                        }
                      >
                        <Card className="p-3 custom-card-body request-card">
                          <Card.Title>
                            {
                              sender
                            }
                          </Card.Title>

                          <Card.Text>
                            <strong>
                              To:
                            </strong>{' '}
                            {
                              target
                            }
                          </Card.Text>

                          <Card.Text>
                            <strong>
                              Game:
                            </strong>{' '}
                            {
                              req.game
                            }
                          </Card.Text>

                          <Card.Text>
                            <strong>
                              Rank:
                            </strong>{' '}
                            {
                              req.rank
                            }
                          </Card.Text>

                          <Card.Text>
                            <strong>
                              Status:
                            </strong>{' '}
                            {req.status ||
                              'PENDING'}
                          </Card.Text>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                req.id,
                              )
                            }
                          >
                            Delete
                          </Button>
                        </Card>
                      </Col>
                    );
                  },
                )
              ) : (
                <p className="mb-0">
                  You haven’t sent
                  any requests yet.
                </p>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}