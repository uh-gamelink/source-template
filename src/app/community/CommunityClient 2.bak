'use client';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import { Session } from 'next-auth';

type CommunityServer = {
  id: number;
  name: string;
  description: string;
  inviteUrl: string;
  imageUrl?: string | null;
  tags: string[];
  featured: boolean;
};

export default function CommunityClient({
  servers,
  session,
}: {
  servers: CommunityServer[];
  session: Session | null;
}) {
  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Community</h1>

      {/* 🔥 Admin-only button */}
      {session?.user?.role === 'ADMIN' && (
        <div className="text-end mb-3">
          <Link href="/admin/add-server">
            <Button>Add Server</Button>
          </Link>
        </div>
      )}

      <Row className="g-4">
        {servers.map((server) => (
          <Col md={4} key={server.id}>
            <Card className="h-100 shadow-sm custom-card-body">
              {server.imageUrl && (
                <Card.Img
                  className="mt-5"
                  variant="top"
                  src={server.imageUrl}
                  style={{
                    height: '160px',
                    objectFit: 'contain',
                    padding: '10px',
                  }}
                />
              )}

              <Card.Body className="d-flex flex-column">
                <Card.Title>{server.name}</Card.Title>

                <Card.Text>{server.description}</Card.Text>

                {server.featured && (
                  <Card.Text>
                    <strong>Featured Community</strong>
                  </Card.Text>
                )}

                <div className="mb-3">
                  {server.tags.map((tag) => (
                    <span key={tag} className="badge custom-tag-btn me-1">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    href={server.inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-tag-btn border-0"
                  >
                    Join Discord
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}