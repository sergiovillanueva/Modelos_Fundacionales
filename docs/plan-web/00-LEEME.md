# Plan del curso web — empezar aquí

Fecha: 15 de septiembre de 2026. Autor del curso: Sergio Villanueva.

## Estado y encargo

Este paquete es una planificación, no una web implementada. El profesor pide preparar un curso público, visual e interactivo a partir de Gamma, implementando solamente el tema 1. Los temas 2–6 tendrán metadatos y estado «Próximamente», sin lecciones, ejercicios ni páginas de contenido. Se revisará y pulirá el tema 1 antes de ampliarlo.

La planificación incluye decisiones operativas para ejecutar después con un modelo más sencillo. No se han instalado dependencias, alterado notebooks, creado repositorios, hecho commits ni publicado contenido. El dominio y la conexión Cloudflare los prepara el profesor. La revisión final de la implementación se reserva al modelo revisor y al profesor; no ha ocurrido aún.

## Leer en este orden

1. [01-DISENO-Y-ARQUITECTURA.md](01-DISENO-Y-ARQUITECTURA.md): alcance, pantallas, diseño y contratos técnicos.
2. [02-TEMA-1.md](02-TEMA-1.md): recorrido docente, correspondencia con Gamma y tratamiento de recursos.
3. [03-INTERACCIONES.md](03-INTERACCIONES.md): preguntas redactadas, respuestas y simulaciones deterministas.
4. [04-IMPLEMENTACION.md](04-IMPLEMENTACION.md): tareas pequeñas en orden, interfaces y comprobaciones.
5. [05-REVISION-Y-PUBLICACION.md](05-REVISION-Y-PUBLICACION.md): criterios de aceptación, publicación y encargo al revisor.
6. [fuentes-tema-1.json](fuentes-tema-1.json): textos de las diapositivas 1–30 y referencias exactas a medios dentro del PPTX. Es evidencia original, no contenido científicamente validado.

## Decisiones principales

- Carpeta de proyecto y raíz de compilación Cloudflare: `web/` dentro del repositorio existente.
- Salida pública: `web/dist/`. Solo esta carpeta se publica.
- HTML semántico + CSS + JavaScript modular + reveal.js para presentar.
- Construcción pequeña con Node; sin React, Vue, Astro, servidor de aplicación ni base de datos.
- Lectura con diseño adaptable real, presentación 16:9 y PDF desde el mismo contenido.
- Recursos locales en el sitio; sin depender de Gamma o CDNs para visualizar la teoría.
- Un alumno puede estudiar sin cuenta. Los ejercicios se corrigen localmente y el progreso es propio de cada navegador.
- Colab abre el notebook de GitHub; el alumno guarda su copia en Drive. La web no ejecuta modelos.
- Tema 1: detección de objetos, con contexto de las tareas de visión, arquitecturas y evaluación.
- La práctica de entrenamiento será una ampliación opcional; la web seguirá siendo útil sin GPU.

## Preferencias confirmadas por el profesor

El profesor respondió durante la planificación:

1. «Identidad de Datamecum, pero bonito [...] asegúrate de que es bonito y elegante». El diseño toma los colores reales del logo y la referencia de Gamma, con lectura clara, composiciones cuidadas y marca visible sin repetición excesiva.
2. «Python y nociones de deep learning; explicar desde cero las métricas y la detección». CNN como recordatorio breve.

Si el profesor cambia estas preferencias, actualizar primero el diseño y los textos afectados. No hace falta el dominio para implementar ni probar: todas las rutas internas son relativas.

## Material encontrado

- `docs/Modelos-fundacionales-en-vision-artificial.pptx`: 94 diapositivas, 272 entradas de medios.
- PDF del mismo nombre: 94 páginas. Se inspeccionaron visualmente las páginas 4–30 para esta planificación.
- `docs/img/tema 1/`: GIFs, diagramas y fuentes. Hay recursos adicionales dentro del PPTX, incluido un GIF de CNN.
- `1_OD.ipynb`: 27 celdas; inferencia, cambio de umbral, recuento, ejercicios y entrenamiento.
- Los notebooks de temas 2–6 ya existen; no se modificarán al ejecutar esta fase.
- Remoto observado: `https://github.com/sergiovillanueva/Modelos_Fundacionales.git`.
- Hay cambios previos del usuario en notebooks 3, 4 y 6. Preservarlos. No leer `.env`, descargar pesos ni ejecutar entrenamiento para construir el sitio.

## Qué falta realmente

No hace falta pedir otro export para empezar. Si un medio extraído tiene resolución insuficiente, registrar su diapositiva y nombre exacto y pedir únicamente ese original. La portada no debe reutilizar automáticamente las fechas de noviembre de 2025.

Antes de publicar: comprobar enlaces de GitHub/Colab y procedencia de recursos usados; confirmar el nombre final del dominio solo si se desea URL canónica y metadatos sociales. No copiar el repositorio entero al directorio público.

## Prompt para el modelo implementador

> Implementa el curso siguiendo `docs/plan-web/00-LEEME.md` y los documentos enlazados. Lee primero la especificación completa y luego ejecuta las tareas de `04-IMPLEMENTACION.md` en orden. Construye solo `web/` y el tema 1; temas 2–6 únicamente como tarjetas «Próximamente». Conserva los archivos originales y los cambios del usuario. No reemplaces esta arquitectura por otro framework. No inventes benchmarks, fuentes, resultados de inferencia o prácticas ya validadas. Empieza por la muestra vertical de la tarea 2 y detente en su punto de revisión visual antes de completar el tema. Anota evidencias y estado en `docs/plan-web/estado-implementacion.md`. No publiques ni hagas push hasta recibir la instrucción correspondiente. Al finalizar, entrega la web, su PDF y el informe de comprobaciones para revisión.
