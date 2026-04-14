import { test, expect } from './auth-utils';

test.slow();

test('test access to admin page', async ({ getUserPage }) => {
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  await adminPage.goto('http://localhost:3000/');

  await expect(
    adminPage.getByRole('button', { name: 'admin@foo.com' })
  ).toBeVisible({ timeout: 10000 });

  await expect(
    adminPage.getByRole('link', { name: 'UH GameLink' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    adminPage.getByRole('link', { name: 'Community' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    adminPage.getByRole('link', { name: 'Game Library' })  // Changed from 'Library' to 'GameLibrary'
  ).toBeVisible({ timeout: 5000 });

  await adminPage.getByRole('link', { name: 'Community' }).click();
  await expect(adminPage).toHaveURL(/\/community$/);

  await adminPage.getByRole('link', { name: 'Game Library' }).click();  // Changed from 'Library' to 'GameLibrary'
  await expect(adminPage).toHaveURL(/\/gamelibrary$/);  // Changed from '/library' to '/gamelibrary'
});