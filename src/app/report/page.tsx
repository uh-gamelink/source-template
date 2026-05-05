'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';

const ReportPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reportedUsername, setReportedUsername] = useState('');
  const [issue, setIssue] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  if (session?.user?.role === 'ADMIN') {
    redirect('admin/manage');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportedUsername, issue, incidentDate }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Failed to submit report.');
      setIsSubmitting(false);
      return;
    }

    setMessage('Report submitted. An admin will review this case.');
    setReportedUsername('');
    setIssue('');
    setIncidentDate('');
    setIsSubmitting(false);
  };

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col md={8}>
          <h1 className="text-center mb-3">Report a Player</h1>

          <Card className="custom-card-body">
            <Form onSubmit={handleSubmit}>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Player Username</Form.Label>
                  <Form.Control
                    value={reportedUsername}
                    onChange={(e) => setReportedUsername(e.target.value)}
                    placeholder="Enter the player's username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Issue</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Describe the harassment or misuse"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date of Incident</Form.Label>
                  <Form.Control
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    required
                  />
                </Form.Group>

                {message && <Alert variant="secondary-emphasis">{message}</Alert>}
                {error && <Alert variant="light">{error}</Alert>}
              </Card.Body>

              <Card.Footer>
                <Button
                  type="submit"
                  className="custom-reg-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </Card.Footer>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportPage;