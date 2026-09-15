import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
import {buildSite} from './build.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const topicId = process.argv[2] || '01-deteccion';
const pdfName = `tema-${topicId}.pdf`;
const PUBLIC_OUTPUT = path.resolve(WEB_ROOT, 'public', 'descargas', pdfName);
const DIST_OUTPUT = path.resolve(WEB_ROOT, 'dist', 'descargas', pdfName);

async function waitForServer(url) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The local server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`No se pudo iniciar la previsualización en ${url}`);
}

async function exportPdf() {
  buildSite();

  const serverScript = path.resolve(WEB_ROOT, 'node_modules', 'http-server', 'bin', 'http-server');
  const server = spawn(process.execPath, [serverScript, 'dist', '-p', '4173', '-c-1'], {
    cwd: WEB_ROOT,
    stdio: 'ignore'
  });

  let browser;
  try {
    const url = `http://127.0.0.1:4173/temas/${topicId}/index.html`;
    await waitForServer(url);
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle'});
    await page.emulateMedia({media: 'print'});

    fs.mkdirSync(path.dirname(PUBLIC_OUTPUT), {recursive: true});
    await page.pdf({
      path: PUBLIC_OUTPUT,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;padding:0 15mm;color:#6b7280;font-size:8px;text-align:right"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
    });

    fs.mkdirSync(path.dirname(DIST_OUTPUT), {recursive: true});
    fs.copyFileSync(PUBLIC_OUTPUT, DIST_OUTPUT);
    console.log(`PDF generado: ${path.relative(WEB_ROOT, PUBLIC_OUTPUT)}`);
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

exportPdf().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
