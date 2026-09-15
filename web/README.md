# Plataforma Web: Modelos Fundacionales en Visión Artificial

Sitio web estático interactivo del curso, desarrollado con HTML semántico, CSS modular, JavaScript en módulos estándar (ESM) y Reveal.js (modo presentación).

Una portada breve presenta el curso y abre el tema 01 con **Empezar**. Los temas están arriba y cada tema se recorre con **Anterior / Siguiente**: **Concepto → Tu turno → IoU → Colab**. El menú **Material** reúne el PDF y la presentación. Los temas 02–06 están preparados en la navegación, pendientes de contenido.

Antes de crear o ampliar un tema, consulta [INSTRUCCIONES.md](INSTRUCCIONES.md). Ahí están las reglas visuales, los límites de texto, la estructura de las actividades y la lista de comprobación que deben seguir personas y agentes de programación.

**Para que otro modelo continúe:** [CONTINUAR.md](CONTINUAR.md) contiene el prompt de trabajo. [plan/ESTADO.md](plan/ESTADO.md) señala el siguiente lote; [plan/MIGRACION-POWERPOINT.md](plan/MIGRACION-POWERPOINT.md) define el proceso y [plan/COBERTURA.json](plan/COBERTURA.json) registra las 94 diapositivas. Estos archivos son documentación de trabajo y no se copian a `dist/`.

## Estructura del proyecto

```text
web/
  content/             Fuentes estructuradas (JSON y secciones HTML)
  templates/           Cascarones y plantillas HTML
  src/
    styles/            CSS compartido, aula, presentación e impresión (print.css)
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
- `npm run check`: Valida los datos básicos del curso, identificadores de temas, archivos de salida y ausencia de marcadores sin resolver.
- `npm test`: Ejecuta los tests unitarios con el ejecutor nativo `node:test`.
- `npm run preview`: Inicia un servidor HTTP local en `http://localhost:4173` para previsualizar `dist/`.
- `npm run test:e2e`: Ejecuta las pruebas automatizadas de navegador con Playwright.
- `node tests/visual-check.mjs`: Captura la portada y cada paso del tema 01 en escritorio, móvil y presentación, en `test-results/visual/`.
- `npm run pdf`: Regenera el PDF A4 de la lección en `public/descargas/` y lo copia a `dist/descargas/`.

Trabajar desde `web/`. Tras editar contenido o estilos, ejecutar `npm run build`, `npm run check`, `npm test` y `npm run test:e2e`. Revisar las capturas con `node tests/visual-check.mjs` y regenerar el PDF. Los tests de navegador comprueban los cuatro pasos, historial, teclado, respuestas, IoU, animación, recursos, móvil a 390/320 px e impresión.

El HTML de `content/tema-01/sections.html` es la fuente de los tres formatos. `.print-detail` añade matices solo al PDF y las preguntas incluyen su solución impresa. Las fuentes y las imágenes se sirven localmente. No hay backend, cuentas, resultados compartidos ni modelos ejecutándose en la web.

El PDF y las capturas se exportan actualmente para el tema 01; hay que ampliar los scripts al publicar otro tema. El enlace de Colab abre el notebook externo; los tests de esta web no ejecutan ese cuaderno ni comprueban la disponibilidad de GPU.

## Despliegue en Cloudflare Pages

Configuración prevista si se conecta este repositorio completo:

- **Root directory:** `web`
- **Build command:** `npm ci && npm run build && npm run check`
- **Output directory:** `dist`
- **Node version:** 22 LTS o superior

Si el repositorio contiene únicamente el contenido de `web/`, dejar vacía la raíz de construcción. Esta revisión no publica cambios ni configura Cloudflare.

El `.gitignore` raíz excluye los archivos llamados `.gitignore`. Antes del primer commit de esta carpeta, añade su configuración local una sola vez con `git add -f web/.gitignore`; después se puede usar `git add web` normalmente. Los recursos publicables usan WebP para evitar las exclusiones globales de PNG y GIF.
