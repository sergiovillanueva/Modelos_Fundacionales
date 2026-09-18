import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {relativeUrl, absoluteUrl} from './paths.mjs';
import {renderTopic, buildTopicNavigation} from './render.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(WEB_ROOT, 'dist');
const TEMPLATES_DIR = path.resolve(WEB_ROOT, 'templates');
const CONTENT_DIR = path.resolve(WEB_ROOT, 'content');
const PUBLIC_DIR = path.resolve(WEB_ROOT, 'public');
const SRC_DIR = path.resolve(WEB_ROOT, 'src');

function assertSafeDist() {
  const normalizedDist = path.normalize(DIST_DIR);
  const expectedRoot = path.normalize(WEB_ROOT);
  if (!normalizedDist.startsWith(expectedRoot) || normalizedDist === expectedRoot) {
    throw new Error(`Inseguro: DIST_DIR (${normalizedDist}) fuera de WEB_ROOT (${expectedRoot})`);
  }
}

function cleanDist() {
  assertSafeDist();
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, {recursive: true, force: true});
  }
  fs.mkdirSync(DIST_DIR, {recursive: true});
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, {recursive: true});
  const entries = fs.readdirSync(src, {withFileTypes: true});
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyVendorAssets() {
  const vendorDest = path.join(DIST_DIR, 'vendor', 'reveal');
  fs.mkdirSync(vendorDest, {recursive: true});
  
  const revealDist = path.resolve(WEB_ROOT, 'node_modules', 'reveal.js', 'dist');
  if (fs.existsSync(revealDist)) {
    const allowedFiles = ['reveal.mjs', 'reveal.css', 'reset.css'];
    for (const file of allowedFiles) {
      const srcFile = path.join(revealDist, file);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.join(vendorDest, file));
      }
    }
  }
}

function replaceTemplateTokens(template, tokens, pageOutputPath, siteUrl = '') {
  let result = template;

  // Replace REL_PATH tokens first
  result = result.replace(/\{\{REL_PATH:([^}]+)\}\}/g, (_, target) => {
    return relativeUrl(pageOutputPath, target);
  });

  // ABS_URL da la direccion con dominio: canonical y las etiquetas og: no admiten rutas relativas
  result = result.replace(/\{\{ABS_URL:([^}]+)\}\}/g, (_, target) => {
    return absoluteUrl(siteUrl, target);
  });

  // Replace standard tokens
  for (const [key, value] of Object.entries({PAGE_URL: absoluteUrl(siteUrl, pageOutputPath), ...tokens})) {
    const token = `{{${key}}}`;
    result = result.replaceAll(token, value);
  }

  // Check for unresolved tokens
  const unhandled = result.match(/\{\{[^}]+\}\}/g);
  if (unhandled && unhandled.length > 0) {
    throw new Error(`Marcadores sin resolver en ${pageOutputPath}: ${unhandled.join(', ')}`);
  }

  return result;
}

export function buildSite() {
  cleanDist();

  // Copy public assets & static source styles/scripts
  copyDirRecursive(PUBLIC_DIR, DIST_DIR);
  copyDirRecursive(SRC_DIR, path.join(DIST_DIR, 'src'));
  copyVendorAssets();

  // Read course metadata
  const coursePath = path.resolve(CONTENT_DIR, 'course.json');
  const course = JSON.parse(fs.readFileSync(coursePath, 'utf8'));

  // A short cover introduces the course; lessons share one reading template.
  const firstTopic = course.topics.find((topic) => topic.status === 'available' && topic.contentDir);
  if (!firstTopic) throw new Error('El curso necesita al menos un tema disponible.');
  const homeTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'home.html'), 'utf8');
  const home = replaceTemplateTokens(homeTemplate, {
    COURSE_TITLE: course.title,
    TOPIC_NAV: buildTopicNavigation(course, null, 'index.html'),
    START_URL: `temas/${firstTopic.id}/index.html`
  }, 'index.html', course.siteUrl);
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), home, 'utf8');

  // Render creditos.html
  const creditsOutputPath = 'creditos.html';
  const creditsTemplate = fs.readFileSync(path.resolve(TEMPLATES_DIR, 'credits.html'), 'utf8');
  const creditsTokens = {
    COURSE_TITLE: course.title,
    AUTHOR: course.author,
    REPO_URL: course.repository
  };
  const renderedCredits = replaceTemplateTokens(creditsTemplate, creditsTokens, creditsOutputPath, course.siteUrl);
  fs.writeFileSync(path.resolve(DIST_DIR, creditsOutputPath), renderedCredits, 'utf8');

  // Render 404.html
  const notFoundOutputPath = '404.html';
  const notFoundTemplate = fs.readFileSync(path.resolve(TEMPLATES_DIR, '404.html'), 'utf8');
  const notFoundTokens = {
    COURSE_TITLE: course.title,
    AUTHOR: course.author
  };
  const rendered404 = replaceTemplateTokens(notFoundTemplate, notFoundTokens, notFoundOutputPath, course.siteUrl);
  fs.writeFileSync(path.resolve(DIST_DIR, notFoundOutputPath), rendered404, 'utf8');

  // Render available topics
  for (const topic of course.topics) {
    if (topic.status === 'available' && topic.contentDir) {
      const topicDir = path.resolve(DIST_DIR, 'temas', topic.id);
      fs.mkdirSync(topicDir, {recursive: true});

      const readingHtml = renderTopic(course, topic, 'reading');
      fs.writeFileSync(path.join(topicDir, 'index.html'), readingHtml, 'utf8');

      const presentationHtml = renderTopic(course, topic, 'presentation');
      fs.writeFileSync(path.join(topicDir, 'presentar.html'), presentationHtml, 'utf8');
    }
  }

  console.log('Build completed successfully.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildSite();
}
