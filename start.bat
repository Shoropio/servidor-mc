@echo off
echo Elija el servidor que desea iniciar:
echo 1. Servidor Java (PaperMC)
echo 2. Servidor Bedrock
echo 3. Salir
set /p choice="Ingrese su opcion (1-3): "

if "%choice%"=="1" (
    cd java
    start start.bat
) else if "%choice%"=="2" (
    cd bedrock
    if exist start.bat (
        start start.bat
    ) else (
        echo El servidor Bedrock no esta configurado aun.
        pause
    )
) else (
    exit
)
