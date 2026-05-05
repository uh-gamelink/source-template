import { test as base, expect, Page } from '@playwright/test';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const SESSION_STORAGE_PATH = path.join(__dirname, 'playwright-auth-sessions');

if (!fs.existsSync(SESSION_STORAGE_PATH)) {
  fs.mkdirSync(SESSION_STORAGE_PATH, { recursive: true });
}

interface AuthFixtures {
  getUserPage: (email: string, password: string) => Promise<Page>;
}

async function isLoggedIn(page: Page): Promise<boolean> {
  const response = await page.request.get(`${BASE_URL}/api/auth/session`);

  if (!response.ok()) {
    return false;
  }

  const session = await response.json();

  return Boolean(session?.user?.email);
}

async function authenticateWithUI(
  page: Page,
  email: string,
  password: string,
  sessionName: string,
): Promise<void> {
  const sessionPath = path.join(SESSION_STORAGE_PATH, `${sessionName}.json`);

  // 🔁 Try restoring saved session
  if (fs.existsSync(sessionPath)) {
    try {
      const sessionData = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
      await page.context().addCookies(sessionData.cookies);

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      if (await isLoggedIn(page)) {
        console.log(`✓ Restored session for ${email}`);

        // 🔥 CRITICAL FIX: allow NextAuth to stabilize
        await page.waitForTimeout(1000);

        return;
      }

      console.log(`× Saved session for ${email} expired, re-authenticating...`);
    } catch (error) {
      console.log(`× Error restoring session: ${error}`);
    }
  }

  // 🔐 Fresh login
  try {
    console.log(`→ Authenticating ${email} via UI...`);

    await page.goto(`${BASE_URL}/auth/signin`);
    await page.waitForLoadState('networkidle');

    await fillFormWithRetry(page, [
      { selector: 'input[name="email"]', value: email },
      { selector: 'input[name="password"]', value: password },
    ]);

    const submitButton = page.getByRole('button', { name: /sign[ -]?in/i });

    if (await submitButton.isVisible({ timeout: 1000 })) {
      await submitButton.click();
    } else {
      await page.getByRole('button', { name: /log[ -]?in/i }).click();
    }

    await expect
      .poll(async () => isLoggedIn(page), {
        timeout: 10000,
      })
      .toBe(true);

    // 🔥 CRITICAL FIX: stabilize session after login
    await page.waitForTimeout(1000);

    const cookies = await page.context().cookies();
    fs.writeFileSync(sessionPath, JSON.stringify({ cookies }));

    console.log(`✓ Successfully authenticated ${email} and saved session`);
  } catch (error) {
    console.error(`× Authentication failed for ${email}:`, error);
    throw new Error(`Authentication failed: ${error}`);
  }
}

async function fillFormWithRetry(
  page: Page,
  fields: Array<{ selector: string; value: string }>,
): Promise<void> {
  for (const field of fields) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const element = page.locator(field.selector);
        await element.waitFor({ state: 'visible', timeout: 2000 });
        await element.clear();
        await element.fill(field.value);
        await element.evaluate((el) => el.blur());
        break;
      } catch {
        attempts += 1;

        if (attempts >= maxAttempts) {
          throw new Error(
            `Failed to fill field ${field.selector} after ${maxAttempts} attempts`,
          );
        }

        await page.waitForTimeout(500);
      }
    }
  }
}

export const test = base.extend<AuthFixtures>({
  getUserPage: async ({ browser }, fixtureCallback) => {
    const createUserPage = async (email: string, password: string) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await authenticateWithUI(page, email, password, `session-${email}`);

      return page;
    };

    await fixtureCallback(createUserPage);
  },
});

export { expect } from '@playwright/test';