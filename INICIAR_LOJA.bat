@echo off
title Dycore LOJA — Ambiente de Producao
color 0B

echo.
echo  =============================================
echo         DYCORE - MODO LOJA (PRODUCAO)
echo  =============================================
echo.

:: Tenta mudar para a branch main (estavel)
echo  Ajustando versao para PRODUCAO...
git checkout main --quiet
if errorlevel 1 (
    echo  [AVISO] Nao foi possivel mudar para a branch 'main'. 
    echo  Verifique se ha arquivos abertos ou alteracoes nao salvas.
) else (
    echo  [OK] Versao Estavel (Main) ativada.
)

set APP_ENV=production
set PYTHON_EXE=python

:: Verifica Python
python --version > nul 2>&1
if errorlevel 1 ( set PYTHON_EXE=py )

echo  Iniciando sistema com banco de dados REAL...
echo  -----------------------------------------------
start /b cmd /c "timeout /t 3 /nobreak > nul && start http://localhost:5000"

%PYTHON_EXE% app.py
pause
