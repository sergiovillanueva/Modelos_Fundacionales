# Estado de la migración

Actualizado: 15 de septiembre de 2026. Este archivo es el punto de reanudación; sobrescribir el resumen actual al finalizar cada lote y añadir una fila breve al historial.

## Próxima acción

- **Tema activo:** 03, Modelos multimodales.
- **Siguiente acción:** adaptar los lotes T3-A a T3-D, diapositivas 37–54 y `3_Multimodal.ipynb`.
- **Trabajo:** conservar la navegación actual; explicar desde cero relación texto-imagen, CLIP, BLIP, Grounding DINO y el VLM del notebook.

## Lo que existe

| Elemento | Estado real |
| --- | --- |
| Portada, logo, navegación y estilo | Rediseñados; conservar |
| Tema 01 | 26 pantallas: visión, familias, CNN, dos etapas, YOLO, DETR, RF-DETR, métricas, evaluación y Colab |
| Interacciones | Dos animaciones controlables, siete preguntas y simulación de IoU |
| Recursos | Diagramas relevantes del PPTX extraídos en `public/assets/tema-01/presentacion/` |
| Tema 01, `practica` | Enlace a `1_OD.ipynb` y tres pasos; no equivale a revisar o ejecutar el notebook |
| PDF tema 01 | Regenerado en `public/descargas/tema-01-deteccion.pdf`: 26 páginas A4 inspeccionadas |
| Tema 02 | 9 pantallas, 3 preguntas, Colab y PDF en `public/descargas/tema-02-hugging-face.pdf` |
| Temas 03–06 | Pendientes de adaptación |
| Inventario del PPTX | 94 diapositivas identificadas por orden, título y referencias a medios; sin revisión visual completa |

La implementación del tema 01 ha pasado `npm run build`, `npm run check`, `npm test`, `npm run test:e2e` y la captura visual de las 26 pantallas en escritorio, móvil y presentación. Esto prueba el funcionamiento local; no sustituye la revisión docente ni la comprobación de fuentes externas pendientes.

## Cobertura y fuentes

- Fuente: `../docs/Modelos-fundacionales-en-vision-artificial.pptx` desde `web/`.
- Registro por diapositiva: [COBERTURA.json](COBERTURA.json).
- Las diapositivas 4–30 están **adaptadas** con destinos explícitos. Ninguna está marcada como **revisada**: ese estado requiere contraste docente de cobertura y exactitud.
- `content/tema-01/sources.json` registra el origen de cada recurso, los cambios editoriales y las verificaciones pendientes.
- Las diapositivas generales 1–3 y 94 también tienen destino previsto, para que no desaparezcan del registro.
- La presentación contiene afirmaciones sobre versiones, licencias, benchmarks y arquitecturas que requieren comprobación antes de trasladarlas. Consultar las alertas del plan.

## Pendientes técnicos conocidos

1. Resolver o mantener documentadas las fuentes técnicas con estado `pending` en `sources.json`.
2. La web no guarda resultados tras recargar ni recoge respuestas del grupo. Mantener esta arquitectura estática.
3. Los notebooks originales están fuera de `web/` y no se modifican en este encargo. Registrar aquí cualquier incompatibilidad necesaria para la práctica.

## Material imprescindible que falta

Ninguno identificado para iniciar T1-A. No se han inspeccionado todos los medios del PPTX; no interpretar esto como garantía de calidad o disponibilidad de cada animación.

## Historial

| Fecha | Lote | Resultado | Evidencia y siguiente acción |
| --- | --- | --- | --- |
| 2026-09-15 | Preparación | Guía e inventario de 94 diapositivas; sin incorporar contenido nuevo a la web | Empezar T1-A |
| 2026-09-15 | T1-A a T1-I | Diapositivas 4–30 convertidas en 26 pantallas guiadas con recursos originales y actividades | Build, validación, tests, capturas y PDF A4 de 26 páginas comprobados; hacer revisión docente del tema 01 |
| 2026-09-15 | T2-A a T2-B | Diapositivas 31–36 convertidas en 9 pantallas sobre Hub, model cards, licencias e inferencia | Build, validación, tests y PDF A4 de 9 páginas comprobados; continuar tema 03 |

## Al cerrar un lote, actualizar

1. Qué diapositivas se adaptaron y en qué IDs de sección.
2. Qué conceptos faltan, qué recursos faltan y qué afirmaciones se corrigieron.
3. Comandos ejecutados y resultado real; rutas de capturas/PDF revisados.
4. Estado de la revisión docente, separado de los tests técnicos.
5. Un único siguiente lote, con una acción concreta para retomarlo.

No escribir «terminado» si quedan conceptos sin destino o errores abiertos. Si un recurso impide una parte del lote, describirlo con su diapositiva y continuar las partes independientes.
