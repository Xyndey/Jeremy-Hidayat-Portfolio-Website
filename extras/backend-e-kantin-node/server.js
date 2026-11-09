// Back-end E-Kantin: Node.js murni (tanpa dependensi). Jalankan: node server.js
const http = require('http'), fs = require('fs'), path = require('path');
const { serveStatic, send, body } = require('../node-static');
const PORT = process.env.PORT || 3001, DB = path.join(__dirname, 'data.json');
const MENU = [
  { id: 1, name: 'Nasi Goreng', icon: '🍛', price: 15000 }, { id: 2, name: 'Mie Ayam', icon: '🍜', price: 13000 },
  { id: 3, name: 'Ayam Geprek', icon: '🍗', price: 16000 }, { id: 4, name: 'Roti Bakar', icon: '🍞', price: 8000 },
  { id: 5, name: 'Gorengan', icon: '🍤', price: 2000 }, { id: 6, name: 'Es Teh', icon: '🧋', price: 4000 },
  { id: 7, name: 'Es Jeruk', icon: '🍊', price: 5000 }, { id: 8, name: 'Air Mineral', icon: '💧', price: 3000 }
];
const load = () => { try { return JSON.parse(fs.readFileSync(DB, 'utf8')); } catch (e) { return []; } };
const save = (o) => fs.writeFileSync(DB, JSON.stringify(o, null, 2));
const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0], A = '/e-kantin/api';
  try {
    if (url === A + '/health') return send(res, 200, { ok: true });
    if (url === A + '/menu' && req.method === 'GET') return send(res, 200, MENU);
    if (url === A + '/orders' && req.method === 'GET') return send(res, 200, load());
    if (url === A + '/orders' && req.method === 'POST') {
      const b = await body(req), name = String(b.name || '').trim().slice(0, 30);
      const items = Array.isArray(b.items) ? b.items : [];
      const lines = items.map(i => ({ m: MENU.find(m => m.id === +i.id), q: Math.max(1, Math.min(50, +i.qty || 0)) })).filter(l => l.m);
      if (!name || !lines.length) return send(res, 400, { error: 'Nama dan item pesanan wajib diisi' });
      const orders = load(), code = 'K' + String(100 + orders.length % 900).padStart(3, '0');
      const o = { code, name, lines: lines.map(l => `${l.m.name} x${l.q}`).join(', '), total: lines.reduce((s, l) => s + l.m.price * l.q, 0), ready: false, at: new Date().toISOString() };
      orders.push(o); save(orders); return send(res, 201, o);
    }
    const m = url.match(/^\/e-kantin\/api\/orders\/([A-Z0-9]+)\/ready$/);
    if (m && req.method === 'PATCH') {
      const orders = load(), o = orders.find(x => x.code === m[1]);
      if (!o) return send(res, 404, { error: 'Pesanan tidak ditemukan' });
      o.ready = true; save(orders); return send(res, 200, o);
    }
    if (url.startsWith(A)) return send(res, 404, { error: 'Endpoint tidak ada' });
    serveStatic(req, res);
  } catch (e) { send(res, 400, { error: 'Permintaan tidak valid' }); }
});
if (require.main === module) server.listen(PORT, () => console.log(`E-Kantin: http://localhost:${PORT}/e-kantin/`));
module.exports = server;
