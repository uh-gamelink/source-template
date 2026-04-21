import Link from 'next/link';
import { Card, Container, Image, Row, Col, Button } from 'react-bootstrap';
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
          <Col className="py-3">
              {player.username}
            </Col>
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
        <div className="mb-2">Rank: {player.rank}</div>
        <Row className="ps-0 py-2 align-items-center">
          <Col xs="auto">
            <Link href={`/requests?game=${encodeURIComponent(player.game)}&rank=${encodeURIComponent(player.rank)}`}  className="custom-link-button">
                <PlusLg />
            </Link>
          </Col>
          <Col className= "pl-0">
            <Link href={`/requests?game=${encodeURIComponent(player.game)}&rank=${encodeURIComponent(player.rank)}`} >
              <Button size="sm">Connect</Button>
            </Link>
          </Col>
        </Row>
      </Card.Body>
    </Container>
  </Card>
);

export default PlayerCard;