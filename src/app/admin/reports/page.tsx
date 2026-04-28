'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Button,
} from 'react-bootstrap';

type Report = {
  id: number;
  reportedUsername: string;
  issue: string;
  incidentDate: string;
  status: string;
  createdAt: string;
};

const AdminReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    const res = await fetch('/api/reports');
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Failed to load reports.');
      return;
    }

    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (reportId: number, status: string) => {
    await fetch(`/api/reports/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    fetchReports();
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Reports Dashboard</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {reports.length === 0 ? (
        <Alert variant="info">No reports have been submitted yet.</Alert>
      ) : (
        <Row className="g-3">
          {reports.map((report) => (
            <Col key={report.id} xs={12} md={6} lg={4}>
              <Card className="custom-card-body h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title>{report.reportedUsername}</Card.Title>
                    <Badge bg="secondary">{report.status}</Badge>
                  </div>

                  <Card.Text>
                    <strong>Issue:</strong> {report.issue}
                  </Card.Text>

                  <Card.Text>
                    <strong>Incident Date:</strong>{' '}
                    {new Date(report.incidentDate).toLocaleDateString()}
                  </Card.Text>

                  <Card.Text>
                    <strong>Submitted:</strong>{' '}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>

                <Card.Footer>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => updateStatus(report.id, 'INVESTIGATING')}
                    >
                      Investigate
                    </Button>

                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => updateStatus(report.id, 'WARNING')}
                    >
                      Warning
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus(report.id, 'FLAGGED')}
                    >
                      Flag
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => updateStatus(report.id, 'BANNED')}
                    >
                      Ban
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AdminReportsPage;