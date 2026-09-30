const http = require('http');
const fs = require('fs');
const path = require('path');

const SEARCH_DIRS = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'app', 'src', 'main', 'assets', 'www'),
  __dirname
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg'
};

function resolveFile(reqPath) {
  for (const dir of SEARCH_DIRS) {
    const fullPath = path.join(dir, reqPath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return fullPath;
    }
  }
  return null;
}

function handleRequest(req, res) {
  const isHead = req.method === 'HEAD';
  let reqPath = (req.url || '/').split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Cloud Run readiness and liveness probe endpoints
  if (reqPath === '/health' || reqPath === '/healthz' || reqPath === '/_health' || reqPath === '/ping') {
    const body = JSON.stringify({ status: 'ok', service: 'naija-pop', uptime: process.uptime() });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Cache-Control': 'no-cache, no-store'
    });
    if (isHead) {
      res.end();
    } else {
      res.end(body);
    }
    return;
  }

  let filePath = resolveFile(reqPath);
  if (!filePath && !path.extname(reqPath)) {
    filePath = resolveFile('/index.html');
  }

  if (!filePath) {
    const notFound = '404 Not Found';
    res.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Length': Buffer.byteLength(notFound)
    });
    if (isHead) {
      res.end();
    } else {
      res.end(notFound);
    }
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      const errMsg = `Server Error: ${err.code}`;
      res.writeHead(500, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': Buffer.byteLength(errMsg)
      });
      if (isHead) {
        res.end();
      } else {
        res.end(errMsg);
      }
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': content.length,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    if (isHead) {
      res.end();
    } else {
      res.end(content);
    }
  });
}

// Collect target ports to listen on
const targetPorts = new Set();
if (process.env.PORT) {
  const p = parseInt(process.env.PORT, 10);
  if (!isNaN(p)) targetPorts.add(p);
}
if (process.env.DEFAULT_APP_PORT) {
  const p = parseInt(process.env.DEFAULT_APP_PORT, 10);
  if (!isNaN(p)) targetPorts.add(p);
}
// Defaults if nothing configured
if (targetPorts.size === 0) {
  targetPorts.add(8080);
  targetPorts.add(3000);
}

for (const port of targetPorts) {
  const server = http.createServer(handleRequest);

  // Cloud Run keepAlive recommendations to prevent 502 connection race conditions
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use (e.g. Nginx proxy in dev mode). Skipping.`);
    } else {
      console.error(`Server error on port ${port}:`, err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Naija Pop Server listening on http://0.0.0.0:${port}`);
  });
}

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
