const { test, expect } = require('@playwright/test');

test('navigate all 13 slides via Next button', async ({ page }) => {
  await page.goto('/');
  for (let i = 1; i <= 13; i++) {
    await expect(page.locator('.slide.active')).toHaveAttribute('id', `slide-${i}`);
    if (i < 13) {
      if (i === 6) await page.click('#reveal-btn-6');
      if (i === 10) {
        await page.click('#reveal-btn-q1');
        await page.click('#reveal-btn-q2');
      }
      await page.click('#nextBtn');
    }
  }
});

test('keyboard arrow navigation works', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-1');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-2');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-1');
});

test('language toggle shows current state and persists across pages', async ({ page }) => {
  await page.goto('/');
  // First load: Chinese mode, button shows current state '中文'
  await expect(page.locator('#langToggle')).toHaveText('中文');
  await page.click('#langToggle');
  await expect(page.locator('#langToggle')).toHaveText('EN');
  // Persist to resources page
  await page.goto('/resources');
  await expect(page.locator('#langToggle')).toHaveText('EN');
});

test('paycheck reveal gates slide 6 advance', async ({ page }) => {
  await page.goto('/');
  // Advance to slide 6
  for (let i = 0; i < 5; i++) await page.click('#nextBtn');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-6');
  await expect(page.locator('#nextBtn')).toBeDisabled();
  // Phase-1 card visible, phase-2 hidden
  await expect(page.locator('#phase1-card')).not.toHaveClass(/paycheck-hidden/);
  await expect(page.locator('#phase2-card')).toHaveClass(/paycheck-hidden/);
  // Click reveal
  await page.click('#reveal-btn-6');
  await expect(page.locator('#phase2-card')).not.toHaveClass(/paycheck-hidden/);
  await expect(page.locator('#nextBtn')).toBeEnabled();
});

test('quiz Q1 must be revealed before Q2 appears, both before advance', async ({ page }) => {
  await page.goto('/');
  for (let i = 0; i < 5; i++) await page.click('#nextBtn');
  await page.click('#reveal-btn-6');
  for (let i = 0; i < 4; i++) await page.click('#nextBtn');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-10');
  await expect(page.locator('#nextBtn')).toBeDisabled();
  // Q2 block initially hidden
  await expect(page.locator('#q2-block')).toBeHidden();
  // Reveal Q1 → Q2 block appears, next still disabled
  await page.click('#reveal-btn-q1');
  await expect(page.locator('#q2-block')).toBeVisible();
  await expect(page.locator('#nextBtn')).toBeDisabled();
  // Reveal Q2 → next enabled
  await page.click('#reveal-btn-q2');
  await expect(page.locator('#nextBtn')).toBeEnabled();
});

test('home button returns to slide 1', async ({ page }) => {
  await page.goto('/');
  await page.click('#nextBtn');
  await page.click('#nextBtn');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-3');
  await page.click('#homeBtn');
  await expect(page.locator('.slide.active')).toHaveAttribute('id', 'slide-1');
});

test('no JS console errors on home and resources', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.goto('/resources');
  await page.waitForLoadState('networkidle');

  expect(errors).toEqual([]);
});
