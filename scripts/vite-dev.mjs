import { createServer } from "vite";
import react from "@vitejs/plugin-react";

const args = process.argv.slice(2);
const readFlag = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const host = readFlag("--host", "127.0.0.1");
const port = Number(readFlag("--port", "5173"));

const server = await createServer({
  root: process.cwd(),
  configFile: false,
  plugins: [react()],
  server: { host, port, strictPort: false },
});

await server.listen();
server.printUrls();

await new Promise(() => {});
