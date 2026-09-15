# Ejercicios y laboratorios — especificación ejecutable

## 1. Cuestionarios

Ocho preguntas de respuesta única, tres opciones cada una. Orden fijo para poder relacionarlas con el PDF. No se envían respuestas a ningún servidor.

Contrato de datos por pregunta:

```json
{"id":"q01","sectionId":"tareas","prompt":"Necesitas contar coches y saber dónde está cada uno. ¿Qué salida necesitas?","options":[{"id":"a","text":"Una etiqueta para toda la imagen."},{"id":"b","text":"Una caja y una categoría por objeto."},{"id":"c","text":"Un vector de características sin localizaciones."}],"correctOptionId":"b","explanations":{"a":"Una etiqueta global no localiza cada coche ni proporciona su recuento.","b":"La detección devuelve instancias localizadas; puedes contar las cajas de la categoría coche.","c":"Un embedding puede ser útil como representación, pero por sí solo no devuelve las ubicaciones."}}
```

Cada widget usa `fieldset/legend`, radios con nombre único, botón «Comprobar», mensaje y «Reintentar». Hasta seleccionar, Comprobar está deshabilitado. Seleccionar no corrige ni cuenta intento. Comprobar incrementa intentos una vez; se bloquea hasta Reintentar. Reintentar conserva el histórico de intentos pero pone `checked:false`, `correct:false`, `selectedId:null`, borra selección y feedback. El recuento principal refleja estado actual, no suma puntos por clics repetidos. Recargar restaura selección, feedback y bloqueo si estaba comprobada.

Cada opción explica el porqué. Feedback anuncia «Correcto» o «Todavía no» con explicación específica, sin humillar y sin animación excesiva. Se puede volver a intentar sin límite. La solución está en el código y el PDF: autoevaluación, no evaluación certificada.

## 2. Banco de preguntas cerrado para la primera versión

### q01 · `tareas`

**Necesitas contar coches y saber dónde está cada uno. ¿Qué salida necesitas?**

- a. Una etiqueta para toda la imagen.
- b. Una caja y una categoría por objeto. **Correcta.**
- c. Un vector de características sin localizaciones.

Explicaciones: las del ejemplo JSON anterior.

### q02 · `una-etapa`

**¿Qué describe mejor la idea básica de un detector de una etapa?**

- a. Propone regiones y luego ejecuta una segunda etapa de clasificación sobre ellas.
- b. No necesita imágenes de entrenamiento.
- c. Predice localización y categoría mediante una ruta de detección de una etapa. **Correcta.**

Explicaciones: a describe detectores de dos etapas; b confunde arquitectura con entrenamiento; c distingue la organización del detector sin afirmar que todas las versiones tengan los mismos bloques.

### q03 · `matching`

**En DETR original, ¿para qué se usa la asignación bipartita durante el entrenamiento?**

- a. Para asociar predicciones y objetos reales uno a uno al calcular la pérdida. **Correcta.**
- b. Para ejecutar NMS sobre las cajas durante cada inferencia.
- c. Para convertir automáticamente imágenes en etiquetas de entrenamiento.

Explicaciones: a relaciona las predicciones con los objetivos para supervisarlas; b confunde entrenamiento e inferencia; c no corresponde a ese algoritmo, que utiliza anotaciones existentes.

### q04 · `iou`

**Dos cajas tienen un área de intersección de 40 y un área de unión de 100. ¿Cuál es su IoU?**

- a. 0.60.
- b. 0.40. **Correcta.**
- c. 2.50.

Explicaciones: a es el complemento, no el solapamiento relativo; b divide 40/100; c invierte la división y no puede ser una IoU válida.

### q05 · `precision-recall`

**Hay 3 TP, 1 FP y 2 FN. ¿Cuáles son la precisión y el recall?**

- a. Precisión 0.60; recall 0.75.
- b. Precisión 0.75; recall 0.75.
- c. Precisión 0.75; recall 0.60. **Correcta.**

Explicaciones: a intercambia denominadores; b calcula bien precisión pero olvida los 2 FN en recall; c usa 3/(3+1) y 3/(3+2).

### q06 · `umbral`

**Manteniendo fijas las predicciones candidatas, subes el umbral de confianza. ¿Qué ocurre con las cajas que superan el filtro?**

- a. Se conservan las mismas o menos cajas. **Correcta.**
- b. Se generan nuevas categorías de objetos.
- c. Aumenta necesariamente la IoU de todas las cajas restantes.

Explicaciones: a el filtro elimina puntuaciones inferiores al nuevo umbral; b un filtro no amplía vocabulario; c la confianza no cambia las coordenadas ni garantiza mayor solapamiento.

### q07 · `dominio`

**Tu checkpoint solo predice clases COCO y necesitas una categoría nueva de defecto industrial. ¿Qué decisión tiene más sentido?**

- a. Bajar mucho el umbral para crear la categoría que falta.
- b. Evaluar adaptación con datos etiquetados o un modelo adecuado al nuevo vocabulario. **Correcta.**
- c. Aumentar únicamente el tamaño de las cajas que ya predice.

Explicaciones: a el umbral no añade clases; b aborda el desajuste de vocabulario y requiere evaluación del dominio; c altera geometría, no enseña una categoría nueva.

### q08 · `evaluar`

**Un detector obtiene mejor AP en un benchmark publicado. ¿Basta para elegirlo para tu aplicación?**

- a. Sí, cualquier mejora de AP garantiza mejor resultado en producción.
- b. Sí, si es el modelo publicado más recientemente.
- c. No; hay que medir calidad y latencia con datos y condiciones representativos. **Correcta.**

Explicaciones: a el benchmark puede no representar el dominio ni los costes; b la fecha no sustituye una evaluación; c relaciona la elección con objetivos y restricciones medibles.

## 3. Laboratorio IoU · `iou`

Propósito: ver cómo cambia la superposición al desplazar una caja. SVG de 100×100 unidades con caja real fija `[20,20,60,60]` y predicha inicial `[40,20,80,60]`. Representación visual ampliada y textos «Referencia»/«Predicción», sin depender de rojo/verde.

Controles nativos: posición X de la esquina superior izquierda y posición Y, rango 0–60, paso 1; ancho y alto fijos 40. Botones «Coincidir» (x20,y20), «Separar» (x60,y60) y «Reiniciar» (x40,y20). Arrastre con ratón opcional fuera de alcance inicial; sliders cubren teclado y tacto.

Mostrar áreas, fórmula `IoU = intersección / unión`, resultado a dos decimales y frase «Aquí solo medimos solapamiento; falta considerar clase y correspondencia para evaluar una detección». Intersección sombreada con trama además de color. Resultado visual en vivo; anuncios para lector de pantalla al terminar el cambio, no una ráfaga por píxel.

Función pura `iou(a, b)` con cajas `[x1,y1,x2,y2]`: ancho/alto de intersección `max(0,min(x2)-max(x1))`, unión `areaA+areaB-intersection`; si unión cero devuelve 0 por convención de la demo. Rechazar coordenadas no finitas, invertidas y área cero en el validador de datos; función defensiva nunca devuelve NaN.

Casos de referencia: iguales → 1; separadas → 0; inicial → 800/2400 = 1/3. PDF: imprimir el estado inicial, sus áreas y valor 0.33; no depender del estado del último usuario.

## 4. Laboratorio de confianza · `umbral`

Propósito: diferenciar puntuación de confianza, IoU y métricas. Escena SVG didáctica 100×100; tres rectángulos etiquetados como coches, sin presentarlos como salidas de un modelo real. Mostrar rótulo visible «Ejemplo ilustrativo con predicciones fijas».

Datos inmutables:

| ID | Tipo | Clase | Caja | Puntuación |
|---|---|---|---|---:|
| g1 | referencia | car | [10,10,30,30] | — |
| g2 | referencia | car | [40,10,60,30] | — |
| g3 | referencia | car | [70,10,90,30] | — |
| p1 | predicción | car | [10,10,30,30] | 0.95 |
| p2 | predicción | car | [40,10,60,30] | 0.75 |
| p3 | predicción | car | [10,10,30,30] | 0.60 |
| p4 | predicción | car | [70,10,90,30] | 0.40 |
| p5 | predicción | car | [10,60,30,80] | 0.30 |

Slider confianza 0.00–1.00, paso 0.05, inicial 0.50. Criterio de filtro `score >= confidenceThreshold`. IoU de evaluación fija 0.50, visible, no editable en esta demo.

`evaluateDetections(groundTruth, predictions, confidenceThreshold, iouThreshold=0.5)`:

1. Filtrar puntuación; ordenar de mayor a menor, empate por ID.
2. Para cada predicción, buscar la referencia sin asignar de la misma clase con mayor IoU; empate por ID.
3. Si IoU ≥ umbral, asignar y contar TP. Si no, FP. Cada referencia se empareja como máximo una vez.
4. FN = referencias no asignadas. `precision = tp/(tp+fp)` o `null` si no hay predicciones; `recall = tp/(tp+fn)` o `null` si no hay referencias. Renderizar `null` como «— (no definido)», nunca NaN ni 100% inventado.
5. Devolver `{tp,fp,fn,precision,recall,matches}`; `matches` lista `{predictionId,groundTruthId:null|string,outcome:'tp'|'fp'}`.

Esta es una evaluación didáctica a un único umbral, no una implementación de COCO AP.

Resultados exigidos:

| Confianza mínima | TP | FP | FN | Precisión | Recall |
|---|---:|---:|---:|---:|---:|
| 0.30 | 3 | 2 | 0 | 0.60 | 1.00 |
| 0.50 | 2 | 1 | 1 | 0.67 | 0.67 |
| 0.75 | 2 | 0 | 1 | 1.00 | 0.67 |
| 1.00 | 0 | 0 | 3 | — | 0.00 |

Mostrar tabla de predicciones incluidas y motivo de cada FP: duplicado p3 o falta de correspondencia p5. Conservar la tabla textual debajo del SVG para accesibilidad. Texto de interpretación cambiante, sin afirmar monotonía universal de precisión. PDF muestra estado 0.50 y la tabla de los cuatro umbrales.

## 5. Persistencia, aislamiento y límites

`gradeAnswer(question, selectedId)` devuelve `{correct, explanation}` y rechaza una opción inexistente. `summarizeProgress(questions, answers)` devuelve `{answered, correct, total}` calculando únicamente IDs de la versión actual.

Dos contextos de navegador distintos deben tener estados independientes; no hay eventos de red para corregir. Si localStorage está deshabilitado, mostrar aviso discreto «El progreso se conserva durante esta visita» y mantener funcionalidad. Si el JSON guardado está corrupto o tiene otra versión, empezar limpio sin romper página.

Todas las demos se reinician a valores documentados en exportación PDF. Las soluciones van en apéndice con enlaces internos desde cada pregunta y número visible. Colab no se incrusta en iframe: se abre con enlace claramente rotulado en pestaña nueva y `rel="noopener noreferrer"`.
