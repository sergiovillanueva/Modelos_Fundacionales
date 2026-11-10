# Curso: Modelos fundacionales en visión artificial

Material del curso de Datamecum sobre modelos fundacionales de visión: seis temas en una web con simulaciones interactivas y seis cuadernos de Google Colab, uno por tema. Los cuadernos funcionan en Colab con las librerías que ya trae (el 1 instala además el paquete `rfdetr`, en un minuto), y en tu ordenador con el entorno de este repositorio, que tiene las mismas versiones.

## Dónde está el material

| | Enlace |
|---|---|
| Web del curso | [datamecum.sergiovillanuevalopez.com](https://datamecum.sergiovillanuevalopez.com) |
| Temas en PDF | Carpeta [pdf/](pdf/) (también en la web, botón *Descargar PDF* de cada tema) |
| Cuadernos | En la tabla de abajo, cada uno con su enlace a Colab |
| Todo junto, para usar sin internet | **[curso-sin-internet.zip](https://github.com/sergiovillanueva/Modelos_Fundacionales/releases/latest/download/curso-sin-internet.zip)** |

## Si falla internet

El zip de arriba tiene la web completa (se abre con doble clic en `web/index.html`, sin conexión y con las simulaciones funcionando), los seis PDF y los seis cuadernos ya ejecutados con todos sus resultados. Conviene descargarlo el día antes.

Si tampoco se puede descargar, cada tema está en PDF en la carpeta [pdf/](pdf/) de este repositorio.

## Orden del curso

Cada tema tiene un cuaderno con el mismo número. Se siguen en orden: primero el tema y después su cuaderno.

| Día | Tema | Cuaderno | Qué se hace |
|---|---|---|---|
| 1 | 1. Detección de objetos | [1_OD](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/1_OD.ipynb) | Detectar con RF-DETR, mover el umbral, contar objetos y ajustar el detector a clases nuevas con 10 fotos de baloncesto (jugadores, árbitros y balón) |
| 1 | 2. Hugging Face | [2_HF_Intro](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/2_HF_Intro.ipynb) | Cargar modelos del Hub, probar un catálogo de clasificadores clásicos (ResNet, ViT, ConvNeXt...), detectar con el RF-DETR del cuaderno 1 desde el Hub, guardarlos en una carpeta y leer su licencia |
| 1 | 3. Modelos multimodales | [3_Multimodal](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/3_Multimodal.ipynb) | Clasificar con CLIP, describir con BLIP, detectar por texto con Grounding DINO, y preguntar, leer texto y detectar con instrucciones con Qwen3.5 |
| 2 | 4. DINO | [4_DINO](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/4_DINO.ipynb) | Vectores de imagen y de parche con DINOv3: parecido entre imágenes, correspondencias, PCA de los parches y detección de anomalías sin ejemplos de defectos |
| 2 | 5. Segmentación con SAM | [5_SAM](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/5_SAM.ipynb) | Segmentar con puntos en SAM 2, por texto con Grounding DINO o Qwen3.5, y buscar dentro de una foto combinando SAM y CLIP |
| 2 | 6. Otras tareas | [6_Otras_Tareas](https://colab.research.google.com/github/sergiovillanueva/Modelos_Fundacionales/blob/main/6_Otras_Tareas.ipynb) | Pose humana con ViTPose, OCR con GOT-OCR 2.0, superresolución con Swin2SR, quitar el fondo con RT-DETR y SAM 2, y profundidad con Depth Anything V2 |

Cada cuaderno acaba con un ejercicio para practicar por tu cuenta.

## Qué hay en este repositorio

- `1_OD.ipynb` … `6_Otras_Tareas.ipynb`: los cuadernos.
- `assets/`: las imágenes que usan los cuadernos.
- `pdf/`: los seis temas en PDF.

## En tu ordenador, sin Colab

El repositorio trae el entorno de Python con las mismas versiones que Colab (`pyproject.toml` y `uv.lock`). Hace falta [uv](https://docs.astral.sh/uv/) y, para ir rápido, una gráfica NVIDIA con un driver reciente (580 o posterior); sin gráfica también funciona, más despacio.

```
git clone https://github.com/sergiovillanueva/Modelos_Fundacionales
cd Modelos_Fundacionales
uv sync
uv run jupyter lab
```

`uv sync` descarga unos 5 GB la primera vez. Los modelos se bajan solos de Hugging Face al ejecutar cada cuaderno.

