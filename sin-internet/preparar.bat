@echo off
rem Prepara el curso para usarlo sin internet (ejecutar una vez, con internet).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0preparar.ps1"
pause
