'use client';

import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Session } from 'next-auth';
import CommunityServerCard from '@/components/community/CommunityServerCard';

type CommunityServer = {
  id: number;
  name: string;
  description: string;
  inviteUrl: string;
  imageUrl?: string | null;
  tags: string[];
  featured: boolean;
};

const PAGE_SIZE = 6;

export default function CommunityClient({
  servers,
  session,
  savedServerIds,
}: {
  servers: CommunityServer[];
  session: Session | null;
  savedServerIds: number[];
}) {
  const [page, setPage] = useState(1);

  const isLoggedIn = !!session;
  const totalPages = Math.ceil(servers.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentServers = servers.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Community</h1>

      <Row className="g-4">
        {currentServers.map((server) => (
          <Col md={4} key={server.id}>
            <CommunityServerCard
              server={server}
              isLoggedIn={isLoggedIn}
              alreadyAdded={savedServerIds.includes(server.id)}
            />
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <Button
          variant="primary"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <Button
          variant="primary"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}