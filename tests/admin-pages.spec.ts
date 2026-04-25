import { test, expect } from './auth-utils';

test.slow();

test('admin can access the main UH GameLink pages', async ({ getUserPage }) => {
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  await adminPage.goto('http://localhost:3000/');

  await expect(
    adminPage.getByRole('link', { name: /UH GameLink/i }),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    adminPage.getByRole('link', { name: 'Game Library' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('link', { name: 'Community' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('link', { name: 'About Us' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('link', { name: 'Find Players' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('link', { name: 'Profile' }),
  ).toBeVisible();

  await expect(
    adminPage.getByRole('button', { name: /admin@foo\.com/i }),
  ).toBeVisible({ timeout: 10000 });

  await adminPage.getByRole('link', { name: 'Game Library' }).click();
  await expect(adminPage).toHaveURL(/\/gamelibrary$/);
  await expect(
    adminPage.getByRole('heading', { name: 'Game Library' }),
  ).toBeVisible();
  await expect(adminPage.getByText('Apex Legends')).toBeVisible();

  await adminPage.getByRole('link', { name: 'Community' }).click();
  await expect(adminPage).toHaveURL(/\/community$/);
  await expect(
    adminPage.getByRole('heading', { name: 'Community' }),
  ).toBeVisible();

  await adminPage.getByRole('link', { name: 'Find Players' }).click();
  await expect(adminPage).toHaveURL(/\/findplayers$/);
  await expect(
    adminPage.getByRole('heading', { name: 'Find Players' }),
  ).toBeVisible();
  
  await expect(adminPage.getByText(/Showing/i)).toBeVisible();

  await adminPage.getByRole('link', { name: 'Profile' }).click();
  await expect(adminPage).toHaveURL(/\/profile$/);
  await expect(
    adminPage.getByRole('heading', { name: 'Your Profile' }),
  ).toBeVisible();
  await expect(adminPage.getByText(/Username: admin@foo\.com/i)).toBeVisible();

  await adminPage.getByRole('link', { name: 'About Us' }).click();
  await expect(adminPage).toHaveURL(/\/about$/);
  await expect(
    adminPage.getByRole('heading', { name: 'About' }),
  ).toBeVisible();
  await expect(adminPage.getByText('Meet the Team')).toBeVisible();
});