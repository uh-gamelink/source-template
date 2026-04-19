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
          </Card.Body>
         </Card>
      </Col>
      <Col>
        <Card>
         <Card.Body>
            <Card.Text> See our about page to get to know the developers of UH GameLink</Card.Text>
            <Card.Text> visit </Card.Text>
          </Card.Body>
         </Card>
      </Col>
      <Col>
        <Card>
         <Card.Body>
            <Card.Text>Interested in joining the UH game community, go to our sign up page to connect with players on campus</Card.Text>
            <Card.Text>Sign up</Card.Text>
          </Card.Body>
         </Card>
      </Col>
     </Container>
    </footer>
  );
  
  export default Directory;
  