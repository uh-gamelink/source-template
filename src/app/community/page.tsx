import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CommunityClient from '@/components/community/CommunityClient';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const session = await auth();

  const servers = await prisma.communityServer.findMany({
    orderBy: [
      { featured: 'desc' },
      { name: 'asc' },
    ],
  });

  let savedServerIds: number[] = [];

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        savedServers: true,
      },
    });

    savedServerIds = user?.savedServers.map((saved) => saved.serverId) || [];
  }

  return (
    <CommunityClient
      servers={servers}
      session={session}
      savedServerIds={savedServerIds}
    />
  );
}