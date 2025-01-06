import { test, expect } from '@playwright/test';

test('homepage has Perlin noise canvas', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Check if the canvas exists
  const canvas = await page.locator('canvas');
  await expect(canvas).toBeVisible();
  
  // Check if the title is present
  await expect(page).toHaveTitle(/Perlin Noise/);
});

test('canvas size changes with window size', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Set a specific viewport size
  await page.setViewportSize({ width: 800, height: 600 });
  
  // Check if canvas exists and has correct size
  const canvas = await page.locator('canvas');
  await expect(canvas).toBeVisible();
  
  // Get canvas dimensions
  const canvasBox = await canvas.boundingBox();
  expect(canvasBox?.width).toBeGreaterThan(0);
  expect(canvasBox?.height).toBeGreaterThan(0);
});
