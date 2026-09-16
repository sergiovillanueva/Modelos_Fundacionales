# Auditoría del tema 06 · Más visión

Fecha: 16 de septiembre de 2026.

## Alcance

- Fuentes cotejadas: diapositivas 80–93 del PPTX y del PDF, más las 27 celdas de `6_Otras_tareas.ipynb`.
- Cierre general: la diapositiva 94 se integra en la práctica final para evitar una pantalla vacía.
- Resultado: 19 pantallas, 3 preguntas conceptuales, 8 imágenes docentes, modo presentación, PDF A4 de 19 páginas y enlace a Colab.

## Recorrido

1. Panorama de seis tareas.
2. Pose: salida, pipeline top-down, enfoques, modelos, OKS, aplicaciones y oclusiones.
3. OCR: pipeline y elección de herramienta por tipo de salida.
4. Superresolución: resultado, usos y riesgo de detalle inventado.
5. Eliminación de fondo: máscara suave y canal alfa.
6. Image matching: detector, matcher y aplicaciones geométricas.
7. Profundidad: mapa monocular, aplicaciones y diferencia entre escala relativa y métrica.
8. Práctica en Colab con las cinco tareas implementadas por el notebook.

## Correcciones docentes

- Los enfoques de pose se presentan como compromisos dependientes del escenario; se retiraron rankings universales de velocidad y precisión.
- OKS se explica por escala y tolerancia de keypoint antes de evaluarlo.
- TrOCR se describe como reconocimiento end-to-end de regiones de texto; no como sustituto universal de detección, layout y comprensión documental.
- Swin2SR queda como ejemplo representativo y la web distingue nitidez de evidencia observada.
- RMBG se explica mediante máscara suave y canal alfa; se recuerda comprobar la licencia del checkpoint.
- SIFT y ORB no se declaran obsoletos; LightGlue se integra en un pipeline con detector y verificación geométrica.
- La web sigue Depth Anything V2, que es la versión usada en el notebook, y separa profundidad relativa de distancia en metros.

## Recursos omitidos a propósito

- Banner e iconos decorativos de Gamma.
- Imagen de OCR con marca de agua.
- Iconos repetidos de aplicaciones cuando el texto semántico resulta más claro y accesible.

## Evidencia

- `npm run build` y `npm run check`: correctos.
- `npm test`: 15 pruebas superadas.
- `npm run test:e2e`: 9 pruebas superadas.
- Revisión de 19 pasos a 1440 × 900, 390 × 844 y presentación 1280 × 720; comprobación adicional de desbordamiento a 320 px.
- PDF de 19 páginas renderizado e inspeccionado sin páginas vacías.
- Trazabilidad por sección en `content/tema-06/sources.json` y por diapositiva en `plan/COBERTURA.json`.

El notebook se ha leído y enlazado, pero no se han descargado sus modelos ni ejecutado sus inferencias durante esta migración.
