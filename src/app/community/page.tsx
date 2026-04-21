import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CommunityServerCard from '@/components/community/CommunityServerCard';

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
    <div className="container py-4">
      <div className="row g-4">
        {servers.map((server) => (
          <div key={server.id} className="col-md-4">
            <CommunityServerCard
              server={server}
              isLoggedIn={!!session}
              alreadyAdded={savedServerIds.includes(server.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}