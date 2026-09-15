import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(WEB_ROOT, 'test-results', 'visual');

fs.mkdirSync(OUTPUT_DIR, {recursive: true});

async function main() {
  console.log('Starting preview server...');
  const serverScript = path.resolve(WEB_ROOT, 'node_modules', 'http-server', 'bin', 'http-server');
  const server = spawn(process.execPath, [serverScript, 'dist', '-p', '4173', '-c-1'], {
    cwd: WEB_ROOT,
    stdio: 'ignore'
  });

  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch('http://localhost:4173/index.html');
      if (response.ok) break;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.log('Launching browser...');
  const browser = await chromium.launch();
  
  try {
    // 1. Home Desktop (1440x900)
    const ctxDesktop = await browser.newContext({viewport: {width: 1440, height: 900}});
    const pageHome = await ctxDesktop.newPage();
    await pageHome.goto('http://localhost:4173/index.html', {waitUntil: 'networkidle'});
    await pageHome.screenshot({path: path.join(OUTPUT_DIR, 'home-desktop.png'), fullPage: true});
    console.log('Captured home-desktop.png');

    const pageCredits = await ctxDesktop.newPage();
    await pageCredits.goto('http://localhost:4173/creditos.html', {waitUntil: 'networkidle'});
    await pageCredits.screenshot({path: path.join(OUTPUT_DIR, 'credits-desktop.png'), fullPage: true});
    console.log('Captured credits-desktop.png');

    const pageNotFound = await ctxDesktop.newPage();
    await pageNotFound.goto('http://localhost:4173/404.html', {waitUntil: 'networkidle'});
    await pageNotFound.screenshot({path: path.join(OUTPUT_DIR, '404-desktop.png'), fullPage: true});
    console.log('Captured 404-desktop.png');

    // 2. Home Mobile (390x844)
    const ctxMobile = await browser.newContext({viewport: {width: 390, height: 844}});
    const pageHomeMobile = await ctxMobile.newPage();
    await pageHomeMobile.goto('http://localhost:4173/index.html', {waitUntil: 'networkidle'});
    await pageHomeMobile.screenshot({path: path.join(OUTPUT_DIR, 'home-mobile.png'), fullPage: true});
    console.log('Captured home-mobile.png');

    // 3. Reading Desktop (1440x900)
    const pageReading = await ctxDesktop.newPage();
    await pageReading.goto('http://localhost:4173/temas/01-deteccion/index.html', {waitUntil: 'networkidle'});
    await pageReading.screenshot({path: path.join(OUTPUT_DIR, 'reading-desktop.png'), fullPage: true});
    console.log('Captured reading-desktop.png');

    // 4. Reading Mobile (390x844)
    const pageReadingMobile = await ctxMobile.newPage();
    await pageReadingMobile.goto('http://localhost:4173/temas/01-deteccion/index.html', {waitUntil: 'networkidle'});
    await pageReadingMobile.screenshot({path: path.join(OUTPUT_DIR, 'reading-mobile.png'), fullPage: true});
    console.log('Captured reading-mobile.png');

    // 5. Presentation (1280x720)
    const ctxPres = await browser.newContext({viewport: {width: 1280, height: 720}});
    const pagePres = await ctxPres.newPage();
    await pagePres.goto('http://localhost:4173/temas/01-deteccion/presentar.html', {waitUntil: 'networkidle'});
    await pagePres.waitForTimeout(1000);
    await pagePres.screenshot({path: path.join(OUTPUT_DIR, 'presentation-slide-1.png')});
    console.log('Captured presentation-slide-1.png');

    for (let slide = 2; slide <= 4; slide += 1) {
      await pagePres.keyboard.press('ArrowRight');
      await pagePres.waitForTimeout(700);
      await pagePres.screenshot({path: path.join(OUTPUT_DIR, `presentation-slide-${slide}.png`)});
      console.log(`Captured presentation-slide-${slide}.png`);
    }

    console.log('All visual checks captured successfully.');
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
