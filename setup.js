const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const USER_AGENT = 'MinecraftServerSetup/1.0 (contact@example.com)';

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

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`Downloading via PowerShell: ${url}`);
            execSync(`powershell -Command "Invoke-WebRequest -Uri '${url}' -OutFile '${dest}' -UserAgent '${USER_AGENT}'"`, { stdio: 'inherit' });
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

async function setupJava() {
    if (fs.existsSync(path.join(__dirname, 'java', 'server.jar'))) {
        console.log('Java server already exists, skipping...');
        return;
    }
    console.log('Setting up Java (PaperMC) server...');
    const project = 'paper';
    const versionsData = JSON.parse(await fetch(`https://api.papermc.io/v2/projects/${project}`));
    const latestVersion = versionsData.versions[versionsData.versions.length - 1];
    
    const buildsData = JSON.parse(await fetch(`https://api.papermc.io/v2/projects/${project}/versions/${latestVersion}`));
    const latestBuild = buildsData.builds[buildsData.builds.length - 1];
    
    const downloadUrl = `https://api.papermc.io/v2/projects/${project}/versions/${latestVersion}/builds/${latestBuild}/downloads/paper-${latestVersion}-${latestBuild}.jar`;
    const dest = path.join(__dirname, 'java', 'server.jar');
    
    if (!fs.existsSync(path.join(__dirname, 'java'))) fs.mkdirSync(path.join(__dirname, 'java'));
    
    console.log(`Downloading Paper ${latestVersion} build ${latestBuild}...`);
    await downloadFile(downloadUrl, dest);
    
    fs.writeFileSync(path.join(__dirname, 'java', 'eula.txt'), 'eula=true\n');
    fs.writeFileSync(path.join(__dirname, 'java', 'start.bat'), `@echo off\njava -Xms2G -Xmx2G -jar server.jar nogui\npause\n`);
    
    console.log('Java server setup complete!');
}

async function setupBedrock() {
    if (fs.existsSync(path.join(__dirname, 'bedrock', 'bedrock_server.exe'))) {
        console.log('Bedrock server already exists, skipping...');
        return;
    }
    console.log('Setting up Bedrock Dedicated Server...');
    const metadataUrl = 'https://raw.githubusercontent.com/kittizz/bedrock-server-downloads/main/bedrock-server-downloads.json';
    const metadata = JSON.parse(await fetch(metadataUrl));
    
    const releaseVersions = Object.keys(metadata.release);
    const latestVersion = releaseVersions[releaseVersions.length - 1];
    const downloadUrl = metadata.release[latestVersion].windows.url;
    const dest = path.join(__dirname, 'bedrock', 'server.zip');
    
    if (!fs.existsSync(path.join(__dirname, 'bedrock'))) fs.mkdirSync(path.join(__dirname, 'bedrock'));
    
    console.log(`Downloading Bedrock Server ${latestVersion}...`);
    await downloadFile(downloadUrl, dest);
    
    console.log('Extracting Bedrock Server...');
    // Using PowerShell to expand archive since it's Windows
    execSync(`powershell -Command "Expand-Archive -Path '${dest}' -DestinationPath '${path.join(__dirname, 'bedrock')}' -Force"`);
    
    fs.unlinkSync(dest);
    
    fs.writeFileSync(path.join(__dirname, 'bedrock', 'start.bat'), `@echo off\nbedrock_server.exe\npause\n`);
    
    console.log('Bedrock server setup complete!');
}

async function main() {
    try {
        await setupJava();
        await setupBedrock();
        console.log('\nAll servers have been set up successfully!');
        console.log('Go to java/ or bedrock/ and run start.bat to begin.');
    } catch (err) {
        console.error('Error during setup:', err);
    }
}

main();
