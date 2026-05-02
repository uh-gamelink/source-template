'use client';

import { signOut } from 'next-auth/react'; // v5 compatible
import { Button, Col, Row } from 'react-bootstrap';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <Col id="signout-page" className="text-center py-3">
    <h2>Do you want to sign out?</h2>
    <Row>
      <Col xs={4} />
      <Col>
        <Button variant="secondary" className="custom-home-button" onClick={() => signOut({ callbackUrl: '/'})}>
          Sign Out
        </Button>
      </Col>
      <Col>
        <Button variant="danger" className="btn-danger" href="/">
          Cancel
        </Button>
      </Col>
      <Col xs={4} />
    </Row>
  </Col>
);

export default SignOut;
