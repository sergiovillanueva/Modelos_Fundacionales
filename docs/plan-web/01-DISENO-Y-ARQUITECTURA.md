# Especificación del curso web

## 1. Objetivo y límites de la primera entrega

Un alumno entiende qué produce un detector, cómo se diferencian las principales familias y cómo interpretar sus errores; practica con controles visuales, comprueba su comprensión y abre un notebook para experimentar. El profesor presenta el mismo material en clase. La web publica exclusivamente el tema 1.

Incluye: portada del curso, seis tarjetas de temas, lectura del tema 1, presentación, ocho preguntas, dos laboratorios pequeños, práctica Colab enlazada, resumen, referencias y PDF. Progreso local voluntario, sin cuentas. No incluye edición visual, sincronización con Gamma, clasificación de alumnos, estadísticas de clase, certificados, IA servida por la web, PWA, modo offline completo ni desarrollo de temas 2–6.

## 2. Elección técnica

Se evaluaron tres opciones:

| Opción | Ventaja | Coste en este proyecto |
|---|---|---|
| HTML/JS + reveal.js | Control directo; pocas dependencias; presentación y exportación | Un constructor pequeño para reutilizar plantillas |
| Slidev | Markdown y componentes de presentación | Añade Vue y convenciones que el profesor no ha pedido |
| Astro + reveal.js | Excelente estructura para un portal mayor | Segunda herramienta y compilación sin beneficio necesario en esta fase |

Decisión: HTML/JS + reveal.js. Node solo construye archivos, no atiende alumnos. No se usa el modo scroll de reveal.js como sustituto de una página responsive: la lectura tendrá texto que fluye y columnas que se apilan, sin escalar una diapositiva hasta hacer su texto diminuto.

Dependencias previstas: `reveal.js` versión estable 5.x o posterior compatible, fijada exactamente al iniciar la implementación; `@playwright/test` y `http-server` como herramientas de desarrollo. Node 22 LTS y npm. Guardar `package-lock.json`; usar `npm ci` desde entonces. Si la versión de reveal cambia, comprobar las opciones consultadas, no copiar una versión supuesta.

## 3. Mapa del sitio y estados

Salida relativa a `dist/`:

| Ruta | Comportamiento |
|---|---|
| `index.html` | Portada e índice de seis temas |
| `temas/01-deteccion/index.html#iou` | Lectura; fragmentos con IDs estables |
| `temas/01-deteccion/presentar.html#/iou` | Presentación; identificadores de reveal |
| `temas/01-deteccion/presentar.html?print-pdf&export=1` | Preparación determinista del PDF |
| `descargas/tema-01-deteccion.pdf` | PDF generado y revisado |
| `creditos.html` | Autoría, recursos y bibliografía utilizada |
| `404.html` | Página con enlace relativo a la portada |

Los temas 2–6 no tienen ruta ni enlace activo. Una tarjeta dice número, título y «Próximamente» como texto, nunca como botón que no funciona. No mostrar porcentajes o duraciones inventadas.

Índice: 1 Detección de objetos; 2 Ecosistema Hugging Face; 3 Modelos multimodales; 4 DINO y representaciones visuales; 5 Segmentación con SAM; 6 Otras tareas de visión.

### Pantalla inicial

Cabecera compacta con logo Datamecum, título del curso, autor y enlace GitHub. Portada azul profundo con título grande «Modelos fundacionales en visión artificial», subtítulo docente de una frase y CTA «Empezar tema 1». A la derecha, una composición ligera con una imagen real y cajas ilustrativas; indicar si las cajas son ilustrativas. No video de fondo ni imagen decorativa de un robot.

Debajo: tres capacidades concretas que aprenderá el alumno, seis tarjetas numeradas y bloque «Cómo usar el curso»: estudiar, experimentar, abrir Colab. Enlaces a PDF y créditos. Autor y Datamecum con jerarquía discreta; no datos de contacto personales repetidos ni fecha antigua de Gamma.

### Lectura del tema

Cabecera: «Volver al curso», título abreviado, «Presentar» y «Descargar PDF». Escritorio: índice lateral de 230 px + columna central; móvil: botón «Índice del tema» que despliega una lista mediante `details/summary`. Cada sección: título, idea principal, recurso visual, explicación, y actividad si corresponde. Anchura de párrafo 65–75 caracteres; figuras pueden ocupar el ancho mayor.

Barra de progreso discreta: «3 de 8 preguntas respondidas · 2 correctas». Secciones vistas y aciertos son conceptos distintos. No declarar aprendizaje completado solo por hacer scroll. «Continuar donde lo dejé» es un enlace opcional, sin salto automático al cargar.

### Presentación

Fondo claro en explicaciones, separadores oscuros. Relación 16:9, 1280×720 de referencia, navegación horizontal únicamente. Botones anterior/siguiente y contador. `F` o botón para pantalla completa; ocultar el botón si no está disponible. Índice accesible y enlace «Leer este apartado». No autoavance. Entrar/salir de presentación mantiene el ID de sección, no duplica historial innecesariamente.

En pantallas estrechas, la lectura es el acceso principal. El modo presentación sigue disponible, pero los controles, índices y ejercicios deben poder operarse con tacto.

## 4. Sistema visual decidido

Preferencia confirmada: identidad Datamecum, inspirada en el Gamma del profesor y con resultado bonito y elegante. Colores dominantes medidos en el logo transparente suministrado: azul `#1313AB` y cian `#00D0FF`. Son muestras del recurso disponible, no una afirmación sobre un manual oficial de marca. Mantener proporciones del logo; usar la variante de fondo azul donde convenga, sin recolorear el logotipo.

| Token | Valor y uso |
|---|---|
| Fondo | `#F6F8FC` |
| Superficie | `#FFFFFF` |
| Texto principal | `#14243A` |
| Texto secundario | `#42556C` |
| Azul portada | `#10104D`, con área de marca `#1313AB` |
| Primario/enlaces | `#1313AB` |
| Acento de marca | `#00D0FF` en detalles y sobre oscuro; no texto pequeño cian sobre blanco |
| Acento legible sobre claro | `#006A83` para texto que necesita color |
| Panel suave | `#EEEDFF`, referencia al lavanda de Gamma |
| Borde | `#D5DFEB` |
| Éxito | texto `#166534`, fondo `#ECFDF3` |
| Error | texto `#B42318`, fondo `#FEF3F2` |
| Radio | 12 px controles; 20 px tarjetas; evitar formas de pastilla en todo |
| Espaciado | múltiplos de 4: 8, 12, 16, 24, 32, 48, 64 |

Fuentes locales: Raleway 600/700 para títulos; Roboto 400/500/700 para lectura; monospace del sistema para código. Los ZIP disponibles contienen TTF y OFL: extraer solo los pesos necesarios, convertir a WOFF2 si hay herramienta local y conservar licencia; no añadir descargas de Google Fonts en ejecución. Fallback `system-ui, sans-serif`.

Lectura: cuerpo 18 px, interlineado 1.65; H1 `clamp(2rem, 5vw, 3.6rem)`; H2 28–36 px. Presentación: cuerpo mínimo 26 px en lienzo, título 42–52 px, pies 18 px. Máximo 70 palabras principales por diapositiva; el desarrollo más largo va en `.study-detail`. Dividir secciones densas en varias diapositivas, no reducir fuente.

Seis composiciones: portada, texto+figura 45/55, comparación de dos columnas, proceso horizontal 3–4 pasos, laboratorio y pregunta. Alternar composiciones con intención; evitar una sucesión de tarjetas idénticas. Diagramas SVG nítidos, sin redibujar detalles científicos no entendidos. Imágenes sin recortar etiquetas; ampliables con `dialog` y cierre por Escape.

Transiciones: fundido de 150–200 ms. Nada de parallax, partículas, movimientos continuos o confeti. Respetar `prefers-reduced-motion`; poster por defecto en animaciones. Permitir reproducir y detener cada GIF; al detener, sustituir por poster estático. No afirmar que un GIF se puede pausar en su fotograma con CSS.

## 5. Arquitectura de archivos

Todos los caminos siguientes son relativos al repositorio. Son destinos previstos, no archivos ya implementados.

```text
web/
  package.json                 comandos y dependencias exactas
  package-lock.json
  .gitignore                   dist/, node_modules/, test-results/, .cache/
  README.md                    desarrollo, contenido, PDF y despliegue
  content/
    course.json                seis temas y notebook público
    tema-01/
      sections.html            única fuente semántica de teoría
      questions.json           ocho preguntas de 03-INTERACCIONES
      demos.json               datos ilustrativos fijados
      sources.json             referencias y trazabilidad
  templates/
    home.html                  cascarón de portada
    reading.html               cascarón de lectura
    presentation.html          cascarón de presentación
    credits.html
  src/
    styles/{tokens,base,course,reading,presentation,widgets,print}.css
    js/{reading,presentation,quiz,storage,media,iou-demo,threshold-demo}.js
    lib/{metrics,progress}.js   lógica pura compartida con tests
  public/
    assets/tema-01/             solo los medios seleccionados, nombre normalizado
    assets/brand/              logo usado
    fonts/                     solo fuentes empleadas y OFL
    descargas/tema-01-deteccion.pdf
    descargas/pdf-manifest.json huellas de los insumos usados al generar PDF
  scripts/
    build.mjs                  genera rutas conocidas y copia una lista permitida
    render.mjs                 genera preguntas, demos e índices desde datos
    paths.mjs                  enlaces relativos
    validate.mjs               verifica contenido y artefactos
    export-pdf.mjs             Chromium local y determinismo de impresión
    check-prefix.mjs           prueba publicación bajo /curso/
  tests/
    metrics.test.mjs
    progress.test.mjs
    paths.test.mjs
    course.spec.mjs            pruebas reales de navegador
  playwright.config.mjs
  dist/                        resultado desechable, nunca fuente de contenido
```

No desarrollar un motor genérico de plantillas. `build.mjs` lee shells con marcadores únicos como `{{TITLE}}`, `{{CONTENT}}`, `{{NAV}}`, `{{SCRIPTS}}`; reemplaza solo marcadores conocidos, exige que no quede ninguno y escapa texto procedente de JSON. Los fragmentos HTML de teoría son locales y revisados. `render.mjs` genera controles desde datos con funciones concretas. No `eval`, ejecución de HTML remoto ni dependencias de Gamma.

`build.mjs` genera `creditos.html` desde su plantilla y `404.html` como HTML mínimo con navegación; no añadir un router SPA ni un fallback que convierta cualquier URL inválida en una lección. Antes de existir el PDF, ocultar su acción de descarga; la aceptación final exige el archivo y su enlace. La página de créditos solo incluye recursos utilizados en la versión publicada.

Build copia exclusivamente contenido generado, `src/`, `public/` y los archivos necesarios de reveal.js a `vendor/reveal/`. Nunca copia `.env`, `docs/`, notebooks privados, pesos, datasets ni el repositorio completo. No sirve `node_modules/`.

## 6. Contratos para evitar decisiones improvisadas

### Metadatos

`course.json`:

```json
{
  "id": "modelos-fundacionales-vision",
  "title": "Modelos fundacionales en visión artificial",
  "author": "Sergio Villanueva",
  "repository": "https://github.com/sergiovillanueva/Modelos_Fundacionales",
  "topics": [
    {"id":"01-deteccion","title":"Detección de objetos","status":"available","contentDir":"tema-01","notebookPath":"1_OD.ipynb"},
    {"id":"02-hugging-face","title":"Ecosistema Hugging Face","status":"planned"},
    {"id":"03-multimodalidad","title":"Modelos multimodales","status":"planned"},
    {"id":"04-dino","title":"DINO y representaciones visuales","status":"planned"},
    {"id":"05-sam","title":"Segmentación con SAM","status":"planned"},
    {"id":"06-otras-tareas","title":"Otras tareas de visión","status":"planned"}
  ]
}
```

### Contenido único

Cada sección empieza con `<section id="iou" data-title="Intersección sobre unión" data-layout="lab">` y contiene `h2`, párrafo principal y figura o widget. `.study-detail` amplía la explicación solo en lectura; `.print-only` da alternativa estática y `.screen-only` contiene controles. Un marcador `{{QUIZ:q04}}` se expande mediante el renderizador. No duplicar la teoría en plantillas de presentación. IDs exactos en 02-TEMA-1.

Lectura y presentación son documentos diferentes generados de las mismas secciones, por lo que no colisionan los IDs de controles. Solo una instancia de cada pregunta por documento. El modo PDF usa las mismas secciones y apéndice generado de respuestas.

### Rutas

`relativeUrl(fromPage, targetPath)` recibe rutas POSIX de salida, sin barra inicial, y devuelve ruta relativa usando `path.posix.relative(dirname(fromPage), targetPath)`. Ejemplo: desde `temas/01-deteccion/index.html` al PDF devuelve `../../descargas/tema-01-deteccion.pdf`.

Todos los enlaces internos, CSS, módulos y medios usan esta regla. Referencias de medios en fuente: `{{ASSET:tema-01/od.webp}}`, expandidas según página. Rutas públicas de recursos parten de `assets/`. No `/assets/...`, localhost, unidades Windows ni dominio fijo. Así se puede servir `dist/` en la raíz de un dominio o bajo `/curso/`. La carpeta de compilación `web/` no se convierte automáticamente en un prefijo de URL.

### Progreso

Clave `mfv:tema-01:v1`; JSON `{schema:1, contentVersion:1, lastSection:"iou", answers:{q01:{selectedId:"b", checked:true, correct:true, attempts:1}}}`. Versionar si cambian claves correctas. Lectura/escritura envuelta en try/catch; con almacenamiento bloqueado funciona en memoria. No sincronización entre dispositivos. Limpiar progreso requiere botón «Borrar mi progreso» y confirmación local; no afecta a otra persona.

### Presentación y controles

Inicializar reveal solo en `presentar.html`: `hash:true`, `width:1280`, `height:720`, `center:false`, `transition:'fade'`, `slideNumber:'c/t'`, `autoSlide:0`, `scrollActivationWidth:null`. Revisar compatibilidad de configuración con versión fijada. En exportación `transition:'none'` y sin animaciones. No montar reveal en lectura.

Configurar `keyboardCondition` para ignorar atajos si `event.target.closest('input,textarea,select,button,a,[contenteditable="true"],[role="slider"]')` existe. Las flechas de un radio o slider nunca avanzan diapositiva. Swipe no debe capturar arrastre de laboratorio. Cambiar sección detiene medios de la anterior.

## 7. Accesibilidad y rendimiento

- `lang="es"`, enlace «Saltar al contenido», landmarks, jerarquía de títulos y foco visible.
- Controles nativos: `button`, `input type=radio`, `input type=range`, `fieldset/legend`; nombres accesibles.
- Acierto/error mediante texto e icono, además del color. Mensajes tras comprobar con `aria-live="polite"`.
- Teclado y tacto completos; blancos táctiles de al menos 44×44 px como objetivo de diseño.
- Contraste mínimo objetivo 4.5:1 para texto normal y 3:1 para elementos gráficos/controles pertinentes; medir combinaciones finales.
- Sin scroll horizontal del documento a 360 px; contenido legible a 200% de zoom. Figuras densas tienen alternativa textual y ampliación.
- HTML de lectura útil si falla JavaScript: teoría y enlaces siguen presentes; ejercicios muestran mensaje y solución mediante `noscript`, sin controles engañosos.
- Inicio objetivo <1.5 MB transferidos; lectura inicial <2 MB sin activar GIFs. No precargar medios de temas futuros. CSS/JS propios pequeños, imágenes lazy excepto primera, dimensiones explícitas.
- GIFs grandes: cargar tras acción del alumno, mantener poster estático y leyenda. Ningún archivo público debe superar 20 MB como presupuesto interno.
- Las demos son cálculos ilustrativos, no inferencia ni resultados reales del detector.

## 8. Fuentes técnicas consultadas

- [reveal.js: inicialización](https://revealjs.com/initialization/)
- [reveal.js: teclado](https://revealjs.com/keyboard/)
- [reveal.js: PDF](https://revealjs.com/pdf-export/)
- [reveal.js: scroll y sus opciones](https://revealjs.com/scroll-view/)
- [Cloudflare: configuración del build](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Colab: recursos y límites](https://research.google.com/colaboratory/faq.html)
