# Dar el curso aunque falle internet

Tres planes, de más a menos cómodo. Los tres usan el mismo material.

| Plan | Qué falla | Qué se usa |
|---|---|---|
| A | Nada | La web [datamecum.sergiovillanuevalopez.com](https://datamecum.sergiovillanuevalopez.com) y los cuadernos en Colab |
| B | La web o la conexión | La web y los cuadernos en local (profesor) y el paquete descargado de GitHub (alumnos) |
| C | Todo lo demás | Los PDF de los seis temas |

## Plan B para el profesor: el portátil, sin internet

**Una vez, con internet**, doble clic en `sin-internet\preparar.bat`. Hace tres cosas:

1. Crea el entorno de Python `.venv-clase` con las mismas versiones que Colab. Necesita [uv](https://docs.astral.sh/uv/) (`winget install astral-sh.uv`).
2. Descarga los 15 modelos y el dataset de los cuadernos (unos 15 GB, a la caché de Hugging Face) y guarda en `assets/` el vídeo del cuaderno 1 y la foto de COCO del cuaderno 6.
3. Construye la web en `web\dist` (necesita Node.js).

**El día de la clase**, doble clic en `sin-internet\clase.bat`. Abre la web en el navegador, desde el disco, con todas las simulaciones funcionando, y abre Jupyter con los seis cuadernos en modo sin conexión: los modelos salen de la caché y las imágenes de `assets/`.

Si algo falla al ejecutar un cuaderno, las prácticas resueltas del paquete (abajo) enseñan todos los resultados sin ejecutar nada.

## Plan B para los alumnos: el paquete de GitHub

En la página del repositorio, apartado *Releases*, está **[curso-sin-internet.zip](https://github.com/sergiovillanueva/Modelos_Fundacionales/releases/latest/download/curso-sin-internet.zip)**. Se descomprime y dentro hay:

- `web/index.html`: la web entera. Doble clic y se abre, sin internet.
- `pdf/`: los seis temas en PDF.
- `practicas-resueltas/`: los seis cuadernos ya ejecutados, con todos sus resultados, para ver en el navegador.
- `cuadernos/`: los seis cuadernos para ejecutarlos en Colab (eso sí necesita internet).

Conviene que lo descarguen el día anterior.

## Plan C: los PDF

Están en la web (botón *Descargar PDF* de cada tema), en el paquete y en el repositorio, en `web/public/descargas/`. Cada PDF tiene portada, marcadores para saltar entre pantallas y pie de página con el tema.

## Para regenerar el material

Después de cambiar la web o los cuadernos:

```
cd web
npm run build
npm run pdf
cd ..
.venv-clase\Scripts\python.exe sin-internet\paquete.py
```

`paquete.py` ejecuta los seis cuadernos sin red (si alguno falla, se detiene y lo dice) y crea `curso-sin-internet.zip`. Ese zip se sube a GitHub como *release*.
