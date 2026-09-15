# Plataforma Web: Modelos Fundacionales en Visión Artificial

Sitio web estático interactivo del curso, desarrollado con HTML semántico, CSS modular, JavaScript en módulos estándar (ESM) y Reveal.js (modo presentación).

## Estructura del proyecto

```text
web/
  content/             Fuentes estructuradas (JSON y secciones HTML)
  templates/           Cascarones y plantillas HTML
  src/
    styles/            Hojas de estilo CSS (tokens, base, course, reading, presentation, widgets)
    js/                Módulos JavaScript de interacción y montaje
    lib/               Lógica de evaluación pura y tests
  public/
    assets/            Recursos estáticos (logos, diagramas, demostraciones)
    fonts/             Tipografías locales (Raleway, Roboto con licencias OFL)
    descargas/         PDFs generados
  scripts/             Scripts de compilación, rutas, validación y exportación
  tests/               Tests unitarios y funcionales
  dist/                Salida compilada para producción
```

## Comandos disponibles

- `npm run build`: Genera el sitio estático en `dist/` a partir del contenido y plantillas.
- `npm run check`: Valida la integridad del contenido JSON, unicidad de identificadores y ausencia de marcadores sin resolver.
- `npm test`: Ejecuta los tests unitarios con el ejecutor nativo `node:test`.
- `npm run preview`: Inicia un servidor HTTP local en `http://localhost:4173` para previsualizar `dist/`.
- `npm run test:e2e`: Ejecuta las pruebas automatizadas de navegador con Playwright.
- `npm run pdf`: Genera el PDF determinista de la lección.

## Despliegue en Cloudflare Pages

El despliegue está configurado para tomar la carpeta `web` como raíz de construcción:
- **Build command:** `npm ci && npm run build && npm run check`
- **Output directory:** `dist`
- **Node version:** 22 LTS o superior
