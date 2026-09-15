# Encargo para el siguiente modelo

## Prompt listo para usar

> Continúa la migración del PowerPoint a la web. Lee `INSTRUCCIONES.md`, `plan/ESTADO.md` y `plan/MIGRACION-POWERPOINT.md`, tomando `web/` como directorio de trabajo. Ejecuta **solo el siguiente lote pendiente** del tema activo y completa su comprobación antes de terminar. Consulta únicamente las diapositivas, recursos y código necesarios para ese lote. Conserva el diseño actual: portada breve, logo Datamecum visible, una sola navegación por temas, un concepto por pantalla y avance con Anterior/Siguiente. Incorpora todas las ideas docentes del lote en pasos breves; no reduzcas un tema completo a cuatro pantallas. Reutiliza imágenes, animaciones y notebooks del profesor. Registra cada diapositiva y cualquier corrección en `plan/COBERTURA.json`, y deja actualizado `plan/ESTADO.md` con resultados, pendientes y el siguiente lote. Solo puedes escribir dentro de `web/`. No cambies el diseño general, no modifiques los originales, no descargues modelos ni publiques. Resuelve las decisiones rutinarias por tu cuenta; pregunta únicamente por un material imprescindible que realmente falte o una decisión que no se pueda inferir de estas instrucciones.

Si este repositorio contiene directamente el contenido de `web/`, sus rutas empiezan en la raíz actual. No crear una segunda carpeta `web/web/`.

## Orden de lectura

1. [INSTRUCCIONES.md](INSTRUCCIONES.md): requisitos visuales y comportamiento aprobado.
2. [Estado](plan/ESTADO.md): punto exacto para continuar.
3. [Plan de migración](plan/MIGRACION-POWERPOINT.md): proceso, lotes, fidelidad y revisión.
4. [Cobertura](plan/COBERTURA.json): filtrar las diapositivas del lote, sin volcar el archivo entero.
5. [README.md](README.md): comandos y estructura, cuando haga falta ejecutarlos.

El PPTX es la fuente de contenido. La web actual es la referencia de diseño. La planificación antigua aporta ideas docentes y referencias; sus propuestas de tarjetas, índices y textos largos han quedado sustituidas.

## Alcance inicial

Completar y pulir **tema 01**. Los temas 02–06 tienen lotes definidos, pero siguen sin contenido hasta revisar el primero y recibir la indicación de pasar al siguiente. «Continuar» significa tomar el siguiente lote del tema activo, sin repetir los ya revisados.

No generar tareas nuevas, subagentes, commits o despliegues por el mero hecho de leer este documento.
