// Development-only fixture server; never imported by the app or deployed API.
const http = require('node:http');
const fs = require('node:fs');
const body = fs.readFileSync(`${__dirname}/fixtures/calendar-complete.ics`);
http.createServer((request, response) => {
  if (request.url !== '/calendar.ics') { response.writeHead(404); response.end(); return; }
  response.writeHead(200, { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(body);
}).listen(3104, 'localhost', () => console.log('Local fixture only: http://localhost:3104/calendar.ics'));
