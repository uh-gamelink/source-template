import { test, expect } from './auth-utils';

test.slow();

test('can authenticate a specific user', async ({ getUserPage }) => {
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  await customUserPage.goto('http://localhost:3000/');

  await expect(
    customUserPage.getByRole('button', { name: 'john@foo.com' })
  ).toBeVisible({ timeout: 10000 });

  await expect(
    customUserPage.getByRole('link', { name: 'UH GameLink' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    customUserPage.getByRole('link', { name: 'Community' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    customUserPage.getByRole('link', { name: 'Game Library' })  // Changed from 'Library' to 'GameLibrary'
  ).toBeVisible({ timeout: 5000 });

  await customUserPage.getByRole('link', { name: 'Community' }).click();
  await expect(customUserPage).toHaveURL(/\/community$/);

  await customUserPage.getByRole('link', { name: 'Game Library' }).click();  // Changed from 'Library' to 'GameLibrary'
  await expect(customUserPage).toHaveURL(/\/gamelibrary$/);  // Changed from '/library' to '/gamelibrary'
});