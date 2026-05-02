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
  Modal,
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadReports() {
      try {
        const res = await fetch('/api/reports');
        const data = await res.json();

        if (!res.ok) {
          if (!ignore) setError(data.error || 'Failed to load reports.');
          return;
        }

        if (!ignore) {
          setReports(data);
          setError('');
        }
      } catch (err) {
        console.error(err);
        if (!ignore) setError('Something went wrong.');
      }
    }

    loadReports();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

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

      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const openBanModal = (report: Report) => {
    setSelectedReport(report);
    setShowBanModal(true);
  };

  const closeBanModal = () => {
    setSelectedReport(null);
    setShowBanModal(false);
  };

  const confirmBan = async () => {
    if (!selectedReport) return;

    await updateStatus(selectedReport.id, 'BANNED');
    closeBanModal();
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
                    className="custom-resolve-btn"
                    onClick={() => updateStatus(report.id, 'RESOLVED')}
                  >
                    Resolve
                  </Button>
                    <Button
                      size="sm"
                      className="btn-flag"
                      onClick={() => updateStatus(report.id, 'FLAGGED')}
                    >
                      Flag Player
                    </Button>
                    <Button
                      size="sm"
                      className="btn-danger"
                      onClick={() => openBanModal(report)}
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

      <Modal
        show={showBanModal}
        onHide={closeBanModal}
        centered
        contentClassName="custom-modal-card"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Ban</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to ban{' '}
            <strong>{selectedReport?.reportedUsername}</strong>?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeBanModal}>
            Cancel
          </Button>

          <Button variant="danger" onClick={confirmBan}>
            Yes, Ban Player
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminReportsPage;
