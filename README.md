# 🎮 Minecraft Server Manager

Gestor simple para iniciar y administrar servidores de **Minecraft Java (PaperMC)** y **Minecraft Bedrock (Official Dedicated Server)** desde un menú interactivo.

---

## 📌 Descripción

Este proyecto permite ejecutar fácilmente servidores de Minecraft sin configuraciones complejas. Incluye soporte para **cross-play** mediante **GeyserMC**, permitiendo que jugadores de Java y Bedrock jueguen juntos en el mismo servidor.

---

## ⚙️ Requisitos

- 🖥️ Windows 10 / 11  
- ☕ **Java 21** instalado (para PaperMC)  
- 🟢 **Node.js** instalado (para ejecutar el script de instalación inicial)  
- 🌐 Conexión a internet (para descargas iniciales)  
- 🔓 Puertos abiertos (si quieres acceso externo: 25565 y 19132)

---

## 📂 Estructura del Proyecto


```text
servidor-mc/
│
├── java/               # Archivos del servidor Java
│   ├── server.jar      # PaperMC
│   └── plugins/        # Geyser, Floodgate, etc.
│
├── bedrock/            # Archivos del servidor Bedrock
│   └── ...             # Archivos oficiales de Mojang
│
├── setup.js            # Script de instalación automática
└── start.bat           # Menú de inicio rápido
```


---

### 1️⃣ Instalación Inicial
Si es la primera vez que usas el proyecto, necesitas descargar los archivos del servidor (Requiere Git):

```powershell
git clone https://github.com/Shoropio/servidor-mc.git
```

```powershell
cd servidor-mc
```

```powershell
node setup.js
```
*El script incluye una **barra de progreso en tiempo real** y configurará automáticamente la EULA y los scripts de inicio.*

### 2️⃣ Iniciar el Servidor
Una vez descargado todo:
1. Ejecuta `start.bat` en la carpeta raíz.  
2. Selecciona la opción deseada:
   - `1` → Servidor **Java (PaperMC)**  
   - `2` → Servidor **Bedrock**  
3. ¡Listo! El servidor iniciará automáticamente.

---

## ☕ Configuración

### 🧱 Servidor Java (PaperMC)

- **Java requerido:** 21  
- **Memoria RAM:**
  Edita en `java/start.bat`:

```bash
-Xms2G -Xmx2G
```

- **Plugins incluidos:**
- GeyserMC → Permite jugadores Bedrock  
- Floodgate → Login sin cuenta Java  

- **Java en PATH (recomendado):**
Asegúrate de poder ejecutar:

```powershell
java -version
```


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


© 2026 Shoropio Corporation. Todos los derechos reservados.
