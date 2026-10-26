# Prepara este ordenador para dar el curso sin internet. Se ejecuta UNA vez, CON internet.
# Crea el entorno de Python (mismas versiones que Colab), descarga modelos, dataset y archivos,
# y construye la web. Tarda un rato: son unos 15 GB.
$ErrorActionPreference = "Stop"
$curso = Split-Path -Parent $PSScriptRoot
Set-Location $curso

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    throw "Falta uv. Instalalo con:  winget install astral-sh.uv   y vuelve a ejecutar este script."
}

Write-Host "1/3  Entorno de Python en .venv-clase" -ForegroundColor Cyan
uv venv .venv-clase --python 3.12
uv pip install --python .venv-clase\Scripts\python.exe `
    --index-url https://download.pytorch.org/whl/cu128 --extra-index-url https://pypi.org/simple `
    --index-strategy unsafe-best-match -r sin-internet\requirements.txt

Write-Host "2/3  Modelos, dataset y archivos de los cuadernos" -ForegroundColor Cyan
.venv-clase\Scripts\python.exe sin-internet\preparar.py

Write-Host "3/3  Web del curso" -ForegroundColor Cyan
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Push-Location web
    npm install
    npm run build
    Pop-Location
} else {
    Write-Warning "No hay Node.js: descarga la web ya construida (curso-sin-internet.zip) de la pagina de GitHub."
}

Write-Host "`nListo. El dia de la clase, sin internet, abre sin-internet\clase.bat" -ForegroundColor Green
