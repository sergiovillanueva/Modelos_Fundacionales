import torch
import transformers
from transformers import AutoImageProcessor, AutoModel
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import cv2
import requests
from io import BytesIO
import warnings
import torch.nn.functional as F
warnings.filterwarnings("ignore")
transformers.logging.set_verbosity_error()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_name = "facebook/dinov2-base" #DINOV2
# model_name = "facebook/dinov3-vitb16-pretrain-lvd1689m" #DINOv3

processor = AutoImageProcessor.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name).to(device)

print(f"Modelo DINO cargado: {model_name}")

url_dog = "https://github.com/sergiovillanueva/modelos_fundacionales/raw/main/assets/dog.jpg"
image_dog = Image.open(BytesIO(requests.get(url_dog).content)).convert("RGB")

import torch
import transformers
from transformers import AutoImageProcessor, AutoModel
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import cv2
import requests
from io import BytesIO
import warnings
import torch.nn.functional as F
warnings.filterwarnings("ignore")
transformers.logging.set_verbosity_error()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_name = "facebook/dinov2-base" #DINOV2
# model_name = "facebook/dinov3-vitb16-pretrain-lvd1689m" #DINOv3

processor = AutoImageProcessor.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name).to(device)

print(f"Modelo DINO cargado: {model_name}")

url_dog = "https://github.com/sergiovillanueva/modelos_fundacionales/raw/main/assets/dog.jpg"
image_dog = Image.open(BytesIO(requests.get(url_dog).content)).convert("RGB")

url_dog2 = "https://github.com/sergiovillanueva/modelos_fundacionales/raw/main/assets/dog2.jpg"
image_dog2 = Image.open(BytesIO(requests.get(url_dog2).content)).convert("RGB")

url_fruits = "https://github.com/sergiovillanueva/modelos_fundacionales/raw/main/assets/fruits.jpg"
image_fruits = Image.open(BytesIO(requests.get(url_fruits).content)).convert("RGB")

url_bananas = "https://github.com/sergiovillanueva/modelos_fundacionales/raw/main/assets/bananas.jpg"
image_bananas = Image.open(BytesIO(requests.get(url_bananas).content)).convert("RGB")

url_cars = "https://github.com/sergiovillanueva/modelos_fundacionales/raw/main/assets/cars.jpg"
image_cars = Image.open(BytesIO(requests.get(url_cars).content)).convert("RGB")



def extract_embeddings(image, do_resize=False):
    """Extrae embeddings de imagen usando DINOv2/v3"""    
    inputs = processor(images=image, return_tensors="pt", do_resize=do_resize, do_center_crop=False).to(device)
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    # CLS token: representa la imagen completa
    cls_embedding = outputs.last_hidden_state[0, 0, :].cpu().numpy()
    
    # Patch tokens: cada region de la imagen
    patch_embeddings = outputs.last_hidden_state[0, 1:, :].cpu().numpy()
    
    print(f"Embedding global (CLS): {cls_embedding.shape}, Patch embeddings: {patch_embeddings.shape}")
    
    return cls_embedding, patch_embeddings


def compare_images(img1, img2):
    """Calcula similitud coseno entre los embeddings de las imagenes"""
    cls_1, _ = extract_embeddings(img1, do_resize=True)
    cls_2, _ = extract_embeddings(img2, do_resize=True)

    emb1 = cls_1.flatten()
    emb2 = cls_2.flatten()
    similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))

    print(f"\nSimilitud coseno: {similarity:.3f}")

    fig, axes = plt.subplots(1, 2, figsize=(5, 5))
    axes[0].imshow(img1)
    axes[0].axis("off")
    axes[1].imshow(img2)
    axes[1].axis("off")
    plt.suptitle(f"Similitud: {similarity:.3f}", fontsize=16)
    plt.tight_layout()
    plt.savefig("compare.png")
    return similarity

    

def visualize_pca_5_images(img1, img2, img3, img4, img5, names=["Dog", "Dog2", "Fruits", "Bananas", "Cars"]):
    """Realiza PCA de 2 componentes sobre 5 imagenes y guarda el grafico"""
    
    # Extraer embeddings
    cls_1, _ = extract_embeddings(img1, do_resize=True)
    cls_2, _ = extract_embeddings(img2, do_resize=True)
    cls_3, _ = extract_embeddings(img3, do_resize=True)
    cls_4, _ = extract_embeddings(img4, do_resize=True)
    cls_5, _ = extract_embeddings(img5, do_resize=True)
    
    embeddings = np.array([cls_1, cls_2, cls_3, cls_4, cls_5])
    
    # PCA
    pca = PCA(n_components=2)
    coords = pca.fit_transform(embeddings)
    
    # Plot
    plt.figure(figsize=(8, 6))
    plt.scatter(coords[:, 0], coords[:, 1], c='red', s=100)
    
    for i, name in enumerate(names):
        plt.annotate(name, (coords[i, 0], coords[i, 1]), xytext=(10, 10), textcoords='offset points')
        
    plt.title("PCA Similarity Visualization")
    plt.grid(True)
    plt.savefig("pca_result.png")
    print("Grafico guardado en pca_result.png")

# compare_images(image_fruits, image_bananas)
visualize_pca_5_images(image_dog, image_dog2, image_fruits, image_bananas, image_cars)