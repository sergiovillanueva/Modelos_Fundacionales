# Instrucciones de diseño y contenido

Este documento es la referencia obligatoria para completar los temas 02–06. Antes de modificar la web, hay que leerlo junto con [README.md](README.md).

## Objetivo

La web debe ayudar a un alumno con conocimientos de Python y nociones de *deep learning* a aprender sin necesitar instrucciones previas. Cada pantalla debe dejar claro qué mirar, qué idea recordar y cuál es el siguiente paso.

La identidad visual parte de Datamecum: azul marino, azul intenso, cian, Raleway para títulos y Roboto para texto. El resultado debe ser elegante, ligero y académico.

## Reglas que no se deben romper

1. **Una idea principal por sección.** Si una sección intenta explicar dos conceptos independientes, hay que dividirla.
2. **Una acción principal por pantalla.** No repetir enlaces con etiquetas diferentes ni añadir botones de ayuda, reinicio o comprobación cuando la interacción ya se entiende por sí sola.
3. **Primero lo visual.** Título corto, una frase de contexto y una imagen, comparación o actividad. El detalle se añade después y solo si ayuda a estudiar.
4. **Sin tarjetas decorativas.** Las cajas con borde y sombra se reservan para imágenes, laboratorios, preguntas y llamadas a la acción. El texto normal vive sobre el fondo de la página.
5. **Sin texto duplicado.** El título, la entradilla, el pie de imagen y el detalle deben aportar información diferente.
6. **Una sola fuente de contenido.** `content/tema-XX/sections.html` alimenta tanto la lectura como la presentación.
7. **Funciona sin backend.** Todo debe compilarse como HTML, CSS y JavaScript estático para GitHub y Cloudflare Pages.

## Límites de texto

- Título de sección: idealmente 3–7 palabras.
- Entradilla: una frase, hasta 30 palabras.
- Párrafo de estudio: hasta 80 palabras.
- Comparación: hasta 3 alternativas y una frase por alternativa.
- Pregunta: 3 respuestas breves y una explicación concreta por respuesta.
- Práctica de Colab: una llamada a la acción y un máximo de 3 pasos.

Si el material original excede estos límites, se conserva la idea central en la página y se traslada el desarrollo técnico al notebook o a una sección nueva.

## Anatomía de una sección

Cada `<section>` necesita `id`, `data-title` y `data-layout`:

```html
<section id="concepto" data-title="Nombre en el índice" data-layout="split">
  <div class="section-copy">
    <p class="section-kicker">Contexto breve</p>
    <h2>Una idea clara</h2>
    <p class="lead">Una frase que permita interpretar el elemento visual.</p>
  </div>
  <figure class="figure-media">...</figure>
  <div class="study-detail">Detalle útil para estudiar en casa.</div>
</section>
```

Layouts permitidos:

- `split`: texto y elemento visual en dos columnas; se apilan en móvil.
- `lab`: explicación breve y una simulación interactiva.
- `process`: práctica, notebook o recorrido de pasos.

No se crean layouts nuevos salvo que ninguno de estos permita explicar bien el concepto.

## Portada

La portada contiene únicamente:

1. Cabecera con logo, nombre breve y GitHub.
2. Hero con título, resumen, una imagen real del curso y una acción para empezar.
3. Índice de temas. El tema disponible es un único enlace completo; los pendientes son filas sin botones.
4. Pie con autor y créditos.

No añadir bloques de competencias, instrucciones de uso, estadísticas, ventajas, iconos de relleno ni un segundo menú.

## Lectura

- La cabecera solo ofrece `Curso`, el título actual y `Presentar`.
- El índice lateral es discreto y se pliega en móvil.
- Las secciones forman una narración continua separada por espacio y una línea fina.
- No mostrar progreso si no existe un progreso real y persistente.
- El alumno debe poder entender la página desplazándose de arriba abajo sin abrir ayudas.

## Presentación

- Reutiliza las mismas secciones y actividades.
- Oculta `.study-detail` y otros matices largos.
- Cada diapositiva debe caber completa a 1280 × 720 sin desplazamiento.
- Solo se muestra el enlace discreto `Lectura`; Reveal.js aporta avance, número de diapositiva y teclado.
- Si una sección queda densa, se oculta el apoyo menos importante en CSS de presentación o se divide la sección en la fuente.

## Preguntas y laboratorios

### Preguntas

Las preguntas viven en `content/tema-XX/questions.json` y se insertan con `{{QUIZ:id}}`.

- La respuesta se corrige al seleccionarla.
- No añadir botones `Comprobar` o `Reintentar`.
- Cada opción explica por qué es correcta o incorrecta.
- El mensaje usa `role="status"` y `aria-live="polite"`.

### Laboratorios

- Un laboratorio debe enseñar una relación causal visible.
- Empieza con una sola variable controlable. Solo se añade otra si es necesaria para el objetivo didáctico.
- El resultado cambia en directo y se expresa con número y una frase interpretativa.
- No añadir presets, reinicios o modos si el deslizador o control principal basta.

## Imágenes, animaciones y Colab

- Usar recursos locales en `public/assets/tema-XX/` y texto alternativo que explique su propósito.
- Una animación comienza como imagen estática y ofrece un solo control `Ver animación` / `Detener`. Se prefiere WebP animado para que Git lo incluya y pese menos.
- El notebook se abre con una URL de Colab que apunte al archivo de GitHub.
- La tarjeta de Colab incluye el nombre del ejercicio, una frase y un solo botón.
- Los alumnos guardan su propia copia en Drive; la web no necesita permisos de Google ni integración con una API.

## Cómo añadir el siguiente tema

1. Crear `content/tema-XX/sections.html` con 4–7 secciones breves.
2. Crear `content/tema-XX/questions.json` con las preguntas del tema.
3. Copiar las imágenes optimizadas a `public/assets/tema-XX/`.
4. Añadir `contentDir`, `notebookPath` y `status: "available"` en `content/course.json`.
5. Mantener una imagen, una interacción o una práctica relevante por sección; no llenar huecos con componentes.
6. Ejecutar `npm test`, `npm run build`, `npm run check`, `npm run test:e2e` y `npm run pdf`.
7. Revisar la portada, la lectura completa en escritorio y móvil, todas las diapositivas a 1280 × 720 y las páginas del PDF renderizadas.

## Criterio de terminado

Un tema está listo cuando:

- se entiende su recorrido sin instrucciones;
- no repite títulos, texto ni acciones;
- explica desde cero las métricas nuevas que utilice;
- las preguntas y simulaciones responden inmediatamente;
- todos los enlaces y recursos cargan;
- no existe desbordamiento horizontal en móvil;
- cada diapositiva cabe y puede leerse desde el aula;
- el PDF abre, mantiene una jerarquía legible y no muestra controles web;
- pasan todas las comprobaciones indicadas arriba.
