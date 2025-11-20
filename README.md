
# Curso: Modelos Fundacionales en Visión Artificial

Evolución: Detección (modelos con clases COCO, supervisados) -> Multimodales (imagen + texto) -> VLM (razonamiento visual y lingüístico) -> Auto-supervisados (DINO v3) -> Segmentación (SAM2) -> Pose -> Extras

- Cada apartado tiene una parte práctica que se puede descargar de GitHub con todo incluido, y podrá ejecutarse en Colab o en local.
- Se incluirá un ejercicio opcional para que los alumnos practiquen y puedan escribirme un correo si necesitan ayuda.
- Todo se hará con la librería Transformers de Hugging Face (excepto RFDTR). Es fácil de usar, con licencias permisivas y modelos SOTA.
- La parte final es un bonus, si hay tiempo, para enseñar otras aplicaciones como OCR, Matching, Profundidad, Superresolución y Eliminación de Fondo.

---

## Viernes (4 horas)

### Detección de Objetos (1h 30 min)
Introducción a la detección de objetos, mostrando cómo las arquitecturas modernas sientan las bases de los modelos fundacionales de visión y cómo estos conceptos se extienden hacia tareas más generales y multimodales.

- Introducción a las familias de Visión Artificial (Clasificación, Detección, Segmentación, Anomalías)
- Introducción a la detección de objetos
- Comparación entre arquitecturas clásicas y modernas
- YOLO: concepto, versiones y ventajas
- RF-DETR: arquitectura basada en Transformers
- Repaso del entorno / uso en Colab
- Notebook práctico: detección en imágenes con modelos preentrenados (RF-DETR) y fine tunning
- Limitaciones y evolución hacia arquitecturas fundacionales

### Hugging Face y gestión de entornos (30 min)
Aprender a buscar, descargar y ejecutar modelos en Hugging Face, tanto en Colab como en local.

- Qué es Hugging Face (Model Hub, Datasets, Spaces)
- Cómo usar from_pretrained
- Licencias comunes en IA (Apache 2.0, MIT, GPL...)
- Notebook práctico: descargar un modelo, inspeccionar sus archivos y probar una inferencia básica

Descanso (15 min)

### Modelos Fundacionales Multimodales (1h 45 min)
Evolución desde los modelos unimodales (solo imagen) hacia los modelos multimodales, que combinan información visual y textual. Se verán varios ejemplos de modelos fundacionales actuales y cómo se aplican a tareas reales.

- Qué son los modelos fundacionales y su importancia
- De NLP a visión: CLIP, SAM, DINO
- CLIP: relación texto-imagen
- BLIP: captioning y preguntas visuales
- Grounding DINO: detección guiada por texto
- Qwen2.5-VL (VLM): razonamiento visual y textual avanzado
- Comparación entre CLIP, BLIP y un VLM moderno
- Notebook práctico: clasificación, captioning y detección con prompts (CLIP, BLIP, Grounding DINO, Qwen2.5-VL)

---

## Sábado (4 horas)

### Repaso del viernes (30 min)
Repaso de los temas del primer día. Se resolverán dudas y se revisarán los resultados de los notebooks.

- Detección con RF-DETR
- CLIP, BLIP, Grounding DINO y Qwen2.5-VL
- Preguntas rápidas y repaso práctico

### DINO / DINOv3 (1h)
Introducción a los modelos auto-supervisados DINO y DINOv3. Se explicará su papel como extractores de características visuales y su importancia como base de otros modelos fundacionales. Se verá cómo calcular similitudes entre regiones de una imagen y cómo visualizar esas relaciones con t-SNE.

- DINO/DINOv3 como extractores de características visuales
- Aprendizaje auto-supervisado y similitud de parches
- Visualización de features y proyecciones t-SNE
- Notebook práctico: embeddings + t-SNE / similitud de regiones

### Segmentación con SAM y variantes (1h)
Bloque centrado en los modelos de segmentación fundacional. SAM2 como modelo universal de segmentación y se mostrará cómo combinarlo con Grounding DINO y VLMs para hacer segmentación guiada por texto. Se verán ejemplos aplicados a imágenes.

- Segment Anything (SAM2): segmentación universal
- Casos industriales: segmentar componentes o zonas específicas
- Notebook práctico: segmentación interactiva y segmentación por texto con Grounding DINO y VLMs

Descanso (15 min)

### Estimación de Pose (45 min)
Qué es la estimación de pose humana y en qué casos se usa. Detectar puntos clave en imágenes.

- Qué es y para qué sirve
- Modelos para keypoints humanos en Hugging Face
- Notebook práctico: detección de pose humana sobre fotos o vídeo

### Otras tareas de visión fundacional (1h)
Bloque final con una revisión de aplicaciones adicionales de la visión fundacional. Se verán ejemplos prácticos de diferentes modelos, todos con un notebook rápido y visual.

- OCR: reconocimiento de texto con EasyOCR
- Superresolución: mejora de calidad visual con Swin2SR
- Background Removal: eliminación de fondo con RMBG
- Estimación de profundidad con Depth Anything V2
- Matching: correspondencia de puntos con LightGlue + SuperPoint

Cada modelo se mostrará con ejemplos sencillos para experimentar y entender su utilidad.
