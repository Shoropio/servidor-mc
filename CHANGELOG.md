# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [1.0.0] - 2026-05-04

### Añadido
- **Servidor Java:** Soporte para PaperMC con descarga automática.
- **Servidor Bedrock:** Soporte para el servidor dedicado oficial de Mojang.
- **Cross-play:** Instalación de los plugins GeyserMC y Floodgate en la versión Java.
- **Instalador:** Script `setup.js` para la descarga y extracción automática de binarios.
- **Gestor:** Script `start.bat` raíz con menú interactivo de selección.
- **Documentación:** README.md detallado con instrucciones de configuración y requisitos.
- **Git:** Configuración de `.gitignore` para un repositorio limpio.

### Cambios
- Optimización del script de inicio de Java para utilizar la ruta absoluta de **Java 21**.
- Mejora en la robustez de las descargas usando **BITS** y **PowerShell**.
