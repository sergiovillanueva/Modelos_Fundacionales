# Curso web: tema 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Ejecutar secuencialmente, sin delegar salvo petición explícita del profesor.

**Goal:** Entregar una web Datamecum elegante con el tema 1, actividades locales, enlaces a Colab y PDF, dejando los demás temas preparados sin contenido.

**Architecture:** HTML semántico como fuente única, Node genera lectura y presentación, reveal.js controla solamente la presentación. La salida estática de `web/dist/` se publica mediante GitHub y Cloudflare.

**Tech Stack:** Node 22 LTS, HTML, CSS, JavaScript ES modules, reveal.js; node:test, Playwright y http-server para comprobación.

**Spec:** [01-DISENO-Y-ARQUITECTURA.md](01-DISENO-Y-ARQUITECTURA.md), [02-TEMA-1.md](02-TEMA-1.md), [03-INTERACCIONES.md](03-INTERACCIONES.md).

## Restricciones globales

- Construir solo `web/` y tema 1; documentación de seguimiento en `docs/plan-web/`.
- No modificar exportaciones, notebooks ni cambios previos. No subir pesos o datasets.
- Identidad Datamecum: azul #1313AB, cian #00D0FF, lectura clara; fuentes locales Raleway/Roboto.
- Ocho preguntas y dos simulaciones exactamente según especificación.
- Cada dato ilustrativo se etiqueta como tal. Ninguna afirmación científica importante sin fuente revisada.
- Una fuente de teoría para lectura, presentación y PDF. Rutas relativas, también bajo `/curso/`.
- Temas `planned` no generan páginas ni enlaces activos.
- Sin cuentas, backend, llamadas de inferencia, nuevas dependencias innecesarias ni contenidos de temas futuros.
- No publicar ni hacer push durante implementación. Se hará revisión final primero, conforme a la secuencia solicitada por el profesor.

## Forma de ejecutar

Leer la especificación completa una vez. Trabajar una tarea cada vez. Registrar archivos cambiados, comando, resultado y limitaciones en `estado-implementacion.md`. Si falla una comprobación, resolverla antes de ampliar alcance. Los commits locales, si el entorno los permite y el usuario ha autorizado trabajar en Git, incluirán únicamente archivos de esta tarea; nunca `git add .` sobre el repositorio original.

### Tarea 1. Construcción estática y rutas

**Archivos:** `web/package.json`, `package-lock.json`, `.gitignore`, `content/course.json`, `scripts/{build,paths,validate}.mjs`, `templates/home.html`, `tests/paths.test.mjs`, `README.md`.

**Consume:** esquema course.json de la especificación. **Produce:** `npm run build`, `npm run preview`, salida reproducible con seis tarjetas y solo un tema disponible; `relativeUrl(fromPage,targetPath)` exportado.

- [ ] Comprobar estado Git y dejar constancia de cambios previos sin tocarlos.
- [ ] Instalar versiones exactas de reveal.js, @playwright/test y http-server; añadir `"type":"module"` y guardar lockfile. Node del equipo o runtime suministrado; no cambiar entornos Python del curso.
- [ ] Añadir scripts con estos contratos:

```json
{
  "build":"node scripts/build.mjs",
  "preview":"http-server dist -p 4173 -c-1",
  "test":"node --test tests/*.test.mjs",
  "test:e2e":"playwright test",
  "check":"node scripts/validate.mjs",
  "pdf":"node scripts/export-pdf.mjs",
  "check:prefix":"node scripts/check-prefix.mjs"
}
```

- [ ] Implementar rutas y probar antes de generar páginas:

```js
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {relativeUrl} from '../scripts/paths.mjs';
test('ruta de tema a descarga', () => {
  assert.equal(relativeUrl('temas/01-deteccion/index.html', 'descargas/tema-01-deteccion.pdf'), '../../descargas/tema-01-deteccion.pdf');
});
test('ruta de portada a tema', () => {
  assert.equal(relativeUrl('index.html', 'temas/01-deteccion/index.html'), 'temas/01-deteccion/index.html');
});
```

- [ ] Crear build con lista permitida. En esta tarea generar solo portada; activar ruta del tema al existir la muestra de tarea 2, sin un enlace roto intermedio.
- [ ] El constructor limpia únicamente `web/dist/` tras comprobar su ruta absoluta. Copia archivos públicos seleccionados, módulos propios y `reveal.js/dist/reveal.{css,esm.js}` según nombres de la versión instalada; verificar nombres reales, no asumir `esm.js` si el paquete usa `reveal.esm.js`. Mantener import correspondiente.
- [ ] `validate.mjs` comprueba JSON, IDs únicos, marcadores sin resolver y ficheros presentes; validaciones de PDF se activan cuando se incorpora la descarga en tarea 7.
- [ ] Ejecutar `npm test`, `npm run build`, `npm run check`.

**Aceptación:** los mismos archivos de entrada producen las mismas rutas; no aparecen medios de temas 2–6 ni archivos originales del repositorio en dist.

### Tarea 2. Muestra visual antes de migrar todo

**Archivos:** `templates/{reading,presentation}.html`, `scripts/render.mjs`, `src/styles/{tokens,base,course,reading,presentation,widgets}.css`, `src/js/{reading,presentation,media}.js`, `content/tema-01/sections.html`, `public/assets/brand/`, `public/fonts/`, `public/assets/tema-01/`.

**Consume:** tokens, shells y rutas. **Produce:** portada y muestra de cuatro secciones: `inicio`, `tareas`, `iou` (estado estático inicial), `practica`.

- [ ] Extraer logo, fuentes mínimas y GIF del coche; crear poster. Añadir manifiesto de procedencia. No extraer masivamente los 272 medios a la carpeta pública.
- [ ] Crear los seis layouts mediante clases `layout-hero`, `layout-split`, `layout-compare`, `layout-process`, `layout-lab`, `layout-quiz`; implementar visualmente los usados en la muestra.
- [ ] Usar este patrón de contenido, con texto real:

```html
<section id="tareas" data-title="Tareas de visión" data-layout="split">
  <h2>La tarea determina la salida</h2>
  <p>Clasificar identifica categorías; detectar localiza objetos; segmentar delimita sus píxeles.</p>
  <figure><!-- recurso local con poster, alt y pie --></figure>
  <div class="study-detail"><p>Para contar coches necesitas distinguir instancias. Una etiqueta global no indica cuántos coches hay ni dónde están.</p></div>
</section>
```

- [ ] `renderTopic(topic, mode)` devuelve HTML completo para `mode='reading'|'presentation'`; `renderHome(course)` portada. Ambos consumen las mismas secciones. Los shells no contienen teoría duplicada.
- [ ] Implementar enlaces de cambio de modo por ID, índice y navegación. Configurar reveal como en especificación; su CSS queda aislado a presentación.
- [ ] Verificar escritorio 1440×900, móvil 390×844, presentación 1280×720 y lectura a 200% de zoom. Guardar capturas en `web/test-results/visual/`.
- [ ] Mostrar al profesor la muestra y recoger ajustes de diseño. **Punto de revisión visual solicitado para pulir tema 1:** no extender todo el contenido hasta que la dirección visual esté aceptada; se pueden avanzar pruebas de lógica independientes mientras se revisa.

**Aceptación:** apariencia Datamecum elegante, texto móvil legible sin escalado de lienzo, recursos bien proporcionados y funcionamiento de los enlaces de modo.

### Tarea 3. Lógica de aprendizaje y persistencia

**Archivos:** `content/tema-01/{questions,demos}.json`, `src/lib/{metrics,progress}.js`, `src/js/storage.js`, `tests/{metrics,progress}.test.mjs`.

**Consume:** datos y reglas de 03-INTERACCIONES. **Produce:** `iou`, `evaluateDetections`, `gradeAnswer`, `summarizeProgress`, `loadProgress`, `saveProgress`.

- [ ] Transcribir las ocho preguntas y explicaciones, conservando IDs y claves correctas.
- [ ] Implementar validación: opciones únicas, clave correcta presente, explicación no vacía por opción, sectionId existente al completarse el tema; coordenadas y scores válidos.
- [ ] Escribir y ejecutar primero estas pruebas de comportamiento:

```js
test('solapamiento inicial', () => assert.ok(Math.abs(iou([20,20,60,60],[40,20,80,60])-1/3)<1e-9));
test('duplicado no cuenta como otro TP', () => {
  const result=evaluateDetections(groundTruth,predictions,0.50,0.50);
  assert.deepEqual([result.tp,result.fp,result.fn],[2,1,1]);
});
test('sin cajas no hay precisión definida', () => {
  const result=evaluateDetections(groundTruth,predictions,1,0.50);
  assert.equal(result.precision,null);
  assert.equal(result.recall,0);
});
```

`groundTruth` y `predictions` se importan desde demos.json con los datos de 03-INTERACCIONES; no se inventa otro fixture. Añadir casos iguales/disjuntos para IoU, clase errónea como FP y FN, igualdad exacta de score con el umbral, y correspondencia única con duplicados.

- [ ] Implementar `loadProgress(storage, key)` y `saveProgress(storage,key,state)` con storage inyectable, retorno de fallback sin lanzar. Validar schema/contentVersion/IDs y no fiarse de `correct` guardado: recalcular desde question y selectedId al restaurar.
- [ ] Probar q01-b correcta, q01-a incorrecta, opción desconocida rechazada; respuestas repetidas no aumentan total; clave antigua ignorada; JSON corrupto y storage que lanza excepciones no rompen el flujo.
- [ ] Ejecutar `npm test` y registrar resultados.

**Aceptación:** todos los resultados de la tabla de umbrales coinciden exactamente antes de escribir la UI de los laboratorios.

### Tarea 4. Ejercicios y laboratorios accesibles

**Archivos:** `scripts/render.mjs`, `src/js/{quiz,iou-demo,threshold-demo,reading,presentation}.js`, `src/styles/widgets.css`, `tests/course.spec.mjs`, `playwright.config.mjs`.

**Consume:** lógica de tarea 3 y HTML de tarea 2. **Produce:** `mountQuizzes(root,questions,store)`, `mountIouDemo(root)`, `mountThresholdDemo(root,data)`. Cada montaje devuelve función `dispose()` que elimina listeners propios.

- [ ] Expandir `{{QUIZ:q01}}` en formulario accesible y renderizar SVG/tabla de demos en build; JavaScript mejora la interacción, no crea toda la teoría al cargar.
- [ ] Implementar estados y mensajes exactos de 03-INTERACCIONES. Nombre de radio `q01-answer`, IDs `q01-a`, etc.; etiquetas no duplicadas dentro del documento.
- [ ] Conectar persistencia sin red. Mostrar total actual y enlace opcional de continuar.
- [ ] Conectar sliders a funciones puras y tabla textual. PDF/static tiene alternativa ya en el HTML.
- [ ] Probar en navegador:

```js
test('corregir y restaurar', async ({page}) => {
  await page.goto('/temas/01-deteccion/index.html#tareas');
  const quiz=page.locator('[data-question-id="q01"]');
  await quiz.getByLabel('Una caja y una categoría por objeto.',{exact:true}).check();
  await quiz.getByRole('button',{name:'Comprobar',exact:true}).click();
  await expect(quiz.getByRole('status')).toContainText('Correcto');
  await page.reload();
  await expect(quiz.getByRole('status')).toContainText('Correcto');
});
```

- [ ] Probar que flechas en un radio/slider no cambian slide. Dos browser contexts no comparten respuestas. Desactivar storage con un stub que lanza y repetir un ejercicio. Reducir movimiento y comprobar que ningún GIF arranca solo.
- [ ] `npm run build`, `npm test`, `npm run test:e2e`.

**Aceptación:** alumno puede hacer y entender cada actividad con teclado o tacto, y la web no hace peticiones al corregir.

### Tarea 5. Completar únicamente la teoría del tema 1

**Archivos:** `content/tema-01/sections.html`, `sources.json`, `public/assets/tema-01/`, `templates/credits.html`.

**Consume:** guion cerrado de 02-TEMA-1, inventario original y layouts aprobados. **Produce:** todos los IDs del guion y referencias verificadas.

- [ ] Implementar en grupos de 4–5 secciones. Extraer del PPTX solo los medios del grupo. Comprobar figura real antes de asignarla.
- [ ] Adaptar texto según reglas y registrar correspondencia: `{sectionId,sourceSlides:[17],claim,url,checkedOn,status:'verified'}`. Las fuentes verificadas tienen URL real; si se omite una afirmación dejar `status:'omitted'` y motivo en registro interno.
- [ ] Consultar fuentes primarias para puntos técnicos señalados: DETR, variantes RF-DETR, métricas y licencias si se conservan. Si no se verifica un benchmark, usar comparación cualitativa sin sus cifras.
- [ ] Incorporar q02–q08 en ubicaciones especificadas. Añadir desarrollo de lectura y fuentes cortas de figuras. La explicación debe sostenerse sin narración del profesor.
- [ ] Por grupo, ejecutar build/check y mirar capturas de lectura y presentación. Corregir desbordamientos dividiendo contenido.
- [ ] Verificar que temas 2–6 siguen sin contenido generado. No cargar assets futuros.

**Aceptación:** cada objetivo tiene explicación, actividad o práctica asociada; todas las secciones se entienden sin clase presencial y no hay afirmaciones dudosas copiadas automáticamente de Gamma.

### Tarea 6. Práctica Colab y recursos del alumno

**Archivos:** bloque `practica`/`ampliacion` en sections.html, metadata notebook en course.json, README del sitio.

**Consume:** ruta real `1_OD.ipynb`, remoto observado y evaluación de sus requisitos. **Produce:** enlace público validado y recorrido claro.

- [ ] Construir enlace según fórmula documentada; abrir y comprobar existencia real. No es necesario ejecutar entrenamiento para validar que el enlace abre.
- [ ] Incorporar pasos de guardar copia en Drive y elegir entorno. Señalar por separado disponibilidad de GPU y requisitos del dataset de entrenamiento.
- [ ] Añadir actividades concretas: variar umbral, anotar cajas, probar foto y explicar errores. Sin GPU, ofrecer las demos ilustrativas ya disponibles.
- [ ] Registrar qué se verificó: enlace, inspección estática, o ejecución real. No afirmar ejecución si solo se abrió Colab. No alterar notebook original dentro de esta tarea.

**Aceptación:** el alumno sabe dónde ejecuta el código, dónde guarda su trabajo y qué partes requieren recursos adicionales.

### Tarea 7. PDF repetible y publicación bajo subcarpeta

**Archivos:** `src/styles/print.css`, `scripts/{export-pdf,check-prefix}.mjs`, `public/descargas/tema-01-deteccion.pdf`, `scripts/validate.mjs`.

**Consume:** tema completo y modos estáticos definidos. **Produce:** PDF verificado y enlaces que funcionan bajo `/curso/`.

- [ ] Implementar `export=1` antes de inicializar cualquier widget: no leer storage, demos iniciales, preguntas sin respuestas de usuario y apéndice de soluciones generado de questions.json.
- [ ] En `?print-pdf&export=1`, desactivar transiciones, activar todas las figuras/posters, ocultar controles y usar `pdfSeparateFragments:false`, `showNotes:false`. `.study-detail` se conserva para lectura web; no imprimir notas privadas ni estados guardados.
- [ ] Exponer `window.__COURSE_PRINT_READY__=true` solo tras `Reveal.initialize()`, `document.fonts.ready`, carga de imágenes y preparación del apéndice. El exportador espera también `.pdf-page` antes de imprimir.
- [ ] Script de exportación: servir `dist` temporalmente con http-server, abrir Chromium con Playwright, usar `emulateMedia({media:'print',reducedMotion:'reduce'})`, esperar señal y generar `page.pdf({printBackground:true,preferCSSPageSize:true})` a un archivo temporal. Cerrar servidor y navegador incluso si falla.
- [ ] Revisar páginas renderizadas, números, soluciones, enlaces y diagramas; mover resultado aprobado a public/descargas y reconstruir dist. El PDF no se regenera dentro de cada build Cloudflare: se genera al cambiar contenido y se versiona con él.
- [ ] Escribir `pdf-manifest.json` junto al PDF con hash SHA-256 de sections.html, questions.json, demos.json, estilos de impresión/presentación, render.mjs y medios usados. Build falla si hay PDF y cambió un insumo sin regenerarlo; script `pdf` actualiza manifiesto. El primer build para generar PDF admite ausencia de descarga y no muestra un enlace roto.
- [ ] `check-prefix.mjs` copia dist a `web/.cache/prefix/curso/`, sirve `.cache/prefix` en puerto separado y prueba portada, tema, cambio de modo, medios, créditos y PDF con prefijo `/curso/`. Borrado limitado a esa caché tras verificar ruta.
- [ ] Ejecutar `npm run build`, `npm run pdf`, `npm run build`, `npm run check`, `npm run check:prefix`. Si el manifiesto bloquea build tras cambios, el exportador debe construir con opción interna de preparación PDF que omite solo esa verificación y no produce un sitio publicable hasta completar el PDF nuevo.

**Aceptación:** PDF sin clips, estado determinista y coherente con la web; ninguna ruta depende del dominio ni de un slash inicial.

### Tarea 8. Revisión y entrega al modelo revisor

**Archivos:** `web/README.md`, `docs/plan-web/estado-implementacion.md`, `docs/plan-web/informe-revision.md`.

**Consume:** entrega construida y comprobaciones anteriores. **Produce:** paquete revisable y guía Cloudflare.

- [ ] Ejecutar una sola ronda final: test, build, check, e2e y prefix. Repetir solo lo afectado por correcciones.
- [ ] Aplicar checklist completa de 05-REVISION-Y-PUBLICACION, con evidencia de escritorio, móvil, teclado y PDF.
- [ ] Documentar comandos, carpetas, rutas, límites y cómo añadir tema 2 después. No añadir su contenido ahora.
- [ ] Entregar al revisor más capaz con el prompt de 05. No autocertificar como realizada esa revisión independiente.
- [ ] Incorporar correcciones del revisor y permitir al profesor recorrer tema 1 antes de abrir la siguiente fase.

**Aceptación:** no quedan errores bloqueantes; el informe distingue probado, inspeccionado y pendiente externo.
