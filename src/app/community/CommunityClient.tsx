import { Session } from 'next-auth';
import CommunityServerCard from '@/components/community/CommunityServerCard';

type CommunityServer = {
  id: number;
  name: string;
  description: string;
  inviteUrl: string;
  imageUrl?: string | null;
  tags: string[];
  featured: boolean;
};

export default function CommunityClient({
  servers,
  session,
  savedServerIds,
}: {
  servers: CommunityServer[];
  session: Session | null;
  savedServerIds: number[];
}) {
  const isLoggedIn = !!session;

  return (
    <div className="container py-4">
      <div className="row g-4">
        {servers.map((server) => (
          <div key={server.id} className="col-md-4">
            <CommunityServerCard
              server={server}
              isLoggedIn={isLoggedIn}
              alreadyAdded={savedServerIds.includes(server.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}