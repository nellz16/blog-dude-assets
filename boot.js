const fs = require('fs');
const { execSync } = require('child_process');

console.log("🔥 Mengeksekusi Remote Payload Bypass Terminal...");

if (!fs.existsSync('/app/data/npm_global/bin/openclaw')) {
    console.log("[1/4] Download NPM...");
    execSync("node -e 'fetch(\"https://registry.npmjs.org/npm/-/npm-10.9.0.tgz\").then(r=>r.arrayBuffer()).then(b=>require(\"fs\").writeFileSync(\"/app/data/npm.tgz\",Buffer.from(b)))'");
    
    console.log("[2/4] Ekstrak NPM...");
    execSync("tar -xzf /app/data/npm.tgz -C /app/data");
    
    console.log("[3/4] Install OpenClaw (Pakai napas RAM 800MB)...");
    execSync("node --max-old-space-size=800 /app/data/package/bin/npm-cli.js --prefix /app/data/npm_global install -g openclaw", { stdio: 'inherit' });
    
    console.log("[4/4] Cleanup...");
    execSync("rm -rf /app/data/npm.tgz /app/data/package");
} else {
    console.log("✅ OpenClaw sudah terinstal aman!");
}

console.log("🚀 Menyalakan OmniRoute...");
execSync("node server.js", { stdio: 'inherit' });
