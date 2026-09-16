# Estado de la migración

Actualizado: 16 de septiembre de 2026. Este archivo es el punto de reanudación.

## Próxima acción

- **Temas revisables:** 01–05.
- **Siguiente tema pendiente:** 06, otras tareas de visión, diapositivas 80–93 y `6_Otras_tareas.ipynb`.
- **Antes de continuar:** el profesor puede revisar la nueva densidad de los temas 02–05. No reducirlos otra vez para ahorrar pantallas.

## Estado real

| Elemento | Estado |
| --- | --- |
| Portada, logo, navegación y estilo | Conservados; una idea por pantalla |
| Tema 01 · Detección | 26 pantallas, 7 preguntas, 2 animaciones, IoU y Colab |
| Tema 02 · Hugging Face | 12 pantallas, 3 preguntas, 2 recursos y Colab |
| Tema 03 · Multimodal | 19 pantallas, 3 preguntas, 9 recursos y Colab |
| Tema 04 · DINO | 20 pantallas, 3 preguntas, 5 animaciones, 9 imágenes y Colab |
| Tema 05 · SAM | 14 pantallas, 3 preguntas, 1 animación, 5 imágenes y Colab |
| Tema 06 · Más visión | Pendiente |
| Cobertura PPTX | Diapositivas 4–79 con destino; 31–79 reauditas contra PPTX y PDF |
| Fuentes | `content/tema-01/sources.json` a `content/tema-05/sources.json` |
| PDFs | Temas 01–05 disponibles; 02–05 regenerados e inspeccionados tras la ampliación |

## Auditoría de los temas 02–05

La versión anterior resumía 49 diapositivas del PPTX en 34 pantallas y solo conservaba ocho imágenes. La revisión actual recupera mecanismo, arquitectura, límites, elección y recursos fuente sin cambiar la interfaz general. El detalle completo está en [AUDITORIA-TEMAS-02-05.md](AUDITORIA-TEMAS-02-05.md).

Correcciones docentes registradas:

- Las licencias se revisan por artefacto y versión; se retiraron conclusiones jurídicas absolutas.
- CLIP, BLIP, Grounding DINO y VLM se distinguen por su salida.
- DINOv2 se fecha en 2023 y DINOv3 en 2025; la web no presenta atención como máscara garantizada.
- SAM 1, 2 y 3 tienen prompts y capacidades distintas; SAM 1 no se presenta con texto nativo.
- Umbrales, rendimiento y hardware se validan en el dominio en lugar de darse como reglas universales.

## Evidencia técnica de esta revisión

- `npm run build`: correcto.
- `npm run check`: correcto.
- Auditoría Playwright de todos los pasos de los temas 02–05 a 1440 × 900, 390 × 844 y 1280 × 720: sin desbordamientos.
- Seis animaciones nuevas: reproducción y parada comprobadas.
- PDF 02: 12 páginas; PDF 03: 19; PDF 04: 20; PDF 05: 14. Todas inspeccionadas y sin páginas en blanco.
- Capturas representativas en `tmp/visual-audit/` durante la revisión; la carpeta es temporal y no se publica.
- PPTX y PDF cotejados diapositiva a diapositiva para 31–79.

Esto demuestra que la implementación local carga y cabe. La revisión docente del profesor sigue siendo la aceptación final del guion.

## Pendientes concretos

1. Los notebooks se enlazan pero no se han ejecutado ni modificado; los modelos pesados siguen en Colab.
2. No hay almacenamiento de respuestas, cuentas ni resultados compartidos; la web permanece estática.

## Historial

| Fecha | Lote | Resultado |
| --- | --- | --- |
| 2026-09-15 | Preparación | Guía e inventario de 94 diapositivas |
| 2026-09-15 | T1-A a T1-I | Diapositivas 4–30 en 26 pantallas, actividades y PDF |
| 2026-09-15 | Primera pasada T2–T5 | Adaptación demasiado resumida; quedó señalada para auditoría |
| 2026-09-16 | Auditoría T2–T5 | Diapositivas 31–79 recuperadas en 65 pantallas con 27 recursos fuente y correcciones registradas |

## Al cerrar el siguiente lote

1. Registrar cada diapositiva y sus secciones en `COBERTURA.json`.
2. Registrar recursos, correcciones y fuentes en `content/tema-XX/sources.json`.
3. Ejecutar build, validación y revisión visual proporcionada al alcance del cambio.
4. Regenerar e inspeccionar el PDF del tema.
5. Actualizar este archivo con un único siguiente paso.

No escribir «terminado» si quedan conceptos sin destino, medios sin inspeccionar o PDF sin revisar.
