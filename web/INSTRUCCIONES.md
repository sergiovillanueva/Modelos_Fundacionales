# Guía para continuar la web

Referencia obligatoria antes de ampliar cualquier tema. Leer también [README.md](README.md). Esta guía sustituye las decisiones anteriores sobre portada, índice lateral, tarjetas y lectura continua en `../docs/plan-web/`. Trabajar exclusivamente dentro de `web/`.

Para incorporar el PowerPoint por etapas, empezar por [CONTINUAR.md](CONTINUAR.md). El proceso y los lotes están en [plan/MIGRACION-POWERPOINT.md](plan/MIGRACION-POWERPOINT.md); el punto de reanudación está en [plan/ESTADO.md](plan/ESTADO.md) y la correspondencia de las 94 diapositivas, en [plan/COBERTURA.json](plan/COBERTURA.json).

## La experiencia que hay que conservar

La web abre con una portada breve: título, una frase, una ilustración y **Empezar**. Arriba el alumno elige tema. Dentro de cada tema avanza con **Siguiente** y **Anterior**, viendo una sola idea cada vez. No necesita leer una explicación de la interfaz.

El público conoce Python y nociones de deep learning. La detección y las métricas nuevas se explican desde cero, con un ejemplo que se pueda ver o manipular.

**Modelo de referencia: tema 01, tal como está implementado.** Su recorrido guía desde una imagen y las tareas de visión hasta arquitectura, evaluación y Colab. Es una referencia de densidad: una idea por pantalla, no un límite al número de pantallas.

Conservar ese patrón visual al ampliar el contenido. **Cuatro pasos no es el límite del tema.** La sencillez consiste en mostrar una idea cada vez, no en eliminar ideas del PowerPoint. Completar primero el tema 01 y reservar su revisión antes de pasar a los demás.

## Reglas visuales obligatorias

1. **Una idea por vista.** Un título breve, como máximo una frase de contexto, y una imagen o actividad protagonista.
2. **Texto sobre fondo claro.** Sin recuadros para explicaciones, tarjetas de Colab, sombras decorativas ni etiquetas de relleno. Un área suavemente coloreada puede delimitar una simulación. El fondo admite únicamente un degradado ambiental blanco-azulado casi imperceptible; nunca paneles o manchas que compitan con el contenido.
3. **Acciones evidentes.** Una respuesta se corrige al seleccionarla. Un deslizador modifica el ejemplo. No añadir «Comprobar», «Reiniciar», tutoriales, consejos de navegación ni botones duplicados.
4. **Identidad Datamecum como acento.** Logo local claramente visible (94 × 70 px en escritorio, 76 × 57 px en móvil), Raleway en títulos, Roboto en texto. Fondo casi blanco; azul y cian de la marca como acentos. La portada permite un halo de fondo suave, sin añadir paneles.
5. **Espacio y jerarquía.** Título centrado y elemento visual grande. La interfaz ocupa menos atención que el contenido. Las preguntas usan filas con separadores finos.
6. **Contenido real.** No rellenar temas pendientes con ejemplos ficticios, métricas inventadas ni llamadas a la acción sin destino.

### Límites de texto visible

| Elemento | Límite orientativo |
| --- | --- |
| Nombre de tema en navegación (`navTitle`) | 1–3 palabras |
| Nombre de paso (`data-title`) | 1–2 palabras |
| Título de la vista | 3–7 palabras |
| Frase de contexto | Hasta 20 palabras, una sola frase |
| Pie de imagen | Una línea útil; no repetir el título |
| Pregunta | Una situación breve y 3 respuestas |
| Corrección | 1–2 frases, visibles después de responder |
| Colab | Hasta 3 pasos cortos y un enlace principal |

Estos límites rigen las pantallas propias del curso. Una pantalla que traslada una diapositiva del PDF conserva su texto completo: ver «Fidelidad al PDF» más abajo. Si falta espacio en una pantalla propia, dividir la idea en otro paso. Los matices adicionales pueden ir en el notebook o en `.print-detail`, que solo se muestra en el PDF. **Nunca ocultar una definición imprescindible para resolver la actividad web.**

## Fidelidad al PDF: el tema 01 manda

El profesor pidió el 17 de septiembre de 2026 que la web reproduzca el contenido del PDF de origen `../docs/Modelos-fundacionales-en-vision-artificial.pdf`, no un resumen. **Los seis temas ya están trasladados así.** No volver a condensarlos: las 94 diapositivas del PDF están en la web con su texto completo.

Qué significa en la práctica:

- **Una pantalla por diapositiva.** El título de la pantalla es el de la diapositiva y el texto se conserva con su redacción, sus bloques y sus listas. Reparto actual: diapositivas 4–30 en el tema 01, 31–36 en el 02, 37–54 en el 03, 55–70 en el 04, 71–79 en el 05 y 80–93 en el 06. Las diapositivas 1–3 y la 94 se resuelven con portada, créditos y navegación.
- **Los límites de texto de la tabla anterior no aplican a una pantalla que traslada una diapositiva.** Siguen aplicando a `navTitle`, a `data-title` y a las pantallas de ejercicio o simulación, que sí son breves.
- **Los extras van en pantallas propias intercaladas**, nunca amontonados dentro de una diapositiva. En el tema 01 son siete preguntas, dos animaciones y dos simulaciones.
- **Se omiten los elementos sin valor docente:** iconos decorativos, la marca de agua de Gamma y las imágenes humorísticas. Todo lo demás se recupera, incluidas las imágenes que faltaban en el PPTX exportado.
- **Cada diapositiva se registra** en `plan/COBERTURA.json` con su pantalla, y los recursos recuperados en `content/tema-XX/sources.json`.

### Componentes para trasladar una diapositiva

| Clase | Cuándo usarla |
| --- | --- |
| `slide-lead` | Párrafo de entrada de la diapositiva, centrado bajo el título |
| `slide-prose` | Columna de texto con párrafos, negritas y listas |
| `slide-split` | Texto e imagen en paralelo; `slide-split--media-first` invierte el orden |
| `note-grid` | Bloques con encabezado y acento lateral; `note-grid--two` para dos columnas anchas |
| `stage-list` | Pasos numerados; `stage-list--columns` los reparte en rejilla |
| `formula` con `frac` | Fórmulas como Precision = TP / (TP + FP), sin imagen |
| `slide-subtitle` | Subtítulo dentro de la pantalla, para los apartados de una diapositiva larga |
| `slide-callout` | Aviso destacado que la diapositiva resalta en un recuadro propio |
| `note-grid` con `is-ok`, `is-warn` o `is-stop` | Bloques que la diapositiva codifica por color; el texto sigue diciendo el estado |
| `stage-list--four` | Fila de cuatro pasos, como las de flujo del PDF |
| `compare-media` | Comparador deslizante entre dos imágenes alineadas; en papel imprime las dos mitades |

Un hijo directo de `slide-split` no puede llevar `margin: 0 auto`: el margen automático lo convierte en ancho de contenido y lo saca de su columna.

### Las tres salidas siguen conviviendo

- **Web:** la pantalla crece todo lo que necesite y se recorre con la barra flotante. La barra reserva espacio al final del documento.
- **Presentación:** cada diapositiva envuelve su contenido en `.slide-fit` y `src/js/presentation.js` la reduce lo justo para caber en 1280 × 720, igual que un lienzo de diapositiva. No hace falta recortar texto para que entre.
- **PDF:** `print.css` ajusta los componentes para que cada pantalla ocupe una página A4. Una diapositiva muy densa puede necesitar dos páginas; lo que no se admite es contenido cortado.

## Navegación

- `index.html` se genera desde `templates/home.html`: portada de una sola escena, sin tarjetas de temas ni secciones debajo. **Empezar** abre el primer tema disponible.
- Cabecera: marca y menú discreto **Material**, con **Descargar PDF** y **Presentar**.
- Una única fila de navegación: temas. Los disponibles son enlaces; los pendientes se muestran atenuados, sin enlace, con estado accesible «Próximamente».
- **No añadir pestañas de pasos, índices laterales ni otra fila de navegación.** Solo un panel visible con JavaScript activo.
- Pie de la lección: una única barra flotante y translúcida con **Anterior**, posición `n / total` y **Siguiente**. Se mantiene en el mismo lugar de la ventana aunque cambien las dimensiones de la imagen; nunca debe saltar entre pasos. El último paso termina con Colab. El contador indica ubicación, nunca rendimiento ni progreso guardado.
- La barra deja espacio inferior en el documento para no ocultar texto ni controles. En móvil respeta el área segura del dispositivo. Al imprimir se oculta y se eliminan ese espacio y los límites de altura de pantalla.
- No añadir barra lateral, secciones promocionales, pie con créditos, GitHub ni menús adicionales a la lección. Los créditos y licencias se conservan como información secundaria en los archivos existentes.
- La URL identifica el paso (`#iou`); recarga, enlaces directos y botones atrás/adelante del navegador deben conservarlo.
- Presentar abre la diapositiva actual. Volver regresa al mismo paso.

## Fuente única de contenido

`content/tema-XX/sections.html` alimenta web, presentación y PDF. No duplicar texto entre modos. No editar `dist/` a mano.

```html
<section id="concepto" data-title="Concepto" data-layout="visual">
  <div class="section-copy">
    <h2>Una idea clara</h2>
    <p class="lead">Una frase para interpretar el ejemplo.</p>
  </div>
  <figure class="figure-media detection-example">
    <img src="{{ASSET:tema-XX/ejemplo.webp}}"
         alt="Descripción de lo que el ejemplo enseña." width="900" height="457">
    <figcaption>Una conclusión breve.</figcaption>
  </figure>
  <div class="print-detail"><p>Matiz adicional para estudiar en PDF.</p></div>
</section>
```

Los valores actuales de `data-layout` son `visual`, `question`, `lab` y `practice`. Son descriptores: el diseño lo aplican las clases compartidas de `widgets.css`. Reutilizar componentes existentes antes de añadir estilos. No anidar `<section>` dentro de otra; el generador extrae secciones de primer nivel. Usar identificadores únicos y estables dentro del tema.

### Fidelidad al PowerPoint

- Comparar **PPTX y PDF**: el XML aporta texto y relaciones; el PDF revela composición, flechas, etiquetas rasterizadas y qué imagen era protagonista.
- Una diapositiva densa suele necesitar varias pantallas. No sustituir una arquitectura por una frase ni una lista de límites por una mención genérica.
- No reutilizar el mismo recurso visual para dos conceptos consecutivos salvo que la repetición sea una comparación progresiva explícita. Cada imagen debe ayudar a responder la pregunta concreta de su pantalla.
- Si una revisión debe conservar el número de pantallas, recuperar el mecanismo mediante secuencias breves, cronologías o listas compactas. El detalle puede ampliarse en `.print-detail`, pero la idea imprescindible debe seguir visible en la web.
- Cada diapositiva debe tener destino en `plan/COBERTURA.json`. Cada recurso, corrección o afirmación comprobada se registra en `content/tema-XX/sources.json`.
- Conservar definiciones, mecanismo, ejemplo, límites y criterio de elección cuando existan en la fuente. El notebook no sustituye la teoría necesaria para entender la práctica.
- Reutilizar diagramas, matrices, mapas y animaciones con valor docente. Omitir iconos decorativos, capturas redundantes y la marca de agua de Gamma.
- Convertir GIF largos con `scripts/import-source-assets.py`: WebP optimizado, póster representativo y reproducción iniciada por el alumno.
- Tomar [plan/AUDITORIA-TEMAS-02-05.md](plan/AUDITORIA-TEMAS-02-05.md) y [plan/AUDITORIA-TEMA-06.md](plan/AUDITORIA-TEMA-06.md) como referencias de densidad, trazabilidad y correcciones docentes.
- En pose, explicar el orden del pipeline antes de comparar modelos y definir OKS antes de preguntar por él. En OCR, superresolución, matching y profundidad, evitar superlativos o sustituciones universales: especificar entrada, salida, escala, validación y límites del checkpoint concreto.
- Tras cambiar contenido, comparar las hojas de contacto del PDF fuente y del PDF web. La cobertura mecánica no basta: comprobar que no haya cronologías, mecanismos o límites sustituidos por una frase genérica.

### Preguntas

- Datos en `questions.json`; insertar con `{{QUIZ:id}}`.
- Cada respuesta incluye una explicación concreta. Indicar qué significa el error, sin regañar.
- Corregir al seleccionar, con texto y color. Mantener `fieldset`, `legend`, radios nativos y `role="status"`.
- La respuesta se conserva al cambiar de paso en la misma página. No prometer persistencia después de recargar ni recogida de resultados del grupo.
- Para el PDF, asegurar que la solución puede consultarse en papel; el generador incluye la respuesta correcta debajo del ejercicio.

### Simulaciones

- Una variable principal, resultado inmediato y etiquetas junto al control.
- Explicar el nombre y significado de una métrica antes de usarla. No introducir umbrales de «bueno/malo» sin contexto.
- Mantener un ejemplo estático comprensible al imprimir.
- Los controles deben funcionar con teclado; las flechas de un deslizador nunca cambian de diapositiva o paso.
- **Los números se calculan, no se escriben.** La lógica vive en `src/lib/` con tests unitarios y el módulo de `src/js/` solo la conecta con el DOM. Nunca poner en pantalla una métrica inventada.
- **El HTML de la sección contiene el estado inicial ya resuelto**, con sus clases y sus cifras. De ahí salen el PDF y la versión sin JavaScript; el módulo se limita a actualizarlo después.
- Si una escena simula el comportamiento de un modelo en vez de mostrar su salida real, decirlo en la propia pantalla o en `.print-detail`.

#### Componentes compartidos de laboratorio

Antes de crear estilos nuevos, reutilizar los que ya existen en `widgets.css`:

| Clase | Para qué sirve |
| --- | --- |
| `lab-layout` | Rejilla de escena y lectura de resultados; `lab-layout--wide` da más sitio a la escena |
| `lab-stage` | Área suavemente coloreada que delimita la simulación, con `lab-note` para una aclaración breve |
| `lab-readout` | Columna de resultados: admite etiqueta, deslizador y `range-ends` |
| `metric-pair` y `metric` | Una o dos cifras grandes con su nombre encima |
| `metric-counts` y `tally` | Recuentos pequeños en línea, con modificadores `tally--tp`, `--fp` y `--fn` |
| `lab-message` | Frase que interpreta el estado actual; siempre con `aria-live="polite"` |
| `candidate-list` | Ranking con barra y valor por fila, resaltando `is-winner` |
| `prompt-modes` | Control segmentado de dos opciones con `aria-pressed` |

Los laboratorios actuales son `cuadricula` y `nms` (tema 01, cuadrícula de YOLO y supresión de no-máximos), `equilibrio` (tema 01, umbral y métricas), `comprobar` (tema 02, licencia frente a caso de uso), `cercania` (tema 03, similitud coseno), `normalidad` (tema 04, banco de normalidad tipo PatchCore), `marcar` (tema 05, puntos positivos y negativos) y `oks` (tema 06, tolerancia por articulación). Su lógica vive en `src/lib/`: `metrics.js`, `grid.js`, `licensing.js`, `embeddings.js`, `anomaly.js`, `prompting.js` y `keypoints.js`. Para comparar dos imágenes alineadas está `compare-media`, que el tema 06 usa en profundidad y superresolución. Cada uno tiene pruebas unitarias propias y comprobaciones de navegador en `tests/labs.spec.mjs`.

Un módulo nuevo se conecta en `src/js/reading.js` y en `src/js/presentation.js`. Si la interacción usa `role="button"`, comprobar que sigue en el selector de `keyboardCondition` de `presentation.js` para que Reveal no se quede con la barra espaciadora.

### Recursos y Colab

- Imágenes y fuentes locales; conservar proporción, dimensiones reales y texto alternativo. En lectura, limitar su altura en relación con la ventana y usar `object-fit: contain`: una imagen alta puede reducirse, pero nunca deformarse ni desplazar la navegación. Para una comparación inseparable —por ejemplo, RGB frente a profundidad— usar `visual-pair`; apilarla en móvil.
- Animaciones con póster inicial y un solo control **Ver animación / Detener**. Preferir WebP animado para las exclusiones de Git existentes.
- Colab se abre mediante un enlace real al notebook en GitHub. El alumno guarda su copia en Drive.
- Una lista sencilla y un único enlace **Abrir en Colab**. No crear tarjetas coloreadas, autenticar con Google ni cargar modelos pesados en esta web.
- Mantener autorías y licencias en los archivos correspondientes, sin ocupar la pantalla de aprendizaje.

## Presentación, móvil y accesibilidad

- Reveal.js reutiliza el contenido. Cada diapositiva debe caber a 1280 × 720, incluida la corrección de preguntas. Solo enlace discreto **Volver**, controles de Reveal y número de diapositiva.
- En móvil: contenido apilado, controles táctiles cómodos, nada de desplazamiento horizontal de toda la página. La fila de temas puede desplazarse dentro de su propio espacio.
- Temas con enlaces nativos, tema actual con `aria-current`, avance con botones nativos. Al avanzar, llevar el foco al título nuevo. Tab y Enter bastan; no interceptar las flechas del teclado para navegar la lección.
- Contraste legible y foco visible. Los cambios de paso pueden usar una entrada breve y sutil; desactivarla con `prefers-reduced-motion`. Ninguna información depende solo del color.
- Sin JavaScript, todos los pasos siguen disponibles como HTML continuo. Al imprimir también aparecen todos, incluso si la web solo muestra uno.

## Añadir un tema nuevo

1. Leer esta guía y recorrer el tema 01 antes de escribir contenido.
2. Trabajar por lotes pequeños según el plan de migración. El tema completo tendrá tantos pasos como necesite para cubrir sus ideas; no imponer un máximo de 4–7. Mantener el recorrido de ejemplos, conceptos, comprobaciones y práctica sin amontonar texto.
3. Crear `content/tema-XX/sections.html`, `questions.json` y recursos en `public/assets/tema-XX/`.
4. En `content/course.json`, completar `navTitle`, `contentDir`, `notebookPath` y pasar a `status: "available"` cuando haya contenido revisable. La URL de Colab de la sección debe apuntar al notebook correcto; `notebookPath` no la sustituye automáticamente.
5. Preparar el PDF del nuevo tema con `node scripts/export-pdf.mjs <id-del-tema>` y añadir el alias correspondiente en `package.json` para que **Material** no enlace a un archivo inexistente.
6. Ejecutar compilación, validación, tests y revisión visual según README. Ampliar las pruebas para el nuevo tema y revisar todos sus pasos, no solo los del tema 01.

## Lista de revisión antes de entregar

- [ ] La portada explica el curso en una frase y tiene una sola acción.
- [ ] El logo se lee, hay una sola fila de temas y un solo paso visible en la lección.
- [ ] No se han recuperado índice lateral, pestañas de pasos, tarjetas ni bloques de explicaciones.
- [ ] El contenido es correcto y suficiente para la actividad, con métricas explicadas desde cero.
- [ ] Respuestas, animación y simulación funcionan; la corrección cabe en móvil y presentación.
- [ ] Temas, pasos, Material, Colab e historial tienen el comportamiento descrito.
- [ ] La barra Anterior/Siguiente conserva exactamente su posición con imágenes altas, bajas, preguntas y simulaciones, en escritorio y móvil.
- [ ] Los recursos cargan tanto desde la raíz como desde la ruta del tema.
- [ ] Sin desbordamientos a 390 px y 320 px; teclado y movimiento reducido funcionan.
- [ ] Todas las diapositivas caben a 1280 × 720 y el PDF se ha revisado página por página.
- [ ] README e instrucciones reflejan cualquier decisión nueva y todos los cambios están dentro de `web/`.

## Rediseño aplicado en septiembre de 2026

La versión final tiene una portada de una sola escena y lecciones guiadas. Se eliminaron tarjetas, subtítulos repetidos, índice lateral, pestañas de pasos y pie de créditos de la lección. El logo se amplió y se introdujo un fondo suave con acentos de la marca. PDF y presentación se agruparon en Material. Se redujeron los textos, se conservaron las actividades y se añadió navegación accesible con historial. Las reglas de este documento son el patrón para los próximos temas.
