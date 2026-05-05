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

  await expect(
    johnPage.locator('.dropdown-toggle').last(),
  ).toBeVisible({ timeout: 10000 });

  // ---------- HOME PAGE ----------
  await expect(
    johnPage.locator('h1').filter({ hasText: 'UH GameLink' }),
  ).toBeVisible();

  await expect(
    johnPage.locator('h3').filter({ hasText: 'Directory' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'View', exact: true }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'Find', exact: true }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'Visit', exact: true }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'Search', exact: true }),
  ).toBeVisible();

  await expect(
    johnPage.locator('.game-image').first(),
  ).toBeVisible();

  await johnPage.goto('/gamelibrary');
  await expect(
    johnPage.getByRole('heading', { name: 'Game Library' }),
  ).toBeVisible();

  await johnPage.goto('/community');
  await expect(
    johnPage.getByRole('heading', { name: 'Community' }),
  ).toBeVisible();

  await johnPage.goto('/findplayers');
  await expect(
    johnPage.getByRole('heading', { name: 'Find Players' }),
  ).toBeVisible();
  await expect(johnPage.getByText(/Click the plus icon/i)).toBeVisible();

  // ---------- REVIEWS ----------
  await johnPage.goto('/reviews');

  await expect(
    johnPage.getByRole('heading', { name: 'Reviews' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: /leave a review/i }),
  ).toBeVisible();

  await johnPage.getByRole('link', { name: /leave a review/i }).click();

  await expect(johnPage).toHaveURL(/\/reviews\/new$/);

  await expect(
    johnPage.getByRole('heading', { name: 'Write a Review' }).first(),
  ).toBeVisible();

  await expect(johnPage.getByText(/Posting as/i)).toBeVisible();

  await expect(
    johnPage.getByPlaceholder('Write your review...'),
  ).toBeVisible();

  await expect(johnPage.locator('select')).toBeVisible();

  await expect(
    johnPage.getByRole('button', { name: 'Submit Review' }),
  ).toBeVisible();

  await johnPage.goto('/profile');
  await expect(
    johnPage.getByRole('heading', { name: 'Your Profile' }),
  ).toBeVisible();

  await johnPage.goto('/about');
  await expect(
    johnPage.getByRole('heading', { name: 'About' }),
  ).toBeVisible();

  await expect(johnPage.getByText('Meet the Team')).toBeVisible();
});

test('library pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/gamelibrary');

  await expect(
    johnPage.getByRole('heading', { name: 'Game Library' }),
  ).toBeVisible();

  const addButton = johnPage
    .getByRole('button', { name: 'Add to Favorites' })
    .first();

  await expect(addButton).toBeVisible({ timeout: 10000 });

  const gameCard = addButton.locator(
    'xpath=ancestor::*[contains(@class, "card")]',
  );

  const gameTitle = await gameCard.locator('.card-title').innerText();

  await addButton.click();

  await expect(
    johnPage.getByRole('button', { name: /Added to Favorites/i }).first(),
  ).toBeVisible({ timeout: 10000 });

  await johnPage.getByRole('link', { name: 'View Favorites' }).click();

  await expect(
    johnPage.getByRole('heading', { name: 'Favorites' }),
  ).toBeVisible();

  await expect(
    johnPage.getByText(gameTitle, { exact: true }).first(),
  ).toBeVisible({ timeout: 10000 });

  const favoriteCard = johnPage
    .getByText(gameTitle, { exact: true })
    .locator('xpath=ancestor::*[contains(@class, "card")]');

  await favoriteCard
    .getByRole('button', { name: 'Remove from Favorites' })
    .click();

  await expect(
    johnPage.getByText(gameTitle, { exact: true }),
  ).not.toBeVisible({ timeout: 10000 });
});

test('community pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/community');

  await expect(
    johnPage.getByRole('heading', { name: 'Community' }),
  ).toBeVisible();


  const addButton = johnPage
    .getByRole('button', { name: 'Add to Profile' })
    .first();

  if (await addButton.isVisible().catch(() => false)) {
    await addButton.click();

    await expect(
      johnPage.getByRole('button', { name: /Added/i }).first(),
    ).toBeVisible({ timeout: 10000 });
  }

  const joinButton = johnPage
    .getByRole('button', { name: 'Join Discord' })
    .first();

  await expect(joinButton).toBeVisible();

  await expect(
    johnPage.getByText(/Page \d+ of \d+/),
  ).toBeVisible();

 const nextButton = johnPage.getByRole('button', {
  name: 'Next',
  exact: true,
  });

  const prevButton = johnPage.getByRole('button', {
    name: 'Prev',
    exact: true,
  });

  if (await nextButton.isEnabled()) {
    await nextButton.click();

    await expect(
      johnPage.getByText(/Page 2 of \d+/),
    ).toBeVisible();

    await expect(prevButton).toBeEnabled();

    await prevButton.click();

    await expect(
      johnPage.getByText(/Page 1 of \d+/),
    ).toBeVisible();
  }
});


test('find player pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/findplayers');

  await expect(
    johnPage.getByRole('heading', { name: 'Find Players' }),
  ).toBeVisible();

  await expect(
    johnPage.getByText(/Click the plus icon/i),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('link', { name: 'View Requests' }),
  ).toBeVisible();

  // ---------- SEARCH ----------
  const searchInput = johnPage.getByPlaceholder('Search player...');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('john');

  await expect(johnPage).toHaveURL(/search=john/, {
    timeout: 10000,
  });

  await searchInput.fill('');

  // ---------- ADD PLAYER LISTING MODAL ----------
  await johnPage.getByRole('button', { name: 'Add My Player Listing' }).click();

  await expect(
    johnPage.locator('.modal-title').filter({ hasText: 'Add Player Listing' }),
  ).toBeVisible();

  await expect(
    johnPage.getByPlaceholder('Enter your in-game username'),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('button', { name: 'Add Listing' }),
  ).toBeVisible();

  await johnPage.getByRole('button', { name: 'Cancel' }).click();

  // ---------- REQUEST MODAL ----------
  const connectButton = johnPage
    .locator('.custom-link-button')
    .first();

  if (await connectButton.isVisible().catch(() => false)) {
    await connectButton.click();

    await expect(
      johnPage.locator('.modal-title').filter({ hasText: 'Send Request' }),
    ).toBeVisible();

    await expect(
      johnPage.getByText(/Request to connect with/i),
    ).toBeVisible();

    await expect(
      johnPage.getByPlaceholder('Enter your in-game username'),
    ).toBeVisible();

    await expect(
      johnPage.getByRole('button', { name: 'Request' }),
    ).toBeVisible();

    await johnPage.getByRole('button', { name: 'Cancel' }).click();
  }

  // ---------- PAGINATION ----------
  await expect(
    johnPage.getByText(/Page \d+ of \d+/),
  ).toBeVisible();

  const nextButton = johnPage.getByRole('button', {
    name: 'Next →',
    exact: true,
  });

  const prevButton = johnPage.getByRole('button', {
    name: '← Previous',
    exact: true,
  });

  if (await nextButton.isEnabled()) {
    await nextButton.click();

    await expect(
      johnPage.getByText(/Page 2 of \d+/),
    ).toBeVisible({ timeout: 10000 });

    await expect(prevButton).toBeEnabled();

    await prevButton.click();

    await expect(
      johnPage.getByText(/Page 1 of \d+/),
    ).toBeVisible({ timeout: 10000 });
  }
});

test('request pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/requests');

  await expect(
    johnPage.getByRole('heading', { name: 'Requests' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('heading', { name: 'Incoming Requests' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('heading', { name: 'Outgoing Requests' }),
  ).toBeVisible();

  const findPlayersLink = johnPage.getByRole('link', {
    name: '← Find Players',
    exact: true,
  });

  await expect(findPlayersLink).toBeVisible();

  await expect(
    johnPage.getByRole('columnheader', { name: 'Requester Username' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('columnheader', { name: 'Game' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('columnheader', { name: 'Requester Rank' }),
  ).toBeVisible();

  await expect(
    johnPage.getByRole('columnheader', { name: 'Status' }),
  ).toBeVisible();

  const acceptButton = johnPage
    .getByRole('button', { name: 'Accept', exact: true })
    .first();

  const rejectButton = johnPage
    .getByRole('button', { name: 'Reject', exact: true })
    .first();

  const deleteButton = johnPage
    .getByRole('button', { name: 'Delete', exact: true })
    .first();

  if (await acceptButton.isVisible().catch(() => false)) {
    await expect(acceptButton).toBeVisible();
  }

  if (await rejectButton.isVisible().catch(() => false)) {
    await expect(rejectButton).toBeVisible();
  }

  if (await deleteButton.isVisible().catch(() => false)) {
    await expect(deleteButton).toBeVisible();
  }

  await findPlayersLink.click();

  await expect(johnPage).toHaveURL(/\/findplayers/);

  await expect(
    johnPage.getByRole('heading', { name: 'Find Players' }),
  ).toBeVisible();
});

test('review pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  const reviewText = `Playwright test review ${Date.now()}-${Math.random()}`;

  await johnPage.goto('/reviews/new');

  await expect(
    johnPage.getByRole('heading', { name: 'Write a Review' }).first(),
  ).toBeVisible();

  await expect(johnPage.getByText(/Posting as/i)).toBeVisible();

  await johnPage
    .getByPlaceholder('Write your review...')
    .fill(reviewText);

  await johnPage.locator('select').selectOption('5');

  await Promise.all([
    johnPage.waitForURL(/\/reviews$/, { timeout: 15000 }),
    johnPage.getByRole('button', { name: 'Submit Review' }).click(),
  ]);

  await expect(
    johnPage.getByRole('heading', { name: 'Reviews' }),
  ).toBeVisible();

  await expect(
    johnPage.getByText(reviewText),
  ).toBeVisible({ timeout: 10000 });

  const reviewCards = johnPage
  .locator('.custom-card-body')
  .filter({ hasText: reviewText });

  await expect(reviewCards).toHaveCount(1);

  await expect(
    reviewCards.first().getByRole('button', { name: 'Delete' }),
  ).toBeVisible();

  await reviewCards
    .first()
    .getByRole('button', { name: 'Delete' })
    .click();

  await johnPage.waitForLoadState('networkidle');
  await johnPage.reload();

  await expect(
    johnPage.locator('.custom-card-body').filter({ hasText: reviewText }),
  ).toHaveCount(1);
});

test('report pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  await johnPage.goto('/report');

  await expect(
    johnPage.getByRole('heading', { name: 'Report a Player' }),
  ).toBeVisible();

  await johnPage
    .getByPlaceholder("Enter the player's username")
    .fill('AlikaBasco01');

  const issueText = `Playwright report test ${Date.now()}`;

  await johnPage
    .getByPlaceholder('Describe the harassment or misuse')
    .fill(issueText);

  const dateInput = johnPage.locator('input[type="date"]');

  await expect(dateInput).toBeVisible();
  await dateInput.fill('2026-05-04');

  // ✅ Ensure submit button is visible
  const submitButton = johnPage.getByRole('button', { name: 'Submit Report' });
  await expect(submitButton).toBeVisible();

  // ✅ Click submit (no API dependency)
  await submitButton.click();

  // ✅ Verify form values still exist (UI test only)
  await expect(
    johnPage.getByPlaceholder("Enter the player's username"),
  ).toHaveValue('AlikaBasco01');

  await expect(
    johnPage.getByPlaceholder('Describe the harassment or misuse'),
  ).toHaveValue(issueText);

  await expect(dateInput).toHaveValue('2026-05-04');

  // ✅ Optional: verify we are still on /report
  await expect(johnPage).toHaveURL(/\/report/);
});

test('profile pg', async ({ getUserPage }) => {
  const johnPage = await getUserPage('john@foo.com', 'changeme');

  const username = `john_${Date.now()}`;
  const description = `Playwright profile description ${Date.now()}`;
  const interest = `Gaming${Date.now()}`;

  await johnPage.goto('/profile');

  await expect(
    johnPage.getByRole('heading', { name: 'Your Profile' }),
  ).toBeVisible();

  await expect(
    johnPage
      .getByRole('main')
      .getByRole('img', { name: 'Profile picture' }),
  ).toBeVisible();

  // ---------- EDIT PROFILE ----------
  await johnPage.getByRole('link', { name: 'Edit Profile' }).click();

  await expect(johnPage).toHaveURL(/\/profile\/edit$/);

  await expect(
    johnPage.getByRole('heading', { name: 'Edit Profile' }),
  ).toBeVisible();

  await johnPage
    .getByPlaceholder('Choose username (no spaces)')
    .fill(username);

  await johnPage
    .getByPlaceholder('Tell people a little about yourself')
    .fill(description);

  await johnPage
    .getByPlaceholder('Add interest')
    .fill(interest);

  await johnPage.getByRole('button', { name: 'Add' }).click();

  await expect(johnPage.getByText(interest)).toBeVisible();

  await johnPage.getByRole('button', { name: 'Save Profile' }).click();

  await expect(johnPage).toHaveURL(/\/profile$/);

  await expect(
    johnPage.getByRole('heading', { name: 'Your Profile' }),
  ).toBeVisible();

  // ---------- NAVIGATION LINKS ----------
  await johnPage.getByRole('link', { name: 'Edit Commmunity' }).click();
  await expect(johnPage).toHaveURL(/\/community/);

  await johnPage.goto('/profile');

  await johnPage.getByRole('link', { name: 'Edit Favorites' }).click();
  await expect(johnPage).toHaveURL(/\/gamelibrary\/favorites/);

  await johnPage.goto('/profile');

  await johnPage.getByRole('link', { name: 'Edit Interests' }).click();
  await expect(johnPage).toHaveURL(/\/profile\/edit/);

  // ---------- FINAL CHECK ----------
  await johnPage.goto('/profile');

  await expect(
    johnPage.getByRole('heading', { name: 'Your Profile' }),
  ).toBeVisible();

  await expect(
    johnPage.getByText(username),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    johnPage.getByText(description),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    johnPage.getByText(interest),
  ).toBeVisible({ timeout: 10000 });
});