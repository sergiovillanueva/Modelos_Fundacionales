import torch
from transformers import AutoImageProcessor, AutoModel
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import requests
from io import BytesIO
import cv2

# Configuración
# Usamos DINOv2 Base, que es excelente para capturar semántica visual
MODEL_NAME = "facebook/dinov2-base"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"Usando dispositivo: {device}")
print(f"Cargando modelo: {MODEL_NAME}...")

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME).to(device)

def load_image(url):
    """Descarga y carga una imagen desde una URL."""
    response = requests.get(url)
    return Image.open(BytesIO(response.content)).convert("RGB")

def extract_features(image):
    """
    Pasa la imagen por el modelo DINO y devuelve:
    - cls_token: El embedding global de la imagen (vector de contexto).
    - patch_tokens: Los embeddings locales de cada parche (detalles).
    """
    # El procesador redimensiona y normaliza la imagen automáticamente (usualmente a 224x224)
    inputs = processor(images=image, return_tensors="pt").to(device)
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    # last_hidden_state: (batch, seq_len, hidden_size)
    # seq_len = 1 (CLS) + num_patches
    features = outputs.last_hidden_state.squeeze(0) # Quitamos dimensión batch (1, N, D) -> (N, D)
    
    # El primer token es el CLS (representación global)
    cls_token = features[0]
    
    # El resto son los parches (representación local)
    patch_tokens = features[1:]
    
    # Normalizamos los vectores para que el producto punto equivalga a la similitud coseno
    cls_token = cls_token / cls_token.norm()
    patch_tokens = patch_tokens / patch_tokens.norm(dim=-1, keepdim=True)
    
    return cls_token.cpu().numpy(), patch_tokens.cpu().numpy()

def visualize_similarity():
    # URLs de las imágenes
    url_person_dog = "https://github.com/sergiovillanueva/modelos_fundacionales/raw/main/assets/person_dog.jpg"
    url_dog = "https://github.com/sergiovillanueva/modelos_fundacionales/raw/main/assets/dog.jpg"
    
    print("Cargando imágenes...")
    img1 = load_image(url_person_dog)
    img2 = load_image(url_dog)
    
    print("Extrayendo características...")
    cls1, patches1 = extract_features(img1)
    cls2, patches2 = extract_features(img2)
    
    # --- PARTE DIDÁCTICA ---
    print("\n" + "="*40)
    print("       ANÁLISIS DE SIMILITUD DINO")
    print("="*40)
    
    # 1. Similitud Global (Token CLS)
    # El token CLS resume toda la escena.
    global_sim = np.dot(cls1, cls2)
    print(f"\n1. Similitud Global (Token CLS): {global_sim:.4f}")
    print("   Explicación: Este valor indica qué tan parecidas son las escenas en general.")
    print("   (Persona+Perro vs Perro solo -> Similitud media/baja porque el contexto cambia)")
    
    # 2. Similitud Local (Parches)
    # Calculamos la similitud entre TODOS los parches de img1 y TODOS los de img2.
    # patches1 shape: (N1, D), patches2 shape: (N2, D) -> sim_matrix: (N1, N2)
    sim_matrix = np.dot(patches1, patches2.T)
    
    # Para cada parche en la Imagen 1, encontramos su "mejor coincidencia" en la Imagen 2
    best_match_1 = np.max(sim_matrix, axis=1) # Max por filas
    
    # Para cada parche en la Imagen 2, encontramos su "mejor coincidencia" en la Imagen 1
    best_match_2 = np.max(sim_matrix, axis=0) # Max por columnas
    
    avg_local_sim = np.mean(best_match_1)
    print(f"\n2. Similitud Local Promedio: {avg_local_sim:.4f}")
    print("   Explicación: Este valor es el promedio de qué tan bien encaja cada parte de la imagen 1 en la imagen 2.")
    print("   (Aunque la escena global sea distinta, las partes del perro coinciden muy bien)")
    
    # --- VISUALIZACIÓN ---
    
    # Calculamos el tamaño del grid (asumiendo imagen cuadrada procesada, ej. 14x14)
    n_patches = patches1.shape[0]
    grid_size = int(np.sqrt(n_patches))
    
    # Reconstruimos los mapas de calor 2D
    heatmap1 = best_match_1.reshape(grid_size, grid_size)
    heatmap2 = best_match_2.reshape(grid_size, grid_size)
    
    fig, axes = plt.subplots(1, 2, figsize=(16, 8))
    
    def plot_heatmap(ax, img, heatmap, title):
        # Redimensionamos el heatmap (ej. 14x14) al tamaño original de la imagen
        heatmap_resized = cv2.resize(heatmap, img.size, interpolation=cv2.INTER_CUBIC)
        
        # Normalizamos para visualizar (0 a 1)
        heatmap_norm = (heatmap_resized - heatmap_resized.min()) / (heatmap_resized.max() - heatmap_resized.min())
        
        ax.imshow(img)
        # Superponemos el mapa de calor (jet es bueno para ver intensidad: rojo=alto, azul=bajo)
        im = ax.imshow(heatmap_norm, cmap='jet', alpha=0.5)
        ax.set_title(title, fontsize=14)
        ax.axis('off')
        return im

    plot_heatmap(axes[0], img1, heatmap1, "Imagen 1: ¿Qué zonas coinciden con la otra imagen?")
    plot_heatmap(axes[1], img2, heatmap2, "Imagen 2: ¿Qué zonas coinciden con la otra imagen?")
    
    plt.suptitle(f"Comparación DINOv2\nSimilitud Global (CLS): {global_sim:.2f} | Coincidencia Local Promedio: {avg_local_sim:.2f}", fontsize=16)
    
    # Guardar resultado
    output_file = "result.png"
    plt.savefig(output_file, bbox_inches='tight')
    print(f"\n[OK] Visualización guardada en: {output_file}")
    print("     Abre este archivo para ver cómo el modelo detecta al perro en ambas imágenes.")

if __name__ == "__main__":
    visualize_similarity()