import { mkdir, readdir, rename, rm, writeFile } from "node:fs/promises";

const worker = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const url = new URL(request.url);
    if (url.pathname.includes(".")) return response;

    return env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
  },
};
`;

await rm("dist/client", { recursive: true, force: true });
await mkdir("dist/client", { recursive: true });

for (const entry of await readdir("dist", { withFileTypes: true })) {
  if (["client", "server", ".openai"].includes(entry.name)) continue;
  await rename(`dist/${entry.name}`, `dist/client/${entry.name}`);
}

await mkdir("dist/server", { recursive: true });
await writeFile("dist/server/index.js", worker);
