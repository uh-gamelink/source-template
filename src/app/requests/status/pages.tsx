import Container from 'react-bootstrap/Container';
import StatusContents from '@/components/StatusContent';

type RequestRow = {
  username: string;
  game: string;
  rank: string;
  status: string;
};

const StatusPage = () => {
  const requestRows: RequestRow[] = [];

  return (
    <Container className="py-4">
      <StatusContents requestRows={requestRows} />
    </Container>
  );
};

export default StatusPage;