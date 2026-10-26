# Abre el curso SIN internet: la web en el navegador y los cuadernos en Jupyter.
# Antes hay que haber ejecutado preparar.bat una vez con internet.
$curso = Split-Path -Parent $PSScriptRoot

$web = Join-Path $curso "web\dist\index.html"
if (Test-Path $web) {
    Start-Process $web
} else {
    Write-Warning "No encuentro la web construida en web\dist. Ejecuta preparar.bat o usa la carpeta web del zip."
}

# Sin conexion: transformers, datasets y timm usan solo lo que ya esta descargado.
$env:HF_HUB_OFFLINE = "1"
$env:HF_DATASETS_OFFLINE = "1"
$env:TRANSFORMERS_OFFLINE = "1"

$jupyter = Join-Path $curso ".venv-clase\Scripts\jupyter-lab.exe"
if (-not (Test-Path $jupyter)) {
    throw "No encuentro el entorno .venv-clase. Ejecuta antes preparar.bat con internet."
}
& $jupyter --notebook-dir "$curso"
