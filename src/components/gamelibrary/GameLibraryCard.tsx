'use client';

import { Button, Card } from 'react-bootstrap';
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

interface GameLibraryCardProps {
  game: Game;
  inLibrary: boolean;
  isLoading: boolean;
  onToggleLibrary: (gameId: number) => void;
  isLoggedIn: boolean;
  isFavoritesPage?: boolean;
  onRemove?: (gameId: number) => void;
}

export default function GameLibraryCard({
  game,
  inLibrary,
  isLoading,
  onToggleLibrary,
  isLoggedIn,
<<<<<<< HEAD
  isFavoritesPage = false,
  onRemove,
=======
>>>>>>> f662fba304d5f4403e9ab160742d8050a1c781a7
}: GameLibraryCardProps) {
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

<<<<<<< HEAD
      <Card.Footer className="bg-transparent border-0">
        <div className="mt-3">
          {isFavoritesPage ? (
            <Button
              className="custom-reg-btn w-100"
              disabled={isLoading}
              onClick={() => onRemove?.(game.id)}
            >
              {isLoading ? 'Removing...' : 'Remove from Favorites'}
            </Button>
          ) : (
            isLoggedIn && (
              <Button
                className={
                  inLibrary
                    ? 'custom-tag-btn w-100 added-btn'
                    : 'custom-tag-btn w-100'
                }
                disabled={isLoading}
                onClick={() => {
                  if (!inLibrary) {
                    onToggleLibrary(game.id);
                  }
                }}
              >
                {isLoading
                  ? 'Adding...'
                  : inLibrary
                    ? 'Added to Favorites'
                    : 'Add to Favorites'}
              </Button>
            )
          )}
        </div>
=======
      <Card.Footer>
        {isLoggedIn && (
          <Button
            variant={inLibrary ? 'success' : 'primary'}
            className="w-100"
            onClick={() => onToggleLibrary(game.id)}
            disabled={isLoading || inLibrary}
          >
            {isLoading
              ? 'Updating...'
              : inLibrary
                ? 'Added to Library ✓'
                : 'Add to Library'}
          </Button>
        )}
>>>>>>> f662fba304d5f4403e9ab160742d8050a1c781a7
      </Card.Footer>
    </Card>
  );
}