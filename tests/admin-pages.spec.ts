import { test, expect } from './auth-utils';

test.slow();

test('admin can access the admin manage page', async ({ getUserPage }) => {
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  await adminPage.goto('http://localhost:3000/admin/manage');

  await expect(
    adminPage.getByRole('link', { name: /UH GameLink/i }),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    adminPage.getByRole('link', { name: 'Manage' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('button', { name: /Admin/i }),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    adminPage.getByRole('link', { name: 'Game Library' }),
  ).not.toBeVisible();

  await expect(
    adminPage.getByRole('link', { name: 'Community' }),
  ).not.toBeVisible();

  await expect(
    adminPage.getByRole('link', { name: 'About Us' }),
  ).not.toBeVisible();

  await expect(
    adminPage.getByRole('link', { name: 'Find Players' }),
  ).not.toBeVisible();

  await expect(
    adminPage.getByRole('link', { name: 'Profile' }),
  ).not.toBeVisible();

  await expect(adminPage).toHaveURL(/\/admin\/manage$/);

  await expect(
    adminPage.getByRole('heading', { name: 'Admin Manage' }),
  ).toBeVisible();

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
    adminPage.getByText('Games'),
  ).toBeVisible();

  await adminPage.getByRole('button', { name: 'Manage Servers' }).click();

  await expect(
    adminPage.getByRole('button', { name: '+ Add Server' }),
  ).toBeVisible();

  await expect(
    adminPage.getByText('Community Servers'),
  ).toBeVisible();
});