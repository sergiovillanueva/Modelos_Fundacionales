# -*- coding: utf-8 -*-
"""Genera los iconos de pestana a partir del logo de Datamecum.

    python scripts/favicons.py

Recorta solo el simbolo, las llaves con las barras, porque la palabra "Datamecum" no se
lee a 32 pixeles. Lo deja sobre fondo blanco por dos motivos: las barras son azul marino
y sobre una pestana en modo oscuro desapareceria un fondo transparente, y los iconos de
Apple no admiten transparencia, la pintan de negro.

Necesita Pillow y numpy.
"""
from pathlib import Path

from PIL import Image
import numpy as np

WEB = Path(__file__).resolve().parent.parent
MARCA = WEB / 'public' / 'assets' / 'brand'

# El .gitignore de la raiz deja fuera los *.png sueltos, asi que el logo que viaja en el
# repositorio es el .webp. Son el mismo mapa de bits, comprobado pixel a pixel.
ORIGENES = ('logo-transparent.webp', 'logo-transparent.png')

CORTE_PALABRA = 440      # el simbolo acaba en la fila 432, la palabra empieza en la 496
MARGEN = 0.10            # aire alrededor del simbolo, en tanto por uno del lado
FONDO = (255, 255, 255)

TAMANOS = {
    'favicon-32.png': 32,        # pestana del navegador
    'favicon-180.png': 180,      # atajo en la pantalla de inicio de iOS
    'favicon-512.png': 512,      # marcadores grandes
}


def logo():
    for nombre in ORIGENES:
        if (MARCA / nombre).exists():
            return Image.open(MARCA / nombre).convert('RGBA')
    raise FileNotFoundError(f'No encuentro el logo en {MARCA}')


def simbolo():
    """El simbolo recortado justo por donde acaba, sin la palabra."""
    arriba = logo().crop((0, 0, 800, CORTE_PALABRA))

    alfa = np.array(arriba)[:, :, 3]
    filas = np.where((alfa > 8).any(axis=1))[0]
    columnas = np.where((alfa > 8).any(axis=0))[0]
    return arriba.crop((columnas[0], filas[0], columnas[-1] + 1, filas[-1] + 1))


def cuadrado(marca):
    """Centra el simbolo en un cuadrado blanco con margen."""
    lado = int(max(marca.size) * (1 + 2 * MARGEN))
    lienzo = Image.new('RGBA', (lado, lado), FONDO + (255,))
    lienzo.alpha_composite(marca, ((lado - marca.width) // 2, (lado - marca.height) // 2))
    return lienzo.convert('RGB')


def main():
    base = cuadrado(simbolo())
    print(f'  lienzo cuadrado de {base.size[0]} px')

    for nombre, lado in TAMANOS.items():
        base.resize((lado, lado), Image.LANCZOS).save(MARCA / nombre, optimize=True)
        print(f'  {nombre:20} {lado} x {lado}')

    # Un solo .ico con tres tamanos dentro, para /favicon.ico y navegadores viejos.
    ico = MARCA / 'favicon.ico'
    base.resize((64, 64), Image.LANCZOS).save(ico, sizes=[(16, 16), (32, 32), (48, 48)])
    # En la raiz, porque el navegador lo pide por su cuenta sin mirar el HTML.
    (WEB / 'public' / 'favicon.ico').write_bytes(ico.read_bytes())
    print('  favicon.ico          16, 32 y 48, tambien copiado a la raiz de public/')


if __name__ == '__main__':
    main()
