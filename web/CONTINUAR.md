# Encargo para el siguiente modelo

## Prompt listo para usar

> Mantén y mejora el curso web ya migrado. Lee `INSTRUCCIONES.md`, `plan/ESTADO.md`, las auditorías y `plan/COBERTURA.json`, tomando `web/` como directorio de trabajo. Los seis temas y las 94 diapositivas ya tienen destino: no rehagas ni resumas contenido sin una petición concreta del profesor. Para cualquier cambio, contrasta PPTX, PDF, recurso y notebook afectados; conserva la portada breve, el logo Datamecum visible, una sola navegación por temas, un concepto por pantalla y avance con Anterior/Siguiente. Reutiliza imágenes y animaciones que enseñan; no copies iconos decorativos ni marcas de agua. Registra cambios de cobertura, fuentes y correcciones, actualiza `plan/ESTADO.md`, regenera el PDF afectado y revisa web, móvil y presentación. Solo puedes escribir dentro de `web/`. No modifiques los originales, no descargues modelos ni publiques salvo petición expresa.

Si este repositorio contiene directamente el contenido de `web/`, sus rutas empiezan en la raíz actual. No crear una segunda carpeta `web/web/`.

## Orden de lectura

1. [INSTRUCCIONES.md](INSTRUCCIONES.md): requisitos visuales y comportamiento aprobado.
2. [Estado](plan/ESTADO.md): punto exacto para continuar.
3. [Plan de migración](plan/MIGRACION-POWERPOINT.md): proceso, lotes, fidelidad y revisión.
4. [Auditoría completa](plan/AUDITORIA-CONTENIDO-PPTX-PDF-WEB.md): pérdidas, repeticiones y correcciones ya aplicadas.
5. [Auditoría 02–05](plan/AUDITORIA-TEMAS-02-05.md) y [auditoría 06](plan/AUDITORIA-TEMA-06.md): nivel de detalle, decisiones y correcciones de referencia.
6. [Cobertura](plan/COBERTURA.json): filtrar las diapositivas del lote, sin volcar el archivo entero.
7. [README.md](README.md): comandos y estructura, cuando haga falta ejecutarlos.

El PPTX es la fuente de contenido. La web actual es la referencia de diseño. La planificación antigua aporta ideas docentes y referencias; sus propuestas de tarjetas, índices y textos largos han quedado sustituidas.

## Alcance actual

Los **temas 01–06 están adaptados**, sus PDF existen y las 94 diapositivas tienen destino. «Continuar» significa resolver la petición concreta del profesor o una incidencia registrada en `ESTADO.md`; no hay un siguiente lote de migración automático.

No generar tareas nuevas, subagentes, commits o despliegues por el mero hecho de leer este documento.
