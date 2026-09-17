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

test('el comprobador de licencias cambia el veredicto según el uso', async ({page}) => {
  await page.goto('/temas/02-hugging-face/index.html#comprobar');
  const verdict = page.locator('[data-license-verdict]');
  await expect(verdict).toHaveText('Permitido con condiciones');

  await page.locator('[data-license-use]').selectOption('interno');
  await expect(verdict).toHaveText('Permitido');

  await page.locator('[data-license-choice]').selectOption('cc-by-nc');
  await expect(verdict).toHaveText('No permitido');
  await expect(page.locator('[data-license-reason]')).toContainText('uso comercial');

  await page.locator('[data-license-use]').selectOption('investigacion');
  await expect(verdict).toHaveText('Permitido');

  await page.locator('[data-license-choice]').selectOption('apache-2.0');
  await page.locator('[data-license-use]').selectOption('servicio');
  await expect(verdict).toHaveText('Permitido');
});

test('el laboratorio de OKS muestra que el mismo error no penaliza igual', async ({page}) => {
  await page.goto('/temas/06-otras-tareas/index.html#oks');
  await expect(page.locator('[data-joint="ojo"] [data-joint-value]')).toHaveText('0,80');
  await expect(page.locator('[data-joint="cadera"] [data-joint-value]')).toHaveText('0,99');

  await page.locator('[data-oks-distance]').fill('0');
  await expect(page.locator('[data-oks-message]')).toContainText('todos los puntos valen 1,00');
  await expect(page.locator('[data-joint="ojo"] [data-joint-value]')).toHaveText('1,00');

  await page.locator('[data-oks-distance]').fill('20');
  const ojo = await page.locator('[data-joint="ojo"] [data-joint-value]').textContent();
  const cadera = await page.locator('[data-joint="cadera"] [data-joint-value]').textContent();
  expect(Number(ojo.replace(',', '.'))).toBeLessThan(Number(cadera.replace(',', '.')));
});

test('el banco de normalidad marca anomalía solo al alejarse', async ({page}) => {
  await page.goto('/temas/04-dino/index.html#normalidad');
  const verdict = page.locator('[data-anomaly-verdict]');
  await expect(verdict).toHaveText('Anomalía');

  await page.locator('[data-anomaly-position]').fill('0');
  await expect(verdict).toHaveText('Normal');
  await expect(page.locator('[data-anomaly-message]')).toContainText('nada que señalar');

  await page.locator('[data-anomaly-position]').fill('100');
  await expect(verdict).toHaveText('Anomalía');
  const score = await page.locator('[data-anomaly-score]').textContent();
  expect(Number(score.replace(',', '.'))).toBeGreaterThan(14);
});

test('los laboratorios de los temas 4 y 6 caben en móvil', async ({page}) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({width, height: 844});
    for (const url of ['/temas/04-dino/index.html#normalidad', '/temas/06-otras-tareas/index.html#oks', '/temas/02-hugging-face/index.html#comprobar']) {
      await page.goto(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
  }
});

test('el umbral de NMS pasa de borrar un coche a dejar duplicados', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html#nms');
  await expect(page.locator('[data-nms-kept]')).toHaveText('2');
  await expect(page.locator('[data-nms-message]')).toContainText('Una caja por coche');

  await page.locator('[data-nms-threshold]').fill('15');
  await expect(page.locator('[data-nms-kept]')).toHaveText('1');
  await expect(page.locator('[data-nms-message]')).toContainText('se pierde un objeto real');
  await expect(page.locator('[data-candidate-box="b1"]')).toHaveClass(/is-suppressed/);

  await page.locator('[data-nms-threshold]').fill('90');
  await expect(page.locator('[data-nms-kept]')).toHaveText('5');
  await expect(page.locator('[data-nms-suppressed]')).toHaveText('0');
  await expect(page.locator('[data-nms-message]')).toContainText('sobreviven duplicados');
});

test('el comparador deslizante recorta la imagen superpuesta', async ({page}) => {
  await page.goto('/temas/06-otras-tareas/index.html#profundidad');
  const stage = page.locator('#profundidad [data-compare-stage]');
  const clip = () => stage.evaluate((node) => node.style.getPropertyValue('--compare-x'));

  await expect(await clip()).toBe('50%');
  await page.locator('#profundidad [data-compare-position]').fill('0');
  await expect(await clip()).toBe('0%');
  await page.locator('#profundidad [data-compare-position]').fill('100');
  await expect(await clip()).toBe('100%');

  await page.goto('/temas/06-otras-tareas/index.html#superresolucion');
  await expect(page.locator('#superresolucion [data-compare-stage] img')).toHaveCount(2);
});

test('sin JavaScript los comparadores muestran las dos mitades', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false});
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/temas/06-otras-tareas/index.html');
  const stage = page.locator('#profundidad [data-compare-stage]');
  await expect(await stage.evaluate((node) => node.style.getPropertyValue('--compare-x'))).toBe('50%');
  await expect(page.locator('#nms')).toHaveCount(0);
  await context.close();
});

test('la cuadrícula de YOLO reparte o comparte celdas según su tamaño', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html#cuadricula');
  await expect(page.locator('[data-grid-count]')).toHaveText('3 de 3');
  await expect(page.locator('#cuadricula .grid-cell.is-shared')).toHaveCount(0);

  await page.locator('[data-grid-size]').fill('4');
  await expect(page.locator('[data-grid-count]')).toHaveText('2 de 3');
  await expect(page.locator('#cuadricula .grid-cell.is-shared')).toHaveCount(1);
  await expect(page.locator('[data-grid-message]')).toContainText('misma celda');

  await page.locator('[data-grid-size]').fill('13');
  await expect(page.locator('[data-grid-count]')).toHaveText('3 de 3');
  await expect(page.locator('#cuadricula .grid-lines line')).toHaveCount(24);
});

// Un margen automático convierte la rejilla en ancho de contenido: al cambiar el mensaje
// cambiaba de tamaño y la escena daba un salto. Debe mantenerse quieta.
const LAB_CONTROLS = [
  ['/temas/01-deteccion/index.html#equilibrio', 'equilibrio', '[data-threshold-score]', ['0', '42', '60', '96']],
  ['/temas/01-deteccion/index.html#iou', 'iou', '[data-iou-offset]', ['20', '40', '60']],
  ['/temas/01-deteccion/index.html#nms', 'nms', '[data-nms-threshold]', ['10', '50', '90']],
  ['/temas/01-deteccion/index.html#cuadricula', 'cuadricula', '[data-grid-size]', ['2', '7', '13']],
  ['/temas/03-multimodalidad/index.html#cercania', 'cercania', '[data-similarity-angle]', ['0', '41', '175']],
  ['/temas/04-dino/index.html#normalidad', 'normalidad', '[data-anomaly-position]', ['0', '55', '100']],
  ['/temas/06-otras-tareas/index.html#oks', 'oks', '[data-oks-distance]', ['0', '5', '40']]
];

for (const [width, height] of [[1440, 900], [390, 844]]) {
  test(`los laboratorios no cambian de tamaño al mover su control (${width} px)`, async ({page}) => {
    await page.setViewportSize({width, height});

    for (const [url, section, control, values] of LAB_CONTROLS) {
      await page.goto(url, {waitUntil: 'networkidle'});
      // Sin esperar a las imágenes, la primera medida cae antes de que la sección tome su altura.
      await page.locator(`#${section} img`).evaluateAll((images) =>
        Promise.all(images.map((image) => image.decode().catch(() => {})))
      );
      const lab = page.locator(`#${section} .lab-layout, #${section} .iou-lab`);
      const sizes = new Set();
      const tops = [];

      for (const value of values) {
        await page.locator(control).fill(value);
        // Relativo a la sección: enfocar el control puede desplazar el scroll de la página.
        const medida = await page.evaluate((id) => {
          const parent = document.getElementById(id);
          const node = parent.querySelector('.lab-layout, .iou-lab');
          const a = node.getBoundingClientRect();
          const b = parent.getBoundingClientRect();
          return {width: Math.round(a.width), height: Math.round(a.height), offset: a.top - b.top};
        }, section);
        sizes.add(`${medida.width}x${medida.height}`);
        tops.push(medida.offset);
      }

      expect(sizes, `${section} cambia de tamaño: ${[...sizes].join(' | ')}`).toHaveProperty('size', 1);
      // Un píxel de diferencia es el redondeo del centrado vertical, no un salto.
      expect(Math.max(...tops) - Math.min(...tops), `${section} se desplaza dentro de su pantalla: ${tops.map((t) => t.toFixed(1)).join(' | ')}`).toBeLessThanOrEqual(1);
    }
  });
}
