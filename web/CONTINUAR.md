# Encargo para el siguiente modelo

## Prompt listo para usar

> Continúa la migración del PowerPoint a la web. Lee `INSTRUCCIONES.md`, `plan/ESTADO.md`, `plan/AUDITORIA-CONTENIDO-PPTX-PDF-WEB.md`, `plan/AUDITORIA-TEMAS-02-05.md` y `plan/MIGRACION-POWERPOINT.md`, tomando `web/` como directorio de trabajo. Ejecuta **solo la siguiente acción pendiente** del tema activo y completa su comprobación antes de terminar. Consulta las diapositivas completas, el PDF, los recursos y el notebook del lote. Conserva el diseño actual: portada breve, logo Datamecum visible, una sola navegación por temas, un concepto por pantalla y avance con Anterior/Siguiente. Incorpora todas las ideas docentes en pasos breves; el total de pantallas debe surgir de las ideas y nunca de un máximo artificial. Reutiliza imágenes y animaciones que enseñan; no copies iconos decorativos ni la marca de agua de Gamma. No reutilices una misma imagen para conceptos distintos salvo que sea una comparación progresiva explícita. Registra cada diapositiva y cualquier corrección en `plan/COBERTURA.json`, registra recursos y afirmaciones en `content/tema-XX/sources.json`, y deja actualizado `plan/ESTADO.md` con resultados, pendientes y la siguiente acción. Solo puedes escribir dentro de `web/`. No cambies el diseño general, no modifiques los originales, no descargues modelos ni publiques. Resuelve las decisiones rutinarias por tu cuenta; pregunta únicamente por un material imprescindible que realmente falte o una decisión que no se pueda inferir de estas instrucciones.

Si este repositorio contiene directamente el contenido de `web/`, sus rutas empiezan en la raíz actual. No crear una segunda carpeta `web/web/`.

## Orden de lectura

1. [INSTRUCCIONES.md](INSTRUCCIONES.md): requisitos visuales y comportamiento aprobado.
2. [Estado](plan/ESTADO.md): punto exacto para continuar.
3. [Plan de migración](plan/MIGRACION-POWERPOINT.md): proceso, lotes, fidelidad y revisión.
4. [Auditoría completa](plan/AUDITORIA-CONTENIDO-PPTX-PDF-WEB.md): pérdidas, repeticiones y correcciones ya aplicadas.
5. [Auditoría 02–05](plan/AUDITORIA-TEMAS-02-05.md): nivel de detalle y correcciones que sirven de referencia.
6. [Cobertura](plan/COBERTURA.json): filtrar las diapositivas del lote, sin volcar el archivo entero.
7. [README.md](README.md): comandos y estructura, cuando haga falta ejecutarlos.

El PPTX es la fuente de contenido. La web actual es la referencia de diseño. La planificación antigua aporta ideas docentes y referencias; sus propuestas de tarjetas, índices y textos largos han quedado sustituidas.

## Alcance actual

Los **temas 01–05 están adaptados** y el tema 06 sigue pendiente. «Continuar» significa tomar la siguiente acción de `ESTADO.md`, sin resumir ni rehacer temas ya auditados salvo que el profesor señale un problema concreto.

No generar tareas nuevas, subagentes, commits o despliegues por el mero hecho de leer este documento.
