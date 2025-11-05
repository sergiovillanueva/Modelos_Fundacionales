# Notebooks Practicos - Modelos Fundacionales en Vision Artificial

Este documento describe los notebooks practicos que se implementaran en las clases, siguiendo el estilo sencillo y visual de los notebooks de ejemplo (1_GD_SAM.ipynb y 2_QWEN_SAM.ipynb).

**Filosofia de los notebooks:**
- Codigo sencillo usando `transformers` de Hugging Face
- Explicaciones breves y claras en markdown
- Visualizaciones de resultados con matplotlib
- Ejemplos practicos e industriales
- Ejercicios opcionales al final
- Funciona en Colab y en local
- Descarga opcional de modelos en Google Drive
- Que no sean muy dificiles, que sean divertidos, con pequeños ejercicios muy sencillos como por ejemplo escribir un prompt.
- Que funcione todo en colab de manera muy sencilla
- Que utilice fotos de mi github (si necesitas alguna mas puedes descibirmela y la busco)

---

## Viernes - Sesion 1 (4 horas)

### 1. Deteccion de Objetos con RF-DETR (1h 30 min)
**Archivo:** `1_OD.ipynb` (ya existe, revisar y modificar)

**Contenido:**
- Introduccion a la deteccion de objetos
- Comparacion YOLO vs RF-DETR (Transformers)
- Instalacion de dependencias (!pip install rfdetr)
- Descarga del modelo RF-DETR (no está en la librfería transformers)
- Deteccion en imagenes industriales
- Visualizacion de bounding boxes y scores
- Limitaciones de modelos supervisados con clases fijas COCO

**Estilo:**
- Similar a 1_GD_SAM.ipynb pero enfocado en RF-DETR
- Explicar ventajas de Transformers sobre CNN
- Ejemplos visuales con imagenes industriales

**Ejercicio opcional:**
- Detectar objetos en imagen propia del alumno
- Comparar resultados con diferentes thresholds

---

### 2. Hugging Face Basics (30 min)
**Archivo:** `2_HF_Intro.ipynb`

**Contenido:**
- Que es Hugging Face Hub
- Explorar modelos en la web
- Uso de `from_pretrained()`
- Descargar modelo con `snapshot_download()` y de manera normal, que a lo mejor es mas facil
- Inspeccionar archivos del modelo (config.json, pytorch_model.bin o safetensors, etc.)
- Licencias comunes (Apache 2.0, MIT, GPL)
- Primera inferencia basica con un modelo sencillo (ej: image classification)

**Estilo:**
- Muy didactico y paso a paso
- Capturas de pantalla de la web de HF Hub (puedes describirlas y ya las pondré yo)
- Codigo minimo para descargar y usar un modelo
- Mostrar como buscar modelos por tarea

**Ejercicio opcional:**
- Buscar un modelo de clasificacion y de OD de imagenes en HF Hub
- Descargarlo y probarlo con una imagen propia

---

### 3. Modelos Fundacionales Multimodales (1h 45 min)
**Archivo:** `3_Multimodal.ipynb`

**Contenido:**
- Introduccion a modelos fundacionales
- Que es zero-shot learning

**Seccion CLIP:**
- Concepto: relacionar imagen con texto (como en el notebook de ejemplo 1_GD_SAM.ipynb)
- Carga del modelo `openai/clip-vit-base-patch32`
- Clasificacion zero-shot con multiples categorias
- Ejemplo: clasificar imagenes industriales

**Seccion BLIP:**
- Concepto: generar descripciones de imagenes ((como en el notebook de ejemplo 1_GD_SAM.ipynb))
- Carga del modelo `Salesforce/blip-image-captioning-base`
- Generar captions automaticos
- Ejemplo: describir escenas

**Seccion Grounding DINO:**
- Concepto: deteccion guiada por texto (como en el notebook de ejemplo 1_GD_SAM.ipynb)
- Carga del modelo `IDEA-Research/grounding-dino-base`
- Detectar objetos con prompts en lenguaje natural
- Configurar thresholds (detection y text)
- Ejemplo: "encuentra todas las tuercas" en imagen industrial

**Seccion Qwen2.5-VL:**
- Concepto: VLM con razonamiento visual (como en el notebook de ejemplo 2_QWEN_SAM.ipynb)
- Carga del modelo `Qwen/Qwen2.5-VL-3B-Instruct`
- Preguntas sobre imagenes
- Generar respuestas estructuradas (JSON)
- Ejemplo: "Cuantos componentes defectuosos hay?"

**Comparativa:**
- Tabla comparando CLIP, BLIP, Grounding DINO y Qwen2.5-VL
- Cuando usar cada uno

**Estilo:**
- Seguir el formato de 1_GD_SAM.ipynb
- Secciones bien separadas con markdown
- Visualizaciones claras
- Ejemplos industriales (puedes poner la descripcion de la imagen y yo la busco y añado manualmente)

**Ejercicio opcional:**
- Usar Qwen2.5-VL para hacer preguntas sobre una imagen propia
- Comparar CLIP vs Qwen2.5-VL en clasificacion

---

## Sabado - Sesion 2 (4 horas)

### 4. DINO v3 Auto-supervisado (1h)
**Archivo:** `4_DINOv3.ipynb`

**Contenido:**
- Que es el aprendizaje auto-supervisado
- DINO/DINOV2/DINOv3 como extractores de features
- Carga del modelo `facebook/dinov2-base`
- Extraer embeddings de imagenes
- Calcular similitud entre regiones de una imagen
- Visualizacion con t-SNE de patches
- Aplicacion: encontrar regiones similares en imagenes industriales

**Estilo:**
- Codigo sencillo con transformers
- Visualizaciones de similitud con heatmaps
- Proyeccion t-SNE en 2D coloreada por clusters
- Explicar concepto de "self-attention"

**Ejercicio opcional:**
- Calcular similitud entre dos imagenes diferentes
- Visualizar que partes son similares

---

### 5. Segmentacion con SAM2 (1h)
**Archivo:** `5_SAM2.ipynb`

**Contenido:**
- Que es SAM (Segment Anything Model)
- SAM vs SAM2 (mejoras)
- Carga del modelo `facebook/sam2-hiera-large`

**Segmentacion interactiva:**
- Segmentar con puntos (positivos/negativos)
- Segmentar con bounding boxes
- Visualizar mascaras

**Segmentacion automatica:**
- Detectar y segmentar todos los objetos en una imagen
- Aplicar filtros por tamaño

**Pipeline Grounding DINO + SAM2:**
- Combinar deteccion por texto + segmentacion precisa
- Ejemplo: "segmenta todas las tuercas"

**Pipeline Qwen2.5-VL + SAM2:**
- Usar VLM para entender la escena y segmentar
- Ejemplo: "segmenta el componente mas grande"

**Estilo:**
- Similar a 1_GD_SAM.ipynb pero mas completo
- Mostrar ventajas de SAM2 vs SAM1
- Casos industriales: control de calidad

**Ejercicio opcional:**
- Segmentar objetos en imagen propia
- Calcular areas de los objetos segmentados

---

### 6. Estimacion de Pose Humana (45 min)
**Archivo:** `6_Pose.ipynb`

**Contenido:**
- Que es pose estimation
- Aplicaciones: deporte, salud, seguridad
- Carga de modelo de keypoints `microsoft/yolov8-pose` o similar en HF
- Detectar keypoints humanos (17 puntos COCO)
- Visualizar skeleton sobre imagen
- Aplicacion en video (si hay tiempo)

**Estilo:**
- Codigo muy simple
- Visualizacion clara de keypoints con lineas
- Ejemplo con personas en diferentes poses

**Ejercicio opcional:**
- Detectar pose en foto propia
- Contar cuantas personas hay en una imagen grupal

---

### 7. Otras Tareas de Vision (1h - bonus)
**Archivo:** `7_Extras.ipynb`

**Contenido:**
Notebook tipo "showcase" con multiples tareas en secciones cortas, solo para que lo vean.

**OCR - Reconocimiento de texto:**
- Modelo `microsoft/trocr-base-printed` o alguno sencillo de transformers
- Extraer texto de imagenes
- Ejemplo: leer etiquetas industriales

**Superresolucion - Mejora de calidad:**
- Modelo `caidas/swin2SR-classical-sr-x2-64`
- Aumentar resolucion de imagenes
- Ejemplo: mejorar imagen de baja calidad

**Background Removal - Eliminacion de fondo:**
- Modelo `briaai/RMBG-1.4`
- Eliminar fondo de imagenes
- Ejemplo: aislar productos para catalogo

**Depth Estimation - Estimacion de profundidad:**
- Modelo `depth-anything/Depth-Anything-V2-Base-hf`
- Generar mapa de profundidad
- Visualizar con colormap
- Ejemplo: analisis de escenas 3D

**Image Matching - Correspondencia de puntos:**
- Modelo `LightGlue` + `SuperPoint`
- Encontrar puntos correspondientes entre dos imagenes
- Visualizar matches
- Ejemplo: reconstruccion 3D, SLAM

**Estilo:**
- Secciones cortas e independientes
- Cada tarea con 1-2 ejemplos visuales
- Codigo minimo necesario
- Mas para inspirar que para profundizar

**Ejercicio opcional:**
- Elegir una tarea y aplicarla a problema propio
- Combinar dos tareas (ej: depth + segmentation)

---

## Resumen de Notebooks

| Archivo | Tema | Duracion | Modelos Principales |
|---------|------|----------|---------------------|
| `1_OD.ipynb` | Deteccion de Objetos | 1h 30m | RF-DETR |
| `2_HF_Intro.ipynb` | Hugging Face Basics | 30m | Modelo simple de clasificacion |
| `3_Multimodal.ipynb` | Modelos Multimodales | 1h 45m | CLIP, BLIP, Grounding DINO, Qwen2.5-VL |
| `4_DINOv3.ipynb` | Auto-supervisado | 1h | DINOv3 |
| `5_SAM2.ipynb` | Segmentacion | 1h | SAM2, Grounding DINO + SAM2, Qwen + SAM2 |
| `6_Pose.ipynb` | Pose Estimation | 45m | YOLOv8-pose o similar |
| `7_Extras.ipynb` | Otras tareas (bonus) | 1h | TrOCR, Swin2SR, RMBG, Depth-Anything, LightGlue |

---

## Estilo General de Implementacion

**Estructura comun de cada notebook:**

1. **Titulo y descripcion breve**
2. **Configuracion e imports**
   - Instalar dependencias si es necesario (solo rfdtr y puedeque alguna para qwen 2.5 VL)
   - Imports de transformers, torch, PIL, matplotlib, cv2
   - Detectar device (cuda/cpu)
3. **Descarga opcional de modelos en local**
   - Codigo para Google Drive
   - `snapshot_download()` para cachear modelos pero opcion para usarlos de manera estandar
4. **Carga de modelos**
   - `from_pretrained()` con rutas locales o remotas
5. **Carga de imagenes de ejemplo**
   - Descargar desde URL publica o usar rutas locales
6. **Secciones tematicas**
   - Markdown con explicacion breve (que hace, por que es util)
   - Funcion Python que encapsula la funcionalidad
   - Ejemplo de uso con visualizacion
7. **Casos practicos industriales**
   - Al menos un ejemplo aplicado a industria
8. **Ejercicio opcional**
   - Para que el alumno practique
   - Indicacion de contacto para ayuda

**Codigo:**
- Funciones simples y reutilizables
- Comentarios en español donde sea necesario, para que los alumnos lo entiendan todo bien
- Visualizaciones claras con matplotlib, muy sencillas, como en los notebooks de ejemplo
- Usar `warnings.filterwarnings("ignore")` para limpieza
- Configurar `transformers.logging.set_verbosity_error()`

**Visualizaciones:**
- Subplots para comparar original, resultado, mascaras
- Titulos descriptivos en cada subplot
- `plt.axis("off")` para imagenes
- Usar `cv2` para dibujar bounding boxes y texto, muy sencillo
- Colores consistentes (azul para boxes, verde para OK, rojo para NOK)

---

## Proximos Pasos

1. **Crear los notebooks uno por uno** basandose en:
   - Este documento (NOTEBOOKS.md)
   - Estilo de 1_GD_SAM.ipynb y 2_QWEN_SAM.ipynb
   - README.md para contenido teorico
3. **Probar en Colab** - Verificar que funciona sin problemas
4. **Ajustar tiempos** - Puede que algunos notebooks sean muy largos/cortos
