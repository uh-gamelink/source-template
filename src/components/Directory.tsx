import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Directory = () => (
  <Container className="mt-4">
    <Row className="g-3">
      <Col md={4}>
        <Card className="h-100 shadow-sm custom-card-body">
          <Card.Body>
            <Card.Text>
              Visit our community page to explore the Discord game servers on campus.
            </Card.Text>
            <a href="/community" className="btn custom-tag-btn border-0 w-100">
              Connect
            </a>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="h-100 shadow-sm custom-card-body">
          <Card.Body>
            <Card.Text>
              See our About page to get to know the developers of UH GameLink.
            </Card.Text>
            <a href="/about" className="btn custom-tag-btn border-0 w-100">
              Visit
            </a>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="h-100 shadow-sm custom-card-body">
          <Card.Body>
            <Card.Text>
              Interested in joining the UH game community? Sign up to connect with players.
            </Card.Text>
            <a href="/auth/signin" className="btn custom-tag-btn border-0 w-100">
              Sign Up
            </a>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Directory;