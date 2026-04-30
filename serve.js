const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);
const mime = {
  html: 'text/html', css: 'text/css', js: 'text/javascript',
  svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg',
  jpeg: 'image/jpeg', gif: 'image/gif', ico: 'image/x-icon',
  woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf'
};

http.createServer((req, res) => {
  const filePath = req.url === '/' ? '/src/index.html' : req.url;
  const full = path.join(dir, filePath);
  const ext = path.extname(full).slice(1);
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(3000, () => console.log('Game running at http://localhost:3000'));
