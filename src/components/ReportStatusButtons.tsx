'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';

type Props = {
  reportId: number;
};

const ReportStatusButtons = ({ reportId }: Props) => {
  const router = useRouter();

  const updateStatus = async (status: string) => {
    await fetch(`/api/reports/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    router.refresh();
  };

  return (
    <div className="d-flex flex-wrap gap-2">
      <Button size="sm" variant="info" onClick={() => updateStatus('INVESTIGATING')}>
        Investigate
      </Button>

      <Button size="sm" variant="warning" onClick={() => updateStatus('WARNING')}>
        Warning
      </Button>

      <Button size="sm" variant="secondary" onClick={() => updateStatus('FLAGGED')}>
        Flag
      </Button>

      <Button size="sm" variant="danger" onClick={() => updateStatus('BANNED')}>
        Ban
      </Button>
    </div>
  );
};

export default ReportStatusButtons;
