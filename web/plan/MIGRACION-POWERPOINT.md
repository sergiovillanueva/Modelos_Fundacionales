# Plan para incorporar todo el PowerPoint

> **Para el modelo ejecutor:** trabajar lote a lote. Si está disponible, utilizar `superpowers:executing-plans` para la ejecución; estas instrucciones son también autosuficientes para un modelo sin esa skill. Los pasos con casillas describen la comprobación de cada entrega. El estado persistente se guarda en `ESTADO.md` y `COBERTURA.json`.

**Objetivo:** transformar todo el contenido docente del PPTX en un curso público, visual, sencillo e interactivo, empezando por completar el tema 01.

**Arquitectura:** conservar el generador estático actual. Una única fuente HTML por tema produce la lección guiada, Reveal.js y el PDF. Los ejercicios ligeros se resuelven en el navegador; los modelos se ejecutan en el Colab de cada alumno.

**Tecnologías:** HTML, CSS, JavaScript ESM, Node y Reveal.js. No migrar a Astro, React, Vue ni otro framework.

**Diseño obligatorio:** [INSTRUCCIONES.md](../INSTRUCCIONES.md). Este plan amplía el contenido; no reabre el rediseño.

## 1. Prioridades y límites

1. Las nuevas instrucciones del profesor prevalecen; después, `INSTRUCCIONES.md` y este plan.
2. Escribir únicamente dentro de `web/`. Leer PPTX, PDF, imágenes y notebooks del repositorio está permitido. Conservar originales y cambios del usuario.
3. Primero completar el tema 01, revisarlo y pulirlo. Los demás siguen preparados en el registro y en la arquitectura, sin pantallas vacías ni contenido inventado.
4. Trabajar en lotes pequeños completos. No dejar un lote a medias por pasar a otro más atractivo.
5. No instalar frameworks, introducir backend, cuentas, analítica, clasificaciones de alumnos ni almacenamiento compartido.
6. No descargar pesos de Hugging Face, ejecutar entrenamiento ni consumir GPU para construir o comprobar la web.
7. No subir el PPTX completo a `public/`, copiar todo el repositorio a `dist/`, publicar, hacer push ni cambiar Cloudflare como parte de la migración de contenido.
8. No pedir aprobación para decisiones rutinarias ya cubiertas por la guía. Registrar la decisión y seguir trabajando.

## 2. Fuentes y lectura eficiente

Todas las rutas de trabajo de este documento son relativas a `web/`, salvo las que empiezan por `../`.

| Fuente | Uso |
| --- | --- |
| `../docs/Modelos-fundacionales-en-vision-artificial.pptx` | Fuente principal de texto, diagramas, enlaces y medios |
| PDF del mismo nombre y carpeta | Comprobar la composición y leer gráficos que el XML no describe |
| `../docs/img/` | Originales adicionales cuando existan; comprobar la ruta, no darla por supuesta |
| `../1_OD.ipynb` a `../6_Otras_tareas.ipynb` | Prácticas reales; consultar el notebook del lote |
| `../docs/plan-web/02-TEMA-1.md`, `03-INTERACCIONES.md` y `fuentes-tema-1.json` | Guion, preguntas y referencias anteriores del tema 01 |
| `plan/COBERTURA.json` | Orden del PPTX, títulos, lotes, estado y correspondencia con la web |

La planificación antigua no describe la interfaz actual. No copiar sus tarjetas, índice lateral, `.study-detail`, bloques de 80–150 palabras, objetivos repetidos ni controles adicionales.

**Procedimiento de lectura:**

- Leer primero `ESTADO.md` y filtrar únicamente el lote activo del registro. Ejemplo en PowerShell, desde `web/`:

  ```powershell
  $courseCoverage = Get-Content plan/COBERTURA.json -Raw | ConvertFrom-Json
  $courseCoverage.slides | Where-Object batch -eq 'T1-A' | ConvertTo-Json -Depth 8
  ```

- Leer solo esas diapositivas completas, sus notas si existen y sus medios relevantes. Inspeccionar las páginas equivalentes del PDF cuando la disposición, una fórmula o una imagen aporten información.
- El PPTX es un ZIP. El registro contiene el miembro XML exacto y las rutas internas de imágenes. Resolver relaciones de la diapositiva; no adivinar que `image-24-1` es siempre el recurso correcto.
- La primera línea extraída se usa como título de inventario; no garantiza que se haya reconocido el título visual de la diapositiva.
- La extracción de texto no describe fórmulas rasterizadas, flechas ni etiquetas dentro de imágenes. Revisarlas visualmente antes de declarar cobertura completa.
- El inventario tiene una huella SHA-256. Si cambia el PPTX, comparar títulos y orden antes de reutilizar números; conservar el registro anterior y ajustar la correspondencia. No reiniciar estados silenciosamente.
- Si solo está disponible el repositorio de la web y faltan los originales, pedir el PPTX y PDF concretos en `web/fuentes/` y registrar la nueva ubicación. Esa carpeta no se copia al sitio público. No volver a pedirlos si ya están en el equipo.

## 3. Qué significa incorporar «todo»

**Toda idea docente debe tener un destino verificable.** Mantener definiciones, relaciones, ejemplos, fórmulas, comparaciones, limitaciones y recursos útiles. No es necesario reproducir cada frase ni mantener una pantalla por diapositiva.

- Una diapositiva densa se convierte en varios pasos. Varias diapositivas repetidas pueden compartir uno, pero se registran todas las fuentes.
- Los límites de texto se aplican a **cada pantalla**, no al tema completo. Un lote suele cubrir 3–5 diapositivas o una unidad conceptual corta; el tema completo tendrá todos los pasos necesarios.
- No sustituir toda una arquitectura por su nombre y una imagen sin explicación. Mostrar primero el problema, después el mecanismo y finalmente su consecuencia, en vistas separadas cuando haga falta.
- Las figuras que contienen evidencia se conservan legibles. No sustituir resultados, diagramas técnicos o tablas por imágenes decorativas.
- La teoría esencial y las instrucciones necesarias para hacer una práctica deben entenderse en la web sin la voz del profesor. `.print-detail` solo amplía matices; no puede ser el único lugar donde se explique una idea central.
- Los detalles técnicos extensos pueden ir en pasos adicionales o en el notebook. Si el detalle solo se conserva en el notebook, registrar el archivo y encabezado/celda exactos y garantizar que el alumno puede acceder desde la práctica.
- Créditos, autor, fuentes y enlaces se conservan en el lugar secundario correspondiente. Las portadas, agenda y despedida pueden integrarse en la portada o el cierre sin crear pantallas de relleno. No recuperar fechas antiguas de una edición del curso.
- Una afirmación incorrecta se corrige conservando su objetivo docente. Una afirmación sin evidencia queda como pendiente de verificación en el registro privado, nunca como un hecho público inventado.
- No omitir un concepto difícil para marcar el lote como terminado. Si la omisión es editorialmente necesaria, justificarla y dejarla para revisión.

### Registro de cobertura

`COBERTURA.json` es el registro único por diapositiva. No mantener otra lista paralela con estados distintos.

| Campo | Cómo actualizarlo |
| --- | --- |
| `slide`, `title`, `part`, `media` | Identidad de la fuente; no cambiarlos por el nuevo título web |
| `topic`, `batch` | Tema y lote de destino; generales también tienen asignación |
| `status` | `pendiente`, `parcial`, `adaptada` o `revisada` |
| `sectionIds` | Todos los IDs de secciones web que cubren la diapositiva |
| `otherDestinations` | Rutas y encabezados de créditos, notas técnicas o notebook que conservan material |
| `treatment` | `contenido`, `agrupada`, `contexto`, `corregida` o `excluida-con-motivo` |
| `missingConcepts` | Ideas concretas pendientes; no vaciar hasta leer y cotejar toda la diapositiva |
| `note` | Qué se agrupó, corrigió o excluyó y por qué |
| `review` | Fecha, responsable y evidencia de revisión; no poner una fecha de revisión antes de hacerla |

`adaptada` significa que todo el material tiene destino y el lote pasa su revisión local. `revisada` requiere además la revisión de cobertura y exactitud del tema. No marcar `revisada` por pasar tests o generar HTML.

Para cada concepto técnico comprobado o recurso transformado, crear o actualizar `content/tema-XX/sources.json`. Es documentación de autoría y revisión; el generador actual no la muestra en la lección. Usar entradas con estas claves:

```json
{
  "sectionId": "iou",
  "sourceSlides": [24],
  "originalAsset": "",
  "webAsset": "",
  "claim": "Relación entre intersección, unión y solapamiento de cajas",
  "url": "",
  "checkedOn": null,
  "status": "pending",
  "note": "Ejemplo de estructura; completar con la comprobación realmente realizada"
}
```

Este bloque documenta el contrato, no es una entrada que deba copiarse como verificada. Los estados de fuente son `pending`, `verified`, `corrected` y `omitted`; no equivalen a los estados de cobertura. Registrar una ruta local como fuente cuando corresponda; una URL externa solo si se ha consultado.

## 4. Mapa completo y lotes

Los rangos se han obtenido de la exportación de 94 diapositivas. Las etiquetas describen trabajo; no son subtítulos ni menús que haya que añadir a la web.

| Lote | PPTX | Contenido que debe quedar cubierto |
| --- | --- | --- |
| G-A | 1–3 | Nombre del curso, profesor y temario; integrar con la portada y metadatos existentes |
| **T1-A** | **4–6** | Visión, clasificación/detección/segmentación y salida del detector |
| T1-B | 7–9 | Familias de detectores, evolución histórica y recordatorio de CNN |
| T1-C | 10–12 | Detectores de dos etapas, R-CNN y comparación histórica con condiciones explícitas |
| T1-D | 13–16 | YOLO, evolución y relación entre localidad y contexto; corregir generalizaciones |
| T1-E | 17–20 | DETR, queries, matching y RF-DETR; distinguir entrenamiento e inferencia |
| T1-F | 21–23 | Elección docente y técnica, licencias concretas y comparación neutral |
| T1-G | 24–25 | Completar IoU, correspondencia, TP, FP, FN y duplicados |
| T1-H | 26–27 | Precisión, recall, umbral de confianza, AP y mAP con ejemplos desde cero |
| T1-I | 28–30 + notebook 1 | Dominio, evaluación y práctica real de detección; entrenamiento como ampliación |
| T2-A | 31–33 | Ecosistema Hugging Face, Hub y búsqueda de modelos |
| T2-B | 34–36 + notebook 2 | Revisar licencias, cargar modelos y primer pipeline |
| T3-A | 37–40 | Modelos fundacionales, multimodalidad, zero-shot y composicionalidad |
| T3-B | 41–44 | CLIP: uso, mecanismo, entrenamiento y limitaciones |
| T3-C | 45–49 | BLIP y Grounding DINO, usos y límites |
| T3-D | 50–54 + notebook 3 | VLM, Qwen VL, prompting, elección por tarea y buenas prácticas |
| T4-A | 55–58 | Aprendizaje autosupervisado y autodestilación |
| T4-B | 59–62 | Representaciones, copias de imágenes, evolución y datos de DINOv2 |
| T4-C | 63–66 | Mecanismo, características e interpretación de DINO |
| T4-D | 67–70 + notebook 4 | DINOv3, elección y anomalías |
| T5-A | 71–74 | Segmentación y arquitecturas SAM 1/2 |
| T5-B | 75–79 + notebook 5 | SAM 3, evolución, datos, prompts y limitaciones |
| T6-A | 80–84 | Panorama y pose humana, enfoques, evaluación y aplicaciones |
| T6-B | 85–89 | OCR, herramientas, superresolución y eliminación de fondo |
| T6-C | 90–93 + notebook 6 | Matching, reconstrucción y profundidad |
| G-B | 94 | Cierre; integrar una despedida o síntesis breve sin una página vacía |

G-A se resuelve como comprobación editorial al completar el tema 01; la primera entrega de contenido sigue siendo T1-A. G-B se cierra al final de la migración.

**No desarrollar temas futuros solo por estar listados.** Al terminar T1-I, preparar la revisión del tema 01. Activar el siguiente tema cuando el profesor indique continuar con él tras esa revisión.

## 5. Procedimiento obligatorio de cada lote

### A. Preparar una unidad pequeña

- [ ] Leer `ESTADO.md`, las filas del lote y el contenido actual afectado.
- [ ] Leer texto, notas, imágenes y diagramas de las diapositivas asignadas.
- [ ] Enumerar en el registro las ideas del lote y relacionarlas con pasos existentes o nuevos. Reutilizar `inicio`, `tareas`, `iou` y `practica`; no romper sus enlaces.
- [ ] Diseñar el orden para alguien que estudia solo: ejemplo → concepto → comprobación cuando aporte valor → conexión con el siguiente paso.
- [ ] Decidir qué recurso original se reutiliza y qué afirmación necesita comprobación. No rediseñar la portada en cada entrega.

### B. Incorporar contenido y medios

**Archivos habituales:** `content/tema-XX/sections.html`, `questions.json`, `sources.json`, `public/assets/tema-XX/` y los dos archivos de estado de `plan/`.

- [ ] Añadir secciones de primer nivel con `id` estable, `data-title` breve y `data-layout`. Mantener la plantilla de `INSTRUCCIONES.md`; no anidar `<section>`.
- [ ] Componer sobre fondo claro: título, frase necesaria, un visual o interacción. Dividir una explicación si no cabe; no encoger la tipografía.
- [ ] Colocar todo concepto nuevo antes del ejercicio que lo exige. Explicar siglas y términos ingleses al primer uso.
- [ ] Mantener el paso `practica` al final; insertar la teoría nueva antes de él. Tras completar el tema, el cierre conceptual puede estar justo antes de Colab.
- [ ] Extraer únicamente los recursos del lote, conservar proporciones y anotaciones significativas. Optimizar derivados en WebP cuando convenga y documentar origen/cambios.
- [ ] Si el PPTX conserva un GIF/vídeo, usarlo con póster y control de reproducción. Si solo contiene un fotograma, buscar el original local; no simular que se ha recuperado la animación.
- [ ] Pedir al profesor solo el recurso imprescindible que falte, indicando diapositiva, nombre/ruta, uso y resolución necesaria. Continuar las partes independientes.

### C. Ejercicios sencillos

- [ ] Reutilizar `{{QUIZ:id}}` para preguntas. Elegir una situación que discrimine un concepto, con tres opciones y una explicación por respuesta.
- [ ] No añadir una pregunta por diapositiva de forma automática. Incluirla al cerrar una idea relevante y evitar preguntas de memorizar nombres o fechas.
- [ ] Si una relación se entiende mejor manipulándola, usar un control principal y un resultado visible. Ejemplos: mover cajas para IoU, variar confianza para ver qué predicciones se conservan, escoger un prompt para comparar una salida ilustrativa.
- [ ] Identificar los datos de una demo como ilustrativos cuando no procedan de una ejecución real. Nunca presentar una salida precalculada como inferencia en directo.
- [ ] Crear un módulo JS solo si el comportamiento no existe. Inicializar cada instancia dentro de su propio contenedor; IDs únicos, etiquetas accesibles y resultado también expresado en texto.
- [ ] Para lógica nueva, comprobar ejemplos conocidos y casos extremos con tests pequeños en `tests/`. Cambios exclusivamente editoriales se comprueban con render y revisión visual, sin tests que repitan cada frase.

### D. Verificar y registrar

- [ ] Desde `web/`: `npm run build`, `npm run check`, `npm test`, `npm run test:e2e`.
- [ ] Adaptar `tests/course.spec.mjs` al recorrido real. Al crecer el tema, no mantener un total fijo de cuatro ni asumir que IoU es siempre el tercer paso. Mantener pruebas de historial, enlaces directos, foco, respuestas, slider y fallback sin JavaScript.
- [ ] Revisar cada paso nuevo a 1440 × 900 y 390 × 844; comprobar también 320 px sin desbordamiento horizontal. Abrir respuesta correcta e incorrecta, reproducir/detener animaciones y recorrer todos los valores útiles del control.
- [ ] Revisar cada diapositiva nueva a 1280 × 720, esperando a que termine la transición. La corrección de una pregunta también debe caber.
- [ ] Ampliar `tests/visual-check.mjs` para incluir los IDs nuevos. Las capturas antiguas de cuatro pasos no revisan el tema ampliado.
- [ ] Regenerar PDF, renderizar sus páginas e inspeccionar todas las del lote. Debe verse la teoría, ejemplos estáticos y soluciones; ocultar navegación y controles que no sirven en papel.
- [ ] Cotejar de nuevo cada diapositiva fuente con sus destinos web/PDF/notebook. Actualizar cobertura, fuentes y estado con lo que se ha verificado realmente.
- [ ] Entregar un resumen corto: lote completado, cómo verlo, problemas reales y siguiente lote. No llenar la interfaz del alumno con este informe.

No repetir suites completas sin cambios o un motivo concreto. Corregir fallos antes de dar el lote por listo. Un fallo externo de Colab se registra aparte y no se presenta como prueba de que el código del notebook funciona.

## 6. Exactitud docente

El PPTX es evidencia de lo que el profesor quiere enseñar, no garantía de exactitud de cada afirmación. Estas alertas orientan la comprobación; no constituyen una revisión científica ya realizada.

- **YOLO:** distinguir la explicación histórica de YOLOv1 de variantes modernas. Anotar versiones y fecha de comparativas.
- **CNN:** revisar afirmaciones universales sobre contexto, anchors o NMS; explicar la propiedad del modelo concreto.
- **DETR y RF-DETR:** separar matching de entrenamiento, filtrado de inferencia y detalles de la variante usada por el notebook.
- **Evaluación:** explicar IoU y correspondencia por clase; distinguir confianza e IoU; contemplar duplicados. Comprobar a mano un ejemplo de TP/FP/FN y de precisión/recall antes de programarlo. Definir el protocolo de AP/mAP que se esté utilizando.
- **Clases:** no confundir las categorías de un checkpoint con todos los problemas que una arquitectura podría abordar.
- **CLIP, BLIP, Grounding DINO y VLM:** distinguir similitud, generación y localización. No prometer capacidades a partir del nombre de la familia.
- **DINO:** diferenciar la familia de representaciones visuales de Grounding DINO; comprobar versiones y mecanismo, especialmente DINOv3.
- **SAM:** verificar la versión exacta al explicar prompts, vídeo, capacidades y arquitectura; SAM 1, 2 y 3 no son intercambiables.
- **Licencias:** consultar las fuentes oficiales de la implementación y pesos concretos antes de publicar una afirmación. No repetir simplificaciones legales o argumentos comerciales como hechos.
- **Benchmarks, velocidad, VRAM y GPU:** indicar modelo, versión, precisión numérica, datos, hardware y fuente cuando se den cifras; no inventar mediciones.
- **Colab y modelos pesados:** documentar requisitos reales del notebook y un resultado precalculado si está disponible; no garantizar GPU gratuita ni que cualquier checkpoint cabe en cualquier sesión.

Consultar fuentes primarias solo para las afirmaciones del lote: paper, documentación, repositorio, model card o LICENSE. Registrar URL, fecha, versión y conclusión. Si una fuente contradice el PPTX, preservar el objetivo de la explicación y dejar trazabilidad de la corrección para el profesor.

## 7. Cuadernos y apertura de temas futuros

| Tema | Carpeta de contenido | ID de ruta | Notebook original |
| --- | --- | --- | --- |
| 01 | `tema-01` | `01-deteccion` | `1_OD.ipynb` |
| 02 | `tema-02` | `02-hugging-face` | `2_HF_Intro.ipynb` |
| 03 | `tema-03` | `03-multimodalidad` | `3_Multimodal.ipynb` |
| 04 | `tema-04` | `04-dino` | `4_DINO.ipynb` |
| 05 | `tema-05` | `05-sam` | `5_SAM.ipynb` |
| 06 | `tema-06` | `06-otras-tareas` | `6_Otras_tareas.ipynb` |

Antes de activar un tema:

1. Leer el notebook correspondiente y comprobar que la actividad web coincide con sus celdas. Registrar encabezados/celdas relevantes y el modelo/checkpoint usado.
2. Mantener los originales fuera de `web/` intactos. Si una incompatibilidad requiere cambiarlos, documentar el cambio necesario para el profesor y avanzar con el resto del tema; no ejecutarlo por cuenta propia.
3. Construir la URL de Colab con el repositorio, rama y ruta reales. En la configuración actual se usa `https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/` seguido del nombre del notebook. Verificar el destino antes de entregar; `notebookPath` no sustituye automáticamente el enlace HTML.
4. Mantener un único enlace **Abrir en Colab**, copia en Drive y hasta tres pasos visibles. Los resultados de cada alumno son independientes; no hace falta un servidor para usuarios simultáneos.
5. Preparar contenido, preguntas, recursos y PDF. Ampliar `scripts/export-pdf.mjs` para el tema y producir `public/descargas/tema-<id-de-ruta>.pdf`; actualizar capturas y pruebas.
6. Completar `content/course.json` conservando IDs y orden. Pasar a `available` solo cuando la ruta, presentación, PDF y práctica sean utilizables. No mostrar enlaces que llevan a 404 durante la preparación.

## 8. Revisión del tema y revisión final

Al cerrar el tema 01, preparar el relevo al modelo revisor y al profesor. Repetir al cerrar cada tema posterior, sin pedir una aprobación nueva para cada ajuste menor.

El revisor recibe: registro de cobertura, fuentes consultadas, lista de pasos, PDF, enlace local y resultados de comprobaciones. Debe:

- [ ] Comparar todas las diapositivas asignadas con sus destinos; ninguna idea queda olvidada por simplificar el diseño.
- [ ] Revisar los conceptos, correcciones, preguntas y resultados de simulaciones.
- [ ] Recorrer el tema como alumno, sin conocimiento previo de detección o de las métricas nuevas.
- [ ] Confirmar que se mantienen portada sencilla, logo legible, una sola navegación por temas y una sola idea por pantalla.
- [ ] Comprobar móvil, teclado, enlaces, recursos locales, presentación y PDF completos.
- [ ] Distinguir comprobación del enlace a Colab de ejecución real del notebook; registrar lo que no se haya podido ejecutar.
- [ ] Resolver observaciones y marcar como `revisada` solo la cobertura examinada, con fecha y evidencia.

La migración completa requiere resolver las 94 entradas del registro, incluidos los destinos editoriales de 1–3 y 94. No basta con que existan seis pestañas o que todas las pruebas pasen.

La publicación se realiza únicamente cuando el profesor la solicite. Con repositorio completo: raíz de construcción `web`, salida `dist`. Con repositorio que contiene solo la web: raíz del repositorio, salida `dist`. Conservar rutas relativas y no depender del dominio final para desarrollar.
