const fs = require('fs');
const { execSync } = require('child_process');

console.log("🔥 Fix: Storage Wipe & Clean Install...");

const dataDir = '/app/data';
const npmGlobal = `${dataDir}/npm_global`;
const npmCache = `${dataDir}/npm_cache`;
const npmTmp = `${dataDir}/npm_tmp`;

// 1. SAPU JAGAT: Hapus semua sampah sisa gagal instalasi biar storage lega!
try {
    console.log("🧹 Membersihkan storage...");
    execSync(`rm -rf ${npmCache} ${npmTmp} ${npmGlobal} ${dataDir}/package ${dataDir}/npm.tgz`);
} catch(e) {}

try {
    fs.mkdirSync(npmGlobal, { recursive: true });
    fs.mkdirSync(npmCache, { recursive: true });
    fs.mkdirSync(npmTmp, { recursive: true });
} catch(e) {}

// 2. Tarik ulang NPM
console.log("📥 Menarik ulang mesin NPM...");
execSync(`node -e 'fetch("https://registry.npmjs.org/npm/-/npm-10.9.0.tgz").then(r=>r.arrayBuffer()).then(b=>require("fs").writeFileSync("${dataDir}/npm.tgz",Buffer.from(b)))'`);
execSync(`tar -xzf ${dataDir}/npm.tgz -C ${dataDir}`);

// 3. Eksekusi Instalasi
console.log("🔗 Menginstal OpenClaw...");
const env = Object.assign({}, process.env, { TMPDIR: npmTmp, npm_config_tmp: npmTmp });
const npmCmd = `node --max-old-space-size=800 ${dataDir}/package/bin/npm-cli.js --prefix ${npmGlobal} --cache ${npmCache} install -g openclaw --ignore-scripts --no-audit --no-fund --loglevel=error`;

try {
    execSync(npmCmd, { stdio: 'inherit', env: env });
} catch(e) {
    console.log("Abaikan warning kalau ada!");
}

// 4. CLEANUP AKHIR: Hapus cache instalasi biar gak menuhin harddisk
try {
    console.log("🧹 Membersihkan cache instalasi...");
    execSync(`rm -rf ${dataDir}/npm.tgz ${dataDir}/package ${npmCache} ${npmTmp}`);
} catch(e) {}

console.log("🚀 Menyalakan OmniRoute...");
execSync("node server.js", { stdio: 'inherit' });
