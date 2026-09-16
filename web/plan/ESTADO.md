# Estado de la migración

Actualizado: 16 de septiembre de 2026. Este archivo es el punto de reanudación.

## Próxima acción

- **Migración del curso:** completada; no existe un siguiente lote automático.
- **Siguiente trabajo válido:** una corrección concreta del profesor, revisión docente final o publicación cuando se solicite.
- **Regla de continuidad:** no resumir ni rehacer temas ya cotejados para reducir pantallas. Mantener una idea por pantalla y actualizar cobertura, fuentes, PDF y evidencia del tema afectado.

## Estado real

| Elemento | Estado |
| --- | --- |
| Portada, logo, navegación y estilo | Conservados; una idea por pantalla |
| Tema 01 · Detección | 27 pantallas, 7 preguntas, 2 animaciones, IoU, umbral en vivo y Colab |
| Tema 02 · Hugging Face | 12 pantallas, 3 preguntas, 2 recursos y Colab |
| Tema 03 · Multimodal | 20 pantallas, 3 preguntas, 9 recursos, similitud coseno en vivo y Colab |
| Tema 04 · DINO | 20 pantallas, 3 preguntas, 5 animaciones, 9 imágenes y Colab |
| Tema 05 · SAM | 15 pantallas, 3 preguntas, 1 animación, 5 imágenes, prompts por puntos y Colab |
| Tema 06 · Más visión | 19 pantallas, 3 preguntas, 8 imágenes y Colab |
| Cobertura PPTX | 94/94 diapositivas con destino; 77 revisadas y 17 adaptadas |
| Fuentes | `content/tema-01/sources.json` a `content/tema-06/sources.json` |
| PDFs | Temas 01–06 disponibles y regenerados: 27, 12, 20, 20, 15 y 19 páginas |

## Tema 06 · cierre de la migración

Las diapositivas 80–93 y las 27 celdas de `6_Otras_tareas.ipynb` se distribuyen en 19 pasos breves:

- Pose: COCO-17, pipeline top-down, comparación con bottom-up y una etapa, familias de modelos, OKS, aplicaciones y oclusiones.
- OCR: localización, reconocimiento, estructura y elección entre EasyOCR, TrOCR y VLM según la salida.
- Superresolución: Swin2SR, aplicaciones y el riesgo de confundir detalle generado con evidencia.
- Eliminación de fondo: máscara suave, canal alfa y revisión de bordes difíciles.
- Matching y 3D: detector, matcher, verificación geométrica, fotogrametría, SLAM y panoramas.
- Profundidad: Depth Anything V2, aplicaciones y separación entre profundidad relativa y métrica.
- Colab: cinco tareas ejecutables por separado y ampliación para combinar dos pipelines.

La diapositiva 94 se integra en la práctica final como cierre; las diapositivas 1–3 se resuelven mediante portada, créditos y navegación. Las correcciones y omisiones intencionales se detallan en [AUDITORIA-TEMA-06.md](AUDITORIA-TEMA-06.md).

## Revisión visual e interactiva del 16 de septiembre

Encargo del profesor: dejar la web más clara y moderna y añadir actividades que enseñen, sin multiplicar las pantallas. Se conservan la portada, el logo, la fila única de temas, la barra Anterior/Siguiente y la regla de una idea por pantalla.

Tres pantallas nuevas, una por concepto que costaba entender sin manipularlo:

| Paso | Tema | Qué se aprende manipulándolo |
| --- | --- | --- |
| `equilibrio` | 01 | El umbral de confianza sube la precisión y baja el recall sobre la misma escena, y una predicción duplicada cuenta como falsa alarma |
| `cercania` | 03 | La clasificación zero-shot elige el texto con mayor similitud coseno, y un giro pequeño cambia el ganador |
| `marcar` | 05 | Un punto positivo propone el objeto entero y uno negativo retira una parte sin volver a empezar |

Las cifras se calculan en `src/lib/` y no se escriben a mano: `matchDetections` aplica el protocolo de emparejamiento por puntuación con umbral IoU, `cosineSimilarity` compara direcciones y `predictMask` resuelve la propuesta a partir de los puntos. La escena de SAM simula el comportamiento esperado y lo dice en pantalla y en el PDF, porque no es la salida de un modelo.

Ajustes visuales, sin renombrar ni retirar ninguna clase existente:

- Cada paso centra su contenido en vertical, así que las pantallas con poco material dejan de quedar descolgadas arriba.
- Las imágenes de diapositiva llevan filete, esquina redondeada y sombra muy suave para asentarse sobre el fondo casi blanco.
- Las respuestas ganan área de clic, esquina redondeada y una marca de acierto o error que no depende solo del color.
- La cronología deja de parecer una tabla: línea continua, puntos sobre ella y sin filetes verticales.
- La barra flotante incorpora una línea de posición dentro del tema; sigue indicando ubicación y no rendimiento.
- La fila de temas marca el tema actual con un subrayado propio, con estados de paso del ratón y foco.

Comprobaciones: `npm run build`, `npm run check` y `npm test` correctos, con 15 pruebas unitarias. `npm run test:e2e` correcto con 17 pruebas, incluidas las 8 nuevas de `tests/labs.spec.mjs`, que cubren teclado, ausencia de JavaScript y anchuras de 390 y 320 px. Los tres laboratorios caben a 1280 × 720. Los seis PDF se han regenerado y se han revisado las páginas nuevas.

Pendiente de la revisión docente del profesor: el guion de las tres pantallas nuevas y su ubicación dentro de cada tema.

## Revisiones anteriores

La auditoría de fidelidad de los temas 01–05 recuperó mecanismos, arquitecturas, límites, criterios de elección y recursos que una primera adaptación había resumido en exceso. El detalle se conserva en [AUDITORIA-CONTENIDO-PPTX-PDF-WEB.md](AUDITORIA-CONTENIDO-PPTX-PDF-WEB.md) y [AUDITORIA-TEMAS-02-05.md](AUDITORIA-TEMAS-02-05.md).

Correcciones docentes que siguen vigentes:

- Las licencias se revisan por artefacto y versión; no se presentan conclusiones jurídicas absolutas.
- CLIP, BLIP, Grounding DINO y VLM se distinguen por su salida.
- DINOv2 y DINOv3 se separan por versión y mecanismo; la atención no se presenta como máscara garantizada.
- SAM 1, 2 y 3 tienen prompts y capacidades distintas.
- Pose, OCR, superresolución, matching y profundidad se explican por pipeline, salida y límites, sin declarar un modelo ganador universal.
- Umbrales, rendimiento y hardware se validan en el dominio en vez de darse como reglas universales.

## Evidencia técnica actual

- `npm run build` y `npm run check`: correctos.
- `npm test`: 15 pruebas unitarias superadas.
- `npm run test:e2e`: 9 pruebas de navegador superadas; la estabilidad de navegación recorre los seis temas.
- Tema 06 revisado en todos sus pasos a 1440 × 900, 390 × 844 y presentación 1280 × 720; sin desbordamiento horizontal a 320 px.
- PDF 06: 19 páginas renderizadas e inspeccionadas, sin páginas vacías.
- PPTX y PDF cotejados diapositiva a diapositiva para 80–93; recursos fuente inspeccionados individualmente.
- Registro de cobertura: ninguna de las 94 entradas queda sin `sectionIds` u `otherDestinations`.

Esto demuestra que la implementación local carga, navega y cabe. La aceptación docente del guion y la publicación siguen siendo decisiones del profesor.

## Pendientes externos

1. Los notebooks se enlazan pero no se han ejecutado ni modificado; los modelos pesados siguen en Colab.
2. El enlace de Colab usa el remoto `sergiovillanueva/Modelos_Fundacionales` y quedará disponible al subir el notebook y la web a la rama `main`.
3. No hay almacenamiento de respuestas, cuentas ni resultados compartidos; la web permanece estática.
4. Este trabajo no publica ni despliega cambios.

## Historial

| Fecha | Lote | Resultado |
| --- | --- | --- |
| 2026-09-15 | Preparación | Guía e inventario de 94 diapositivas |
| 2026-09-15 | T1-A a T1-I | Diapositivas 4–30 en 26 pantallas, actividades y PDF |
| 2026-09-15 | Primera pasada T2–T5 | Adaptación demasiado resumida; quedó señalada para auditoría |
| 2026-09-16 | Auditoría T2–T5 | Diapositivas 31–79 recuperadas en 65 pantallas con 27 recursos fuente y correcciones registradas |
| 2026-09-16 | Fidelidad T1–T5 | Pérdidas y repeticiones corregidas sin alterar el recorrido de pantallas |
| 2026-09-16 | T6-A a T6-C y G-B | Diapositivas 80–94 en 19 pantallas, práctica, PDF y cierre del curso |

## Al modificar un tema

1. Cotejar únicamente las diapositivas, recursos y notebook afectados.
2. Registrar secciones y correcciones en `COBERTURA.json` y `content/tema-XX/sources.json`.
3. Ejecutar build, validación y las pruebas proporcionadas al cambio.
4. Revisar web, móvil, presentación y regenerar el PDF del tema.
5. Limpiar capturas, extracciones y resultados temporales antes de entregar.
