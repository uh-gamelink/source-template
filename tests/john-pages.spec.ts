import { test, expect } from './auth-utils';

test.slow();

test('john can access the main UH GameLink pages', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('http://localhost:3000/');

  await expect(
    johnPage.getByRole('link', { name: /UH GameLink/i }),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    johnPage.locator('.dropdown-toggle').last(),
  ).toBeVisible({ timeout: 10000 });

  await johnPage.goto('http://localhost:3000/gamelibrary');
  await expect(johnPage).toHaveURL(/\/gamelibrary$/);
  await expect(
    johnPage.getByRole('heading', { name: 'Game Library' }),
  ).toBeVisible();

  await johnPage.goto('http://localhost:3000/community');
  await expect(johnPage).toHaveURL(/\/community$/);
  await expect(
    johnPage.getByRole('heading', { name: 'Community' }),
  ).toBeVisible();

  await johnPage.goto('http://localhost:3000/findplayers');
  await expect(johnPage).toHaveURL(/\/findplayers$/);
  await expect(
    johnPage.getByRole('heading', { name: 'Find Players' }),
  ).toBeVisible();
  await expect(johnPage.getByText(/Click the plus icon/i)).toBeVisible();

  await johnPage.goto('http://localhost:3000/reviews');
  await expect(johnPage).toHaveURL(/\/reviews$/);
  await expect(
    johnPage.getByRole('heading', { name: 'Reviews' }),
  ).toBeVisible();

  await johnPage.goto('http://localhost:3000/profile');
  await expect(johnPage).toHaveURL(/\/profile$/);
  await expect(
    johnPage.getByRole('heading', { name: 'Your Profile' }),
  ).toBeVisible();

  await johnPage.goto('http://localhost:3000/about');
  await expect(johnPage).toHaveURL(/\/about$/);
  await expect(
    johnPage.getByRole('heading', { name: 'About' }),
  ).toBeVisible();
  await expect(johnPage.getByText('Meet the Team')).toBeVisible();
});