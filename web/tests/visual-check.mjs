import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(WEB_ROOT, 'test-results', 'visual');
const URL = 'http://127.0.0.1:4173';
fs.mkdirSync(OUTPUT_DIR, {recursive: true});

const server = spawn(process.execPath, [path.join(WEB_ROOT, 'node_modules/http-server/bin/http-server'), 'dist', '-p', '4173', '-c-1'], {cwd: WEB_ROOT, stdio: 'ignore'});
let browser;
try {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { if ((await fetch(URL)).ok) break; } catch { /* Server is starting. */ }
    if (attempt === 29) throw new Error('Preview server did not start.');
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  browser = await chromium.launch();
  for (const [mode, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844], ['presentation', 1280, 720]]) {
    const page = await browser.newPage({viewport: {width, height}});
    for (const id of ['inicio', 'tareas', 'iou', 'practica']) {
      const route = mode === 'presentation' ? `/temas/01-deteccion/presentar.html#/${id}` : `/index.html#${id}`;
      await page.goto(URL + route, {waitUntil: 'networkidle'});
      await page.locator(mode === 'presentation' ? `.slides > #${id}.present` : `.reading-content > #${id}`).waitFor({state: 'visible'});
      await page.evaluate(() => document.fonts.ready);
      if (mode === 'presentation') {
        await page.waitForFunction(() => [...document.querySelectorAll('.slides > section')].every(section => {
          const opacity = Number(getComputedStyle(section).opacity);
          return section.classList.contains('present') ? opacity === 1 : opacity === 0;
        }));
      }
      await page.screenshot({path: path.join(OUTPUT_DIR, `${mode}-${id}.png`), fullPage: mode !== 'presentation'});
      console.log(`Captured ${mode}-${id}.png`);
    }
    await page.close();
  }
} finally {
  if (browser) await browser.close();
  server.kill();
}
