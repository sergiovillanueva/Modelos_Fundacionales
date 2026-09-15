# Aceptación, publicación y revisión final

## 1. Definición de terminado

La fase termina cuando un alumno puede abrir la portada, estudiar tema 1, usar ocho preguntas y dos demos, abrir la práctica correcta y descargar el PDF; el profesor puede presentar el mismo contenido. Los temas futuros están anunciados sin contenido. Una compilación correcta por sí sola no demuestra que se ha terminado.

## 2. Checklist con evidencia

### Contenido y pedagogía

- [ ] Los seis objetivos de 02 tienen explicación y práctica/actividad asociada.
- [ ] Se explica desde la base detección y métricas; CNN no se convierte en un curso aparte.
- [ ] Texto legible y conciso en presentación; lectura con contexto suficiente para estudio autónomo.
- [ ] Cada pregunta ofrece explicación distinta según opción; claves correctas b,c,a,b,c,a,b,c.
- [ ] No se confunden confianza, IoU, AP50 y COCO AP; no se presenta matching de entrenamiento como inferencia.
- [ ] La comparación de arquitecturas y herramientas evita superioridades universales sin evidencia.
- [ ] RF-DETR y sus detalles tienen versión/fuente concreta; referencias enlazan al recurso pertinente.
- [ ] Datos ilustrativos se identifican; no parecen inferencia real.
- [ ] Solo tema 1 tiene teoría; futuros temas no tienen páginas vacías enlazadas.

### Diseño

- [ ] Identidad Datamecum reconocible; proporción y contraste del logo correctos.
- [ ] Portada elegante, jerarquía clara, imágenes grandes y legibles, alternancia razonable de layouts.
- [ ] Capturas: portada, explicación con figura, pregunta correcta/incorrecta, IoU, umbral y práctica.
- [ ] Presentación a 1280×720 sin desbordamiento en cada slide; fuentes principales ≥26 px del lienzo.
- [ ] Lectura a 360, 390, 768 y 1440 px; sin scroll horizontal del documento.
- [ ] PDF completo inspeccionado por imágenes de páginas; revisar especialmente figuras, actividades y apéndice.

### Accesibilidad y conducta

- [ ] Navegación completa por teclado; foco visible; radios/sliders no cambian diapositiva.
- [ ] Índice móvil abre y cierra correctamente; Escape cierra diálogo y devuelve foco al activador.
- [ ] Todos los controles tienen nombre y se distinguen con zoom al 200%.
- [ ] Diagramas tienen alternativa textual útil; feedback no depende solo del color.
- [ ] `prefers-reduced-motion` evita movimiento automático. GIFs tienen iniciar/detener y poster.
- [ ] Probar lector de pantalla si está disponible; si no, declarar la limitación, no afirmar auditoría WCAG completa.
- [ ] Chrome/Edge Chromium y Firefox/WebKit mediante Playwright cuando estén disponibles; una emulación no equivale a un dispositivo real. Registrar al menos Chromium ejecutado y una prueba manual real de móvil si se dispone del dispositivo.
- [ ] Con JavaScript desactivado la teoría, enlaces y fallback son utilizables.

### Funcionalidad

- [ ] Ocho preguntas: seleccionar, comprobar, reintentar, recargar y borrar progreso.
- [ ] Storage bloqueado/corrupto no rompe la web; aviso sin modal intrusivo.
- [ ] Dos contextos de navegador tienen progresos independientes; no hay llamadas de red al contestar.
- [ ] IoU: igual 1, disjunto 0, estado inicial 1/3.
- [ ] Umbral: cuatro filas de resultados exactamente como 03; score igual al umbral se incluye; duplicados no cuentan dos veces.
- [ ] Los modos preservan la sección; enlaces directos y recarga funcionan.
- [ ] Colab abre notebook correcto sin permiso privado del profesor. Registrar ejecución de celdas como verificada solo si realmente se hizo.
- [ ] PDF contiene preguntas, soluciones, estados estáticos de demos y enlaces clicables; no incluye respuestas guardadas del usuario.

### Compilación y publicación

- [ ] `npm ci` y build reproducible con lockfile; no depende de la ruta del PC del profesor.
- [ ] Funciona sirviendo dist como raíz y bajo `/curso/`.
- [ ] No enlaces rotos de recursos; no recursos de Gamma/CDN necesarios para leer.
- [ ] Presupuestos de peso cumplidos o excepciones justificadas por archivo.
- [ ] dist contiene exclusivamente el sitio y PDF; no `.env`, pesos, datasets, exports originales ni node_modules.
- [ ] No dominio ni cuenta personal nueva requeridos para que el alumno lea teoría.

## 3. Configuración Cloudflare que recibirá el profesor

Para el repositorio existente, tras revisión:

| Campo | Valor |
|---|---|
| Repositorio | `sergiovillanueva/Modelos_Fundacionales` |
| Rama de producción | `main` (confirmar en proyecto Cloudflare) |
| Framework preset | None |
| Root directory | `web` |
| Build command | `npm ci && npm run build && npm run check` |
| Build output directory | `dist` relativo a `web` |
| Node | 22 LTS, especificar versión compatible en configuración/build |

El dominio se asocia al proyecto Pages; no «apunta a una carpeta de GitHub». Cloudflare toma `web/`, ejecuta el build y publica `dist/` en la raíz de ese dominio. Si el profesor quiere un prefijo como `dominio/curso/` dentro de otro sitio ya existente, necesita integrar estos archivos bajo esa ruta o configurar el sitio anfitrión; no se obtiene solo eligiendo `web` como raíz. La implementación usa rutas relativas y se prueba bajo prefijo para permitir esa integración.

Un subdominio dedicado, por ejemplo uno que el profesor elija para el curso, evita integración con su otra web. No fijar ningún hostname hasta que lo facilite. Cloudflare permite previews por rama; usar una antes de producción si ya está conectado.

Actualizar contenido: editar fuente → regenerar PDF si corresponde → probar → commit selectivo → push a rama de publicación cuando esté autorizado. No editar dist manualmente. No instalar Chromium en cada despliegue: el PDF revisado está en public/descargas y build valida su manifiesto.

## 4. Informe de implementación que debe entregar el modelo

`estado-implementacion.md`:

1. Tarea actual y tareas aceptadas.
2. Archivos creados/modificados por esa tarea.
3. Comandos realmente ejecutados con resultado.
4. Capturas y PDF producidos, indicando ruta local.
5. Fuentes técnicas revisadas y afirmaciones omitidas.
6. Limitaciones verificadas: notebook no ejecutado, navegador no disponible o recurso original que falta, si aplica.
7. Próximo paso concreto. Nunca decir «todo probado» si falta GPU o revisión de móvil.

## 5. Prompt para la revisión final con el modelo más capaz

> Revisa la implementación del curso en `web/` contra `docs/plan-web/00-LEEME.md` y los cinco documentos enlazados. Revisa código y contenido, abre el sitio en navegador y comprueba lectura, presentación, preguntas, las dos demos, teclado, móvil, rutas bajo subcarpeta, enlaces de Colab y PDF. Examina específicamente matching de DETR, las afirmaciones de RF-DETR, métricas, licencias y la distinción entre simulaciones y resultados reales. Verifica que el estilo respeta Datamecum y que solo el tema 1 tiene contenido. No desarrolles temas nuevos. Corrige fallos concretos dentro del alcance y repite las comprobaciones afectadas. Deja hallazgos, evidencias, límites y estado final en `docs/plan-web/informe-revision.md`. No hagas push ni publiques hasta que el profesor lo solicite.

Clasificación de hallazgos:

- Bloqueante: error científico que cambia aprendizaje, ejercicio con respuesta incorrecta, demo que calcula mal, datos privados en dist, sitio/práctica enlazada inaccesible o PDF incoherente.
- Importante: lectura móvil mala, controles no operables por teclado, figuras esenciales ilegibles, flujo de estudio confuso.
- Mejora: ajuste fino visual o editorial que no impide estudiar.

Para pasar al tema 2: cero bloqueantes, importantes resueltos o aceptados expresamente por el profesor, recorrido visual aprobado y PDF coherente con web.

## 6. Estimación orientativa de alcance

Para esta fase, una muestra visual puede ocupar 2–4 horas de trabajo asistido y revisión. Tema 1 completo con las actividades, lectura/presentación/PDF y QA puede ocupar aproximadamente 8–16 horas adicionales, según la fidelidad de los medios y correcciones científicas. Son rangos de esfuerzo total, no tiempo garantizado de una sesión ni presupuesto en tokens. El plan reduce decisiones del implementador, pero no elimina la revisión visual y docente.

## 7. Autorrevisión de la planificación

Se contrastó el guion con el PPTX y el notebook del tema 1. Se fijaron IDs, esquema de preguntas, resultados de demos, jerarquía de archivos, modos, rutas, tratamiento PDF y límites del alcance. Se incorporaron las dos preferencias del profesor. La corrección científica completa y las pruebas de navegador quedan para la implementación y su revisión; no se atribuyen a esta fase de planificación.

Comprobaciones ejecutadas sobre el plan: enlaces locales entre documentos resueltos; ocho IDs de pregunta únicos; recálculo independiente de IoU inicial = 1/3 y resultados de los cuatro umbrales = (3,2,0), (2,1,1), (2,0,1), (0,0,3) para TP/FP/FN. No se han ejecutado las pruebas de la futura web porque todavía no existe.
