import { prisma } from '@/lib/prisma';
import type { Report } from '@prisma/client';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import ReportStatusButtons from '../../../components/ReportStatusButtons';

const AdminReportsPage = async () => {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Player Reports</h1>

      <Row className="g-3">
        {reports.map((report: Report) => (
          <Col key={report.id} xs={12} md={6} lg={4}>
            <Card className="custom-card-body h-100">
              <Card.Body>
                <Card.Title>{report.reportedUsername}</Card.Title>

                <Badge bg="secondary" className="mb-3">
                  {report.status}
                </Badge>

                <Card.Text>
                  <strong>Issue:</strong> {report.issue}
                </Card.Text>

                <Card.Text>
                  <strong>Date:</strong>{' '}
                  {report.incidentDate.toLocaleDateString()}
                </Card.Text>

                <Card.Text>
                  <strong>Submitted:</strong>{' '}
                  {report.createdAt.toLocaleDateString()}
                </Card.Text>
              </Card.Body>

              <Card.Footer>
                <ReportStatusButtons reportId={report.id} />
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminReportsPage;
