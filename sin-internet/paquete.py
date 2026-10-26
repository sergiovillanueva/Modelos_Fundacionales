"""Build curso-sin-internet.zip: everything a student needs if the website or Colab are not reachable.

Run from the course folder with the course environment:
    .venv-clase\\Scripts\\python.exe sin-internet\\paquete.py            # runs the notebooks again
    .venv-clase\\Scripts\\python.exe sin-internet\\paquete.py --reuse    # reuses the last executed copies

The notebooks are executed WITHOUT network (Hugging Face offline mode and a dead proxy), which also
proves that the offline kit works. The web must be built first (npm run build in web/).
"""
import os
import re
import shutil
import sys
import time
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "curso-sin-internet"
NOTEBOOKS = ["1_OD", "2_HF_Intro", "3_Multimodal", "4_DINO", "5_SAM", "6_Otras_Tareas"]

README = """CURSO: MODELOS FUNDACIONALES EN VISION ARTIFICIAL (sin internet)
=================================================================

Esta carpeta tiene todo el curso para verlo sin conexion.

1. web/index.html
   La web completa del curso, con las simulaciones interactivas.
   Haz doble clic en index.html y se abre en el navegador. No necesita internet.

2. pdf/
   Los seis temas en PDF, para leer, imprimir o anotar.

3. practicas-resueltas/
   Los seis cuadernos YA EJECUTADOS, con todos sus resultados (imagenes, cajas,
   mascaras, graficos). Se abren con doble clic en el navegador.

4. cuadernos/
   Los seis cuadernos (.ipynb) para ejecutarlos tu mismo.
   Lo mas sencillo es Google Colab: entra en colab.research.google.com,
   Archivo > Subir cuaderno, y elige el que toque. Necesita internet, porque
   descarga los modelos de Hugging Face la primera vez.

Orden del curso
   Dia 1: temas y cuadernos 1, 2 y 3.
   Dia 2: temas y cuadernos 4, 5 y 6.

Web del curso: https://datamecum.sergiovillanuevalopez.com
Repositorio:   https://github.com/sergiovillanueva/Modelos_Fundacionales
"""


def run_notebooks(target):
    """Execute every notebook inside the course folder with the network cut off."""
    import nbformat
    from nbclient import NotebookClient

    os.environ.update({
        "HF_HUB_OFFLINE": "1", "HF_DATASETS_OFFLINE": "1", "TRANSFORMERS_OFFLINE": "1",
        "HTTP_PROXY": "http://127.0.0.1:9", "HTTPS_PROXY": "http://127.0.0.1:9",
        "http_proxy": "http://127.0.0.1:9", "https_proxy": "http://127.0.0.1:9",
    })
    target.mkdir(parents=True, exist_ok=True)
    failures = []
    for name in NOTEBOOKS:
        start = time.time()
        nb = nbformat.read(ROOT / f"{name}.ipynb", as_version=4)
        client = NotebookClient(nb, timeout=3600, kernel_name="python3", allow_errors=True,
                                resources={"metadata": {"path": str(ROOT)}})
        client.execute()
        errors = [i for i, cell in enumerate(nb.cells) if cell.cell_type == "code"
                  and any(o.output_type == "error" for o in cell.get("outputs", []))]
        nbformat.write(nb, target / f"{name}.ipynb")
        print(f"  {name}: {time.time() - start:.0f} s, celdas con error: {errors or 'ninguna'}")
        if errors:
            failures.append(name)
    return failures


def to_html(source, target):
    """Convert the executed notebooks to HTML, without stderr (progress bars, warnings, local paths)."""
    import nbformat
    from nbconvert import HTMLExporter

    target.mkdir(parents=True, exist_ok=True)
    exporter = HTMLExporter(template_name="lab")
    for name in NOTEBOOKS:
        nb = nbformat.read(source / f"{name}.ipynb", as_version=4)
        for cell in nb.cells:
            if cell.cell_type == "code":
                cell.outputs = [o for o in cell.outputs
                                if not (o.output_type == "stream" and o.name == "stderr")]
        body, _ = exporter.from_notebook_node(nb)
        # The Colab badge is a remote image: without internet it shows up broken, so keep only its link text
        body = re.sub(r'<img[^>]*colab-badge\.svg[^>]*>', "Abrir en Colab", body)
        (target / f"{name}.html").write_text(body, encoding="utf-8")


def main():
    dist = ROOT / "web" / "dist"
    if not (dist / "index.html").exists():
        sys.exit("Falta la web construida: ejecuta 'npm run build' dentro de web/.")

    executed = ROOT / "sin-internet" / ".ejecutados"
    if "--reuse" not in sys.argv:
        print("Ejecutando los cuadernos sin red...")
        failures = run_notebooks(executed)
        if failures:
            sys.exit(f"Hay errores en {failures}: revisalos antes de empaquetar.")

    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(dist, OUT / "web")
    shutil.copytree(dist / "descargas", OUT / "pdf")
    (OUT / "cuadernos").mkdir(parents=True)
    for name in NOTEBOOKS:
        shutil.copy(ROOT / f"{name}.ipynb", OUT / "cuadernos" / f"{name}.ipynb")
    to_html(executed, OUT / "practicas-resueltas")
    (OUT / "LEEME.txt").write_text(README, encoding="utf-8")

    archive = ROOT / "curso-sin-internet.zip"
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(OUT.rglob("*")):
            zf.write(path, Path("curso-sin-internet") / path.relative_to(OUT))
    print(f"Paquete listo: {archive.name} ({archive.stat().st_size / 1e6:.0f} MB)")


if __name__ == "__main__":
    main()
