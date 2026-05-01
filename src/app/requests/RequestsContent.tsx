'use client';

import {
  useEffect,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED';

type RequestDirection =
  | 'incoming'
  | 'outgoing';

type RequestUser = {
  email: string;
  profile?: {
    username?: string | null;
  } | null;
};

type PlayerRequest = {
  id: number;
  game: string;
  rank: string;
  requesterUsername?: string | null;
  requesterRank?: string | null;
  notes?: string | null;
  receiverUsername?: string | null;
  status?: RequestStatus;
  direction: RequestDirection;

  user: RequestUser;

  receiver?: RequestUser | null;
};

const fetchRequests = async (): Promise<PlayerRequest[]> => {
  const res = await fetch('/api/requests', {
    cache: 'no-store',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error || 'Failed to load requests.',
    );
  }

  return data;
};

const getDisplayUsername = (
  user?: RequestUser | null,
) =>
  user?.profile?.username ||
  user?.email?.split('@')[0] ||
  'Unknown User';

const getRequesterUsername = (
  request: PlayerRequest,
) =>
  request.requesterUsername ||
  getDisplayUsername(request.user);

const getRequesterRank = (
  request: PlayerRequest,
) => request.requesterRank || request.rank;

const getReceiverUsername = (
  request: PlayerRequest,
) =>
  request.receiverUsername ||
  getDisplayUsername(request.receiver);

const RequestsContent = () => {
  const router = useRouter();

  const [requests, setRequests] =
    useState<PlayerRequest[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [actionError, setActionError] =
    useState('');

  const [pendingActionId, setPendingActionId] =
    useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadInitialRequests = async () => {
      try {
        const data = await fetchRequests();

        if (ignore) {
          return;
        }

        setError('');
        setRequests(data);
      } catch (fetchError) {
        if (ignore) {
          return;
        }

        console.error(fetchError);

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Something went wrong loading requests.',
        );
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialRequests();

    return () => {
      ignore = true;
    };
  }, []);

  const reloadRequests = async () => {
    const data = await fetchRequests();

    setError('');
    setRequests(data);
  };

  const updateStatus = async (
    id: number,
    status: RequestStatus,
  ) => {
    try {
      setActionError('');
      setPendingActionId(id);

      const res = await fetch(
        `/api/requests/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setActionError(
          data?.error ||
            'Failed to update request.',
        );
        return;
      }

      await reloadRequests();
      router.refresh();
    } catch (updateError) {
      console.error(updateError);

      setActionError(
        updateError instanceof Error
          ? updateError.message
          : 'Something went wrong updating the request.',
      );
    } finally {
      setPendingActionId(null);
    }
  };

  const deleteRequest = async (
    id: number,
  ) => {
    try {
      setActionError('');
      setPendingActionId(id);

      const res = await fetch(
        `/api/requests/${id}`,
        {
          method: 'DELETE',
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setActionError(
          data?.error ||
            'Failed to delete request.',
        );
        return;
      }

      await reloadRequests();
      router.refresh();
    } catch (deleteError) {
      console.error(deleteError);

      setActionError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Something went wrong deleting the request.',
      );
    } finally {
      setPendingActionId(null);
    }
  };

  const incomingRequests = requests.filter(
    (request) =>
      request.direction === 'incoming',
  );

  const outgoingRequests = requests.filter(
    (request) =>
      request.direction === 'outgoing',
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
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {actionError && (
        <Alert variant="danger">
          {actionError}
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />

          <p className="mt-3 mb-0">
            Loading requests...
          </p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="custom-card-body p-4 h-100">
              <h2 className="mb-4">
                Incoming Requests
              </h2>

              <div className="status-table-wrapper">
                <Table
                  responsive
                  className="status-table mb-0"
                >
                  <thead>
                    <tr>
                      <th>
                        Requester Username
                      </th>
                      <th>Game</th>
                      <th>
                        Requester Rank
                      </th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {incomingRequests.length > 0 ? (
                      incomingRequests.map(
                        (request) => (
                          <tr key={request.id}>
                            <td>
                              {getRequesterUsername(
                                request,
                              )}
                            </td>

                            <td>
                              {request.game}
                            </td>

                            <td>
                              {getRequesterRank(
                                request,
                              )}
                            </td>

                            <td>
                              {request.status ===
                              'PENDING' ? (
                                <div className="d-flex flex-column gap-2">
                                  <Button
                                    size="sm"
                                    className="request-accept-btn"
                                    disabled={
                                      pendingActionId ===
                                      request.id
                                    }
                                    onClick={() =>
                                      updateStatus(
                                        request.id,
                                        'ACCEPTED',
                                      )
                                    }
                                  >
                                    Accept
                                  </Button>

                                  <Button
                                    size="sm"
                                    className="request-reject-btn"
                                    disabled={
                                      pendingActionId ===
                                      request.id
                                    }
                                    onClick={() =>
                                      updateStatus(
                                        request.id,
                                        'REJECTED',
                                      )
                                    }
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <span className="request-status-text">
                                  {request.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center"
                        >
                          No incoming requests
                          right now.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="custom-card-body p-4 h-100">
              <h2 className="mb-4">
                Outgoing Requests
              </h2>

              {outgoingRequests.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {outgoingRequests.map(
                    (request) => (
                      <div
                        key={request.id}
                        className="custom-card-body p-3"
                      >
                        <h4 className="mb-3">
                          {getRequesterUsername(
                            request,
                          )}
                        </h4>

                        <p className="mb-2">
                          <strong>To:</strong>{' '}
                          {getReceiverUsername(
                            request,
                          )}
                        </p>

                        <p className="mb-2">
                          <strong>Game:</strong>{' '}
                          {request.game}
                        </p>

                        <p className="mb-2">
                          <strong>
                            Your Rank:
                          </strong>{' '}
                          {getRequesterRank(
                            request,
                          )}
                        </p>

                        <p className="mb-2">
                          <strong>
                            Their Listing Rank:
                          </strong>{' '}
                          {request.rank}
                        </p>

                        <p className="mb-3">
                          <strong>Status:</strong>{' '}
                          {request.status ||
                            'PENDING'}
                        </p>

                        <Button
                          size="sm"
                          className="request-reject-btn w-100"
                          disabled={
                            pendingActionId ===
                            request.id
                          }
                          onClick={() =>
                            deleteRequest(
                              request.id,
                            )
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  No outgoing requests right
                  now.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default RequestsContent;