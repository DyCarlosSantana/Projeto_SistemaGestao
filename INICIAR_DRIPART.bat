@echo off
title DripArt — Sistema de Gestao
color 0A

echo.
echo  =============================================
echo        DripArt - Sistema de Gestao v5.0
echo  =============================================
echo.

set PYTHON_EXE=

python --version > nul 2>&1
if not errorlevel 1 ( set PYTHON_EXE=python & goto :python_found )

py --version > nul 2>&1
if not errorlevel 1 ( set PYTHON_EXE=py & goto :python_found )

for %%V in (314 313 312 311 310 39 38) do (
    if exist "%LOCALAPPDATA%\Programs\Python\Python%%V\python.exe" (
        set PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python%%V\python.exe
        goto :python_found
    )
)

echo  ERRO: Python nao encontrado!
echo  Instale em https://www.python.org/downloads/
echo  Marque "Add Python to PATH" durante a instalacao.
pause & exit

:python_found
echo  Python: %PYTHON_EXE%
echo  Verificando dependencias...

%PYTHON_EXE% -m pip show flask > nul 2>&1
if errorlevel 1 ( echo  Instalando Flask... & %PYTHON_EXE% -m pip install flask -q )

%PYTHON_EXE% -m pip show reportlab > nul 2>&1
if errorlevel 1 ( echo  Instalando ReportLab... & %PYTHON_EXE% -m pip install reportlab -q )

%PYTHON_EXE% -m pip show pillow > nul 2>&1
if errorlevel 1 ( echo  Instalando Pillow... & %PYTHON_EXE% -m pip install pillow -q )

echo  Dependencias OK!
echo.
echo  Sistema iniciando em http://localhost:5000
echo  Nao feche esta janela durante o uso.
echo  Para encerrar: Ctrl+C
echo  -----------------------------------------------

start /b cmd /c "timeout /t 2 /nobreak > nul && start http://localhost:5000"

cd /d "%~dp0"
%PYTHON_EXE% app.py

echo.
echo  Sistema encerrado.
pause
