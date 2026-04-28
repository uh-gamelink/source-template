import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 footer">
    <Container>
      <Col className="text-center">
        Created by: Tuan Do, John Gabriel Martinez, Ella Self, Mason Vuong, Peyton Young
        <br />
      </Col>
    </Container>
  </footer>
);

export default Footer;