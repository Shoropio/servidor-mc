const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * Realiza una petición GET HTTPS y devuelve el cuerpo de la respuesta como una cadena.
 * @param {string} url - La URL a la que se realizará la petición.
 * @returns {Promise<string>} Promesa que resuelve con los datos de la respuesta.
 */
function fetch(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': USER_AGENT }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

const http = require('http');

/**
 * Compara dos cadenas de versión (ej. '1.21.1', '1.21.11') numéricamente.
 * @param {string} v1 - Primera versión a comparar.
 * @param {string} v2 - Segunda versión a comparar.
 * @returns {number} 1 si v1 > v2, -1 si v1 < v2, 0 si son iguales.
 */
function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
    }
    return 0;
}

/**
 * Determina la versión de Java requerida basada en la versión de Minecraft.
 * @param {string} mcVersion - Versión de Minecraft.
 * @returns {number} Versión de Java recomendada (8, 17, 21, 25).
 */
function getRequiredJavaVersion(mcVersion) {
    // 26.1+ -> Java 25
    // 1.20 a 1.21.11 -> Java 21
    // 1.17 a 1.19 -> Java 17
    if (compareVersions(mcVersion, '26.0') >= 0) return 25;
    if (compareVersions(mcVersion, '1.20.0') >= 0) return 21;
    if (compareVersions(mcVersion, '1.17.0') >= 0) return 17;
    return 8;
}

/**
 * Intenta detectar la versión mayor de Java instalada en el sistema.
 * @returns {number} Versión de Java detectada o 0 si falla.
 */
function getCurrentJavaVersion() {
    try {
        // java -version suele imprimir en stderr, por lo que redirigimos 2>&1
        const output = execSync('java -version 2>&1', { stdio: 'pipe' }).toString();
        const match = output.match(/(?:version|openjdk version) "(?:1\.)?(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    } catch (e) {
        return 0;
    }
}

/**
 * Descarga un archivo desde una URL y lo guarda en el destino especificado.
 * Incluye una barra de progreso en consola.
 * @param {string} url - URL de descarga.
 * @param {string} dest - Ruta local donde se guardará el archivo.
 * @returns {Promise<void>}
 */
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': USER_AGENT }
        };

        const request = (currentUrl) => {
            const client = currentUrl.startsWith('https') ? https : http;
            client.get(currentUrl, options, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    const nextUrl = res.headers.location.startsWith('http')
                        ? res.headers.location
                        : new URL(res.headers.location, currentUrl).href;
                    return request(nextUrl);
                }

                if (res.statusCode !== 200) {
                    return reject(new Error(`Error al descargar: ${res.statusCode} ${res.statusMessage}`));
                }

                const totalSize = parseInt(res.headers['content-length'], 10);
                let downloadedSize = 0;
                const file = fs.createWriteStream(dest);

                res.on('data', (chunk) => {
                    downloadedSize += chunk.length;
                    if (totalSize) {
                        const percent = ((downloadedSize / totalSize) * 100).toFixed(2);
                        const downloadedMB = (downloadedSize / 1024 / 1024).toFixed(2);
                        const totalMB = (totalSize / 1024 / 1024).toFixed(2);
                        process.stdout.write(`\rDescargando: ${percent}% (${downloadedMB} MB / ${totalMB} MB)`);
                    } else {
                        process.stdout.write(`\rDescargado: ${(downloadedSize / 1024 / 1024).toFixed(2)} MB`);
                    }
                });

                res.pipe(file);

                file.on('finish', () => {
                    file.close();
                    process.stdout.write('\n');
                    resolve();
                });

                file.on('error', (err) => {
                    console.error(`\nError de archivo: ${err.message}`);
                    fs.unlink(dest, () => reject(err));
                });

            }).on('error', (err) => {
                console.error(`\nError de solicitud: ${err.message}`);
                fs.unlink(dest, () => reject(err));
            });
        };

        request(url);
    });
}

/**
 * Configura el servidor de Minecraft Java descargando PaperMC,
 * aceptando la EULA y generando los archivos de inicio.
 * @returns {Promise<void>}
 */
async function setupJava() {
    const javaDir = path.join(__dirname, 'java');
    const jarPath = path.join(javaDir, 'server.jar');

    if (fs.existsSync(jarPath)) {
        console.log('El servidor de Java ya existe, saltando...');
        return;
    }

    console.log('Configurando el servidor de Java (PaperMC)...');
    const project = 'paper';
    const baseUrl = 'https://fill.papermc.io/v3';

    // 1. Obtener lista de versiones desde la API v3
    const projectsData = JSON.parse(await fetch(`${baseUrl}/projects/${project}`));

    // 2. Determinar la versión más reciente (v3 utiliza estructura anidada)
    const majorVersions = Object.keys(projectsData.versions).sort(compareVersions);
    const latestMajor = majorVersions[majorVersions.length - 1];
    const latestVersion = projectsData.versions[latestMajor].sort(compareVersions).pop();

    console.log(`Versión detectada: ${latestVersion}`);

    // 3. Obtener detalles de la versión y el build más reciente
    const versionData = JSON.parse(await fetch(`${baseUrl}/projects/${project}/versions/${latestVersion}`));
    const latestBuildId = versionData.builds.sort((a, b) => a - b).pop();

    // 4. Obtener URL de descarga desde los metadatos del build
    const buildData = JSON.parse(await fetch(`${baseUrl}/projects/${project}/versions/${latestVersion}/builds/${latestBuildId}`));
    const downloadInfo = buildData.downloads['server:default'];
    const downloadUrl = downloadInfo.url;

    if (!fs.existsSync(javaDir)) fs.mkdirSync(javaDir);

    // 5. Descargar archivo JAR
    console.log(`Descargando Paper ${latestVersion} compilación ${latestBuildId}...`);
    await downloadFile(downloadUrl, jarPath);

    // 6. Validar requisitos de Java
    const javaVer = versionData.version.java?.version?.minimum || getRequiredJavaVersion(latestVersion);
    const currentJava = getCurrentJavaVersion();

    console.log(`Este servidor requiere Java ${javaVer}.`);

    if (currentJava < javaVer) {
        console.error('\n' + '!'.repeat(50));
        console.error(`¡ERROR CRÍTICO! Tu versión de Java (${currentJava || 'No detectada'}) es insuficiente.`);
        console.error(`Este servidor requiere obligatoriamente Java ${javaVer} o superior.`);
        console.error(`Por favor, descarga e instala Java ${javaVer} desde:`);
        console.error('https://adoptium.net/es/temurin/releases');
        console.error('!'.repeat(50) + '\n');
        process.exit(1);
    } else {
        console.log(`Versión de Java detectada: ${currentJava}. ¡Todo listo!`);
    }

    // 7. Generar archivos de configuración iniciales
    fs.writeFileSync(path.join(javaDir, 'eula.txt'), 'eula=true\n');
    fs.writeFileSync(path.join(javaDir, 'start.bat'), `@echo off\n:: Requiere Java ${javaVer} (Actual detectado: ${currentJava || '?'})\njava -Xms8G -Xmx8G -jar server.jar nogui\npause\n`);

    console.log('¡Configuración del servidor Java completada!');
}

/**
 * Configura el servidor de Minecraft Bedrock descargando la última versión
 * oficial de Mojang y extrayendo los archivos necesarios.
 * @returns {Promise<void>}
 */
async function setupBedrock() {
    const bedrockDir = path.join(__dirname, 'bedrock');
    const exePath = path.join(bedrockDir, 'bedrock_server.exe');

    console.log('Buscando actualizaciones para el servidor de Bedrock...');
    const metadataUrl = 'https://raw.githubusercontent.com/kittizz/bedrock-server-downloads/main/bedrock-server-downloads.json';
    const metadata = JSON.parse(await fetch(metadataUrl));

    const releaseVersions = Object.keys(metadata.release).sort(compareVersions);
    const latestVersion = releaseVersions[releaseVersions.length - 1];
    const downloadUrl = metadata.release[latestVersion].windows.url;
    const dest = path.join(bedrockDir, 'server.zip');

    if (fs.existsSync(exePath)) {
        console.log(`El servidor de Bedrock ya existe (Versión instalada detectada).`);
        console.log(`La última versión disponible es: ${latestVersion}`);
        console.log('Si deseas actualizar, borra la carpeta "bedrock" y vuelve a ejecutar este script.');
        return;
    }

    console.log(`Configurando el servidor dedicado de Bedrock v${latestVersion}...`);

    if (!fs.existsSync(bedrockDir)) fs.mkdirSync(bedrockDir);

    console.log(`Descargando el servidor de Bedrock ${latestVersion}...`);
    await downloadFile(downloadUrl, dest);

    console.log('Extrayendo el servidor de Bedrock...');
    execSync(`powershell -Command "Expand-Archive -Path '${dest}' -DestinationPath '${bedrockDir}' -Force"`);

    fs.unlinkSync(dest);

    fs.writeFileSync(path.join(bedrockDir, 'start.bat'), `@echo off\nbedrock_server.exe\npause\n`);

    console.log('¡Configuración del servidor Bedrock completada!');
}

/**
 * Función principal que orquestra la configuración de ambos servidores.
 */
async function main() {
    try {
        await setupJava();
        await setupBedrock();
        console.log('\n¡Todos los servidores se han configurado correctamente!');
        console.log('Ve a java/ o bedrock/ y ejecuta start.bat para comenzar.');
    } catch (err) {
        console.error('Error durante la configuración:', err);
    }
}

main();
