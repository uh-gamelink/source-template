import { test, expect } from './auth-utils';

test.slow();

test('admin can access the admin manage page', async ({ getUserPage }) => {
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  await adminPage.goto('/admin/manage');

  await expect(adminPage).toHaveURL(/\/admin\/manage$/);

  await expect(
    adminPage.getByRole('heading', { name: 'Admin Manage' }),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    adminPage.getByRole('button', { name: 'Manage Games' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('button', { name: 'Manage Servers' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('button', { name: '+ Add Game' }),
  ).toBeVisible();

  await expect(
    adminPage.locator('strong').filter({ hasText: /^Games$/ }),
  ).toBeVisible();

  // ---------- SERVERS ----------
  await adminPage.getByRole('button', { name: 'Manage Servers' }).click();

  await expect(
    adminPage.getByRole('button', { name: '+ Add Server' }),
  ).toBeVisible();

  await expect(
    adminPage.locator('strong').filter({ hasText: /^Community Servers$/ }),
  ).toBeVisible();

  // ---------- PLAYERS ----------
  await adminPage.getByRole('button', { name: 'Manage Players' }).click();

  await expect(
    adminPage.getByRole('button', { name: '+ Add Player' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('button', { name: '- Delete Player' }),
  ).toBeVisible();

  await expect(
    adminPage.locator('strong').filter({ hasText: /^Players$/ }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('columnheader', { name: 'Username' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('columnheader', { name: 'Game' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('columnheader', { name: 'Rank' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('columnheader', { name: 'Status' }),
  ).toBeVisible();

  // ---------- ADD PLAYER MODAL (FIXED) ----------
  await adminPage.getByRole('button', { name: '+ Add Player' }).click();

  await expect(
    adminPage.locator('.modal-title').filter({ hasText: 'Add Player' }),
  ).toBeVisible();

  await expect(adminPage.locator('#player-username')).toBeVisible();
  await expect(adminPage.locator('#player-game')).toBeVisible();
  await expect(adminPage.locator('#player-rank')).toBeVisible();

  await adminPage.getByRole('button', { name: 'Cancel' }).click();

  // ---------- DELETE PLAYER MODAL ----------
  await adminPage.getByRole('button', { name: '- Delete Player' }).click();

  await expect(
    adminPage.locator('.modal-title').filter({ hasText: 'Delete Player' }),
  ).toBeVisible();

  await adminPage.getByRole('button', { name: 'Cancel' }).click();
});