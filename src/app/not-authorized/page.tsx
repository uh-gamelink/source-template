import { Col, Container, Row } from 'react-bootstrap';

/** Render a Not Authorized page if the user enters a URL that they don't have authorization for. */
const NotAuthorized = () => (
  <Container className="py-3">
    <Row className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Col xs={4} className="text-center">
        <h2>Not Authorized</h2>
        <p className='fs-6'>Returning to Home</p>
        <meta httpEquiv="refresh" content="3;url=/"/>
      </Col>
    </Row>
  </Container>
);

export default NotAuthorized;
