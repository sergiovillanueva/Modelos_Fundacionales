# Auditoría de contenido: PPTX, PDF y web

Fecha: 2026-09-16  
Estado: revisión terminada y correcciones aplicadas el 2026-09-16.

## Objetivo

Comprobar si la adaptación web de los temas 1 a 5 conserva el contenido de la presentación de Gamma, si existen diapositivas repetidas y si algún texto pudo perderse por transiciones de PowerPoint.

Fuentes cotejadas:

- `docs/Modelos-fundacionales-en-vision-artificial.pptx`
- `docs/Modelos-fundacionales-en-vision-artificial.pdf`
- `web/content/tema-01/sections.html` a `web/content/tema-05/sections.html`
- PDF renderizado de cada tema de la web
- `web/plan/COBERTURA.json`

## Conclusión

El archivo fuente está íntegro: el PPTX contiene 94 diapositivas y el PDF contiene 94 páginas. El texto del PPTX aparece también en el PDF. No hay animaciones, transiciones ni objetos ocultos en el PPTX exportado por Gamma, por lo que las transiciones no explican la pérdida de contenido.

La pérdida se produjo en la adaptación a la web. Los temas 2, 3, 4 y 5 conservaban bien sus ideas principales. El tema 1 tenía varias condensaciones excesivas y dos repeticiones visuales claras. Las correcciones indicadas en este documento ya se han aplicado sin cambiar el número ni el orden de pantallas.

No se han encontrado diapositivas duplicadas en el PPTX ni en el PDF original.

## Integridad del material original

| Comprobación | Resultado |
|---|---|
| Diapositivas del PPTX | 94 |
| Páginas del PDF | 94 |
| Diapositivas con animaciones o secuencias temporales | 0 |
| Diapositivas con transición de PowerPoint | 0 |
| Objetos ocultos detectados | 0 |
| Texto del PPTX ausente en el PDF | Ninguno significativo |
| Diapositivas originales repetidas | Ninguna |

Las diferencias automáticas de texto entre PPTX y PDF proceden del orden de lectura, enlaces y etiquetas incluidas dentro de gráficos. La única palabra aparentemente ausente es `CLIP` en la diapositiva 53, porque el extractor del PDF la une al valor `120`. Visualmente está presente.

## Repeticiones encontradas en la web

### Tema 1: repeticiones corregidas

1. `familias` y `historia`
   - Las dos pantallas muestran prácticamente el mismo árbol de familias de detectores.
   - `familias` representa correctamente la diapositiva 7.
   - `historia` debería representar la diapositiva 8: una evolución temporal con Two-Stage, One-Stage y Transformers.
   - Resolución: `historia` usa ahora una cronología HTML diferenciada con las tres etapas del original.

2. `umbral` y `ap-map`
   - Las dos pantallas usan exactamente `ap-map.jpeg`.
   - Los conceptos son distintos: una pantalla explica el filtrado por confianza y la otra la curva precisión-recall/AP.
   - Resolución: `umbral` usa ahora una escala específica con predicciones visibles y ocultas; la curva queda reservada a `ap-map`.

### Reutilizaciones técnicas que son correctas

- `cnn-poster.webp` y el primer fotograma de `cnn.webp` coinciden porque uno actúa como póster de la animación.
- Los logotipos PNG y WebP coinciden porque son formatos alternativos del mismo recurso.

Estas reutilizaciones no generan diapositivas duplicadas.

### Temas 2 a 5

No se han encontrado pantallas repetidas. Cada tema mantiene una secuencia visual diferenciada.

## Contenido perdido o demasiado condensado

### Tema 1 — Detección de objetos

Es el tema con más diferencias respecto al original.

| Diapositiva fuente | Pantalla web | Gravedad | Resultado del cotejo |
|---:|---|---|---|
| 4 | `ver` | Baja | La definición y el contraste entre visión humana y artificial están condensados, pero la idea central se conserva. |
| 8 | `historia` | Alta | Falta la línea temporal del original y se repite el árbol de la diapositiva 7. |
| 10 | `dos-etapas` | Media | Faltan detalles sobre RPN, ROI pooling, número de propuestas, coste computacional y cuándo priorizar precisión frente a velocidad. |
| 13 | `una-etapa`, `yolo` | Baja | La idea se conserva. Se omitió una cifra concreta de FPS que dependía del hardware. |
| 14 | `arquitectura-yolo` | Media | Los tres mecanismos del original —rejilla, predicción conjunta y red unificada— quedaron reducidos a una explicación breve. |
| 15 | `evolucion-yolo` | Alta | La cronología y las aportaciones de las versiones YOLOv1, v3, v4, v5, v7, v8 y v9 se sustituyeron por una frase genérica. |
| 16 | `contexto` | Alta | Se perdieron casi todos los detalles sobre campo receptivo, sesgo inductivo, anchors y NMS. La corrección de la afirmación universal sobre CNN es válida, pero la explicación quedó demasiado corta. |
| 19–20 | `rf-detr` | Alta | Dos diapositivas se agruparon en una pantalla. Faltan DINOv2 como backbone, atención deformable, diseño anchorless y el flujo multiescala de cinco pasos de RF-DETR. |
| 21–23 | `eleccion` | Intencionada | La web no copia afirmaciones legales y comparativas del original que requieren verificación. Usa un criterio de elección neutral. No se debe restaurar ese texto sin revisar fuentes actuales. |
| 24 | `iou` | Intencionada | Se corrigió la asociación imprecisa entre `IoU > 0,5` y COCO. La explicación web es más exacta. |
| 30 | `practica` | Media | La diapositiva original enlaza las limitaciones de los detectores con los modelos multimodales. En la web se sustituyó por la práctica de Colab y se perdió la transición conceptual. |

Las diapositivas 5–7, 9, 11–12, 17–18 y 24–29 mantienen adecuadamente su contenido pedagógico, aunque no siempre de forma literal.

### Tema 2 — Hugging Face

Cobertura correcta. Las diapositivas 31–36 se distribuyeron en varias pantallas sin perder conceptos relevantes:

- Hub y ecosistema.
- Model cards y metadatos.
- licencias con formulación más prudente.
- carga de modelos y `from_pretrained`.
- uso de `pipeline`.

La adaptación evita generalizaciones legales del original. Conviene mantener esa corrección.

### Tema 3 — Modelos multimodales

Cobertura correcta. Se conservan:

- definición de multimodalidad y modelo fundacional;
- zero-shot;
- arquitectura, inferencia, entrenamiento y limitaciones de CLIP;
- BLIP;
- Grounding DINO y sus límites;
- VLM, Qwen, prompting, elección y validación.

Se omitieron algunas cifras exactas de escala y tamaño que pueden quedar obsoletas. No es una pérdida conceptual.

### Tema 4 — DINO

Cobertura buena. Se mantienen teacher/student, auto-supervisión, atención, embeddings, entrenamiento, DINOv2, DINOv3, recuperación visual y detección de anomalías.

Dos ajustes pendientes:

1. En la diapositiva 66 se enumeran atención, PCA, t-SNE/UMAP y vecinos próximos. La web cubre los demás, pero no menciona t-SNE/UMAP.
2. La sección web `similitud` no está registrada en `COBERTURA.json`. Es una falta de trazabilidad, no de contenido; debe asociarse a la diapositiva 65 o 66 cuando se actualice el inventario.

La web corrige las fechas de DINOv2 y DINOv3 del original. No deben revertirse a las fechas antiguas del PPTX.

### Tema 5 — SAM

Cobertura buena y sin pantallas repetidas. Se mantienen los tipos de segmentación, SAM 1, SAM 2, SAM 3, evolución, motor de datos, prompts, refinamiento, conceptos abiertos y límites de uso.

La pérdida relevante está en la diapositiva 75:

- La pantalla `sam3` conserva la combinación de detector y tracker.
- Faltan el papel del `Presence Token`, el razonamiento sobre presencia/ausencia del concepto y cómo ayuda a reducir falsos positivos.

La diapositiva 73 del original atribuye texto al prompt encoder de SAM 1. La web lo corrige y limita los prompts nativos de SAM 1 a puntos, cajas y máscara previa. No debe restaurarse el error del original.

## Estado de cobertura

- Diapositivas 4–79: todas tienen un destino registrado en la web.
- Diapositivas 80–93: corresponden al tema 6, todavía pendiente.
- Diapositivas 1–3 y 94: portada, presentación, temario y cierre; todavía pendientes como contenido general.
- Secciones web sin referencia en `COBERTURA.json`: una (`tema 04 / similitud`).
- Duplicados de texto entre pantallas web: ninguno.

La cobertura registrada no garantiza fidelidad. Varias diapositivas del tema 1 figuran como adaptadas aunque el cotejo visual muestra pérdida de información. El inventario deberá actualizarse después de corregir el contenido.

## Correcciones aplicadas sin añadir ni quitar pantallas

La recuperación se realizó dentro de las pantallas existentes:

1. `historia` recupera la cronología de la diapositiva 8.
2. `umbral` utiliza un ejemplo visual propio y `ap-map` conserva la curva.
3. `dos-etapas`, `arquitectura-yolo`, `evolucion-yolo` y `contexto` recuperan sus mecanismos esenciales.
4. `rf-detr` muestra el flujo multiescala de cinco pasos de las diapositivas 19–20.
5. `practica` incorpora la transición conceptual de la diapositiva 30 sin sustituir el enlace a Colab.
6. El tema 4 incorpora t-SNE/UMAP y registra `similitud` en la cobertura.
7. `sam3` explica el `Presence Token` y su función.
8. Se mantienen las correcciones de exactitud de las diapositivas 21–24, 61 y 73.

## Orden de corrección propuesto

1. Tema 1: diapositivas 8, 15, 16, 19 y 20.
2. Tema 1: diapositivas 10, 14 y 30; eliminar la repetición visual de `umbral`.
3. Tema 5: completar la diapositiva 75.
4. Tema 4: recuperar t-SNE/UMAP y corregir la trazabilidad de `similitud`.
5. Volver a cotejar las 76 diapositivas de los temas 1–5 y actualizar `COBERTURA.json` solo después de la revisión final.

## Criterio para la siguiente fase

La web debe conservar todas las ideas útiles del material original, pero no copiar afirmaciones erróneas, obsoletas o no verificadas. Cuando el original necesite una corrección, la pantalla debe mantener el objetivo pedagógico y expresar el dato actualizado con claridad.

La aplicación de esta auditoría no ha añadido, eliminado ni reordenado pantallas o preguntas. Se han sustituido recursos repetidos y se ha recuperado texto pedagógico dentro del recorrido existente.
