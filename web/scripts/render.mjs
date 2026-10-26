import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {relativeUrl, absoluteUrl} from './paths.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.resolve(WEB_ROOT, 'templates');
const CONTENT_DIR = path.resolve(WEB_ROOT, 'content');
const ASSETS_DIR = path.resolve(WEB_ROOT, 'public', 'assets');
const DATA_TYPES = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg'};

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

export function buildTopicNavigation(course, topic, pageOutputPath) {
  return course.topics.map((item) => {
    const label = escapeHtml(item.navTitle || item.title);
    if (item.status !== 'available') {
      return `<span class="topic-link is-pending" aria-disabled="true" title="${escapeHtml(item.title)} · Próximamente"><span class="topic-number">${item.number}</span> ${label}<span class="sr-only"> · Próximamente</span></span>`;
    }
    const href = relativeUrl(pageOutputPath, `temas/${item.id}/index.html`);
    return `<a class="topic-link" href="${href}"${item.id === topic?.id ? ' aria-current="page"' : ''}><span class="topic-number">${item.number}</span> ${label}</a>`;
  }).join('\n');
}

/** Home block with the course split by day: each topic with its reading page and its Colab notebook. */
export function buildCoursePlan(course, pageOutputPath) {
  const repo = course.repository.replace('https://github.com/', '');
  const days = [...new Set(course.topics.map((item) => item.day).filter(Boolean))].sort();
  const columns = days.map((day) => {
    const topics = course.topics.filter((item) => item.day === day);
    const items = topics.map((item) => {
      const href = relativeUrl(pageOutputPath, `temas/${item.id}/index.html`);
      const colab = `https://colab.research.google.com/github/${repo}/blob/main/${item.notebookPath}`;
      const pdf = relativeUrl(pageOutputPath, `descargas/tema-${item.id}.pdf`);
      return `<li>
          <a class="plan-topic" href="${href}"><span class="topic-number">${item.number}</span><span>${escapeHtml(item.title)}</span></a>
          <span class="plan-links">
            <a class="plan-colab" href="${colab}" target="_blank" rel="noopener noreferrer">Cuaderno ${Number(item.number)} en Colab <span aria-hidden="true">↗</span></a>
            <a class="plan-pdf" href="${pdf}" download>PDF</a>
          </span>
        </li>`;
    }).join('\n        ');
    return `<div class="plan-day">
      <h3>Día ${day}</h3>
      <ol class="plan-topics">
        ${items}
      </ol>
    </div>`;
  }).join('\n    ');
  return `<section class="course-plan" aria-labelledby="course-plan-title">
  <h2 id="course-plan-title">El curso en dos días</h2>
  <p class="course-plan-lead">Cada tema tiene un cuaderno de Colab con el mismo número. Se siguen en orden: primero el tema, después su cuaderno.</p>
  <div class="plan-days">
    ${columns}
  </div>
  <p class="plan-offline"><strong>Por si falla internet:</strong> <a href="${course.repository}/releases/latest/download/curso-sin-internet.zip">descarga el curso completo</a> (la web, los seis PDF y las prácticas ya ejecutadas). Descomprímelo y abre <code>web/index.html</code>: funciona sin conexión.</p>
</section>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderQuiz(question) {
  const answer = question.options.find(option => option.id === question.correctOptionId);
  const options = question.options.map((option) => `
    <label class="quiz-option" data-feedback="${escapeHtml(option.explanation)}">
      <input type="radio" name="${question.id}-answer" value="${option.id}" id="${question.id}-${option.id}">
      <span><strong>${option.id.toUpperCase()}</strong>${escapeHtml(option.text)}</span>
    </label>`).join('');

  return `<div class="quiz-box" data-question-id="${question.id}" data-correct-option="${question.correctOptionId}">
    <fieldset>
      <legend>${escapeHtml(question.prompt)}</legend>
      <div class="quiz-options">${options}</div>
      <p class="quiz-status" role="status" aria-live="polite"></p>
    </fieldset>
    <p class="print-detail quiz-solution">Respuesta ${escapeHtml(answer.id.toUpperCase())}. ${escapeHtml(answer.explanation)}</p>
  </div>`;
}

export function processSectionAssets(html, pageOutputPath) {
  return html
    // Images whose pixels a lab reads go inline: opened from disk, the browser blocks reading a separate file.
    .replace(/\{\{ASSET_DATA:([^}]+)\}\}/g, (_, assetPath) => {
      const file = path.join(ASSETS_DIR, assetPath);
      const type = DATA_TYPES[path.extname(file).toLowerCase()];
      if (!type) throw new Error(`ASSET_DATA no admite ${assetPath}`);
      return `data:${type};base64,${fs.readFileSync(file).toString('base64')}`;
    })
    .replace(/\{\{ASSET:([^}]+)\}\}/g, (_, assetPath) => relativeUrl(pageOutputPath, `assets/${assetPath}`));
}

export function renderTopic(course, topic, mode = 'reading', outputPath) {
  const isReading = mode === 'reading';
  const pageOutputPath = outputPath || (isReading
    ? `temas/${topic.id}/index.html`
    : `temas/${topic.id}/presentar.html`);

  const templateName = isReading ? 'reading.html' : 'presentation.html';
  const template = fs.readFileSync(path.resolve(TEMPLATES_DIR, templateName), 'utf8');

  const contentFile = path.resolve(CONTENT_DIR, topic.contentDir, 'sections.html');
  if (!fs.existsSync(contentFile)) {
    throw new Error(`Fichero de secciones no encontrado: ${contentFile}`);
  }

  const rawSectionsHtml = fs.readFileSync(contentFile, 'utf8');
  const questionsPath = path.resolve(CONTENT_DIR, topic.contentDir, 'questions.json');
  const questions = fs.existsSync(questionsPath)
    ? JSON.parse(fs.readFileSync(questionsPath, 'utf8'))
    : [];
  const questionsById = new Map(questions.map((question) => [question.id, question]));

  // Process ASSET tokens
  let content = processSectionAssets(rawSectionsHtml, pageOutputPath);

  content = content.replace(/\{\{QUIZ:([^}]+)\}\}/g, (_, questionId) => {
    const question = questionsById.get(questionId);
    if (!question) throw new Error(`Pregunta no encontrada: ${questionId}`);
    return renderQuiz(question);
  });

  if (!isReading) {
    // Cada diapositiva envuelve su contenido para poder escalarlo y que quepa en 1280 x 720.
    content = extractSections(content)
      .map((section) => `<section ${section.attrs}><div class="slide-fit">${section.innerHtml}</div></section>`)
      .join('\n');
  }

  const readingUrl = relativeUrl(pageOutputPath, `temas/${topic.id}/index.html`);
  const presentationUrl = relativeUrl(pageOutputPath, `temas/${topic.id}/presentar.html`);
  const pdfUrl = relativeUrl(pageOutputPath, `descargas/tema-${topic.id}.pdf`);

  const topicTitle = `Tema ${topic.number || '01'}: ${topic.title}`;

  let rendered = template;

  // Replace REL_PATH tokens
  rendered = rendered.replace(/\{\{REL_PATH:([^}]+)\}\}/g, (_, target) => {
    return relativeUrl(pageOutputPath, target);
  });

  // ABS_URL da la direccion con dominio: canonical y og: no admiten rutas relativas
  rendered = rendered.replace(/\{\{ABS_URL:([^}]+)\}\}/g, (_, target) => {
    return absoluteUrl(course.siteUrl, target);
  });

  const tokens = {
    TITLE: topicTitle,
    PAGE_URL: absoluteUrl(course.siteUrl, pageOutputPath),
    COURSE_TITLE: course.title,
    AUTHOR: course.author,
    TOPIC_TITLE: topicTitle,
    READING_URL: readingUrl,
    PRESENTATION_URL: presentationUrl,
    PDF_URL: pdfUrl,
    TOPIC_NAV: buildTopicNavigation(course, topic, pageOutputPath),
    // Data for the cover that only appears in the PDF
    TOPIC_NAME: escapeHtml(topic.title),
    TOPIC_NUMBER: String(Number(topic.number)),
    TOPIC_DAY: String(topic.day || ''),
    SITE_HOST: course.siteUrl.replace(/^https?:\/\//, ''),
    NOTEBOOK_URL: `https://colab.research.google.com/github/${course.repository.replace('https://github.com/', '')}/blob/main/${topic.notebookPath}`,
    NOTEBOOK_FILE: topic.notebookPath,
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
