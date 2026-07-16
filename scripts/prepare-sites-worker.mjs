import { mkdir, writeFile } from "node:fs/promises";

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

await mkdir("dist/server", { recursive: true });
await writeFile("dist/server/index.js", worker);
