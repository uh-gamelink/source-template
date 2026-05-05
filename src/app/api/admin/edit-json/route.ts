import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type GameJson = {
  title: string;
  developer: string;
  platform?: string | null;
  tags: string[];
  description?: string | null;
  imageUrl?: string | null;
};

type CommunityServerJson = {
  name: string;
  description: string;
  inviteUrl: string;
  tags: string[];
  imageUrl?: string | null;
  featured?: boolean;
};

const isAdmin = async () => {
  const session = await auth();

  return session?.user?.role === 'ADMIN';
};

const validateGames = (games: unknown): games is GameJson[] => {
  if (!Array.isArray(games)) {
    return false;
  }

  return games.every(
    (game) =>
      typeof game === 'object' &&
      game !== null &&
      'title' in game &&
      'developer' in game &&
      'tags' in game &&
      typeof game.title === 'string' &&
      typeof game.developer === 'string' &&
      Array.isArray(game.tags),
  );
};

const validateCommunityServers = (
  communityServers: unknown,
): communityServers is CommunityServerJson[] => {
  if (!Array.isArray(communityServers)) {
    return false;
  }

  return communityServers.every(
    (server) =>
      typeof server === 'object' &&
      server !== null &&
      'name' in server &&
      'description' in server &&
      'inviteUrl' in server &&
      'tags' in server &&
      typeof server.name === 'string' &&
      typeof server.description === 'string' &&
      typeof server.inviteUrl === 'string' &&
      Array.isArray(server.tags),
  );
};

export async function POST(request: Request) {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();

    const games = body.games ?? [];
    const communityServers = body.communityServers ?? [];

    if (!validateGames(games)) {
      return NextResponse.json(
        {
          error:
            'Invalid games JSON. Games must be an array with title, developer, and tags.',
        },
        { status: 400 },
      );
    }

    if (!validateCommunityServers(communityServers)) {
      return NextResponse.json(
        {
          error:
            'Invalid community servers JSON. Servers must be an array with name, description, inviteUrl, and tags.',
        },
        { status: 400 },
      );
    }

    await Promise.all(
      games.map((game) =>
        prisma.game.upsert({
          where: {
            title: game.title,
          },
          update: {
            developer: game.developer,
            platform: game.platform ?? '',
            tags: game.tags,
            description: game.description ?? '',
            imageUrl: game.imageUrl ?? '',
          },
          create: {
            title: game.title,
            developer: game.developer,
            platform: game.platform ?? '',
            tags: game.tags,
            description: game.description ?? '',
            imageUrl: game.imageUrl ?? '',
          },
        }),
      ),
    );

    await Promise.all(
      communityServers.map((server) =>
        prisma.communityServer.upsert({
          where: {
            name: server.name,
          },
          update: {
            description: server.description,
            inviteUrl: server.inviteUrl,
            tags: server.tags,
            imageUrl: server.imageUrl ?? '',
            featured: server.featured ?? false,
          },
          create: {
            name: server.name,
            description: server.description,
            inviteUrl: server.inviteUrl,
            tags: server.tags,
            imageUrl: server.imageUrl ?? '',
            featured: server.featured ?? false,
          },
        }),
      ),
    );

    return NextResponse.json({
      message: 'JSON data saved successfully.',
      gamesImported: games.length,
      communityServersImported: communityServers.length,
    });
  } catch (error) {
    console.error('Error saving JSON data:', error);

    return NextResponse.json(
      {
        error: 'Invalid JSON or failed to save data.',
      },
      { status: 500 },
    );
  }
}