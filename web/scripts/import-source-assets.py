"""Import the selected teaching visuals from the extracted Gamma PPTX.

The deck remains the source of truth. Static images are copied without
re-encoding; GIFs receive an animated WebP plus a still poster so motion is
always controlled by the learner.
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageSequence, ImageStat


WEB = Path(__file__).resolve().parents[1]
MEDIA = WEB / "tmp" / "pptx-extract" / "ppt" / "media"
ASSETS = WEB / "public" / "assets"

STATIC = {
    "tema-02": {
        "image-31-1.jpeg": "portada-hugging-face.jpeg",
        "image-32-13.png": "model-hub.webp",
    },
    "tema-03": {
        "image-37-1.jpeg": "portada-multimodal.jpeg",
        "image-39-1.jpeg": "espacio-multimodal.jpeg",
        "image-40-1.jpeg": "zero-shot.jpeg",
        "image-41-1.jpeg": "clip-arquitectura.jpeg",
        "image-42-9.jpeg": "clip-similitud.jpeg",
        "image-42-10.png": "clip-matriz.webp",
        "image-45-1.jpeg": "blip.jpeg",
        "image-47-9.jpeg": "grounding-dino.jpeg",
        "image-53-1.png": "comparativa-modelos.webp",
    },
    "tema-04": {
        "image-55-1.jpeg": "portada-dino.jpeg",
        "image-56-1.jpeg": "auto-supervision.jpeg",
        "image-59-9.jpeg": "atencion-dino.jpeg",
        "image-60-1.jpeg": "copias-dino.jpeg",
        "image-62-11.jpeg": "datos-dinov2.jpeg",
        "image-64-1.jpeg": "capacidades-dino.jpeg",
        "image-65-1.jpeg": "extractor-dino.jpeg",
        "image-66-1.jpeg": "pca-dino.jpeg",
        "image-66-2.jpeg": "vecinos-dino.jpeg",
    },
    "tema-05": {
        "image-71-1.jpeg": "portada-sam.jpeg",
        "image-72-1.jpeg": "tipos-segmentacion.jpeg",
        "image-73-1.jpeg": "arquitectura-sam1.jpeg",
        "image-74-1.jpeg": "arquitectura-sam2.jpeg",
        "image-75-3.jpeg": "arquitectura-sam3.jpeg",
    },
}

ANIMATED = {
    "tema-04": {
        "image-57-1.gif": "auto-supervision",
        "image-58-9.gif": "teacher-student",
        "image-61-1.gif": "evolucion-dino",
        "image-67-1.gif": "dinov3-mapas",
        "image-68-1.gif": "dinov3-denso",
    },
    "tema-05": {"image-76-1.gif": "evolucion-sam"},
}


def convert_animation(source: Path, animated: Path, poster: Path):
    with Image.open(source) as gif:
        # Long Gamma animations can contain hundreds of full-resolution frames.
        # Sampling every second frame above 200 keeps the lesson responsive while
        # preserving the motion and avoids loading several gigabytes in memory.
        frame_count = getattr(gif, "n_frames", 1)
        step = 4 if frame_count > 80 else 2 if frame_count > 40 else 1
        frames = []
        durations = []
        default_duration = gif.info.get("duration", 100)
        for index, frame in enumerate(ImageSequence.Iterator(gif)):
            if index % step:
                if durations:
                    durations[-1] += frame.info.get("duration", default_duration)
                continue
            converted = frame.convert("RGB")
            if converted.width > 640:
                converted.thumbnail((640, 640), Image.Resampling.LANCZOS)
            frames.append(converted.copy())
            durations.append(frame.info.get("duration", default_duration))
        poster_frame = max(frames, key=lambda frame: sum(ImageStat.Stat(frame.resize((96, 96))).var))
        poster_frame.save(poster, "WEBP", quality=86, method=2)
        frames[0].save(
            animated,
            "WEBP",
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=gif.info.get("loop", 0),
            quality=76,
            method=0,
        )


def main():
    for topic, mapping in STATIC.items():
        destination = ASSETS / topic / "presentacion"
        destination.mkdir(parents=True, exist_ok=True)
        for source_name, target_name in mapping.items():
            source = MEDIA / source_name
            target = destination / target_name
            if source.suffix.lower() == target.suffix.lower():
                shutil.copy2(source, target)
            else:
                with Image.open(source) as image:
                    image.save(target, "WEBP", quality=88, method=4)
            print(destination / target_name)
    for topic, mapping in ANIMATED.items():
        destination = ASSETS / topic / "presentacion"
        destination.mkdir(parents=True, exist_ok=True)
        for source_name, stem in mapping.items():
            convert_animation(
                MEDIA / source_name,
                destination / f"{stem}.webp",
                destination / f"{stem}-poster.webp",
            )
            print(destination / f"{stem}.webp")


if __name__ == "__main__":
    main()
