'use client';

import Table from 'react-bootstrap/Table';

type RequestRow = {
  username: string;
  game: string;
  rank: string;
  status: string;
};

const StatusContents = ({ requestRows }: { requestRows: RequestRow[] }) => (
  <div className="mt-5">
    <h2 className="mb-3">Request Status</h2>

    <Table striped bordered hover responsive className="custom-card-body">
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
            <tr key={request.username}>
              <td>{request.username}</td>
              <td>{request.game}</td>
              <td>{request.rank}</td>
              <td>{request.status}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center">
              No requests yet.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
);

export default StatusContents;