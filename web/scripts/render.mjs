import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {relativeUrl} from './paths.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.resolve(WEB_ROOT, 'templates');
const CONTENT_DIR = path.resolve(WEB_ROOT, 'content');

export function extractSections(sectionsHtml) {
  const sections = [];
  const sectionRegex = /<section\s+([^>]+)>([\s\S]*?)<\/section>/gi;
  let match;

  while ((match = sectionRegex.exec(sectionsHtml)) !== null) {
    const attrsStr = match[1];
    const innerHtml = match[2];

    const idMatch = attrsStr.match(/id=["']([^"']+)["']/i);
    const titleMatch = attrsStr.match(/data-title=["']([^"']+)["']/i);
    const layoutMatch = attrsStr.match(/data-layout=["']([^"']+)["']/i);

    const id = idMatch ? idMatch[1] : '';
    const title = titleMatch ? titleMatch[1] : id;
    const layout = layoutMatch ? layoutMatch[1] : 'split';

    sections.push({
      id,
      title,
      layout,
      attrs: attrsStr,
      innerHtml,
      fullHtml: match[0]
    });
  }

  return sections;
}

export function buildSidebarIndex(sections) {
  return sections.map((sec) => {
    return `<li><a href="#${sec.id}" class="topic-index-link">${sec.title}</a></li>`;
  }).join('\n');
}

export function processSectionAssets(html, pageOutputPath) {
  return html.replace(/\{\{ASSET:([^}]+)\}\}/g, (_, assetPath) => {
    return relativeUrl(pageOutputPath, `assets/${assetPath}`);
  });
}

export function renderTopic(course, topic, mode = 'reading') {
  const isReading = mode === 'reading';
  const pageOutputPath = isReading
    ? `temas/${topic.id}/index.html`
    : `temas/${topic.id}/presentar.html`;

  const templateName = isReading ? 'reading.html' : 'presentation.html';
  const template = fs.readFileSync(path.resolve(TEMPLATES_DIR, templateName), 'utf8');

  const contentFile = path.resolve(CONTENT_DIR, topic.contentDir, 'sections.html');
  if (!fs.existsSync(contentFile)) {
    throw new Error(`Fichero de secciones no encontrado: ${contentFile}`);
  }

  const rawSectionsHtml = fs.readFileSync(contentFile, 'utf8');
  const sections = extractSections(rawSectionsHtml);
  const topicIndexHtml = buildSidebarIndex(sections);

  // Process ASSET tokens
  let content = processSectionAssets(rawSectionsHtml, pageOutputPath);

  // In vertical slice (Tarea 2), replace quiz placeholders with clean accessible quiz markup
  content = content.replace(/\{\{QUIZ:q01\}\}/g, () => {
    return `
      <div class="quiz-box" data-question-id="q01">
        <fieldset>
          <legend>Necesitas contar coches y saber dónde está cada uno. ¿Qué salida necesitas?</legend>
          <div class="quiz-options">
            <label class="quiz-option">
              <input type="radio" name="q01-answer" value="a" id="q01-a">
              <span>a. Una etiqueta para toda la imagen.</span>
            </label>
            <label class="quiz-option">
              <input type="radio" name="q01-answer" value="b" id="q01-a">
              <span>b. Una caja y una categoría por objeto.</span>
            </label>
            <label class="quiz-option">
              <input type="radio" name="q01-answer" value="c" id="q01-c">
              <span>c. Un vector de características sin localizaciones.</span>
            </label>
          </div>
          <div class="quiz-actions">
            <button type="button" class="btn-primary btn-sm" id="q01-btn-check" disabled>Comprobar</button>
            <button type="button" class="btn-secondary btn-sm" id="q01-btn-retry" style="display: none;">Reintentar</button>
          </div>
          <div class="quiz-status" role="status" aria-live="polite" id="q01-status"></div>
        </fieldset>
      </div>
    `;
  });

  const readingUrl = relativeUrl(pageOutputPath, `temas/${topic.id}/index.html`);
  const presentationUrl = relativeUrl(pageOutputPath, `temas/${topic.id}/presentar.html`);
  const pdfUrl = relativeUrl(pageOutputPath, `descargas/tema-${topic.id}.pdf`);

  const topicTitle = `Tema ${topic.number || '01'}: ${topic.title}`;

  let rendered = template;

  // Replace REL_PATH tokens
  rendered = rendered.replace(/\{\{REL_PATH:([^}]+)\}\}/g, (_, target) => {
    return relativeUrl(pageOutputPath, target);
  });

  const tokens = {
    TITLE: topicTitle,
    COURSE_TITLE: course.title,
    AUTHOR: course.author,
    TOPIC_TITLE: topicTitle,
    READING_URL: readingUrl,
    PRESENTATION_URL: presentationUrl,
    PDF_URL: pdfUrl,
    TOPIC_INDEX: topicIndexHtml,
    CONTENT: content
  };

  for (const [key, val] of Object.entries(tokens)) {
    rendered = rendered.replaceAll(`{{${key}}}`, val);
  }

  // Check unresolved
  const unhandled = rendered.match(/\{\{[^}]+\}\}/g);
  if (unhandled && unhandled.length > 0) {
    throw new Error(`Marcadores sin resolver en ${pageOutputPath}: ${unhandled.join(', ')}`);
  }

  return rendered;
}
