# -*- coding: utf-8 -*-
"""Genera la imagen que se ve al pegar el enlace del curso en WhatsApp, LinkedIn o Slack.

    python scripts/social-card.py

Sale en public/assets/brand/social-card.png a 1200 x 630, que es la medida que esperan
las redes y la que declaran las etiquetas og:image:width y og:image:height. Si cambias
el tamano, cambia tambien esas etiquetas en templates/ o la tarjeta se recorta sola.

Necesita Pillow y numpy. Usa las tipografias y los colores del propio sitio.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
import numpy as np

WEB = Path(__file__).resolve().parent.parent
FUENTES = WEB / 'public' / 'fonts'
MARCA = WEB / 'public' / 'assets' / 'brand'
DESTINO = MARCA / 'social-card.png'

ANCHO, ALTO = 1200, 630
MARGEN = 76

FONDO = (16, 16, 77)        # --color-hero-bg
CIAN = (0, 208, 255)        # --color-brand-accent
BLANCO = (255, 255, 255)
APAGADO = (166, 178, 214)

TITULO = 'Modelos fundacionales en visión artificial'
PIE = 'Seis temas · Prácticas en Google Colab'

# El titulo ocupa la mitad de abajo, asi que las cajas van solo en la banda de arriba
# a la derecha. Si alargas el titulo, comprueba que no se crucen.
CAJAS = [          # (x, y, ancho, alto, opacidad, largo de la marca de esquina)
    (604, 52, 306, 216, 48, 24),
    (700, 128, 194, 140, 88, 18),
    (938, 92, 168, 134, 38, 16),
]


def fondo_con_halo():
    """Azul de portada con un halo mas claro arriba a la derecha."""
    base = np.zeros((ALTO, ANCHO, 3), np.float32)
    base[:, :] = FONDO

    yy, xx = np.mgrid[0:ALTO, 0:ANCHO]
    distancia = np.sqrt(((xx - 990) / (ANCHO * 0.62)) ** 2 + ((yy - 90) / (ALTO * 0.92)) ** 2)
    halo = np.clip(1 - distancia, 0, 1) ** 2.4

    base += halo[:, :, None] * (np.array([38, 56, 168], np.float32) - base) * 0.9
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert('RGBA')


def motivo_de_cajas(lienzo):
    """Cajas de deteccion en cian, que es de lo que va el curso."""
    capa = Image.new('RGBA', lienzo.size, (0, 0, 0, 0))
    trazo = ImageDraw.Draw(capa)

    for x, y, ancho, alto, alfa, esquina in CAJAS:
        trazo.rounded_rectangle((x, y, x + ancho, y + alto), radius=10,
                                outline=CIAN + (alfa,), width=3)
        # Las esquinas van mas marcadas, como en el visor de una camara.
        for dx, dy in ((0, 0), (ancho, 0), (0, alto), (ancho, alto)):
            px, py = x + dx, y + dy
            sx = esquina if dx == 0 else -esquina
            sy = esquina if dy == 0 else -esquina
            fuerte = CIAN + (min(255, alfa + 95),)
            trazo.line((px, py, px + sx, py), fill=fuerte, width=4)
            trazo.line((px, py, px, py + sy), fill=fuerte, width=4)

    return Image.alpha_composite(lienzo, capa)


def abrir_logo():
    """El .gitignore de la raiz deja fuera los *.png sueltos, asi que el logo que viaja
    en el repositorio es el .webp. Son el mismo mapa de bits, comprobado pixel a pixel."""
    for nombre in ('logo-transparent.webp', 'logo-transparent.png'):
        if (MARCA / nombre).exists():
            return Image.open(MARCA / nombre).convert('RGBA')
    raise FileNotFoundError(f'No encuentro el logo en {MARCA}')


def envolver(texto, fuente, ancho_max, dibujo):
    """Parte el texto en lineas que quepan en ancho_max."""
    lineas, actual = [], ''
    for palabra in texto.split():
        prueba = f'{actual} {palabra}'.strip()
        if dibujo.textlength(prueba, font=fuente) <= ancho_max:
            actual = prueba
        else:
            if actual:
                lineas.append(actual)
            actual = palabra
    if actual:
        lineas.append(actual)
    return lineas


def main():
    lienzo = motivo_de_cajas(fondo_con_halo())
    dibujo = ImageDraw.Draw(lienzo)

    # El logo va sobre una tarjeta blanca: sus barras son azul marino y sobre el
    # fondo oscuro se perderian.
    logo = abrir_logo()
    alto_logo = 132
    logo = logo.resize((round(logo.width * alto_logo / logo.height), alto_logo), Image.LANCZOS)

    aire = 22
    tarjeta = (MARGEN, 56, MARGEN + logo.width + 2 * aire, 56 + alto_logo + 2 * aire)
    dibujo.rounded_rectangle(tarjeta, radius=20, fill=BLANCO)
    lienzo.alpha_composite(logo, (MARGEN + aire, 56 + aire))

    titulo_fuente = ImageFont.truetype(str(FUENTES / 'Raleway-Bold.ttf'), 76)
    lineas = envolver(TITULO, titulo_fuente, ANCHO - 2 * MARGEN, dibujo)

    y = tarjeta[3] + 66
    for linea in lineas:
        dibujo.text((MARGEN, y), linea, font=titulo_fuente, fill=BLANCO)
        y += 92

    y += 16
    dibujo.rounded_rectangle((MARGEN, y, MARGEN + 104, y + 6), radius=3, fill=CIAN)
    dibujo.text((MARGEN, y + 34), PIE,
                font=ImageFont.truetype(str(FUENTES / 'Roboto-Medium.ttf'), 30), fill=APAGADO)

    lienzo.convert('RGB').save(DESTINO, optimize=True)
    print(f'{DESTINO}')
    print(f'  {ANCHO} x {ALTO}, {DESTINO.stat().st_size / 1024:.1f} KB')
    print(f'  titulo en {len(lineas)} linea(s): {lineas}')


if __name__ == '__main__':
    main()
