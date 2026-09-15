import {expect, test} from '@playwright/test';

test('la portada ofrece una ruta principal clara', async ({page}) => {
  await page.goto('/index.html');

  await expect(page.getByRole('heading', {level: 1})).toContainText('Modelos fundacionales');
  await expect(page.locator('.hero .primary-action')).toHaveCount(1);
  await expect(page.locator('.topic-card.available')).toHaveAttribute('href', 'temas/01-deteccion/index.html');
});

test('la pregunta explica la respuesta al seleccionarla', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html');

  await page.locator('#q01-a').check();
  await expect(page.locator('.quiz-status')).toHaveClass(/incorrect/);
  await expect(page.locator('.quiz-status')).not.toBeEmpty();

  await page.locator('#q01-b').check();
  await expect(page.locator('.quiz-status')).toHaveClass(/correct/);
});

test('los recursos locales y el PDF están disponibles', async ({page, request}) => {
  const failedResponses = [];
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('/temas/01-deteccion/index.html', {waitUntil: 'networkidle'});
  await expect(page.getByRole('link', {name: 'Descargar PDF'})).toHaveAttribute(
    'href',
    '../../descargas/tema-01-deteccion.pdf'
  );

  const animatedImage = page.locator('.interactive-media');
  await page.getByRole('button', {name: 'Ver animación'}).click();
  await expect(animatedImage).toHaveAttribute('src', /car-task\.webp$/);
  await animatedImage.evaluate((image) => image.decode());
  const firstFrame = await animatedImage.screenshot();
  await page.waitForTimeout(2200);
  const laterFrame = await animatedImage.screenshot();
  expect(laterFrame.equals(firstFrame)).toBeFalsy();
  expect(failedResponses).toEqual([]);

  const pdfResponse = await request.get('/descargas/tema-01-deteccion.pdf');
  expect(pdfResponse.ok()).toBeTruthy();
  expect(pdfResponse.headers()['content-type']).toContain('application/pdf');
});

test('el laboratorio de IoU responde al deslizador', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html');

  await page.locator('[data-iou-offset]').fill('20');
  await expect(page.locator('[data-iou-value]')).toHaveText('1.00');
  await expect(page.locator('[data-iou-message]')).toContainText('supera');
});

test('la presentación carga las cuatro secciones y permite avanzar', async ({page}) => {
  await page.goto('/temas/01-deteccion/presentar.html');

  await expect(page.locator('.reveal')).toHaveClass(/ready/);
  await expect(page.locator('.slides > section')).toHaveCount(4);
  await expect(page.locator('.slides > section.present')).toHaveAttribute('id', 'inicio');

  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.slides > section.present')).toHaveAttribute('id', 'tareas');
});

test('la lectura no desborda en una pantalla móvil', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/temas/01-deteccion/index.html');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
