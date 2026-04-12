const fs = require('fs');
const { execSync } = require('child_process');

console.log("🔥 Fix: Membabat argumen palsu yang bikin NPM bingung...");

const dataDir = '/app/data';
const npmGlobal = `${dataDir}/npm_global`;
const npmCache = `${dataDir}/npm_cache`;
const npmTmp = `${dataDir}/npm_tmp`;

try {
    fs.mkdirSync(npmGlobal, { recursive: true });
    fs.mkdirSync(npmCache, { recursive: true });
    fs.mkdirSync(npmTmp, { recursive: true });
} catch(e) {}

// Pengaman: kalau mesin NPM kehapus, tarik lagi dari asalnya
if (!fs.existsSync(`${dataDir}/package/bin/npm-cli.js`)) {
    console.log("📥 Menarik ulang mesin NPM...");
    execSync(`node -e 'fetch("https://registry.npmjs.org/npm/-/npm-10.9.0.tgz").then(r=>r.arrayBuffer()).then(b=>require("fs").writeFileSync("${dataDir}/npm.tgz",Buffer.from(b)))'`);
    execSync(`tar -xzf ${dataDir}/npm.tgz -C ${dataDir}`);
}

if (!fs.existsSync(`${npmGlobal}/bin/openclaw`)) {
    console.log("🔗 Menginstal OpenClaw...");
    
    // Injeksi lokasi Temp langsung ke jantung OS, gak usah dilempar via argumen
    const env = Object.assign({}, process.env, { TMPDIR: npmTmp, npm_config_tmp: npmTmp });
    
    // Argumen --tmp dihapus total di sini
    const npmCmd = `node --max-old-space-size=800 ${dataDir}/package/bin/npm-cli.js --prefix ${npmGlobal} --cache ${npmCache} install -g openclaw --ignore-scripts --no-audit --no-fund --loglevel=error`;
    
    try {
        execSync(npmCmd, { stdio: 'inherit', env: env });
    } catch(e) {
        console.log("Abaikan warning kalau ada!");
    }
} else {
    console.log("✅ OpenClaw udah nongkrong dengan aman!");
}

// Bersihin file mentahan biar storage lu lega
try {
    execSync(`rm -rf ${dataDir}/npm.tgz ${dataDir}/package`);
} catch(e) {}

console.log("🚀 Menyalakan OmniRoute...");
execSync("node server.js", { stdio: 'inherit' });
