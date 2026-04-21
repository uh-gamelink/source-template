'use client';

import { Suspense } from 'react';
import RequestsContent from './RequestsContent';

export const dynamic = 'force-dynamic';

export default function RequestsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RequestsContent />
    </Suspense>
  );
}