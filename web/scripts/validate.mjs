import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(WEB_ROOT, 'dist');
const CONTENT_DIR = path.resolve(WEB_ROOT, 'content');

export function validate() {
  const errors = [];

  // 1. Validate course.json
  const coursePath = path.resolve(CONTENT_DIR, 'course.json');
  if (!fs.existsSync(coursePath)) {
    errors.push('content/course.json does not exist');
  } else {
    try {
      const course = JSON.parse(fs.readFileSync(coursePath, 'utf8'));
      if (!course.id || !course.title || !Array.isArray(course.topics)) {
        errors.push('course.json missing id, title, or topics array');
      } else {
        const ids = new Set();
        for (const t of course.topics) {
          if (!t.id || !t.title || !t.status) {
            errors.push(`Topic missing id, title or status: ${JSON.stringify(t)}`);
          }
          if (ids.has(t.id)) {
            errors.push(`Duplicate topic id: ${t.id}`);
          }
          ids.add(t.id);
        }
      }
    } catch (err) {
      errors.push(`Error parsing course.json: ${err.message}`);
    }
  }

  // 2. Validate dist output files
  if (!fs.existsSync(DIST_DIR)) {
    errors.push('dist/ folder does not exist. Run "npm run build" first.');
  } else {
    const requiredFiles = ['index.html', 'creditos.html', '404.html'];
    for (const file of requiredFiles) {
      const filePath = path.join(DIST_DIR, file);
      if (!fs.existsSync(filePath)) {
        errors.push(`Required build file missing: dist/${file}`);
      }
    }

    // Check all HTML files for unresolved placeholders
    function checkHtmlFiles(dir) {
      const entries = fs.readdirSync(dir, {withFileTypes: true});
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          checkHtmlFiles(fullPath);
        } else if (entry.name.endsWith('.html')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const unresolved = content.match(/\{\{[^}]+\}\}/g);
          if (unresolved && unresolved.length > 0) {
            errors.push(`Unresolved placeholders in ${path.relative(DIST_DIR, fullPath)}: ${unresolved.join(', ')}`);
          }
        }
      }
    }
    checkHtmlFiles(DIST_DIR);
  }

  if (errors.length > 0) {
    console.error('Validation failed:');
    for (const e of errors) {
      console.error(`- ${e}`);
    }
    process.exit(1);
  }

  console.log('Validation passed successfully.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validate();
}
