# Estado de la migración

Actualizado: 15 de septiembre de 2026. Este archivo es el punto de reanudación; sobrescribir el resumen actual al finalizar cada lote y añadir una fila breve al historial.

## Próxima acción

- **Tema activo:** 01, Detección de objetos.
- **Siguiente lote:** T1-A, diapositivas 4–6.
- **Trabajo:** completar el contexto de visión, distinguir las salidas de las tareas y explicar caja, categoría y confianza. Reutilizar `inicio` y `tareas`; añadir los pasos que falten antes de avanzar a arquitecturas.
- **Primera lectura:** filas 4–6 de `COBERTURA.json`, esas diapositivas del PPTX/PDF, `content/tema-01/sections.html` y `questions.json`.
- **Revisión posterior:** ejecutar las comprobaciones del lote, actualizar cobertura y dejar T1-B como siguiente. No empezar el tema 02.

## Lo que existe

| Elemento | Estado real |
| --- | --- |
| Portada, logo, navegación y estilo | Rediseñados; conservar |
| Tema 01, `inicio` | Explicación inicial de detección; cobertura parcial de la diapositiva 6 |
| Tema 01, `tareas` | Animación y pregunta q01; cobertura parcial de la diapositiva 5 |
| Tema 01, `iou` | Simulación de solapamiento; cobertura parcial de la diapositiva 24 |
| Tema 01, `practica` | Enlace a `1_OD.ipynb` y tres pasos; no equivale a revisar o ejecutar el notebook |
| PDF tema 01 | Cuatro páginas de la introducción actual; crecerá con el contenido |
| Temas 02–06 | Solo metadatos y navegación; sin contenido |
| Inventario del PPTX | 94 diapositivas identificadas por orden, título y referencias a medios; sin revisión visual completa |

La revisión previa del diseño pasó 10 pruebas unitarias y 8 pruebas de navegador. Es evidencia de aquella versión, no una validación anticipada de los próximos lotes ni de la exactitud de todo el PowerPoint.

## Cobertura y fuentes

- Fuente: `../docs/Modelos-fundacionales-en-vision-artificial.pptx` desde `web/`.
- Registro por diapositiva: [COBERTURA.json](COBERTURA.json).
- Las diapositivas 5, 6 y 24 se han marcado como **parcial** por las secciones actuales. El resto necesita adaptación o tratamiento editorial; ninguna está marcada como revisada por el mero hecho de haberla inventariado.
- Las diapositivas generales 1–3 y 94 también tienen destino previsto, para que no desaparezcan del registro.
- La presentación contiene afirmaciones sobre versiones, licencias, benchmarks y arquitecturas que requieren comprobación antes de trasladarlas. Consultar las alertas del plan.

## Pendientes técnicos conocidos

1. `export-pdf.mjs` y `visual-check.mjs` trabajan con el tema 01; ampliar antes de activar otro tema.
2. `course.spec.mjs` conoce cuatro secciones y su orden. Al añadir pasos, adaptar las expectativas conservando las comprobaciones de comportamiento; no desactivar tests para que pasen.
3. La web no guarda resultados tras recargar ni recoge respuestas del grupo. Mantener esta arquitectura estática.
4. Los notebooks originales están fuera de `web/` y no se modifican en este encargo. Registrar aquí cualquier incompatibilidad necesaria para la práctica.

## Material imprescindible que falta

Ninguno identificado para iniciar T1-A. No se han inspeccionado todos los medios del PPTX; no interpretar esto como garantía de calidad o disponibilidad de cada animación.

## Historial

| Fecha | Lote | Resultado | Evidencia y siguiente acción |
| --- | --- | --- | --- |
| 2026-09-15 | Preparación | Guía e inventario de 94 diapositivas; sin incorporar contenido nuevo a la web | Empezar T1-A |

## Al cerrar un lote, actualizar

1. Qué diapositivas se adaptaron y en qué IDs de sección.
2. Qué conceptos faltan, qué recursos faltan y qué afirmaciones se corrigieron.
3. Comandos ejecutados y resultado real; rutas de capturas/PDF revisados.
4. Estado de la revisión docente, separado de los tests técnicos.
5. Un único siguiente lote, con una acción concreta para retomarlo.

No escribir «terminado» si quedan conceptos sin destino o errores abiertos. Si un recurso impide una parte del lote, describirlo con su diapositiva y continuar las partes independientes.
