'use server';

import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { Role } from '@prisma/client';
import { auth } from '@/lib/auth';

/**
 * Admin-only: adds a new game to the catalog.
 */
export async function addGameAdmin(game: {
  title: string;
  developer: string;
  platform?: string;
  tags: string;
  description?: string;
  imageUrl?: string;
}) {
  await prisma.game.create({
    data: {
      title: game.title.trim(),
      developer: game.developer.trim(),
      platform: game.platform?.trim() || null,
      tags: game.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: game.description?.trim() || null,
      imageUrl: game.imageUrl?.trim() || null,
    },
  });

  redirect('/admin/games');
}

/**
 * Admin-only: edits an existing game in the catalog.
 */
export async function editGameAdmin(game: {
  id: number;
  title: string;
  developer: string;
  platform?: string;
  tags: string;
  description?: string;
  imageUrl?: string;
}) {
  await prisma.game.update({
    where: { id: game.id },
    data: {
      title: game.title.trim(),
      developer: game.developer.trim(),
      platform: game.platform?.trim() || null,
      tags: game.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: game.description?.trim() || null,
      imageUrl: game.imageUrl?.trim() || null,
    },
  });

  redirect('/admin/games');
}

/**
 * Admin-only: deletes a game from the catalog.
 */
export async function deleteGameAdmin(id: number) {
  await prisma.game.delete({
    where: { id },
  });

  redirect('/admin/games');
}

/**
 * Creates a new user in the database.
 */
export async function createUser(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);

  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
      role: Role.USER,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);

  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

/**
 * Adds a community server to the logged-in user's profile.
 */
export async function addServerToProfile(serverId: number) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('You must be logged in to add a server to your profile.');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  await prisma.userCommunityServer.upsert({
    where: {
      userId_serverId: {
        userId: user.id,
        serverId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      serverId,
    },
  });
}