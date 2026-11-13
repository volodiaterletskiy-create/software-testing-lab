const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 1920, height: 1080 } });

test('Перевірка навігації: Жінка та Розпродаж на House Brand', async ({ page }) => {
  // 1. Відкриваємо головну сторінку сайту House
  const response = await page.goto('https://www.housebrand.com/ua/uk/', { waitUntil: 'domcontentloaded' });
  expect(response.status()).toBeLessThan(400);

  // Закриваємо банер cookie, якщо він є
  const acceptCookiesButton = page.locator('#cookiebotDialogOkButton, button:has-text("Прийняти"), button:has-text("Згоден"), button:has-text("Accept")').first();
  if (await acceptCookiesButton.isVisible().catch(() => false)) {
    await acceptCookiesButton.click();
  }

  // 2. ПЕРЕВІРКА №1: Заголовок сторінки
  await expect(page).toHaveTitle(/House/i);

  // 3. ПЕРЕВІРКА №2: Відкриваємо розділ «Жінка»
  const womenMenu = page.locator(':text-is("Жінка") >> visible=true').first();
  await expect(womenMenu).toBeVisible({ timeout: 10000 });
  await womenMenu.click();
  await page.waitForTimeout(1500);

  // 4. ПЕРЕВІРКА №3: Знаходимо пункт «Міжсезонний розпродаж» в меню (беремо останній видимий елемент, щоб оминути верхній банер)
  const saleMenu = page.locator('button:visible, a:visible, span:visible').filter({ hasText: /розпродаж/i }).last();
  await expect(saleMenu).toBeVisible({ timeout: 10000 });
  await saleMenu.click();

  // Пауза 3 секунди, щоб побачити відкритий розділ розпродажу
  await page.waitForTimeout(3000);
});