'use client';

import { Card, Image } from 'react-bootstrap';

type Player = {
  username: string;
  imageUrl?: string | null;
  game: string;
  rank: string;
};

const PlayerCard = ({ player }: { player: Player }) => (
  <Card style={{ width: '250px'}}>
    <Card.Header>
      <Image
        src={player.imageUrl || '/default-player.png'}
        width={200}
        height={200}
        rounded
        alt={player.username}
        className="card-body d-flex justify-content-center align-items-center">
      </Image>
    </Card.Header>

    <Card.Body>
      <Card.Title>{player.username}</Card.Title>
      <Card.Text>
        <div>Game: {player.game}</div>
        <div>Rank: {player.rank}</div>
      </Card.Text>
    </Card.Body>
  </Card>
);

export default PlayerCard;