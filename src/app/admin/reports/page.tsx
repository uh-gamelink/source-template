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
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to load reports.');
        return;
      }

      setReports(data);
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 🔥 FIXED: use "action" instead of "status"
  const updateStatus = async (reportId: number, action: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        console.error('Failed to update report');
        return;
      }

      // refresh dashboard after update
      fetchReports();
    } catch (err) {
      console.error(err);
    }
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
                      variant="success"
                      onClick={() => updateStatus(report.id, 'RESOLVED')}
                    >
                      Resolve
                    </Button>

                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => updateStatus(report.id, 'FLAGGED')}
                    >
                      Flag Player
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => updateStatus(report.id, 'BANNED')}
                    >
                      Ban Player
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