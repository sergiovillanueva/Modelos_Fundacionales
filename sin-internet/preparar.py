"""Download everything the six notebooks need, so the course can run without internet.

Run it once, with internet, from the course folder:  python sin-internet/preparar.py
Models and the dataset go to the Hugging Face cache; the two files that do not come from
the Hub (the video of notebook 1 and the COCO photo of notebook 6) go to assets/.
"""
from pathlib import Path

import requests
from huggingface_hub import list_repo_files, snapshot_download

ROOT = Path(__file__).resolve().parent.parent

# Every model the notebooks load, in course order.
MODELS = [
    "Roboflow/rf-detr-medium",                      # 1 and 2
    "google/vit-base-patch16-224",                  # 2
    "microsoft/resnet-50",                          # 2
    "openai/clip-vit-base-patch32",                 # 3 and 5
    "Salesforce/blip-image-captioning-base",        # 3
    "IDEA-Research/grounding-dino-base",            # 3 and 5
    "Qwen/Qwen3.5-2B",                              # 3 and 5
    "timm/vit_small_patch16_dinov3.lvd1689m",       # 4
    "facebook/sam2.1-hiera-small",                  # 5 and 6
    "facebook/sam-vit-base",                        # 5
    "PekingU/rtdetr_r50vd_coco_o365",               # 6
    "usyd-community/vitpose-plus-base",             # 6
    "stepfun-ai/GOT-OCR-2.0-hf",                    # 6
    "caidas/swin2SR-classical-sr-x2-64",            # 6
    "depth-anything/Depth-Anything-V2-Small-hf",    # 6
]
DATASET = "rishitdagli/cppe-5"                       # fine-tuning in notebook 1
FILES = {
    "bedroom.mp4": "https://huggingface.co/datasets/hf-internal-testing/sam2-fixtures/resolve/main/bedroom.mp4",
    "000000000139.jpg": "http://images.cocodataset.org/val2017/000000000139.jpg",
}
# Weights in formats the notebooks never use (TensorFlow, Flax, ONNX...).
SKIP = ["*.h5", "*.msgpack", "*.onnx", "onnx/*", "*.ot", "tf_model*", "flax_model*", "rust_model*", "*.tflite"]


def download_model(repo):
    files = list_repo_files(repo)
    skip = list(SKIP)
    # When a repo has both, the safetensors weights are enough.
    if any(f.endswith(".safetensors") for f in files):
        skip += ["*.bin", "*.pt", "*.pth"]
    snapshot_download(repo, ignore_patterns=skip)


def main():
    for number, repo in enumerate(MODELS, start=1):
        print(f"[{number}/{len(MODELS)}] {repo}")
        download_model(repo)

    print(f"Dataset {DATASET}")
    from datasets import load_dataset
    load_dataset(DATASET)

    # Notebook 2 saves a model in a folder of its own: leave it ready too.
    snapshot_download("google/vit-base-patch16-224", local_dir=ROOT / "modelos" / "vit-base-patch16-224",
                      allow_patterns=["*.json", "*.safetensors"])

    for name, url in FILES.items():
        target = ROOT / "assets" / name
        if not target.exists():
            print(f"Archivo {name}")
            response = requests.get(url, timeout=120)
            response.raise_for_status()
            target.write_bytes(response.content)

    print("\nListo: los seis cuadernos ya pueden ejecutarse sin internet con sin-internet/clase.ps1")


if __name__ == "__main__":
    main()
