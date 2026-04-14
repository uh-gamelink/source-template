'use client';

import { signIn } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.currentTarget as typeof e.currentTarget & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    await signIn('credentials', {
      callbackUrl: '/profile',
      email,
      password,
    });
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center ">
          <Col xs={5}>
            <h1 className="text-center mt-5 mb-2">Sign In</h1>
            <Card className="custom-card-body">
              <Card.Body>
                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <input name="email" type="text" className="form-control" />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="pt-2">Password</Form.Label>
                    <input name="password" type="password" className="form-control" />
                  </Form.Group>
                  <Button type="submit" className="mt-3">
                    Signin
                  </Button>
                </Form>
              </Card.Body>

              <Card.Footer>
                Don&apos;t have an account?
                <a href="/auth/signup">Sign up</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;