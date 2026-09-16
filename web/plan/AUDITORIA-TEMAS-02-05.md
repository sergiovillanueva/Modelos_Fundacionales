# Auditoría de fidelidad · temas 02–05

Fecha: 16 de septiembre de 2026.

## Motivo

La primera adaptación era visualmente limpia, pero comprimía demasiado el PowerPoint. Varias arquitecturas, ejemplos, limitaciones y animaciones no tenían un destino web. Esta auditoría compara las diapositivas 31–79 del PPTX con el PDF, el HTML y los recursos publicados.

## Resultado

| Tema | Fuente | Antes | Después | Recursos recuperados |
| --- | ---: | ---: | ---: | ---: |
| 02 · Hugging Face | 6 diapositivas | 9 pantallas | 12 pantallas | 2 |
| 03 · Multimodalidad | 18 diapositivas | 8 pantallas | 19 pantallas | 9 |
| 04 · DINO | 16 diapositivas | 9 pantallas | 20 pantallas | 9 imágenes + 5 animaciones |
| 05 · SAM | 9 diapositivas | 8 pantallas | 14 pantallas | 5 imágenes + 1 animación |

Cada diapositiva tiene ahora uno o varios `sectionIds` en `COBERTURA.json`. Los cambios editoriales y fuentes técnicas están en `content/tema-02/sources.json` a `content/tema-05/sources.json`.

## Contenido restaurado

### Tema 02

- Cuatro piezas del ecosistema y flujo buscar → probar → integrar.
- Criterios de búsqueda y contenido de una model card.
- Revisión separada de permisos, obligaciones y restricciones.
- Descarga, caché, memoria, archivos, `from_pretrained` y `pipeline`.

### Tema 03

- Definición de modelo fundacional, multimodalidad, zero-shot y composicionalidad.
- CLIP: usos, dos encoders, inferencia, entrenamiento contrastivo y límites.
- BLIP: generación condicionada y VQA.
- Grounding DINO: vocabulario abierto, arquitectura, atención entre modalidades, usos y límites.
- VLM: encoder, adaptador y LLM; Qwen2.5-VL, prompting, elección y validación.

### Tema 04

- Diferencia entre supervisado y auto-supervisado; cuatro familias de señales.
- Auto-destilación teacher–student y proceso por vistas.
- Mapas de atención, copias, evolución, curación de datos DINOv2 y capacidades emergentes.
- Embedding global, patches, PCA, vecinos cercanos y dos visualizaciones DINOv3.
- Elección del backbone y pipeline de anomalías tipo PatchCore.

### Tema 05

- Segmentación semántica, por instancias y panóptica.
- Arquitecturas separadas de SAM 1, SAM 2 y SAM 3.
- Evolución de imagen a vídeo y conceptos abiertos.
- Motor de datos de SA-1B y prompts de punto, caja, máscara, texto y ejemplar según la versión.
- Refinamiento, criterios de uso, combinaciones con otros modelos y límites.

## Decisiones de fidelidad

1. **No copiar la densidad visual de Gamma.** Una diapositiva densa se divide en varias pantallas; no se reduce a un título y una imagen.
2. **Mantener la teoría esencial en la web.** `.print-detail` amplía contexto y cifras, pero el mecanismo necesario para aprender aparece en la pantalla.
3. **Conservar diagramas que enseñan.** Se reutilizan arquitecturas, matrices, mapas y ejemplos. Los iconos decorativos y la marca de agua de Gamma no se trasladan.
4. **Controlar el movimiento.** Los GIF se convierten en WebP optimizado con un póster representativo y el control **Ver animación / Detener**.
5. **Corregir sin ocultar el objetivo docente.** Fechas, prompts, licencias y afirmaciones absolutas se ajustan y quedan trazadas en `sources.json`.
6. **Pocas comprobaciones interactivas.** Se mantienen tres preguntas por tema; no se añade un test por diapositiva.

## Puerta de calidad para futuros temas

Un tema no pasa a `adaptada` o `revisada` hasta que:

- todas sus diapositivas tienen destino o una exclusión justificada;
- definición, mecanismo, ejemplo, límites y criterio de elección están presentes cuando existan en la fuente;
- cada figura con valor docente se conserva o se recrea de forma legible;
- las afirmaciones corregidas quedan registradas en `sources.json`;
- web, presentación y PDF se revisan con el mismo contenido fuente;
- el total de pantallas surge de las ideas, sin imponer un máximo artificial.
