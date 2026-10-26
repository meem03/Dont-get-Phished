const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.gif': 'image/gif', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end('Preview: scoreboard requires Netlify'); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4173'));
