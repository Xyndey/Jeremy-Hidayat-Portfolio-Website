// Back-end papan skor Flappy Pixel: Node.js murni. Jalankan: node server.js
const http = require('http'), fs = require('fs'), path = require('path');
const { serveStatic, send, body } = require('../node-static');
const PORT = process.env.PORT || 3004, DB = path.join(__dirname, 'scores.json');
const load = () => { try { return JSON.parse(fs.readFileSync(DB, 'utf8')); } catch (e) { return []; } };
const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0], A = '/flappy-pixel/api';
  try {
    if (url === A + '/health') return send(res, 200, { ok: true });
    if (url === A + '/scores' && req.method === 'GET') return send(res, 200, load().sort((a, b) => b.score - a.score).slice(0, 10));
    if (url === A + '/scores' && req.method === 'POST') {
      const b = await body(req), name = String(b.name || '').trim().slice(0, 16), score = Math.floor(+b.score);
      if (!name || !(score >= 0) || score > 1000) return send(res, 400, { error: 'Nama atau skor tidak valid' });
      const all = load(); all.push({ name, score, at: new Date().toISOString() });
      fs.writeFileSync(DB, JSON.stringify(all.sort((a, b) => b.score - a.score).slice(0, 100), null, 2));
      return send(res, 201, { ok: true });
    }
    if (url.startsWith(A)) return send(res, 404, { error: 'Endpoint tidak ada' });
    serveStatic(req, res);
  } catch (e) { send(res, 400, { error: 'Permintaan tidak valid' }); }
});
if (require.main === module) server.listen(PORT, () => console.log(`Flappy Pixel: http://localhost:${PORT}/flappy-pixel/`));
module.exports = server;
