import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
import {PDFDocument, PDFHexString, PDFName} from 'pdf-lib';
import {buildSite} from './build.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const previewPort = 4180;
const course = JSON.parse(fs.readFileSync(path.resolve(WEB_ROOT, 'content', 'course.json'), 'utf8'));

// No argument or "all" exports every topic; otherwise the topic ids given, e.g. 03-multimodalidad.
const requested = process.argv.slice(2);
const topics = !requested.length || requested.includes('all')
  ? course.topics.filter((topic) => topic.status === 'available')
  : requested.map((id) => {
    const topic = course.topics.find((item) => item.id === id);
    if (!topic) throw new Error(`Tema desconocido: ${id}`);
    return topic;
  });

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

/**
 * Chrome builds the bookmarks from the headings but glues the words around a line break
 * ("arquitecturasde"). Rewrite each bookmark with the real heading text, in document order.
 */
async function fixBookmarks(file, headings) {
  const pdf = await PDFDocument.load(fs.readFileSync(file));
  const outlines = pdf.catalog.lookup(PDFName.of('Outlines'));
  if (!outlines) return;
  const items = [];
  const walk = (ref) => {
    for (let node = ref && pdf.context.lookup(ref); node; node = node.get(PDFName.of('Next')) && pdf.context.lookup(node.get(PDFName.of('Next')))) {
      items.push(node);
      walk(node.get(PDFName.of('First')));
    }
  };
  walk(outlines.get(PDFName.of('First')));
  if (items.length !== headings.length) {
    console.warn(`  Marcadores sin corregir: ${items.length} en el PDF y ${headings.length} títulos en la página.`);
    return;
  }
  items.forEach((item, index) => item.set(PDFName.of('Title'), PDFHexString.fromText(headings[index])));
  fs.writeFileSync(file, await pdf.save());
}

function footer(topic) {
  const title = `${course.title} · Tema ${Number(topic.number)}: ${topic.title}`;
  return `<div style="width:100%;padding:0 16mm;display:flex;justify-content:space-between;color:#6b7280;font-size:7.5px;font-family:Roboto,Arial,sans-serif">
    <span>${title}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
}

async function exportPdfs() {
  buildSite();

  const serverScript = path.resolve(WEB_ROOT, 'node_modules', 'http-server', 'bin', 'http-server');
  const server = spawn(process.execPath, [serverScript, 'dist', '-p', String(previewPort), '-c-1'], {
    cwd: WEB_ROOT,
    stdio: 'ignore'
  });

  let browser;
  try {
    await waitForServer(`http://127.0.0.1:${previewPort}/index.html`);
    browser = await chromium.launch();
    for (const topic of topics) {
      const pdfName = `tema-${topic.id}.pdf`;
      const publicOutput = path.resolve(WEB_ROOT, 'public', 'descargas', pdfName);
      const distOutput = path.resolve(WEB_ROOT, 'dist', 'descargas', pdfName);

      const page = await browser.newPage();
      await page.goto(`http://127.0.0.1:${previewPort}/temas/${topic.id}/index.html`, {waitUntil: 'networkidle'});
      await page.emulateMedia({media: 'print'});
      await page.evaluate(() => document.fonts.ready);
      // Each section is labelled by its own heading; Chrome would join both texts in the PDF bookmarks.
      await page.evaluate(() => document.querySelectorAll('section[aria-labelledby]').forEach((section) => section.removeAttribute('aria-labelledby')));

      const headings = await page.evaluate(() => [...document.querySelectorAll('h1, h2, h3')]
        .filter((heading) => heading.getClientRects().length > 0)
        .map((heading) => heading.textContent.replace(/\s+/g, ' ').trim()));

      fs.mkdirSync(path.dirname(publicOutput), {recursive: true});
      await page.pdf({
        path: publicOutput,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: footer(topic),
        outline: true,   // bookmarks with one entry per screen, from the headings
        tagged: true     // accessible PDF: text order and structure for screen readers
      });
      await page.close();
      await fixBookmarks(publicOutput, headings);

      fs.mkdirSync(path.dirname(distOutput), {recursive: true});
      fs.copyFileSync(publicOutput, distOutput);
      console.log(`PDF generado: ${path.relative(WEB_ROOT, publicOutput)}`);
    }
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

exportPdfs().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
