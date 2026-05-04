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
    johnPage.getByRole('link', { name: 'Reviews' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'Profile' }),
  ).toBeVisible();

  await expect(
    johnPage.locator('.dropdown-toggle').last(),
  ).toBeVisible({ timeout: 10000 });

  await johnPage.goto('http://localhost:3000/gamelibrary');
  await expect(
    johnPage.getByRole('heading', { name: 'Game Library' }),
  ).toBeVisible();

  await johnPage.goto('http://localhost:3000/community');
  await expect(
    johnPage.getByRole('heading', { name: 'Community' }),
  ).toBeVisible();

  await johnPage.goto('http://localhost:3000/findplayers');
  await expect(
    johnPage.getByRole('heading', { name: 'Find Players' }),
  ).toBeVisible();
  await expect(johnPage.getByText(/Click the plus icon/i)).toBeVisible();

  await johnPage.goto('http://localhost:3000/reviews');
  await expect(
    johnPage.getByRole('heading', { name: 'Reviews' }),
  ).toBeVisible();
  await expect(
    johnPage.getByRole('link', { name: /leave a review/i }),
  ).toBeVisible();

  await johnPage.goto('http://localhost:3000/profile');
  await expect(
    johnPage.getByRole('heading', { name: 'Your Profile' }),
  ).toBeVisible();

  await johnPage.goto('http://localhost:3000/about');
  await expect(
    johnPage.getByRole('heading', { name: 'About' }),
  ).toBeVisible();
  await expect(johnPage.getByText('Meet the Team')).toBeVisible();
});