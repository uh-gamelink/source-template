import { test, expect } from './auth-utils';

test.slow();

test('admin can access the admin manage page', async ({ getUserPage }) => {
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  await adminPage.goto('http://localhost:3000/admin/manage');

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

  await adminPage.getByRole('button', { name: 'Manage Servers' }).click();

  await expect(
    adminPage.getByRole('button', { name: '+ Add Server' }),
  ).toBeVisible();

  await expect(
    adminPage.locator('strong').filter({ hasText: /^Community Servers$/ }),
  ).toBeVisible();
});