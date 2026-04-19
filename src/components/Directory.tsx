  import { Col, Container, Card, Button } from 'react-bootstrap';
  
  /** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
  const Directory = () => (
      <Container className="mt-4">
      <Col>
        <Card>
         <Card.Body>
            <Card.Text>Visit our community page to exploring the dicord game servers on campus</Card.Text>
              <div className="mt-auto">
                <Button
                  href="/src/community"
                  target="Community"
                  rel="_blank"
                  className="custom-tag-btn border-0"
                >
                  Connect
                </Button>
              </div>
          </Card.Body>
         </Card>
      </Col>
      <Col>
        <Card>
         <Card.Body>
            <Card.Text> See our about page to get to know the developers of UH GameLink</Card.Text>
              <div className="mt-auto">
                <Button
                  href="/src/app/about"
                  target="About"
                  rel="_blank"
                  className="custom-tag-btn border-0"
                >
                  Visit
                </Button>
              </div>
          </Card.Body>
         </Card>
      </Col>
      <Col>
        <Card>
         <Card.Body>
            <Card.Text>Interested in joining the UH game community, go to our sign up page to connect with players on campus</Card.Text>
              <div className="mt-auto">
                <Button
                  href="/auth/app/signin"
                  target="Signup"
                  rel="_blank"
                  className="custom-tag-btn border-0"
                >
                  Sign up
                </Button>
              </div>  
          </Card.Body>
         </Card>
      </Col>
     </Container>
  );
  
  export default Directory;
  