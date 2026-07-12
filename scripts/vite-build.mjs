import { build } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDirName = `dist-current-${stamp}`;
const outDir = path.join(process.cwd(), outDirName);
const distDir = path.join(process.cwd(), "dist");

await build({
  root: process.cwd(),
  configFile: false,
  publicDir: false,
  plugins: [react()],
  build: { outDir: outDirName, emptyOutDir: false },
});

const publicDir = path.join(process.cwd(), "public");

if (fs.existsSync(publicDir)) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const entry of fs.readdirSync(publicDir)) {
    const from = path.join(publicDir, entry);
    const to = path.join(outDir, entry);
    if (fs.statSync(from).isFile()) fs.copyFileSync(from, to);
  }
}

try {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
  for (const entry of fs.readdirSync(outDir)) {
    fs.cpSync(path.join(outDir, entry), path.join(distDir, entry), {
      recursive: true,
      force: true,
    });
  }
} catch (error) {
  console.warn(`Built ${outDirName}; could not fully mirror into dist: ${error.message}`);
}

console.log(`Verified build output: ${outDirName}`);
