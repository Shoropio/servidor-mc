# 🎮 Minecraft Server Manager

Gestor simple para iniciar y administrar servidores de **Minecraft Java (PaperMC)** y **Minecraft Bedrock (Official Dedicated Server)** desde un menú interactivo.

---

## 📌 Descripción

Este proyecto permite ejecutar fácilmente servidores de Minecraft sin configuraciones complejas. Incluye soporte para **cross-play** mediante **GeyserMC**, permitiendo que jugadores de Java y Bedrock jueguen juntos en el mismo servidor.

---

## ⚙️ Requisitos

- 🖥️ Windows 10 / 11  
- ☕ Java 21 instalado (para PaperMC)  
- 🌐 Conexión a internet (para descargas iniciales)  
- 🔓 Puertos abiertos (si quieres acceso externo)

---

## 📂 Estructura del Proyecto


minecraft-server-manager/
│
├── java/
│ ├── server.jar
│ ├── start.bat
│ └── plugins/
│ ├── GeyserMC
│ └── Floodgate
│
├── bedrock/
│ ├── bedrock_server.exe
│ ├── server.properties
│ └── start.bat
│
└── start.bat


---

## 🚀 Cómo empezar

1. Ejecuta `start.bat` en la carpeta raíz  
2. Selecciona una opción:
   - `1` → Servidor **Java (PaperMC)**  
   - `2` → Servidor **Bedrock**  
3. ¡Listo! El servidor iniciará automáticamente  

---

## ☕ Configuración

### 🧱 Servidor Java (PaperMC)

- **Java requerido:** 21  
- **Memoria RAM:**
  Edita en `java/start.bat`:

-Xms2G -Xmx2G

- **Plugins incluidos:**
- GeyserMC → Permite jugadores Bedrock  
- Floodgate → Login sin cuenta Java  

- **Java en PATH (recomendado):**
Asegúrate de poder ejecutar:

java -version


---

### 📱 Servidor Bedrock

Edita `bedrock/server.properties`:

- `server-name` → Nombre del servidor  
- `gamemode` → survival / creative  
- `difficulty` → easy / normal / hard  
- `server-port` → 19132 (por defecto)  
- `level-name` → mundo  

---

## 🌍 Cross-play (Java + Bedrock)

Gracias a GeyserMC:

- Los jugadores de **Bedrock pueden entrar al servidor Java**
- Configuración por defecto:
- 📡 IP: la misma del servidor Java  
- 🔌 Puerto: `19132`  

---

## 🌐 Red y Puertos

Para permitir conexiones externas:

- Abre los siguientes puertos en tu router/firewall:
- `25565` → Minecraft Java  
- `19132` → Bedrock / Geyser  

⚠️ No compartas tu IP pública con desconocidos.

---

## 🛠 Problemas comunes

**❌ El servidor no inicia**
- Verifica que Java 21 esté instalado  
- Revisa que `java` esté en el PATH  

**❌ No pueden conectarse**
- Revisa firewall  
- Verifica port forwarding  
- Asegúrate de usar la IP correcta  

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**.  
Puedes usarlo, modificarlo y distribuirlo libremente.

---

## 💡 Notas

- La EULA de Mojang ya está aceptada por defecto  
- Ideal para uso local o servidores pequeños  
- Puedes ampliar fácilmente con más plugins o configuraciones  


## 🤝 Contribuir

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, por favor sigue estos pasos:
1. Crea un **fork** del proyecto  
2. Crea una **feature branch**  
3. Haz tu commit  
4. Abre un **pull request**

---

## 📝 Notas sobre la licencia

© 2026 Shoropio Corporation. Todos los derechos reservados.
