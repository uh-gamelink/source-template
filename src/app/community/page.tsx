import { prisma } from '@/lib/prisma';
import CommunityClient from './CommunityClient';
import { auth } from '@/lib/auth';

export default async function CommunityPage() {
  const session = await auth();

  const servers = await prisma.CommunityServer.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  });

  return <CommunityClient servers={servers} session={session} />;
}