import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('./fixtures', import.meta.url));
const port = Number(process.env.E2E_PORT ?? 5599);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

createServer(async (req, res) => {
  try {
    const reqPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
    const filePath = join(dir, normalize(reqPath === '/' ? '/mock-chatgpt.html' : reqPath));
    if (!filePath.startsWith(dir)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    const body = await readFile(filePath);
    res.writeHead(200, { 'content-type': types[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(port, () => console.log(`mock server on http://localhost:${port}`));
