import {expect, test} from '@playwright/test';

test('la portada es breve, muestra la marca y abre el primer tema', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {name: /Visión artificial/})).toBeVisible();
  await expect(page.getByAltText('Datamecum')).toBeVisible();
  await expect(page.getByRole('navigation', {name: 'Temas'})).toBeVisible();
  await page.getByRole('link', {name: 'Empezar'}).click();
  await expect(page.getByRole('heading', {name: 'Detectar es localizar'})).toBeVisible();
  await expect(page.locator('.reading-content > section:visible')).toHaveCount(1);
  await expect(page.locator('.step-tabs, .reading-sidebar, .study-detail:visible')).toHaveCount(0);
});

test('siguiente, anterior y el historial mantienen el paso', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html');
  await page.getByRole('button', {name: 'Siguiente'}).click();
  await expect(page.getByRole('heading', {name: '¿Qué salida necesitas?'})).toBeFocused();
  await expect(page).toHaveURL(/#tareas$/);
  await page.getByRole('button', {name: 'Siguiente'}).click();
  await expect(page.locator('#iou')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#tareas')).toBeVisible();
  await page.reload();
  await expect(page.locator('#tareas')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#inicio')).toBeVisible();
  await page.goForward();
  await expect(page.locator('#tareas')).toBeVisible();
});

test('se puede avanzar con teclado y usar las flechas del deslizador', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html#tareas');
  await page.getByRole('button', {name: 'Siguiente'}).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#iou')).toBeVisible();
  await page.locator('[data-iou-offset]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#iou')).toBeVisible();
  await expect(page.locator('[data-iou-offset]')).toHaveValue('41');
});

test('la pregunta da una explicación inmediata y conserva la respuesta', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html#tareas');
  await page.locator('#q01-a').check();
  await expect(page.locator('.quiz-status')).toHaveClass(/incorrect/);
  await expect(page.locator('.quiz-status')).not.toBeEmpty();
  await page.locator('#q01-b').check();
  await expect(page.locator('.quiz-status')).toHaveClass(/correct/);
  await page.getByRole('button', {name: 'Siguiente'}).click();
  await page.getByRole('button', {name: 'Anterior'}).click();
  await expect(page.locator('#q01-b')).toBeChecked();
});

test('IoU muestra los extremos y conserva el paso al presentar', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html#iou');
  await page.locator('[data-iou-offset]').fill('20');
  await expect(page.locator('[data-iou-value]')).toHaveText('1.00');
  await page.locator('[data-iou-offset]').fill('60');
  await expect(page.locator('[data-iou-value]')).toHaveText('0.00');
  await page.locator('.course-material > summary').click();
  await page.getByRole('link', {name: 'Presentar'}).click();
  await expect(page.locator('.slides > section.present')).toHaveAttribute('id', 'iou');
  await page.getByRole('link', {name: 'Volver al tema'}).click();
  await expect(page.locator('#iou')).toBeVisible();
});

test('imágenes, animación, fuentes y PDF cargan desde la raíz y desde el tema', async ({page, request}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400) errors.push(response.url());
  });
  await page.goto('/', {waitUntil: 'networkidle'});
  await page.getByAltText('Datamecum').evaluate(image => image.decode());
  await page.goto('/temas/01-deteccion/index.html#tareas', {waitUntil: 'networkidle'});
    await page.getByRole('button', {name: 'Ver animación'}).click();
    const img = page.locator('.interactive-media');
    await img.evaluate((image) => image.decode());
    await expect(img).toHaveAttribute('src', /car-task\.webp$/);
    await page.getByRole('button', {name: 'Detener animación'}).click();
    await expect(img).toHaveAttribute('src', /car-task-poster\.webp$/);
  expect(errors).toEqual([]);
  expect((await request.get('/descargas/tema-01-deteccion.pdf')).ok()).toBeTruthy();
});

test('cada paso es accesible y no desborda en móvil', async ({page}) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({width, height: 844});
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.getByRole('link', {name: 'Empezar'}).click();
    for (const id of ['inicio', 'tareas', 'iou', 'practica']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      if (id !== 'practica') await page.getByRole('button', {name: 'Siguiente'}).click();
    }
    await expect(page.getByRole('link', {name: 'Abrir en Colab'})).toBeVisible();
  }
});

test('sin JavaScript y al imprimir siguen disponibles todos los pasos', async ({browser, page}) => {
  const context = await browser.newContext({javaScriptEnabled: false});
  const plainPage = await context.newPage();
  await plainPage.goto('http://127.0.0.1:4173/temas/01-deteccion/index.html');
  await expect(plainPage.locator('.reading-content > section:visible')).toHaveCount(4);
  await context.close();
  await page.goto('/temas/01-deteccion/index.html#iou');
  await page.emulateMedia({media: 'print'});
  await expect(page.locator('.reading-content > section:visible')).toHaveCount(4);
  await expect(page.locator('.lesson-nav')).toBeHidden();
});
