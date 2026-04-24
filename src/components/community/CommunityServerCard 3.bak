'use client';

import { Card, Button } from 'react-bootstrap';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { addServerToProfile } from '@/lib/dbActions';

export type CommunityServer = {
  id: number;
  name: string;
  description: string;
  inviteUrl: string;
  imageUrl?: string | null;
  tags: string[];
  featured: boolean;
};

type CommunityServerCardProps = {
  server: CommunityServer;
  isLoggedIn: boolean;
  alreadyAdded?: boolean;
};

export default function CommunityServerCard({
  server,
  isLoggedIn,
  alreadyAdded = false,
}: CommunityServerCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(alreadyAdded);

  const handleAdd = () => {
    startTransition(async () => {
      try {
        await addServerToProfile(server.id);
        setIsAdded(true);
      } catch (error) {
        console.error(error);
        alert('Could not add community to profile');
      }
    });
  };

  return (
    <Card className="h-100 shadow-sm custom-card-body">
      {server.imageUrl && (
        <div
          className="mt-5 d-flex justify-content-center align-items-center"
          style={{
            height: '160px',
            padding: '10px',
            position: 'relative',
          }}
        >
          <Image
            src={server.imageUrl}
            alt={`${server.name} server image`}
            width={160}
            height={160}
            style={{
              objectFit: 'contain',
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
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

        <div className="mt-auto d-flex gap-2 flex-wrap">
          <Button
            href={server.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="custom-tag-btn border-0"
          >
            Join Discord
          </Button>

          {isLoggedIn && (
            <Button
              onClick={handleAdd}
              disabled={isPending || isAdded}
              variant={isAdded ? 'success' : 'outline-primary'}
            >
              {isPending ? 'Adding...' : isAdded ? 'Added ✓' : 'Add to Profile'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}