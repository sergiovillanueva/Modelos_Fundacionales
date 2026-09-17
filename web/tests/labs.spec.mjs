import {expect, test} from '@playwright/test';

const THRESHOLD_URL = '/temas/01-deteccion/index.html#equilibrio';
const MASK_URL = '/temas/05-sam/index.html#segmentar';
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

test('cada indicación enciende su máscara sobre la foto', async ({page}) => {
  await page.goto(MASK_URL);
  await expect(page.locator('.mask-layer[data-mask="sandia"]')).toHaveClass(/is-visible/);
  await expect(page.locator('.mask-layer[data-mask="sandia-derecha"]')).not.toHaveClass(/is-visible/);
  await expect(page.locator('[data-mask-count]')).toHaveText('1');

  await page.getByRole('button', {name: 'Un punto en la sandía derecha'}).click();
  await expect(page.locator('.mask-layer[data-mask="sandia-derecha"]')).toHaveClass(/is-visible/);
  await expect(page.locator('.mask-layer[data-mask="sandia"]')).not.toHaveClass(/is-visible/);
});

test('un concepto en texto devuelve todas las instancias', async ({page}) => {
  await page.goto(MASK_URL);
  await page.getByRole('button', {name: 'Texto: «sandía»'}).click();
  await expect(page.locator('.mask-layer[data-mask="sandia"]')).toHaveClass(/is-visible/);
  await expect(page.locator('.mask-layer[data-mask="sandia-derecha"]')).toHaveClass(/is-visible/);
  await expect(page.locator('[data-mask-count]')).toHaveText('2');
  await expect(page.locator('[data-mask-message]')).toContainText('todas las instancias');

  await page.getByRole('button', {name: 'Una caja sobre las limas'}).click();
  await expect(page.locator('.mask-layer[data-mask="limas"]')).toHaveClass(/is-visible/);
  await expect(page.locator('.mask-layer[data-mask="sandia"]')).not.toHaveClass(/is-visible/);
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
  await expect(page.locator('#segmentar .mask-layer[data-mask="sandia"]')).toHaveClass(/is-visible/);
  await page.goto('http://127.0.0.1:4173/temas/03-multimodalidad/index.html');
  await expect(page.locator('#cercania .candidate.is-winner')).toHaveCount(1);

  await context.close();
});

test('los laboratorios nuevos caben en móvil sin desbordar', async ({page}) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({width, height: 844});
    for (const url of [THRESHOLD_URL, MASK_URL, SIMILARITY_URL]) {
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

test('el presupuesto de anotación responde a los tres controles', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html#presupuesto');
  await expect(page.locator('[data-budget-total-images]')).toHaveText('1200');
  await expect(page.locator('[data-budget-hours]')).toHaveText('20');

  await page.locator('[data-budget-classes]').fill('20');
  await expect(page.locator('[data-budget-total-images]')).toHaveText('6000');
  await expect(page.locator('[data-budget-message]')).toContainText('dos semanas');
});

test('la calculadora de memoria descarta las tarjetas que no llegan', async ({page}) => {
  await page.goto('/temas/02-hugging-face/index.html#memoria');
  await expect(page.locator('[data-vram-total]')).toHaveText('0,8');
  await expect(page.locator('.device-list li.is-out')).toHaveCount(0);

  await page.locator('[data-vram-params]').fill('8000');
  await page.locator('[data-vram-precision]').selectOption('fp32');
  await expect(page.locator('.device-list li.is-out')).toHaveCount(5);
  await expect(page.locator('[data-vram-message]')).toContainText('No cabe en ninguna');

  // 8000 M en int8 son 10,8 GB: solo se queda fuera el portátil de 8 GB.
  await page.locator('[data-vram-precision]').selectOption('int8');
  await expect(page.locator('.device-list li.is-out')).toHaveCount(1);
});

test('el asistente de modelo cambia la recomendación con las respuestas', async ({page}) => {
  await page.goto('/temas/03-multimodalidad/index.html#asistente');
  await expect(page.locator('#asistente .chooser-result:visible')).toHaveText(/CLIP/);

  await page.getByRole('radio', {name: 'Cajas alrededor de lo que nombro'}).check();
  await expect(page.locator('#asistente .chooser-result:visible')).toHaveText(/Grounding DINO/);

  await page.getByRole('radio', {name: 'Datos estructurados o un razonamiento'}).check();
  await page.getByRole('radio', {name: /Bastante/}).check();
  await expect(page.locator('#asistente .chooser-result:visible')).toHaveText(/Qwen2\.5-VL/);
  await expect(page.locator('#asistente .chooser-result:visible')).toHaveCount(1);
});

test('el asistente de SAM distingue medio e indicación', async ({page}) => {
  await page.goto('/temas/05-sam/index.html#version');
  await expect(page.locator('#version .chooser-result:visible')).toHaveText(/SAM 1 basta/);

  await page.getByRole('radio', {name: /Vídeo/}).check();
  await expect(page.locator('#version .chooser-result:visible')).toHaveText(/SAM 2/);

  await page.getByRole('radio', {name: /Escribiendo qué es/}).check();
  await expect(page.locator('#version .chooser-result:visible')).toHaveText(/SAM 3/);
});

test('la tabla de candidatos filtra por tarea y licencia', async ({page}) => {
  await page.goto('/temas/02-hugging-face/index.html#candidatos');
  await expect(page.locator('[data-model-count]')).toHaveText('9');

  await page.locator('[data-model-filter="task"]').selectOption('embeddings');
  await expect(page.locator('[data-model-count]')).toHaveText('2');

  await page.locator('[data-model-filter="license"]').selectOption('apache');
  await expect(page.locator('[data-model-count]')).toHaveText('1');
  await expect(page.locator('[data-model-row]:visible')).toContainText('dinov2');
});

test('la receta se puede copiar', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/temas/01-deteccion/index.html#receta');
  await page.getByRole('button', {name: 'Copiar'}).click();
  await expect(page.getByRole('button', {name: 'Copiado'})).toBeVisible();

  const copiado = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiado).toContain('RFDETRMedium');
});

test('el selector de escena cambia las dos imágenes del comparador', async ({page}) => {
  await page.goto('/temas/04-dino/index.html#atencion-comparar');
  const antes = page.locator('[data-scene-before]');
  const despues = page.locator('[data-scene-after]');

  await expect(antes).toHaveAttribute('src', /jirafas-foto/);
  await expect(despues).toHaveAttribute('src', /jirafas-atencion/);

  await page.getByRole('button', {name: 'Bicicleta'}).click();
  await expect(antes).toHaveAttribute('src', /bici-foto/);
  await expect(despues).toHaveAttribute('src', /bici-atencion/);
  await expect(page.locator('[data-scene-note]')).toContainText('la bicicleta');
  await expect(page.getByRole('button', {name: 'Jirafas'})).toHaveAttribute('aria-pressed', 'false');

  // La cortina sigue respondiendo después de cambiar de escena.
  await page.locator('#atencion-comparar [data-compare-position]').fill('20');
  const stage = page.locator('#atencion-comparar [data-compare-stage]');
  await expect(await stage.evaluate((node) => node.style.getPropertyValue('--compare-x'))).toBe('20%');
});

test('el constructor de pipeline rehace el código con cada elección', async ({page}) => {
  await page.goto('/temas/02-hugging-face/index.html#pipeline-armar');
  const code = page.locator('[data-pipeline-code]');

  await expect(code).toContainText('image-classification');
  await expect(code).toContainText('device="cpu"');

  await page.getByRole('button', {name: 'Localizar objetos descritos con palabras'}).click();
  await expect(code).toContainText('zero-shot-object-detection');
  await expect(code).toContainText('candidate_labels');

  await page.getByRole('button', {name: 'GPU'}).click();
  await expect(code).toContainText('device="cuda"');
  await expect(page.locator('[data-pipeline-note]')).toContainText('Grounding DINO');
});
