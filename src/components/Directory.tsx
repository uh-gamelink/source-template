<<<<<<< Updated upstream
  import { Col, Container, Card } from 'react-bootstrap';
  
  /** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
  const Directory = () => (
    <footer className="mt-auto py-3">
      <Container className="mt-4">
      <Col>
        <Card>
         <Card.Body>
            <Card.Text>Visit our community page to exploring the dicord game servers on campus</Card.Text>
            <Card.Text> connect </Card.Text>
=======
import { Container, Card, Row, Col } from 'react-bootstrap';

/** The Directory page */
const Directory = () => (
  <Container className="mt-4">
    <Row className="g-3">

      <Col md={4}>
        <Card className="h-100 shadow-sm custom-card-body">
          <Card.Body>
            <Card.Text>
              Visit our community page to explore the Discord game servers on campus.
            </Card.Text>
            <Card.Text>Connect</Card.Text>
>>>>>>> Stashed changes
          </Card.Body>
         </Card>
      </Col>
<<<<<<< Updated upstream
      <Col>
        <Card>
         <Card.Body>
            <Card.Text> See our about page to get to know the developers of UH GameLink</Card.Text>
            <Card.Text> visit </Card.Text>
=======

      <Col md={4}>
        <Card className="h-100 shadow-sm custom-card-body">
          <Card.Body>
            <Card.Text>
              See our About page to get to know the developers of UH GameLink.
            </Card.Text>
>>>>>>> Stashed changes
          </Card.Body>
         </Card>
      </Col>
<<<<<<< Updated upstream
      <Col>
        <Card>
         <Card.Body>
            <Card.Text>Interested in joining the UH game community, go to our sign up page to connect with players on campus</Card.Text>
=======

      <Col md={4}>
        <Card className="h-100 shadow-sm custom-card-body">
          <Card.Body>
            <Card.Text>
              Interested in joining the UH game community? Go to our sign-up page to connect with players on campus.
            </Card.Text>
>>>>>>> Stashed changes
            <Card.Text>Sign up</Card.Text>
          </Card.Body>
         </Card>
      </Col>
     </Container>
    </footer>
  );
  
  export default Directory;
  