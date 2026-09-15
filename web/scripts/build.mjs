import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {relativeUrl} from './paths.mjs';
import {renderTopic} from './render.mjs';

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

function replaceTemplateTokens(template, tokens, pageOutputPath) {
  let result = template;
  
  // Replace REL_PATH tokens first
  result = result.replace(/\{\{REL_PATH:([^}]+)\}\}/g, (_, target) => {
    return relativeUrl(pageOutputPath, target);
  });

  // Replace standard tokens
  for (const [key, value] of Object.entries(tokens)) {
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

function buildTopicCards(topics, pageOutputPath) {
  return topics.map((t) => {
    const isAvailable = t.status === 'available';
    if (isAvailable) {
      const readingUrl = relativeUrl(pageOutputPath, `temas/${t.id}/index.html`);
      return `<a class="topic-card available" href="${readingUrl}">
        <span class="topic-number">${t.number}</span>
        <span class="topic-copy"><strong>${t.title}</strong><small>${t.description || ''}</small></span>
        <span class="topic-arrow" aria-hidden="true">→</span>
      </a>`;
    }
    return `<article class="topic-card planned">
      <span class="topic-number">${t.number}</span>
      <span class="topic-copy"><strong>${t.title}</strong><small>Próximamente</small></span>
    </article>`;
  }).join('\n');
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

  // Tokens for home page
  const homeOutputPath = 'index.html';
  const topic1Url = relativeUrl(homeOutputPath, 'temas/01-deteccion/index.html');
  const homeTemplate = fs.readFileSync(path.resolve(TEMPLATES_DIR, 'home.html'), 'utf8');

  const homeTokens = {
    TITLE: course.title,
    COURSE_TITLE: course.title,
    AUTHOR: course.author,
    REPO_URL: course.repository,
    TOPIC_1_URL: topic1Url,
    TOPICS_CARDS: buildTopicCards(course.topics, homeOutputPath)
  };

  const renderedHome = replaceTemplateTokens(homeTemplate, homeTokens, homeOutputPath);
  fs.writeFileSync(path.resolve(DIST_DIR, homeOutputPath), renderedHome, 'utf8');

  // Render creditos.html
  const creditsOutputPath = 'creditos.html';
  const creditsTemplate = fs.readFileSync(path.resolve(TEMPLATES_DIR, 'credits.html'), 'utf8');
  const creditsTokens = {
    COURSE_TITLE: course.title,
    AUTHOR: course.author,
    REPO_URL: course.repository
  };
  const renderedCredits = replaceTemplateTokens(creditsTemplate, creditsTokens, creditsOutputPath);
  fs.writeFileSync(path.resolve(DIST_DIR, creditsOutputPath), renderedCredits, 'utf8');

  // Render 404.html
  const notFoundOutputPath = '404.html';
  const notFoundTemplate = fs.readFileSync(path.resolve(TEMPLATES_DIR, '404.html'), 'utf8');
  const notFoundTokens = {
    COURSE_TITLE: course.title,
    AUTHOR: course.author
  };
  const rendered404 = replaceTemplateTokens(notFoundTemplate, notFoundTokens, notFoundOutputPath);
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
