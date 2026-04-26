@echo off
title Dycore DEV — Ambiente de Desenvolvimento
color 0E

echo.
echo  =============================================
echo       DYCORE - MODO DESENVOLVIMENTO (DEV)
echo  =============================================
echo.

:: Tenta mudar para a branch develop
echo  Ajustando versao para DESENVOLVIMENTO...
git checkout develop --quiet
if errorlevel 1 (
    echo  [AVISO] Nao foi possivel mudar para a branch 'develop'.
) else (
    echo  [OK] Versao de Desenvolvimento ativada.
)

set APP_ENV=development
set PYTHON_EXE=python

:: Verifica Python
python --version > nul 2>&1
if errorlevel 1 ( set PYTHON_EXE=py )

echo  Iniciando sistema com banco de dados de TESTE...
echo  -----------------------------------------------
start /b cmd /c "timeout /t 3 /nobreak > nul && start http://localhost:5000"

%PYTHON_EXE% app.py
pause
