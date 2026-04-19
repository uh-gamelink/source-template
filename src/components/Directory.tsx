import { Col, Container, Row, Card, Button } from 'react-bootstrap';
import Link from 'next/link';

const Directory = () => (
  <Container className="mt-4">
    <Row className="g-3">

      {/* COMMUNITY */}
      <Col md={4}>
        <Card className="h-100 shadow-sm custom-card-body d-flex flex-column">
          <Card.Body className="d-flex flex-column">
            <Card.Text>
              Visit our community page to explore the Discord game servers on campus.
            </Card.Text>

            <div className="mt-auto">
              <Link href="/community" passHref>
                <Button className="custom-tag-btn border-0 w-100">
                  Connect
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* ABOUT */}
      <Col md={4}>
        <Card className="h-100 shadow-sm custom-card-body d-flex flex-column">
          <Card.Body className="d-flex flex-column">
            <Card.Text>
              See our About page to get to know the developers of UH GameLink.
            </Card.Text>

            <div className="mt-auto">
              <Link href="/about" passHref>
                <Button className="custom-tag-btn border-0 w-100">
                  Visit
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* SIGN UP */}
      <Col md={4}>
        <Card className="h-100 shadow-sm custom-card-body d-flex flex-column">
          <Card.Body className="d-flex flex-column">
            <Card.Text>
              Interested in joining the UH game community? Sign up to connect with players.
            </Card.Text>

            <div className="mt-auto">
              <Link href="/auth/signin" passHref>
                <Button className="custom-tag-btn border-0 w-100">
                  Sign Up
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>

    </Row>
  </Container>
);

export default Directory;