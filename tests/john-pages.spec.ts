import { test, expect } from './auth-utils';

test.slow();

test('john can access the main UH GameLink pages', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('http://localhost:3000/');

  await expect(
    johnPage.getByRole('link', { name: /UH GameLink/i }),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    johnPage.getByRole('link', { name: 'Game Library' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'Community' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'About Us' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'Find Players' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'Profile' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('button', { name: /john@foo\.com/i }),
  ).toBeVisible({ timeout: 10000 });

  await johnPage.getByRole('link', { name: 'Game Library' }).click();
  await expect(johnPage).toHaveURL(/\/gamelibrary$/);
  await expect(
    johnPage.getByRole('heading', { name: 'Game Library' }),
  ).toBeVisible();
  await expect(johnPage.getByText('League of Legends')).toBeVisible();

  await johnPage.getByRole('link', { name: 'Community' }).click();
  await expect(johnPage).toHaveURL(/\/community$/);
  await expect(
    johnPage.getByRole('heading', { name: 'Community Players' }),
  ).toBeVisible();
  await expect(johnPage.getByText('Mathedealer1')).toBeVisible();

  await johnPage.getByRole('link', { name: 'Find Players' }).click();
  await expect(johnPage).toHaveURL(/\/findplayers$/);
  await expect(
    johnPage.getByRole('heading', { name: 'Find Players' }),
  ).toBeVisible();
  await expect(johnPage.getByText(/Click the plus icon/i)).toBeVisible();

  await johnPage.getByRole('link', { name: 'Profile' }).click();
  await expect(johnPage).toHaveURL(/\/profile$/);
  await expect(
    johnPage.getByRole('heading', { name: 'Your Profile' }),
  ).toBeVisible();
  await expect(johnPage.getByText(/Username: john@foo\.com/i)).toBeVisible();

  await johnPage.getByRole('link', { name: 'About Us' }).click();
  await expect(johnPage).toHaveURL(/\/about$/);
  await expect(
    johnPage.getByRole('heading', { name: 'About' }),
  ).toBeVisible();
  await expect(johnPage.getByText('Meet the Team')).toBeVisible();
});