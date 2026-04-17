import { prisma } from '@/lib/prisma';
import CommunityClient from './CommunityClient';

export default async function CommunityPage() {
  const servers = await prisma.communityServer.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  });

  return <CommunityClient servers={servers} />;
}