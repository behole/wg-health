const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html' || req.url === '/firebase-test.html') {
    fs.readFile(path.join(__dirname, 'firebase-test.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading the test page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Firebase test server running at http://localhost:${PORT}`);
  console.log(`Open your browser to http://localhost:${PORT} to run the test`);
});