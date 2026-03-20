import { test, expect } from '@playwright/test';

test('check for loading state and app render at /Pedidos/', async ({ page }) => {
  await page.goto('http://localhost:8000/Pedidos/');

  // Initial loading state
  const loading = await page.getByText('Loading BeeMesh...').isVisible();
  console.log('Loading state visible:', loading);

  // App should render
  await expect(page.getByText('Bee Mesh System')).toBeVisible({ timeout: 10000 });
  console.log('App rendered successfully');

  await page.screenshot({ path: 'screenshot_pedidos_v2.png' });
});
