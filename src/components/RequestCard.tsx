'use client';

import { Card, Container, Image, Button, Col, Row} from 'react-bootstrap';

type Player = {
  username: string;
  imageUrl?: string | null;
};

const PlayerRequestCard = ({ player }: { player: Player }) => (
<Card className="h-100 custom-card-body" style={{ width: '235px' }}>
  <Container className="ms-2">
    <Card.Body className="p-3">
      <Card.Title className="pb-2">{player.username}</Card.Title>
      <Image
        src={player.imageUrl || '/default-player.svg'}
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
      <Row>
        <Col>
          <Button variant="danger" className="custom-tag-btn" 
            /*onClick={() => signOut({ callbackUrl: '/'})}*/>
            Request
          </Button>
        </Col>
        <Col>
          <Button variant="secondary" className="custom-reset-btn"  href="/">
            Cancel
          </Button>
        </Col>
      </Row>
    </Card.Body>
  </Container>
</Card>
);

export default PlayerRequestCard;