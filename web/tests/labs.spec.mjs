import {expect, test} from '@playwright/test';

const THRESHOLD_URL = '/temas/01-deteccion/index.html#equilibrio';
const PROMPT_URL = '/temas/05-sam/index.html#marcar';
const SIMILARITY_URL = '/temas/03-multimodalidad/index.html#cercania';

test('el umbral mueve precisión y recall en direcciones opuestas', async ({page}) => {
  await page.goto(THRESHOLD_URL);
  const precision = page.locator('[data-threshold-precision]');
  const recall = page.locator('[data-threshold-recall]');

  await expect(precision).toHaveText('0,75');
  await expect(recall).toHaveText('1,00');

  await page.locator('[data-threshold-score]').fill('50');
  await expect(precision).toHaveText('1,00');
  await expect(recall).toHaveText('1,00');
  await expect(page.locator('[data-threshold-fp]')).toHaveText('0');

  await page.locator('[data-threshold-score]').fill('85');
  await expect(precision).toHaveText('1,00');
  await expect(recall).toHaveText('0,33');
  await expect(page.locator('[data-threshold-fn]')).toHaveText('2');

  await page.locator('[data-threshold-score]').fill('96');
  await expect(precision).toHaveText('—');
  await expect(page.locator('[data-threshold-message]')).toContainText('no queda ninguna predicción');
});

test('la escena del umbral marca cada predicción como acierto o falsa alarma', async ({page}) => {
  await page.goto(THRESHOLD_URL);
  await expect(page.locator('[data-prediction="p1"]')).toHaveClass(/is-tp/);
  await expect(page.locator('[data-prediction="p4"]')).toHaveClass(/is-fp/);
  await expect(page.locator('[data-prediction="p5"]')).toHaveClass(/is-filtered/);

  await page.locator('[data-threshold-score]').fill('0');
  await expect(page.locator('[data-prediction="p5"]')).toHaveClass(/is-fp/);
  await expect(page.locator('[data-threshold-message]')).toContainText('repite un objeto');
});

test('un punto positivo propone el objeto entero y uno negativo retira la parte', async ({page}) => {
  await page.goto(PROMPT_URL);
  const message = page.locator('[data-prompt-message]');
  await expect(message).toContainText('la carrocería, la cabina y las ruedas');
  await expect(page.locator('[data-region="ruedas"]')).toHaveClass(/is-inside/);

  // La rueda trasera queda a la izquierda del recuadro que envuelve a las dos ruedas.
  const clickWheel = async () => {
    const box = await page.locator('[data-region="ruedas"]').boundingBox();
    await page.mouse.click(box.x + box.width * 0.13, box.y + box.height * 0.5);
  };

  await page.getByRole('button', {name: 'Excluir'}).click();
  await clickWheel();
  await expect(page.locator('[data-region="ruedas"]')).not.toHaveClass(/is-inside/);
  await expect(message).toContainText('sin las ruedas');
  await expect(page.locator('[data-prompt-count]')).toHaveText('2');

  await clickWheel();
  await expect(page.locator('[data-region="ruedas"]')).toHaveClass(/is-inside/);
  await expect(page.locator('[data-prompt-count]')).toHaveText('1');
});

test('el árbol entra en la máscara solo si se le señala', async ({page}) => {
  await page.goto(PROMPT_URL);
  await expect(page.locator('[data-region="arbol"]')).not.toHaveClass(/is-inside/);
  await page.locator('[data-region="arbol"]').click();
  await expect(page.locator('[data-region="arbol"]')).toHaveClass(/is-inside/);
  await expect(page.locator('[data-prompt-message]')).toContainText('el árbol');
});

test('las zonas de la escena responden al teclado sin cambiar de paso', async ({page}) => {
  await page.goto(PROMPT_URL);
  await page.locator('[data-region="cabina"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#marcar')).toBeVisible();
  await expect(page.locator('[data-prompt-count]')).toHaveText('2');
});

test('girar el vector de la imagen cambia el texto ganador', async ({page}) => {
  await page.goto(SIMILARITY_URL);
  await expect(page.locator('.candidate.is-winner .candidate-name')).toHaveText('un gato');
  await expect(page.locator('[data-candidate="gato"] [data-candidate-value]')).toHaveText('0,97');

  await page.locator('[data-similarity-angle]').fill('41');
  await expect(page.locator('.candidate.is-winner .candidate-name')).toHaveText('un perro');
  await expect(page.locator('[data-similarity-winner]')).toContainText('un perro');

  await page.locator('[data-similarity-angle]').fill('115');
  await expect(page.locator('.candidate.is-winner .candidate-name')).toHaveText('una bicicleta');
  await expect(page.locator('[data-candidate="bicicleta"] [data-candidate-value]')).toHaveText('1,00');
});

test('los laboratorios conservan un ejemplo legible sin JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false});
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:4173/temas/01-deteccion/index.html');
  await expect(page.locator('#equilibrio [data-threshold-precision]')).toHaveText('0,75');
  await page.goto('http://127.0.0.1:4173/temas/05-sam/index.html');
  await expect(page.locator('#marcar [data-region="carroceria"]')).toHaveClass(/is-inside/);
  await page.goto('http://127.0.0.1:4173/temas/03-multimodalidad/index.html');
  await expect(page.locator('#cercania .candidate.is-winner')).toHaveCount(1);

  await context.close();
});

test('los laboratorios nuevos caben en móvil sin desbordar', async ({page}) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({width, height: 844});
    for (const url of [THRESHOLD_URL, PROMPT_URL, SIMILARITY_URL]) {
      await page.goto(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
  }
});
