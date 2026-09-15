# Tema 1 — diseño docente y uso de Gamma

## 1. Resultado de aprendizaje

Al terminar, el alumno podrá:

1. Distinguir clasificación, detección y segmentación según la salida deseada.
2. Leer una detección: caja, etiqueta y puntuación de confianza.
3. Explicar la idea de detectores de dos etapas, una etapa y predicción de conjuntos.
4. Calcular IoU e interpretar TP, FP, FN, precisión y recall en ejemplos pequeños.
5. Distinguir el umbral de confianza del umbral de IoU de evaluación.
6. Justificar la evaluación con datos del dominio y abrir una práctica de inferencia en Colab.

Prerrequisitos operativos: Python básico y familiaridad con redes neuronales. Ritmo estimado de diseño, por validar con el profesor: 45–60 min de teoría/actividades y 30–45 min de práctica. No fijar este tiempo como promesa en la web antes de probar el recorrido.

Patrón docente: observar una imagen → anticipar un resultado → manipular o responder → leer explicación → trasladar a una imagen propia. Las preguntas miden conceptos, no fechas ni siglas memorizadas.

## 2. Guion y correspondencia con las fuentes

Una fila es una sección semántica y normalmente una diapositiva. Las preguntas dentro de una sección se muestran tras la explicación; si no caben con fuente de 26 px, convertir el ejercicio en una sección inmediatamente posterior con ID `ID-original-ejercicio` y actualizar el índice automáticamente. No reducir tipografía para encajar.

| ID estable | Título y mensaje que debe comunicar | Fuente PPTX | Recurso/actividad |
|---|---|---|---|
| `inicio` | Detección de objetos: localizar, reconocer y evaluar. Objetivos y recorrido. | 6 + objetivos nuevos | Imagen de calle, sin animación automática |
| `ver` | La imagen contiene píxeles; la tarea define la información que queremos extraer. | 4 | Figura fuente, explicación breve |
| `tareas` | Clasificar da una categoría; detectar añade ubicaciones; segmentar delimita píxeles. | 5 | GIF del coche con poster y pregunta q01 |
| `salida` | Caja, clase y puntuación. La puntuación no es por sí sola una probabilidad calibrada. | 6; notebook celdas 8–9 | Imagen anotada y tabla con las tres partes |
| `familias` | Dos etapas, una etapa y predicción de conjuntos: tres formas de organizar el problema. | 7–8 | Tres columnas; historia detallada en lectura |
| `cnn` | Filtros compartidos extraen patrones visuales; capas posteriores combinan información. | 9 | GIF CNN del PPTX con control |
| `dos-etapas` | Primero regiones candidatas, después clasificación/refinamiento. | 10–11 | Diagrama de pasos, original legible |
| `una-etapa` | Predice ubicaciones y categorías en una pasada; YOLOv1 como ejemplo histórico. | 13–14 | `yolo_design.webp`, q02 |
| `evolucion` | Las familias evolucionan; evitar identificar todo YOLO moderno con la cuadrícula de v1. | 12,15 | Cronología histórica breve; tabla comparativa sin benchmark nuevo |
| `contexto` | Localidad y contexto global son elecciones de arquitectura, no una competición universal. | 16 | Ilustración de contexto; evitar generalización «CNN insuficiente» |
| `detr` | Backbone + transformer + queries para predecir un conjunto de objetos. | 17 | `detr1.webp` o imagen interna según legibilidad |
| `matching` | Asignación uno a uno durante entrenamiento; diferenciarla del filtrado de inferencia. | 18 | Dos paneles, q03; sin animación algorítmica compleja |
| `rf-detr` | Ejemplo de detector moderno que utilizaremos en la práctica. | 19–20 | Diagrama y flujo; detalles sujetos a verificación de versión |
| `eleccion` | Elegir por tarea, latencia medida, calidad, entorno y condiciones del recurso concreto. | 21–23 | Tabla neutral. RF-DETR es elección docente, no ganador universal |
| `iou` | IoU mide solapamiento, no confianza ni corrección de clase. | 24 | Laboratorio de cajas + q04 |
| `errores` | TP/FP/FN necesitan correspondencia, clase y criterio de evaluación. | 25 | Un objeto, predicción correcta, duplicado y objeto omitido |
| `precision-recall` | Precisión: aciertos entre predicciones; recall: encontrados entre objetos reales. | 26 | Fórmulas accesibles + ejemplo 3 TP, 1 FP, 2 FN + q05 |
| `umbral` | Cambiar confianza filtra predicciones; IoU sigue siendo otro criterio. | Notebook 10–11; 26 | Laboratorio de umbral + q06 |
| `ap-map` | AP resume una curva precision–recall; mAP agrega AP según protocolo. | 27 | Figura con leyenda. AP50 y COCO AP no son intercambiables |
| `dominio` | Un vocabulario de entrenamiento limitado no garantiza las clases de tu aplicación. | 28,30 | Imagen COCO o ejemplo industrial; q07 |
| `evaluar` | Medir datos propios, errores y latencia con condiciones explícitas. | 29 | Lista breve, q08 |
| `practica` | Abrir Colab, guardar copia, ejecutar inferencia, probar umbrales y una imagen propia. | 1_OD.ipynb | Botón real y checklist de observación |
| `ampliacion` | Entrenamiento opcional para nuevas clases: datos, recursos y evaluación separada. | Notebook 21–25 | Explicar requisitos; no prometer ejecución sin preparación |
| `resumen` | Cinco ideas esenciales; preguntas pendientes; puente a HF/multimodalidad. | 30 + síntesis | Resumen y enlaces al índice y PDF |
| `referencias` | Fuentes concretas para ampliar y fecha de revisión técnica. | Figuras + fuentes verificadas | Lista bibliográfica corta y créditos |

La presentación resultante puede necesitar unas 30–35 diapositivas al separar actividades; no mantener a la fuerza el recuento de Gamma. La lectura conserva los mismos IDs y orden.

## 3. Reglas de adaptación del texto

- Conservar el concepto y la procedencia; corregir errores de extracción, redundancias y erratas.
- Cada sección empieza con una idea de una frase, no con una definición grandilocuente.
- Introducir término español y habitual inglés la primera vez: caja delimitadora (bounding box).
- Añadir explicación en `.study-detail` para que el contenido se entienda sin escuchar al profesor; 80–150 palabras adicionales cuando sean necesarias, no en todas las secciones.
- No inventar material de temas 2–6 para completar enlaces. El puente puede nombrarlos en una frase.
- Las preguntas y datos de demos proceden de 03-INTERACCIONES, no de una generación libre del implementador.
- No añadir imágenes generadas por IA ni decoración sin función didáctica.

## 4. Aspectos técnicos que requieren revisión antes de publicar

El PPTX sirve como fuente editorial, no como garantía de exactitud. Registrar cada decisión en `content/tema-01/sources.json` con `sectionId`, `sourceSlides`, `url`, `checkedOn`, `claim` y `status` (`verified` o `omitted`). Una afirmación importante sin verificar se omite o se formula sin el detalle dudoso; no queda marcada «pendiente» en el producto público.

| Fuente | Tratamiento obligatorio |
|---|---|
| 13–15, YOLO | Presentar cuadrícula S×S como explicación de YOLOv1. Verificar versión antes de atribuir un mecanismo a toda la familia. |
| 16, CNN | Retirar generalizaciones de que toda CNN necesita anchors/NMS o no puede modelar contexto global. |
| 17–18, DETR | Diferenciar matching de entrenamiento de inferencia. No presentar matching como un NMS ejecutado al predecir. Referencia primaria: repositorio/paper DETR. |
| 19–20, RF-DETR | Verificar backbone y bloques para la variante exacta usada. No extrapolar detalles de DETR original ni llamar encoder a cualquier etapa. |
| 21–23, licencias/benchmarks | Sustituir juicios contra herramientas por criterios prácticos. Si se mencionan licencias, consultar LICENSE/model card de la versión concreta; no mantener «AGPL impide investigación» ni una obligación legal resumida sin contexto. Evitar cifras sin hardware, dataset, versión y fuente. |
| 24–27, métricas | Usar IoU ≥ umbral en las demos; matching uno a uno por clase; duplicados cuentan como FP. Distinguir AP50 de AP promediada en IoU 0.50:0.95. No definir TN como inexistentes en todo detector: explicar que no se usa un recuento útil de TN de fondo para estas métricas. |
| Notebook, confianza | Sustituir en la explicación web «probabilidad» por «puntuación» salvo calibración demostrada. No prometer que subir umbral siempre aumenta precisión en todo conjunto. |
| 28–30, COCO | Las 80 categorías corresponden al checkpoint COCO, no a la capacidad inmutable de RF-DETR. Fine-tuning y open vocabulary son estrategias distintas. |

Esta planificación no realiza una revisión científica completa. El implementador verifica las afirmaciones usadas y el revisor final comprueba que la explicación publicada es correcta.

## 5. Inventario de recursos del tema 1

Originales presentes en `docs/img/tema 1/`:

| Archivo | Uso previsto | Observación |
|---|---|---|
| `There is a car.gif` | tareas | 500×500, 4 frames; contiene texto en inglés; leyenda en español |
| `cars_od.gif` | salida/portada alternativa | 497×267, 76 frames, 5.9 MB; no agrandar a pantalla completa |
| `od.jpg` | panorama de detección | 3914×1989; derivado web optimizado |
| `history_od.jpg` | familias | 676×249; revisar etiquetas al ampliar |
| `yolo_design.webp` | una etapa | 600×381 |
| `detr1.webp`, `detr2.webp` | DETR/matching | Verificar visualmente qué diagrama corresponde a cada explicación |
| `pr_ap.webp` | AP/PR | 1144×412; no hacer pasar curva ilustrativa por medición del curso |
| `rf_vs_yolo.png` | elección | 2369×989; usar solo si se documentan versiones/condiciones; alternativa tabla cualitativa |
| `Raleway,Roboto.zip`, `Raleway.zip` | tipografía | Extraer solo pesos y licencia necesarios |

Medios internos útiles, con nombres exactos en el ZIP PPTX:

- `ppt/media/image-4-1.jpeg`: figura de introducción a visión.
- `ppt/media/image-9-1.gif`: CNN, puede evitar pedir otro GIF al profesor.
- `ppt/media/image-10-1.jpeg`, `image-11-1.jpeg`: dos etapas/R-CNN.
- `ppt/media/image-12-1.jpeg`: comparación histórica, conservar contexto si se usa.
- `ppt/media/image-17-1.jpeg`: DETR.
- `ppt/media/image-18-1.jpeg`, `image-18-2.jpeg`: comparación visual de predicciones.
- `ppt/media/image-20-1.jpeg`: RF-DETR.
- `ppt/media/image-24-1.jpeg`: IoU, sustituible por SVG propio de la demo.
- `ppt/media/image-27-1.jpeg`, `image-28-1.jpeg`: métricas y COCO.

Resolver relaciones desde `ppt/slides/_rels/slideN.xml.rels`, no adivinar por orden de extracción. `fuentes-tema-1.json` contiene las relaciones observadas. Conservar los originales en `docs/`; producir derivados solo en `web/public/assets/tema-01/`. El build no debe volver a extraer el PPTX en cada deploy.

Crear manifiesto con `id`, `sourcePath`, `pptxSlide`, `outputPath`, `alt`, `caption`, `credit`, `posterPath` cuando aplica. Describir función de la figura en el alt; el contenido largo va en texto adjunto. Créditos visibles donde corresponda, además de página general.

## 6. Contrato de Colab

Enlace previsto derivado del remoto observado:

`https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/1_OD.ipynb`

Verificar que archivo y rama publicados existen antes de dar el botón por validado. La referencia local fue inspeccionada; la ejecución remota aún no se ha probado. No usar una URL de Drive privada.

Copy visible propuesto:

> Abre la práctica en Colab y elige «Archivo → Guardar una copia en Drive». Trabaja en tu copia. Colab ejecutará el código en su entorno; la web no descarga ni ejecuta el modelo. Para conservar tus cambios necesitas una cuenta de Google.

Pasos: 1 abrir/guardar copia; 2 elegir GPU si está disponible; 3 ejecutar instalación y carga; 4 comparar umbrales 0.25/0.50/0.75; 5 probar imagen propia; 6 anotar un FP y un FN; 7 guardar conclusiones. Una puntuación baja/alta se interpreta en contexto, no se fuerza un resultado esperado en cualquier foto.

Sin GPU: completar las dos demos locales y analizar sus datos ilustrativos; no etiquetarlos como resultados de RF-DETR. Añadir capturas reales del notebook solo si se generan y se identifica su procedencia.

La sección de fine-tuning local comprueba una ruta de dataset y después intenta entrenar aunque falte. Además, requiere un checkpoint y una imagen de prueba específicos. La primera web puede enlazar el notebook existente con estos requisitos explícitos y estado de validación honesto. Reparar o certificar todo el notebook es una tarea separada, salvo que el profesor amplíe el alcance. No decir «Ejecutar todo funciona» sin haberlo comprobado.
