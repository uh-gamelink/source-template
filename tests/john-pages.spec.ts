import { test, expect } from './auth-utils';

test.slow();

test('john can access the main UH GameLink pages', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/');

  await expect(
    johnPage.getByRole('link', { name: /UH GameLink/i }),
  ).toBeVisible({ timeout: 10000 });

  await expect(johnPage.getByRole('link', { name: 'Game Library' })).toBeVisible();
  await expect(johnPage.getByRole('link', { name: 'Community' })).toBeVisible();
  await expect(johnPage.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(johnPage.getByRole('link', { name: 'Find Players' })).toBeVisible();
  await expect(johnPage.getByRole('link', { name: 'Reviews' })).toBeVisible();
  await expect(johnPage.getByRole('link', { name: 'Profile' })).toBeVisible();

  await expect(johnPage.locator('.dropdown-toggle').last()).toBeVisible();

  await expect(johnPage.locator('h1').filter({ hasText: 'UH GameLink' })).toBeVisible();
  await expect(johnPage.locator('.game-image').first()).toBeVisible();

  await johnPage.goto('/gamelibrary');
  await expect(johnPage.getByRole('heading', { name: 'Game Library' })).toBeVisible();

  await johnPage.goto('/community');
  await expect(johnPage.getByRole('heading', { name: 'Community' })).toBeVisible();

  await johnPage.goto('/findplayers');
  await expect(johnPage.getByRole('heading', { name: 'Find Players' })).toBeVisible();
});

test('library pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/gamelibrary');

  const addButton = johnPage.getByRole('button', { name: 'Add to Favorites' }).first();

  const gameCard = addButton.locator('xpath=ancestor::*[contains(@class, "card")]');
  const gameTitle = await gameCard.locator('.card-title').innerText();

  await addButton.click();

  await johnPage.getByRole('link', { name: 'View Favorites' }).click();

  await expect(
    johnPage.getByText(gameTitle, { exact: true }).first(),
  ).toBeVisible();

  const favoriteCard = johnPage
    .getByText(gameTitle, { exact: true })
    .first()
    .locator('xpath=ancestor::*[contains(@class, "card")]');

  await favoriteCard
    .getByRole('button', { name: 'Remove from Favorites' })
    .first() // ✅ FIX
    .click();
});

test('find player pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/findplayers');

  await expect(
    johnPage.getByRole('heading', { name: 'Find Players' }),
  ).toBeVisible();

  const connectButton = johnPage.locator('.custom-link-button').first();

  if (await connectButton.isVisible().catch(() => false)) {
    await connectButton.click();

    await expect(
      johnPage.locator('.modal-title').filter({ hasText: 'Send Request' }),
    ).toBeVisible();

    const requestBtn = johnPage
      .getByRole('button', { name: 'Request', exact: true })
      .first(); // ✅ FIX

    await expect(requestBtn).toBeVisible();

    await johnPage.getByRole('button', { name: 'Cancel' }).first().click();
  }
});

test('community pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/community');

  await expect(
    johnPage.getByRole('heading', { name: 'Community' }),
  ).toBeVisible();
});

test('review pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/reviews');

  await expect(
    johnPage.getByRole('heading', { name: 'Reviews' }),
  ).toBeVisible();
});

test('report pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/report');

  await expect(
    johnPage.getByRole('heading', { name: 'Report a Player' }),
  ).toBeVisible();
});

test('profile pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/profile');

  await expect(
    johnPage.getByRole('heading', { name: 'Your Profile' }),
  ).toBeVisible();
});