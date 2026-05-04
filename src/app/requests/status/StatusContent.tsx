'use client';

import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

type RequestRow = {
  id: number;
  username: string;
  game: string;
  rank: string;
  status: string;
};

type StatusContentsProps = {
  requestRows?: RequestRow[];
};

const StatusContents = ({
  requestRows = [],
}: StatusContentsProps) => {
  const router = useRouter();

  const updateStatus = async (
    id: number,
    status: 'ACCEPTED' | 'REJECTED',
  ) => {
    await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    router.refresh();
  };

  return (
    <div className="mt-5">
      <h2 className="mb-3">Request Status</h2>

      <Table
        striped
        bordered
        hover
        responsive
        className="status-table"
      >
        <thead>
          <tr>
            <th>Username</th>
            <th>Game</th>
            <th>Rank</th>
            <th>Request Status</th>
          </tr>
        </thead>

        <tbody>
          {requestRows.length > 0 ? (
            requestRows.map((request) => (
              <tr key={request.id}>
                <td>{request.username}</td>
                <td>{request.game}</td>
                <td>{request.rank}</td>

                <td>
                  {request.status === 'PENDING' ? (
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() =>
                          updateStatus(
                            request.id,
                            'ACCEPTED',
                          )}
                      >
                        Accept
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          updateStatus(
                            request.id,
                            'REJECTED',
                          )}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    request.status
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center"
              >
                No requests yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default StatusContents;