const fs = require('fs');
const { execSync } = require('child_process');

console.log("🔥 Mode Bypass Ekstrem: Mengisolasi Cache & Temp ke Persistent Volume...");

// 1. Definisikan folder aman di dalam persistent volume
const dataDir = '/app/data';
const npmGlobal = `${dataDir}/npm_global`;
const npmCache = `${dataDir}/npm_cache`;
const npmTmp = `${dataDir}/npm_tmp`;

// Bikin foldernya kalau belum ada
try {
    fs.mkdirSync(npmGlobal, { recursive: true });
    fs.mkdirSync(npmCache, { recursive: true });
    fs.mkdirSync(npmTmp, { recursive: true });
} catch(e) {}

// 2. Sapu bersih sisa sampah instalasi yang bikin error sebelumnya
try {
    execSync(`rm -rf ${npmGlobal}/lib/node_modules/.openclaw*`);
    execSync(`rm -rf ${npmCache}/*`);
    execSync(`rm -rf ${npmTmp}/*`);
} catch(e) {}

// 3. Eksekusi Instalasi dengan Isolasi 100%
if (!fs.existsSync(`${npmGlobal}/bin/openclaw`)) {
    console.log("🔗 Menginstal OpenClaw... (Aman dari limit 100MB)");
    try {
        // Kita paksa environment variabel OS buat pindah folder Temp ke /app/data
        const env = Object.assign({}, process.env, { TMPDIR: npmTmp });
        
        // Perhatikan parameter --cache dan --tmp yang baru ditambahkan
        const npmCmd = `node --max-old-space-size=800 /app/data/package/bin/npm-cli.js --prefix ${npmGlobal} --cache ${npmCache} --tmp ${npmTmp} install -g openclaw --ignore-scripts --no-audit --no-fund --loglevel=error`;
        
        execSync(npmCmd, { stdio: 'inherit', env: env });
    } catch(e) {
        console.log("Abaikan jika ada warning, gas lanjut!");
    }
} else {
    console.log("✅ OpenClaw sudah terinstal aman!");
}

console.log("🚀 Menyalakan OmniRoute...");
execSync("node server.js", { stdio: 'inherit' });
