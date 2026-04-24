'use client';

import { Card } from 'react-bootstrap';
import Image from 'next/image';

export type Game = {
  id: number;
  title: string;
  developer: string;
  platform?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags: string[];
};

export default function GameLibraryCard({ game }: { game: Game }) {
  return (
    <Card className="h-100 custom-card-body request-card">
      {game.imageUrl && (
        <div className="game-image-wrapper">
          <div className="game-image-frame">
            <Image
              src={game.imageUrl}
              alt={game.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="game-card-img"
            />
          </div>
        </div>
      )}

      <Card.Body>
        <Card.Title>{game.title}</Card.Title>

        <Card.Text>
          <strong>Developer:</strong> {game.developer}
        </Card.Text>

        {game.platform && (
          <Card.Text>
            <strong>Platform:</strong> {game.platform}
          </Card.Text>
        )}

        {game.description && <Card.Text>{game.description}</Card.Text>}

        <div className="mt-2">
          {game.tags.map((tag) => (
            <span key={tag} className="badge custom-tag-btn me-1 mb-1">
              {tag}
            </span>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}