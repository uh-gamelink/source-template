'use client';

import { Card, Image } from 'react-bootstrap';
import Link from 'next/link';

type Player = {
  username: string;
  imageUrl?: string | null;
  game: string;
  rank: string;
};

const PlayerCard = ({ player }: { player: Player }) => (
  <Card className="w-100 h-100">
    
    <Card.Header className="text-center">
      <Image
        src={player.imageUrl || '/default-player.png'}
        width={200}
        height={200}
        rounded
        alt={player.username}
        style={{ objectFit: 'cover', borderRadius: '12px' }}
      />
    </Card.Header>

    <Card.Body className="text-center">
      <Card.Title>{player.username}</Card.Title>

      <div>Game: {player.game}</div>
      <div>Rank: {player.rank}</div>
      <Link href="/auth/signin">Connect</Link>
    </Card.Body>

  </Card>
);

export default PlayerCard;