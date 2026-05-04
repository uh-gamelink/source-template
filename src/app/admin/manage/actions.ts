'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

const getRequiredString = (formData: FormData, key: string) => {
  const value = String(formData.get(key) ?? '').trim();

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
};

const getOptionalString = (formData: FormData, key: string) => {
  const value = String(formData.get(key) ?? '').trim();

  return value || null;
};

const getTags = (formData: FormData) => {
  const rawTags = String(formData.get('tags') ?? '');

  return rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const getId = (formData: FormData) => {
  const id = Number(formData.get('id'));

  if (!id) {
    throw new Error('Valid id is required.');
  }

  return id;
};

export async function createGameAction(formData: FormData) {
  await prisma.game.create({
    data: {
      title: getRequiredString(formData, 'title'),
      developer: getRequiredString(formData, 'developer'),
      platform: getOptionalString(formData, 'platform'),
      description: getOptionalString(formData, 'description'),
      imageUrl: getOptionalString(formData, 'imageUrl'),
      tags: getTags(formData),
    },
  });

  revalidatePath('/admin/manage');
}

export async function updateGameAction(formData: FormData) {
  const id = getId(formData);

  await prisma.game.update({
    where: {
      id,
    },
    data: {
      title: getRequiredString(formData, 'title'),
      developer: getRequiredString(formData, 'developer'),
      platform: getOptionalString(formData, 'platform'),
      description: getOptionalString(formData, 'description'),
      imageUrl: getOptionalString(formData, 'imageUrl'),
      tags: getTags(formData),
    },
  });

  revalidatePath('/admin/manage');
}

export async function deleteGameAction(formData: FormData) {
  const id = getId(formData);

  await prisma.$transaction([
    prisma.userGame.deleteMany({
      where: {
        gameId: id,
      },
    }),
    prisma.game.delete({
      where: {
        id,
      },
    }),
  ]);

  revalidatePath('/admin/manage');
}

export async function createServerAction(formData: FormData) {
  await prisma.communityServer.create({
    data: {
      name: getRequiredString(formData, 'name'),
      description: getRequiredString(formData, 'description'),
      inviteUrl: getRequiredString(formData, 'inviteUrl'),
      imageUrl: getOptionalString(formData, 'imageUrl'),
      tags: getTags(formData),
      featured: formData.get('featured') === 'on',
    },
  });

  revalidatePath('/admin/manage');
}

export async function updateServerAction(formData: FormData) {
  const id = getId(formData);

  await prisma.communityServer.update({
    where: {
      id,
    },
    data: {
      name: getRequiredString(formData, 'name'),
      description: getRequiredString(formData, 'description'),
      inviteUrl: getRequiredString(formData, 'inviteUrl'),
      imageUrl: getOptionalString(formData, 'imageUrl'),
      tags: getTags(formData),
      featured: formData.get('featured') === 'on',
    },
  });

  revalidatePath('/admin/manage');
}

export async function deleteServerAction(formData: FormData) {
  const id = getId(formData);

  await prisma.$transaction([
    prisma.userCommunityServer.deleteMany({
      where: {
        serverId: id,
      },
    }),
    prisma.communityServer.delete({
      where: {
        id,
      },
    }),
  ]);

  revalidatePath('/admin/manage');
}

export async function createPlayerAction(formData: FormData) {

  const userId = formData.get('userId');

  await prisma.player.create({
    data: {
      username: getRequiredString(formData, 'username'),
      imageUrl: getOptionalString(formData, 'imageUrl'),
      game: getRequiredString(formData, 'game'),
      rank: getRequiredString(formData, 'rank'),
      moderationStatus: "CLEAN",
      ...(userId ? { user: { connect: { id: userId } } } : {}),
    },
  });

  revalidatePath('/admin/manage');
}

export async function banPlayerAction(formData: FormData) {
  const id = getId(formData);

  await prisma.player.updateMany({
    where: { 
      id,
      moderationStatus: {
        in: ['CLEAN', 'FLAGGED'],
      },
     },
    data: { moderationStatus: 'BANNED' },
  });

  revalidatePath('/admin/manage');
}

export async function unbanPlayerAction(formData: FormData) {
  const id = getId(formData);

  await prisma.player.updateMany({
    where: { 
      id,
      moderationStatus: {
        in: ['BANNED', 'FLAGGED'],
      }
    },
    data: { moderationStatus: 'CLEAN' },
  });

  revalidatePath('/admin/manage');
}

export async function updatePlayerAction(formData: FormData) {
  const id = getId(formData);

  await prisma.player.update({
    where: { id },
    data: {
      username: getRequiredString(formData, 'username'),
      imageUrl: getOptionalString(formData, 'imageUrl'),
      game: getRequiredString(formData, 'game'),
      rank: getRequiredString(formData, 'rank'),
    },
  });

  revalidatePath('/admin/manage');
}

export async function flagPlayerAction(formData: FormData) {
  const id = getId(formData);

  await prisma.player.update({
    where: { id },
    data: { moderationStatus : "FLAGGED"},
  });

  revalidatePath('/admin/manage');
}

export async function deletePlayerAction(formData: FormData) {
  const id = getId(formData);

  await prisma.$transaction([
    prisma.userPlayer.deleteMany({
      where: {
        playerId: id,
      },
    }),
    prisma.player.delete({
      where: {
        id,
      },
    }),
  ]);

  revalidatePath('/admin/manage');
}