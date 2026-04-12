const fs = require('fs');
const { execSync } = require('child_process');

console.log("🔥 Mode Penyelamatan: Memotong kompilasi yang nyangkut...");

// 1. Sapu bersih folder sampah sisa ekstraksi sebelumnya biar gak bentrok
try {
    execSync("rm -rf /app/data/npm_global/lib/node_modules/.openclaw*");
} catch(e) {}

// 2. Paksa NPM nge-link shortcut TANPA jalanin script compile yang bikin pingsan (--ignore-scripts)
if (!fs.existsSync('/app/data/npm_global/bin/openclaw')) {
    console.log("🔗 Memperbaiki shortcut binari...");
    try {
        execSync("node --max-old-space-size=800 /app/data/package/bin/npm-cli.js --prefix /app/data/npm_global install -g openclaw --ignore-scripts", { stdio: 'inherit' });
    } catch(e) {
        console.log("Abaikan jika ada warning, gas lanjut!");
    }
} else {
    console.log("✅ OpenClaw sudah terinstal aman!");
}

console.log("🚀 Menyalakan OmniRoute...");
execSync("node server.js", { stdio: 'inherit' });
