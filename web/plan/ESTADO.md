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
| Tema 01 · Detección | 40 pantallas: 27 diapositivas, 7 preguntas, 2 animaciones, 4 simulaciones, el puente al Hub y las tres salidas de RF-DETR |
| Tema 02 · Hugging Face | 13 pantallas fieles al PDF: 6 diapositivas, 3 preguntas, el comprobador de licencias, el constructor de pipeline y los Spaces para probar |
| Tema 03 · Multimodal | 23 pantallas fieles al PDF: 18 diapositivas, 3 preguntas y la similitud coseno en vivo |
| Tema 04 · DINO | 24 pantallas fieles al PDF: 16 diapositivas, 3 preguntas, el banco de normalidad, el comparador de atención, el PCA explicado y la inspección de la alfombra |
| Tema 05 · SAM | 15 pantallas fieles al PDF: 9 diapositivas, 3 preguntas, los prompts por puntos y el recorte sobre fondo negro |
| Tema 06 · Más visión | 21 pantallas fieles al PDF: 14 diapositivas, 3 preguntas, el laboratorio de OKS con escala, el de OCR y la verificación geométrica |
| Cobertura PPTX | 94/94 diapositivas con destino; las 91 de contenido trasladadas al completo |
| Fuentes | `content/tema-01/sources.json` a `content/tema-06/sources.json` |
| PDFs | Temas 01–06 disponibles y regenerados a plena opacidad: 46, 18, 28, 28, 18 y 26 páginas |

## Cuadernos de Colab revisados · 17 de septiembre

Primera revisión de los seis cuadernos desde que se grabaron. Copia intacta en `old/backup-2026-09-17/`.

**Lo que fallaba al ejecutar.** En el cuaderno 1, la comparación que cierra el fine-tuning cargaba el modelo entrenado y después llamaba al genérico, con las líneas del custom comentadas: enseñaba dos veces lo mismo. Ahora compara de verdad y avisa si todavía no hay checkpoint. La celda de entrenamiento comprobaba si existía el dataset de baloncesto, imprimía que no y entrenaba igual, así que reventaba desde dentro de `train()`; ahora se detiene con el enlace de Roboflow Universe y lo que tiene que haber en la carpeta. En el cuaderno 5, la plantilla del ejercicio tenía listas de coordenadas vacías que eran un error de sintaxis al descomentarlas.

**Lo que había envejecido.** `torch_dtype` quedó obsoleto en transformers 4.56 en favor de `dtype`: cambiado en los cuadernos 3 y 5. El resto de llamadas se cotejó una a una con la documentación vigente y están al día: SAM 2 con `Sam2Model` y `post_process_masks`, Grounding DINO con `threshold` y `text_threshold`, VitPose con su `dataset_index`, y el pipeline de profundidad. La carga de RMBG-1.4, que ejecuta código del propio repositorio, va ahora dentro de un `try` que explica la alternativa en vez de cortar la clase.

**Lo que se abre con GPU.** Ninguno declaraba acelerador, así que Colab los abría en CPU y Qwen2.5-VL o SAM 2.1 large eran inusables. Los seis llevan ya `accelerator: GPU` en su metadata y una insignia de Colab en la primera celda. El cuaderno 3 guardaba las salidas de siete celdas y pesaba 487 KB; limpio pesa 24 KB y el alumno no ve los resultados antes de ejecutar.

**Lo que se ha añadido**, sin tocar la estructura de ninguno:

| Añadido | Dónde | Por qué |
| --- | --- | --- |
| Deslizador del umbral con `ipywidgets` | 1 | Antes había que editar un número a mano |
| Anotadores de `supervision` | 1 | Tres líneas y el resultado se parece al de las demos |
| Foto con la cámara del portátil | 1 y 6 | Detectar sobre uno mismo, o sacar el esqueleto en clase |
| Segmentación y puntos clave de RF-DETR | 1 | Salieron después de grabar el curso |
| RF-DETR desde el Hub | 2 | El año pasado solo existía por el paquete de Roboflow |
| Nota sobre SAM 3 | 5 | Incorpora el texto como indicación propia y ahorra el apaño de encadenar Grounding DINO |

El cuaderno 4 ya tenía la línea de DINOv3 comentada con el aviso del token, así que se quedó como estaba.

**Cuadernos 5 y 6: mas amenos.** SAM 2.1 large descarga 1.796 MB y en clase eso se nota: el cuaderno 5 pasa a `small`, 369 MB, con registro para volver al grande en una linea. Ademas gana un selector de punto con deslizadores, que es la version de aula del clic del que habla el paper, y un recorte con transparencia que se pega sobre otra foto y se guarda como PNG. El cuaderno 6 gana tres cosas: la superresolucion comparada con zoom sobre un recorte, que es donde de verdad se aprecia; la foto levantada en 3D a partir del mapa de profundidad; y un corte de la escena por distancia, que es el desenfoque de retrato del movil explicado en cinco lineas. El fondo, ademas de quitarse, se sustituye por otro.

Las funciones nuevas que no dependen del modelo se probaron aqui con datos simulados: recorte, pegado, aritmetica del zoom, nube de puntos y corte por distancia.

**Cuaderno 4: DINOv3 y por que el PCA salia ruidoso.** El profesor reporta que la visualizacion PCA no se parece a las demos oficiales. Son tres causas acumuladas, y las tres estan corregidas:

1. **Tokens de registro.** DINOv3 coloca cuatro tokens de registro entre el CLS y los parches. El cuaderno cortaba por `[1:]`, asi que esos cuatro entraban en la rejilla y desplazaban la imagen entera. Ahora corta por `[1 + num_register_tokens:]`, que es lo que documenta transformers, y comprueba que el numero de parches cuadra con la rejilla antes de seguir.
2. **Tamaño de entrada.** La imagen entraba a resolucion original, que casi nunca es multiplo del tamaño de parche: el modelo descarta la franja sobrante y la rejilla calculada deja de corresponderse con los tokens. Ahora se redimensiona a un multiplo exacto.
3. **El fondo.** La causa mas visible. La primera componente principal separa objeto y fondo, asi que aplicando PCA a toda la imagen dos de las tres componentes se gastan en el cielo y la hierba. La receta de las demos es usar la primera componente como mascara y repetir el PCA solo con los parches del objeto. El cuaderno enseña las dos versiones una al lado de la otra, que es la mejor forma de explicarlo.

El cuaderno pasa a **DINOv3** con un registro de modelos, `ELEGIDO`, y respaldo automatico a DINOv2 si faltan las condiciones aceptadas o el token, que es lo habitual el primer dia. Ademas de arreglar el PCA, se reescribe para que se entienda que hay dentro: que devuelve el modelo token a token, la rejilla de parches dibujada sobre la foto, una matriz de similitud coseno entre cinco imagenes, correspondencias parche a parche entre dos fotos distintas, el PCA compartido entre varias imagenes y una deteccion de anomalias sobre la alfombra buena y la defectuosa, con banco de normalidad y umbral fijado sin mirar el defecto.

**Ensayo sin GPU.** Se probo el cuaderno entero con un torch simulado y rasgos falsos pero con estructura, para comprobar formas, reshapes y figuras. Aparecio un fallo de metodo que no daba error: al medir la pieza buena contra un banco que contiene sus propios parches, cada parche se encuentra a si mismo, la puntuacion sale cero y el umbral tambien, de modo que cualquier pieza se rechazaria. La funcion admite ahora `es_del_banco=True` y mira al segundo vecino mas parecido.

**Lo que aparecio al ejecutarlo en Colab.** El profesor probo el cuaderno 1 y salieron tres fallos, todos por la version nueva de `rfdetr`:

- `class_names` paso de diccionario a lista, asi que la celda que listaba las clases moria con `AttributeError: 'list' object has no attribute 'items'`.
- Peor y mas silencioso: las etiquetas salian corridas, una persona como `bicycle` y un coche como `motorcycle`. La causa es que en los modelos COCO el `class_id` es el identificador original del dataset, que llega a 90 con diez huecos (12, 26, 29, 30, 45, 66, 68, 69, 71 y 83), mientras que `class_names` solo tiene los 80 nombres seguidos. Indexar la lista con ese identificador desplaza todo. Ahora hay una funcion `nombres_de()` que lee `detections.data["class_name"]`, que es lo que el propio modelo adjunta ya resuelto, con respaldo por identificador para versiones antiguas y para modelos propios. Probada contra los cuatro casos posibles.
- `train()` dejo de traer sus dependencias: la celda instala `rfdetr[train,loggers]` si falta, y una nota avisa de reiniciar el entorno si aun asi falla.

Con el mismo criterio se reforzo el cuaderno 6, que daba por hecho que la persona era la clase 0 del detector: ahora filtra por nombre en `id2label`.

**Cuaderno 3: un VLM mas ligero y mas nuevo.** El profesor pidio bajar el peso de la descarga sin perder la deteccion con JSON, que es lo que mejor funciona de ese cuaderno, y despues si habia algo aun mas moderno. Tamaños reales consultados en el Hub: Qwen2.5-VL-3B descarga 7,51 GB, Qwen3-VL-2B 4,26 GB y Qwen3.5-2B 4,55 GB. Se queda Qwen3.5-2B, de febrero de 2026, cuya ficha declara que supera a los Qwen3-VL en comprension visual y cuya torre de vision es la misma. Generacion mas nueva hay, Qwen3.8 de agosto de 2026, pero su multimodal mas pequeño es de 27B y son 55,6 GB: no cabe en la GPU de Colab.

El cuaderno lleva ahora un registro de modelos y cambiar de uno a otro es cambiar la variable `ELEGIDO`, con Qwen3.5-2B, Qwen3-VL-2B y Qwen2.5-VL-3B preparados. Las celdas de Qwen2.5 se quedan ademas comentadas en su sitio. Una salvedad anotada en el propio cuaderno: el grounding con cajas esta documentado para Qwen3-VL, con cookbook oficial, y no para Qwen3.5, asi que si las detecciones salieran peor, volver es cambiar una palabra.

El cambio de version trae una trampa que confirma el cookbook oficial de Qwen: Qwen2.5-VL devolvia las cajas en pixeles absolutos y las familias nuevas las devuelven de 0 a 1000. Sin convertirlas, todas las detecciones se apelotonan en la esquina superior izquierda, y no salta ningun error. Por eso cada modelo del registro declara su convencion, `escalar_caja()` hace la conversion y avisa por pantalla cuando una caja se sale de la imagen, que es la señal de que la convencion elegida no es la que toca. El troceado del JSON se reescribio para aguantar salidas sin vallado, generaciones cortadas a medias y coordenadas invertidas; las funciones puras estan probadas contra esos seis casos.

**Sin ejecutar del todo.** Aqui no hay GPU ni librerias, asi que el resto de la revision es estatica: JSON valido, las 79 celdas de codigo compilan y cada API contrastada con su documentacion. Falta una pasada completa en Colab del fine-tuning del cuaderno 1 y de RMBG en el 6.

## El PDF salía lavado · 17 de septiembre

El profesor avisa de que los PDF se exportan borrosos. Eran dos cosas distintas y la primera es la que se veía.

**La causa principal.** Las pantallas entran con una animación, `lesson-enter`, que arranca en `opacity: .35`. Al imprimir, todas las secciones se muestran a la vez y cada una empieza su animación; el exportador congela la página en el fotograma cero, así que las **46 páginas del tema 1 salían al 35 % de opacidad**. Texto gris lavado, fotos desvaídas y sensación de borroso. Se desactiva la animación en `print.css` y el PDF sale a plena opacidad. Hay una prueba de navegador que comprueba que en medio `print` ninguna sección tiene animación y todas están a opacidad 1.

**La causa secundaria.** Diez imágenes se imprimían por debajo de 150 puntos por pulgada, la peor a 61, porque el maquetado las estiraba por encima de su resolución. Ninguna imagen se estira ya más allá de lo que da su fichero: los comparadores pasan a imprimirse en dos columnas con las dos imágenes enteras en vez de la cortina al 50 %, y hay topes de ancho para los pósteres de animación, la placa del OCR y la alfombra. Queda una sola imagen por debajo de 140 ppp, con mediana de 391.

Medido con un script que recorre las 156 pantallas en medio `print`, compara el ancho impreso en milímetros con el ancho real del fichero y ordena por resolución efectiva.

## Verificación geométrica y Spaces · 17 de septiembre

| Pantalla | Tema | Qué hace |
| --- | --- | --- |
| La mitad de las parejas sobran | 06 | El umbral de reproyección decide qué emparejamientos encajan con la escena. Cuatro son errores típicos y dos limítrofes se cuelan al abrir el umbral |
| Pruébalo ahora, sin instalar nada | 02 | Seis enlaces comprobados a Spaces y a páginas de tarea, el reto de diez minutos y el aviso de no subir imágenes de cliente a un Space público |

La homografía de la pantalla de matching es real, calculada con `getPerspectiveTransform`, y el error de reproyección de cada pareja lo calcula el navegador con `src/lib/matching.js`. De los Spaces que se probaron, los de YOLO-World y OWLSAM estaban caídos, así que los enlaces apuntan a las páginas de tarea salvo dos demos que sí funcionaban: eso mismo se explica en la pantalla.

Pruebas: **75 unitarias** y **41 de navegador**. Auditoría de las 156 pantallas en escritorio y móvil sin incidencias.

## Laboratorios nuevos y explicaciones · 17 de septiembre

Encargo del profesor: que la pantalla de coseno no tenga todos los textos en el mismo radio y se vean grupos, explicar mejor de dónde salen los colores de DINO, un detector de pieza buena y pieza mala, dar una vuelta a la pantalla de pose, algo más en OCR y más casos de uso en general.

| Pantalla | Tema | Qué cambia |
| --- | --- | --- |
| Gana el texto más cercano | 03 | Los cuatro textos pasan a longitudes distintas y a dos grupos. Gana «un gato» por ángulo aunque «un perro» esté casi tres veces más cerca en línea recta |
| De 768 números a un color | 04 | Pantalla nueva: los cuatro pasos de parche a PCA a color, y por qué el ala del avión sale del color del ala del pájaro |
| Aceptar o rechazar la pieza | 04 | Laboratorio nuevo con dos fotos reales de alfombra: el umbral decide entre falsa alarma y defecto que se escapa |
| El mismo error no penaliza igual | 06 | Gana la escala de la persona como segundo control y el veredicto con umbral 0,50 |
| Lo que devuelve cada generación de OCR | 06 | Laboratorio nuevo sobre la serigrafía de una placa: texto suelto, texto con coordenadas o campos estructurados |
| La misma familia hace tres cosas | 01 | Pantalla nueva: RF-DETR ya trae segmentación y puntos clave, con la misma llamada y un ejercicio de una foto |

Dos decisiones de honestidad, con el mismo criterio que las máscaras de GrabCut del tema 05. Las puntuaciones de la alfombra salen de un descriptor clásico de intensidad y gradiente, no de DINO, y cada celda buena se compara con las demás celdas buenas y nunca consigo misma; con ese descriptor la pieza buena llega a 1,28 y la defectuosa a 1,89, margen suficiente para la lección y estrecho para que se vea por qué conviene DINOv2. Las cajas del OCR están medidas a mano sobre la foto para enseñar el formato de salida. Las dos pantallas lo declaran en su pie.

Componentes nuevos: `mode-switch` conmuta bloques de salida y una capa opcional sobre la imagen, y lo usan el laboratorio de OCR y el de las tres salidas de RF-DETR; `anomaly-map` pinta el mapa de anomalía y aplica el umbral. Lógica nueva con pruebas en `src/lib/inspection.js` y `src/lib/embeddings.js`.

Pruebas: **71 unitarias** y **39 de navegador**. Auditoría de las 154 pantallas en escritorio y móvil sin incidencias.

## Costura entre el tema 01 y el tema 02 · 17 de septiembre

El profesor plantea si este curso conviene dar Hugging Face antes que detección, ahora que RF-DETR ya está publicado en el Hub. Se mantiene el orden y se arregla lo que de verdad chirriaba, que era el salto entre los dos temas.

Qué pasaba: el tema 01 no nombraba Hugging Face ni una vez y cargaba el detector con el paquete `rfdetr`; dos temas después el alumno aprendía a cargar un detector con `pipeline`, sin que nadie dijera que son la misma cosa por dos caminos.

- Pantalla nueva al final del tema 01, «¿De dónde han salido esos pesos?»: las dos vías de carga del mismo RF-DETR, la del paquete y la del Hub, con el identificador `Roboflow/rf-detr-medium` y su licencia. Cierra preguntando lo que abre el tema 02.
- El constructor de pipeline del tema 02 gana la detección cerrada con `PekingU/rtdetr_r50vd`, que es la tarea que enlaza hacia atrás con el tema 01.
- Corregido un identificador del original: `facebook/rt-detr-l` no existe en el Hub. Se sustituye por `PekingU/rtdetr_r50vd`, el punto de control oficial de RT-DETR, también Apache 2.0.

Por qué no se cambia el orden de los temas: la dependencia va en un solo sentido. El tema 02 está construido sobre el vocabulario del 01, su ejemplo central de `pipeline` es detección y seis de sus nueve candidatos solo significan algo si ya sabes qué es una caja. Además el tema 02 abre con una diapositiva numerada, «2. El ecosistema de modelos de IA», y toda la web está documentada como recorrido fiel del PDF, así que invertir obligaría a renumerar el mazo y a rehacer la correspondencia en `COBERTURA.json` y en los seis `sources.json`.

Pruebas: **59 unitarias** y **34 de navegador**. Auditoría de las 150 pantallas en escritorio y móvil sin incidencias.

## Tres pantallas interactivas · 17 de septiembre

Encargo del profesor: un deslizador entre la foto y su segmentación sobre fondo negro, algo con gracia en el tema de Hugging Face y una pantalla nueva en DINO.

| Pantalla | Tema | Qué se manipula |
| --- | --- | --- |
| Qué devuelve exactamente una máscara | 05 | Una cortina quita el fondo y deja las cuatro instancias recortadas con su contorno |
| La atención, encima de la foto | 04 | Tres escenas y una cortina entre la imagen y el mapa de atención del modelo |
| Arma tu pipeline | 02 | Cuatro tareas y dos dispositivos componen el código de `pipeline` que se copia |

La imagen segmentada del tema 05 se compone multiplicando la foto por la unión de las máscaras de GrabCut que ya usaba el laboratorio de indicaciones, así que no aparece ninguna fuente nueva. De paso se recalculó la máscara de la piña, cuya caja estaba mal situada y recortaba las botellas del fondo.

Los seis recortes del tema 04 salen de la figura que ya estaba en la diapositiva 64: cada par es una casilla de foto y la casilla de atención contigua, recortadas sin retocar.

El constructor del tema 02 genera el código en `src/lib/pipeline.js`, con cinco pruebas unitarias. Los cuatro modelos que ofrece existen en el Hub y las dos tareas de clases abiertas son las que aceptan `candidate_labels`, que es justo lo que distingue un modelo fundacional de un clasificador cerrado.

Componentes nuevos: `scene-compare` cambia el par de imágenes de cualquier comparador, y `pipeline-lab` rehace el bloque de código sin tocar el botón de copiar.

Pruebas: **58 unitarias** y **34 de navegador**. Auditoría de las 149 pantallas en escritorio y móvil sin incidencias.

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

## Bloque práctico del 17 de septiembre

Encargo del profesor: menos teoría y más práctica, con cosas sencillas y aplicaciones reales. El contenido del PDF se mantiene íntegro; lo que cambia es que ahora cada tema termina con pantallas que se usan, no que se leen.

**21 pantallas nuevas**, de 126 a 146 en total:

| Tipo | Dónde | Qué hace |
| --- | --- | --- |
| Receta copiable | los seis temas | El código mínimo de cada tema, sacado de su cuaderno, con botón de copiar |
| Checklist | los seis temas | Seis a ocho comprobaciones antes de llevar algo a producción; se imprime bien |
| Presupuesto de anotación | 01 | Clases, imágenes y segundos por imagen a horas y jornadas |
| Tu caso | 01 | Cuatro escenarios reales y hacia dónde mover el umbral en cada uno |
| ¿Me cabe en la GPU? | 02 | Parámetros y precisión a memoria de inferencia, con cinco tarjetas concretas |
| Candidatos reales | 02 | Nueve modelos de visión del Hub, filtrables por tarea y licencia |
| Taller de prompts | 03 | Dos prompts que fallan en clase y su arreglo |
| Asistente de modelo | 03 | Dos preguntas y sale CLIP, BLIP, Grounding DINO o VLM con su línea de código |
| Montaje de anomalías | 04 | Los seis pasos de PatchCore como guía operativa |
| ¿Qué versión de SAM? | 05 | Medio e indicación deciden entre SAM 1, 2 y 3 |

La escena sintética de la furgoneta del tema 05 se retira. En su lugar, `segmentar` usa **una foto real** del material del curso y máscaras precalculadas con GrabCut a partir de una caja. Cambiando la indicación se ve la diferencia entre un prompt de instancia y uno de concepto, que es lo que separa SAM 1 de SAM 3. La pantalla declara que las máscaras no las produjo SAM.

Componentes nuevos reutilizables: `copy-code` para cualquier bloque de código, `chooser` para los tres asistentes, `calc-layout` para las dos calculadoras, `checklist` y `model-table`.

Tres fallos reales que destaparon las pruebas al escribirlas:

- Los botones del selector de máscaras también llevaban `data-mask`, así que el módulo los trataba como capas.
- En la tabla de modelos, `display: grid` en la fila ganaba al `display: none` del atributo `hidden`: el contador filtraba pero no se ocultaba ninguna fila.
- El formateador de números tenía razón y el HTML estático no: en español un número de cuatro cifras va sin separador de millar.

Pruebas: **53 unitarias** y **32 de navegador**. Auditoría de las 146 pantallas en escritorio y móvil sin incidencias. PDF regenerados: 44, 15, 28, 24, 17 y 22 páginas.

## Corrección: los laboratorios cambiaban de tamaño al mover su control

El profesor señaló que el deslizador del umbral no iba suave y que a media carrera parecía haber un redimensionado. Lo había: **la rejilla del laboratorio cambiaba de ancho** según el texto del mensaje. Medido en el tema 01, `equilibrio` pasaba de 507 + 304 px a 420 + 252 px y volvía a 521 + 313 px, así que la escena SVG se recalculaba y daba un salto de 25 px.

Causa: `margin: 28px auto 0` sobre un hijo de una sección en columna flexible. El margen automático desactiva el estirado y el elemento pasa a medir su contenido, de modo que el ancho dependía de la frase más larga del mensaje. Es el mismo fallo que ya se había corregido en `slide-split`.

Arreglo: ancho definido con `width: min(900px, 100%)` en `lab-layout`, sus variantes y `iou-lab`. Además, `lab-message` reserva dos líneas, que es lo máximo que ocupan los mensajes en móvil, para que el bloque tampoco crezca en vertical.

Afectaba a los siete laboratorios con deslizador, no solo al del umbral. Medidos todos en escritorio y móvil: ninguno cambia de tamaño al recorrer su control.

Queda una prueba de regresión en `tests/labs.spec.mjs` que recorre los siete y compara tamaño y posición dentro de su pantalla. Mide relativo a la sección porque enfocar el control puede desplazar el scroll de la página, algo que confundió la primera versión de la prueba.

Pruebas: 46 unitarias y 27 de navegador. PDF regenerados.

## Repaso e interactivos del 17 de septiembre

Encargo: revisar el conjunto y añadir cosas manipulables, en concreto un comparador deslizante entre una imagen y su mapa de profundidad.

Cuatro pantallas nuevas, todas con lógica propia y pruebas:

| Pantalla | Tema | Qué hace |
| --- | --- | --- |
| `profundidad` | 06 | Comparador deslizante entre la foto de la carretera y su mapa de profundidad, sobre el mismo encuadre |
| `superresolucion` | 06 | Comparador deslizante entre la interpolación bicúbica y la salida de Swin2SR |
| `nms` | 01 | Umbral de supresión de no-máximos sobre cinco cajas candidatas y dos coches solapados |
| `cuadricula` | 01 | Cuadrícula S × S de YOLO y qué celda se responsabiliza de cada objeto |

El comparador (`compare-media`) es un componente reutilizable: cortina con `clip-path`, deslizador accesible y arrastre sobre la propia imagen. Funciona en las tres salidas, y en papel imprime las dos mitades.

Dos cosas que descubrieron las pruebas y que se han incorporado a la enseñanza:

- **El umbral de NMS no tiene valor universal.** Con 0,20 la caja del primer coche suprime la del segundo y se pierde un objeto real; con 0,80 sobreviven las cinco. Es justo el argumento de la diapositiva 16 contra los componentes ad-hoc.
- **Subir S no garantiza separar objetos cercanos.** Con 7 × 7 los tres centros tienen celda propia, pero con 8 × 8 y con 12 × 12 dos vuelven a caer juntos, porque lo que decide es dónde quedan las líneas. Está recogido en el detalle impreso.

Auditoría automática de las **126 pantallas** en escritorio y móvil: sin desbordamientos, sin imágenes rotas, sin texto alternativo ausente, sin enlaces vacíos y sin pantallas desproporcionadas. Marcó dos pantallas con muy poco texto visible (`progreso` y `dinov3-mapas`), que ahora llevan un pie que orienta la mirada.

Estado de las pruebas: **46 unitarias** y **25 de navegador**, todas correctas. PDF regenerados.

## Traslado literal de los temas 04, 05 y 06 · 17 de septiembre

Con estos tres, **las 94 diapositivas del PDF están en la web con su texto completo**. Cada diapositiva ocupa una pantalla; los ejercicios y las simulaciones van en pantallas propias intercaladas.

| Tema | Diapositivas | Pantallas | Extras intercalados |
| --- | --- | --- | --- |
| 04 · DINO | 55–70 (16) | 21 | 3 preguntas, banco de normalidad, 5 animaciones, Colab |
| 05 · SAM | 71–79 (9) | 14 | 3 preguntas, prompts por puntos, 1 animación, Colab |
| 06 · Más visión | 80–93 (14) | 19 | 3 preguntas, laboratorio de OKS, Colab |

Dos pantallas nuevas, las dos con matemática real y tests:

- **`oks` (tema 06)** hace manipulable lo que afirma la diapositiva 83. Mueves el error de predicción y comparas ojo, muñeca y cadera con las sigmas publicadas de COCO. Con 5 px sobre una persona de 150 px de escala, el ojo cae a 0,80 y la cadera se queda en 0,99: el mismo error en píxeles, cuatro veces más penalizado en un punto rígido.
- **`normalidad` (tema 04)** hace manipulable el paso 6 de la diapositiva 70. Alejas un parche de test del banco de normalidad y ves cómo su distancia al vecino más cercano cruza el umbral. El banco no contiene ni un ejemplo de defecto, que es justo el punto del método.

Ambas declaran en pantalla que el espacio es esquemático y calculan sus cifras en `src/lib/keypoints.js` y `src/lib/anomaly.js`, con 13 pruebas unitarias nuevas.

Comprobaciones: 34 pruebas unitarias y 21 de navegador correctas. Capturas de los tres temas en escritorio, móvil y presentación. PDF regenerados con una página por pantalla: 21, 14 y 19 páginas.

Verificador de fidelidad: `scripts` locales comparan frase a frase el PDF con la web. Las diferencias que quedan en los seis temas son erratas del original corregidas, normalizaciones de plural y artefactos de extracción de glifos matemáticos, más el identificador de modelo de la diapositiva 36 que no resuelve en el Hub.

Verificador de títulos y rótulos: el anterior solo compara frases de 45 caracteres o más, así que se añadió un segundo cotejo que saca la primera forma de texto de cada `ppt/slides/slideN.xml` y la contrasta con el `h2` de su sección, más un tercero que busca cada párrafo corto del PPTX dentro de la sección que le corresponde. De 90 títulos coinciden 86. Los cuatro restantes son decisiones tomadas: `rf-detr-flujo` y `dinov3-denso` desambiguan títulos que el mazo repite en dos diapositivas seguidas, y `evolucion` y `motor-datos` traducen al español los dos únicos títulos que el mazo dejó en inglés. De 450 rótulos cortos faltan 32 en su sección, todos por numeración que la web genera con `ol`, por la corrección de erratas (hyperparámetros, re-entrenar) o por la nota «*GIF Animado» que el mazo se dejó escrita.

## Traslado literal de los temas 02 y 03 · 17 de septiembre

Mismo criterio que el tema 01: una pantalla por diapositiva, con su título y su texto completo, y los ejercicios en pantallas propias intercaladas.

| Tema | Diapositivas | Pantallas | Extras intercalados |
| --- | --- | --- | --- |
| 02 · Hugging Face | 31–36 (6) | 11 | 3 preguntas, comprobador de licencias, Colab |
| 03 · Multimodal | 37–54 (18) | 23 | 3 preguntas, simulación de similitud coseno, Colab |

Añadido en el tema 02: **comprobador de licencias** (`comprobar`). Cruza ocho licencias con cuatro casos de uso y responde permitido, permitido con condiciones o no permitido, con el motivo concreto. La tabla codifica lo que dice la diapositiva 34 y se comprueba con seis pruebas unitarias en `tests/licensing.test.mjs`. Se presenta como orientación para buscar modelo, nunca como asesoramiento legal, y la pantalla lo dice.

Conservado del trabajo anterior: la simulación de similitud coseno del tema 03 pasa a acompañar a la diapositiva 42, que es justo donde el PDF explica el cálculo de similitud. La gráfica comparativa de la diapositiva 53 vuelve a la pantalla, junto a la regla de decisión rápida.

Componentes nuevos: `slide-callout` para los avisos destacados de una diapositiva, los estados `is-ok`, `is-warn` e `is-stop` de `note-grid`, y `stage-list--four` para las filas de cuatro pasos.

Comprobaciones: `npm run build`, `npm run check` y `npm test` correctos con 21 pruebas unitarias; `npm run test:e2e` correcto con 18; capturas de los dos temas en escritorio, móvil y presentación; PDF de cada tema regenerado, con una página por pantalla en ambos.

Pendiente: los temas 04, 05 y 06 siguen en su versión resumida.

## Traslado literal del tema 01 · 17 de septiembre

Encargo del profesor: la web debe llevar el contenido del PDF de origen, no un resumen, con ejercicios y animaciones intercalados. El tema 01 ya está así y queda como modelo; la regla está escrita en [INSTRUCCIONES.md](../INSTRUCCIONES.md), sección «Fidelidad al PDF».

- Las diapositivas 4 a 30 ocupan **27 pantallas**, una por diapositiva, con su título y su texto completo.
- Entre medias hay **9 pantallas propias**: siete preguntas, la simulación de umbral y el paso de Colab. El laboratorio de IoU acompaña ahora al texto y a la fórmula de la diapositiva 24 en la misma pantalla.
- Total: **36 pantallas**, 7 preguntas, 2 animaciones y 2 simulaciones.
- Recuperada del PPTX la imagen de la fórmula de IoU (`image-24-1.jpeg`), que faltaba en la web.
- Se omiten iconos decorativos, la marca de agua de Gamma y el meme de la diapositiva 16.

Componentes nuevos en `widgets.css` para trasladar diapositivas: `slide-lead`, `slide-prose`, `slide-split`, `note-grid`, `stage-list`, `formula` y `slide-subtitle`.

Los tres formatos siguen cuadrando. En presentación, `src/js/presentation.js` mide cada diapositiva y la reduce lo justo para caber en 1280 × 720, de modo que una diapositiva densa ya no se corta. En papel, el PDF del tema pasa de 26 a **37 páginas**: 35 secciones ocupan una página y solo `iou`, la más densa, usa dos sin cortar contenido.

Comprobaciones: `npm run build`, `npm run check` y `npm test` correctos con 15 pruebas unitarias; `npm run test:e2e` correcto con 17; `node tests/visual-check.mjs 01-deteccion` recapturado en escritorio, móvil y presentación; PDF del tema regenerado y revisado página a página.

Pendiente: los temas 02 a 06 siguen en su versión resumida. Si el profesor quiere el mismo traslado, se repite el proceso tema a tema con estos componentes.

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

1. Los notebooks se revisaron y actualizaron el 17 de septiembre de 2026, con copia en `old/backup-2026-09-17/`, pero no se han ejecutado: los modelos pesados siguen en Colab y hace falta una pasada allí antes de clase.
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
| 2026-09-17 | Títulos y rótulos | Cuatro encabezados devueltos a la letra del mazo, subtítulo de la diapositiva 64 recuperado y nombres YOLOv1 a YOLOv9 en la línea de tiempo |
| 2026-09-17 | Interactivos | Comparador de máscara sobre fondo negro, comparador de atención con tres escenas y constructor de pipeline |
| 2026-09-17 | Costura 01–02 | Puente al Hub al final del tema 01, detección cerrada en el constructor y un identificador de modelo corregido |
| 2026-09-17 | Laboratorios | Coseno con grupos y longitudes, PCA explicado, inspección de alfombra, pose con escala, OCR de placa y las tres salidas de RF-DETR |
| 2026-09-17 | PDF y matching | Arreglada la opacidad y la resolución de los PDF, verificación geométrica en el tema 06 y Spaces comprobados en el tema 02 |
| 2026-09-17 | Cuadernos | Seis cuadernos revisados: tres fallos de ejecución, `dtype` nuevo, GPU por defecto, cámara, deslizador y celdas de RF-DETR |
| 2026-09-17 | Cuaderno 1 | Arreglado con lo visto al ejecutar: nombres de clase por identificador COCO, listado de clases y dependencias de entrenamiento |
| 2026-09-17 | Cuaderno 3 | Qwen3.5-2B en lugar de Qwen2.5-VL-3B: 4,55 GB frente a 7,51 GB, registro de modelos y conversion de coordenadas 0-1000 |
| 2026-09-17 | Cuaderno 4 | DINOv3 con respaldo a DINOv2, PCA sin ruido, correspondencias entre parches y deteccion de anomalias con la alfombra |
| 2026-09-17 | Cuadernos 5 y 6 | SAM small por defecto, deslizador de punto y recorte pegable; zoom en superresolucion, nube de puntos 3D y corte por distancia |
| 2026-09-18 | Dominio | `datamecum.sergiovillanuevalopez.com` como dominio del Worker, declarado junto al apex en `wrangler.json` |
| 2026-09-18 | Icono de marca | Favicon con el simbolo de Datamecum en 32, 180 y 512 px mas `.ico`, enlazado en las cinco plantillas |
| 2026-09-18 | Cuaderno 5 | Qwen3.5-2B en la parte de Qwen + SAM: 4,55 GB frente a 7,51 GB, con la conversion de coordenadas 0-1000 que necesita SAM |

## Al modificar un tema

1. Cotejar únicamente las diapositivas, recursos y notebook afectados.
2. Registrar secciones y correcciones en `COBERTURA.json` y `content/tema-XX/sources.json`.
3. Ejecutar build, validación y las pruebas proporcionadas al cambio.
4. Revisar web, móvil, presentación y regenerar el PDF del tema.
5. Limpiar capturas, extracciones y resultados temporales antes de entregar.
