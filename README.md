# Curso: Modelos fundacionales en visión artificial

Material del curso de Datamecum sobre modelos fundacionales de visión: seis temas en una web con simulaciones interactivas y seis cuadernos de Google Colab, uno por tema. Todo el código usa la librería Transformers de Hugging Face y funciona con las librerías que ya trae Colab, sin instalar nada.

## Dónde está el material

| | Enlace |
|---|---|
| Web del curso | [datamecum.sergiovillanuevalopez.com](https://datamecum.sergiovillanuevalopez.com) |
| Temas en PDF | [web/public/descargas/](web/public/descargas/) (también en la web, botón *Descargar PDF* de cada tema) |
| Cuadernos | En la tabla de abajo, cada uno con su enlace a Colab |
| Todo junto, para usar sin internet | **[curso-sin-internet.zip](https://github.com/sergiovillanueva/Modelos_Fundacionales/releases/latest/download/curso-sin-internet.zip)** |

## Si falla internet

El zip de arriba tiene la web completa (se abre con doble clic en `web/index.html`, sin conexión y con las simulaciones funcionando), los seis PDF y los seis cuadernos ya ejecutados con todos sus resultados. Conviene descargarlo el día antes.

Si tampoco se puede descargar, cada tema está en PDF en la carpeta [web/public/descargas/](web/public/descargas/) de este repositorio.

Para ejecutar los cuadernos en un portátil sin conexión (modelos descargados de antemano, mismas versiones que Colab) está la carpeta [sin-internet/](sin-internet/LEEME.md).

## Orden del curso

Cada tema tiene un cuaderno con el mismo número. Se siguen en orden: primero el tema y después su cuaderno.

| Día | Tema | Cuaderno | Qué se hace |
|---|---|---|---|
| 1 | 1. Detección de objetos | [1_OD](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/1_OD.ipynb) | Detectar con RF-DETR, contar objetos, seguirlos en vídeo y ajustar el detector a clases nuevas (equipos de protección del dataset CPPE-5) |
| 1 | 2. Hugging Face | [2_HF_Intro](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/2_HF_Intro.ipynb) | Buscar modelos en el Hub, usarlos con `pipeline`, ver qué hay dentro, guardarlos en una carpeta y leer su licencia |
| 1 | 3. Modelos multimodales | [3_Multimodal](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/3_Multimodal.ipynb) | Clasificar y buscar fotos con CLIP, describirlas con BLIP, detectar por texto con Grounding DINO y razonar sobre la imagen con Qwen3.5 |
| 2 | 4. DINO | [4_DINO](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/4_DINO.ipynb) | Vectores de imagen y de parche con DINOv3: parecido entre imágenes, correspondencias, PCA de los parches y detección de anomalías sin ejemplos de defectos |
| 2 | 5. Segmentación con SAM | [5_SAM](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/5_SAM.ipynb) | Segmentar con puntos en SAM 2, por texto con Grounding DINO o Qwen3.5, y buscar dentro de una foto combinando SAM y CLIP |
| 2 | 6. Otras tareas | [6_Otras_Tareas](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/6_Otras_Tareas.ipynb) | Pose humana con ViTPose, OCR con GOT-OCR 2.0, superresolución con Swin2SR, quitar el fondo con RT-DETR y SAM 2, y profundidad con Depth Anything V2 |

Cada cuaderno acaba con un ejercicio para practicar por tu cuenta.

## Estructura del repositorio

- `1_OD.ipynb` … `6_Otras_Tareas.ipynb`: los cuadernos.
- `assets/`: imágenes que usan los cuadernos.
- `web/`: el código de la web y los PDF (instrucciones en [web/INSTRUCCIONES.md](web/INSTRUCCIONES.md)).
- `sin-internet/`: preparar un portátil para dar o seguir el curso sin conexión.
