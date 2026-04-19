'use client';

import { Card, Container, Image, Row, Col } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';

type Player = {
  username: string;
  imageUrl?: string | null;
  game: string;
  rank: string;
};

const PlayerCard = ({ player }: { player: Player }) => (
<Card className="h-100 custom-card-body" style={{ width: '235px' }}>
  <Container className="ms-2">
    <Card.Body className="p-3">
      <Card.Title>
        <Row className="ps-0 py-2">
          <Col md={1}>
            <a href="/findplayers/request" className='custom-link-button'>
              <PlusLg/> 
            </a>
          </Col>
          <Col md={10} className="username-size">
            {player.username}
          </Col>
        </Row>
      </Card.Title>
      <Image
        src={player.imageUrl || '/default-player.png'}
        width={155}
        height={160}
        rounded
        alt={player.username}
        style={{
          objectFit: 'cover',
          borderRadius: '12px',
          border: '4px solid #b0e0e682',
        }}
        className="mb-3"
      />
      <div>Game: {player.game}</div>
      <div>Rank: {player.rank}</div>
    </Card.Body>
  </Container>
</Card>
);

export default PlayerCard;