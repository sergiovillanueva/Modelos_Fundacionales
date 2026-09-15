# Guía para continuar la web

Referencia obligatoria antes de ampliar cualquier tema. Leer también [README.md](README.md). Esta guía sustituye las decisiones anteriores sobre portada, índice lateral, tarjetas y lectura continua en `docs/plan/web`. Trabajar exclusivamente dentro de `web/`.

## La experiencia que hay que conservar

La web es un aula visual. Al entrar, el alumno ya está en el primer ejemplo. Arriba elige tema; debajo elige un paso. Puede avanzar con «Siguiente» o saltar directamente a cualquier paso. No necesita leer una explicación de la interfaz.

El público conoce Python y nociones de deep learning. La detección y las métricas nuevas se explican desde cero, con un ejemplo que se pueda ver o manipular.

**Modelo de referencia: tema 01, tal como está implementado.** Sus cuatro pasos son Concepto → Tu turno → IoU → Colab. Es una introducción; no representa todavía todo el temario de detección.

## Reglas visuales obligatorias

1. **Una idea por vista.** Un título breve, como máximo una frase de contexto, y una imagen o actividad protagonista.
2. **Texto sobre blanco.** Sin recuadros para explicaciones, tarjetas de Colab, sombras decorativas, gradientes ni etiquetas de relleno. Un área suavemente coloreada sí puede delimitar una simulación.
3. **Acciones evidentes.** Una respuesta se corrige al seleccionarla. Un deslizador modifica el ejemplo. No añadir «Comprobar», «Reiniciar», tutoriales, consejos de navegación ni botones duplicados.
4. **Identidad Datamecum.** Logo local, Raleway en títulos, Roboto en texto; azul marino y azul intenso, cian solo como acento. Usar los colores de `tokens.css`.
5. **Espacio y jerarquía.** Título centrado y elemento visual grande. La interfaz ocupa menos atención que el contenido. Las preguntas usan filas con separadores finos.
6. **Contenido real.** No rellenar temas pendientes con ejemplos ficticios, métricas inventadas ni llamadas a la acción sin destino.

### Límites de texto visible

| Elemento | Límite orientativo |
| --- | --- |
| Nombre de tema en navegación (`navTitle`) | 1–3 palabras |
| Nombre de paso (`data-title`) | 1–2 palabras |
| Título de la vista | 3–7 palabras |
| Frase de contexto | Hasta 20 palabras, una sola frase |
| Pie de imagen | Una línea útil; no repetir el título |
| Pregunta | Una situación breve y 3 respuestas |
| Corrección | 1–2 frases, visibles después de responder |
| Colab | Hasta 3 pasos cortos y un enlace principal |

Si falta espacio, dividir la idea en otro paso. Los matices adicionales pueden ir en el notebook o en `.print-detail`, que solo se muestra en el PDF. **Nunca ocultar una definición imprescindible para resolver la actividad web.**

## Navegación

- `index.html` abre el primer tema disponible. Se genera desde la misma plantilla que la ruta del tema; no crear una portada aparte.
- Cabecera: marca y menú discreto **Material**, con **Descargar PDF** y **Presentar**.
- Primera fila: temas. Los disponibles son enlaces; los pendientes se muestran atenuados, sin enlace, con estado accesible «Próximamente».
- Segunda fila: pasos del tema. Solo un panel visible con JavaScript activo. En móvil, mantener acceso a todos los pasos; si se añaden más de cuatro, adaptar y comprobar la fila para que no desborde.
- Pie de la lección: **Anterior**, posición `n / total` y **Siguiente**. El último paso termina con Colab. El contador indica ubicación, nunca rendimiento ni progreso guardado.
- No añadir barra lateral, portada promocional, pie con créditos, GitHub ni un tercer menú a la lección. Los créditos y licencias se conservan como información secundaria en los archivos existentes.
- La URL identifica el paso (`#iou`); recarga, enlaces directos y botones atrás/adelante del navegador deben conservarlo.
- Presentar abre la diapositiva actual. Volver regresa al mismo paso.

## Fuente única de contenido

`content/tema-XX/sections.html` alimenta web, presentación y PDF. No duplicar texto entre modos. No editar `dist/` a mano.

```html
<section id="concepto" data-title="Concepto" data-layout="visual">
  <div class="section-copy">
    <h2>Una idea clara</h2>
    <p class="lead">Una frase para interpretar el ejemplo.</p>
  </div>
  <figure class="figure-media detection-example">
    <img src="{{ASSET:tema-XX/ejemplo.webp}}"
         alt="Descripción de lo que el ejemplo enseña." width="900" height="457">
    <figcaption>Una conclusión breve.</figcaption>
  </figure>
  <div class="print-detail"><p>Matiz adicional para estudiar en PDF.</p></div>
</section>
```

Los valores actuales de `data-layout` son `visual`, `question`, `lab` y `practice`. Son descriptores: el diseño lo aplican las clases compartidas de `widgets.css`. Reutilizar componentes existentes antes de añadir estilos. No anidar `<section>` dentro de otra; el generador extrae secciones de primer nivel. Usar identificadores únicos y estables dentro del tema.

### Preguntas

- Datos en `questions.json`; insertar con `{{QUIZ:id}}`.
- Cada respuesta incluye una explicación concreta. Indicar qué significa el error, sin regañar.
- Corregir al seleccionar, con texto y color. Mantener `fieldset`, `legend`, radios nativos y `role="status"`.
- La respuesta se conserva al cambiar de paso en la misma página. No prometer persistencia después de recargar ni recogida de resultados del grupo.
- Para el PDF, asegurar que la solución puede consultarse en papel; el generador incluye la respuesta correcta debajo del ejercicio.

### Simulaciones

- Una variable principal, resultado inmediato y etiquetas junto al control.
- Explicar el nombre y significado de una métrica antes de usarla. No introducir umbrales de «bueno/malo» sin contexto.
- Mantener un ejemplo estático comprensible al imprimir.
- Los controles deben funcionar con teclado; las flechas de un deslizador nunca cambian de diapositiva o paso.

### Recursos y Colab

- Imágenes y fuentes locales; conservar proporción, dimensiones reales y texto alternativo.
- Animaciones con póster inicial y un solo control **Ver animación / Detener**. Preferir WebP animado para las exclusiones de Git existentes.
- Colab se abre mediante un enlace real al notebook en GitHub. El alumno guarda su copia en Drive.
- Una lista sencilla y un único enlace **Abrir en Colab**. No crear tarjetas coloreadas, autenticar con Google ni cargar modelos pesados en esta web.
- Mantener autorías y licencias en los archivos correspondientes, sin ocupar la pantalla de aprendizaje.

## Presentación, móvil y accesibilidad

- Reveal.js reutiliza el contenido. Cada diapositiva debe caber a 1280 × 720, incluida la corrección de preguntas. Solo enlace discreto **Volver**, controles de Reveal y número de diapositiva.
- En móvil: contenido apilado, controles táctiles cómodos, nada de desplazamiento horizontal de toda la página. La fila de temas puede desplazarse dentro de su propio espacio.
- Pestañas con roles ARIA, flechas izquierda/derecha y Home/End. Al avanzar con botones, llevar el foco al título nuevo.
- Contraste legible y foco visible. Respetar movimiento reducido. Ninguna información depende solo del color.
- Sin JavaScript, todos los pasos siguen disponibles como HTML continuo. Al imprimir también aparecen todos, incluso si la web solo muestra uno.

## Añadir el siguiente tema

1. Leer esta guía y recorrer el tema 01 antes de escribir contenido.
2. Preparar 4–7 pasos: ejemplo inicial, comprobación breve, exploración y práctica. Si hacen falta más ideas, distribuirlas sin amontonar texto.
3. Crear `content/tema-XX/sections.html`, `questions.json` y recursos en `public/assets/tema-XX/`.
4. En `content/course.json`, completar `navTitle`, `contentDir`, `notebookPath` y pasar a `status: "available"` cuando haya contenido revisable. La URL de Colab de la sección debe apuntar al notebook correcto; `notebookPath` no la sustituye automáticamente.
5. Preparar el PDF del nuevo tema con el nombre que espera el generador: `tema-<id>.pdf`. Actualmente `scripts/export-pdf.mjs` exporta solo el tema 01; ampliar ese script antes de publicar otro tema para que **Material** no enlace a un archivo inexistente.
6. Ejecutar compilación, validación, tests y revisión visual según README. Ampliar las pruebas para el nuevo tema y revisar todos sus pasos, no solo los del tema 01.

## Lista de revisión antes de entregar

- [ ] La entrada ya enseña algo y hay un solo paso visible.
- [ ] No se han recuperado portada, índice lateral, tarjetas ni bloques de explicaciones.
- [ ] El contenido es correcto y suficiente para la actividad, con métricas explicadas desde cero.
- [ ] Respuestas, animación y simulación funcionan; la corrección cabe en móvil y presentación.
- [ ] Temas, pasos, Material, Colab e historial tienen el comportamiento descrito.
- [ ] Los recursos cargan tanto desde la raíz como desde la ruta del tema.
- [ ] Sin desbordamientos a 390 px y 320 px; teclado y movimiento reducido funcionan.
- [ ] Todas las diapositivas caben a 1280 × 720 y el PDF se ha revisado página por página.
- [ ] README e instrucciones reflejan cualquier decisión nueva y todos los cambios están dentro de `web/`.

## Rediseño aplicado en septiembre de 2026

Se sustituyó la portada y la lectura larga por un aula con temas y pasos. Se eliminaron sidebar, tarjetas, subtítulos repetidos y pie de créditos de la lección. PDF y presentación se agruparon en Material. Se redujeron los textos, se conservaron las actividades y se añadió navegación accesible con historial. Las reglas de este documento son el patrón para los próximos temas.
