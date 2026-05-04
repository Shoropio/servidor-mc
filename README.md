# Minecraft Server Manager

Este proyecto permite gestionar servidores de Minecraft tanto en versión **Java** (PaperMC) como en versión **Bedrock** (Official Dedicated Server).

## Estructura del Proyecto

- `java/`: Servidor de Minecraft Java.
  - `server.jar`: Ejecutable PaperMC (Versión 1.21.1+).
  - `start.bat`: Script de inicio (configurado para usar **Java 21**).
  - `plugins/`: Incluye **GeyserMC** y **Floodgate** para permitir que jugadores de Bedrock se unan al servidor Java.
- `bedrock/`: Servidor de Minecraft Bedrock Oficial.
  - `bedrock_server.exe`: Ejecutable del servidor.
  - `server.properties`: Archivo principal de configuración.
  - `start.bat`: Script de inicio.
- `start.bat`: Menú interactivo para iniciar cualquiera de los dos servidores.

## Configuración y Ajustes

### 🚀 Java (PaperMC)
- **Versión de Java:** Requiere **Java 21**. El script `java/start.bat` ya está configurado para buscar el ejecutable en `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot\`.
- **Memoria RAM:** Por defecto usa 2GB. Puedes cambiar `-Xms2G -Xmx2G` en el `.bat` para asignar más.
- **Cross-play:** Gracias a GeyserMC, los jugadores de Bedrock pueden entrar usando la IP del servidor Java (Puerto 19132 por defecto para Geyser).

### 🧱 Bedrock (Official)
- **Ajustes del servidor:** Edita `bedrock/server.properties` para modificar:
  - `server-name`: Nombre que verán los jugadores.
  - `gamemode`: Modo de juego (survival, creative, etc.).
  - `difficulty`: Dificultad (easy, normal, hard).
  - `server-port`: Puerto (19132 es el estándar).
  - `level-name`: Nombre de la carpeta del mundo.

## Cómo empezar

1. **Ejecutar el Gestor:** Haz doble clic en el archivo `start.bat` de la carpeta raíz.
2. **Elegir Servidor:**
   - Presiona `1` para el servidor **Java**.
   - Presiona `2` para el servidor **Bedrock**.
3. **Aceptar EULA:** Los servidores ya están pre-configurados para aceptar la EULA de Mojang.

---
*Nota: Asegúrate de que los puertos (25565 para Java y 19132 para Bedrock) estén abiertos en tu firewall/router si deseas que personas fuera de tu red local se unan.*

## Licencia

© 2026 Shoropio Corporation. Todos los derechos reservados.
