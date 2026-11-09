/* Mesin catur: aturan lengkap (rokade, en passant, promosi, skak, skakmat, remaja) + AI alpha-beta.
   Papan: indeks 0 = a8, 63 = h1. Huruf besar = putih, huruf kecil = hitam, '.' = kosong. */
(function (root) {
  var START = 'rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR';
  function isW(p) { return p !== '.' && p === p.toUpperCase(); }
  function col(p) { return p === '.' ? null : (isW(p) ? 'w' : 'b'); }
  function newGame() { return { b: START.split(''), turn: 'w', cas: 'KQkq', ep: -1, half: 0, full: 1 }; }
  var N_OFF = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  var K_OFF = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  var B_DIR = [[-1, -1], [-1, 1], [1, -1], [1, 1]], R_DIR = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  function attacked(b, sq, by) {
    var r = sq >> 3, c = sq & 7, i, d, rr, cc, p;
    var pr = by === 'w' ? r + 1 : r - 1, pp = by === 'w' ? 'P' : 'p';
    if (pr >= 0 && pr < 8) { if (c > 0 && b[pr * 8 + c - 1] === pp) return true; if (c < 7 && b[pr * 8 + c + 1] === pp) return true; }
    var kn = by === 'w' ? 'N' : 'n', kg = by === 'w' ? 'K' : 'k';
    for (i = 0; i < 8; i++) { rr = r + N_OFF[i][0]; cc = c + N_OFF[i][1]; if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && b[rr * 8 + cc] === kn) return true; }
    for (i = 0; i < 8; i++) { rr = r + K_OFF[i][0]; cc = c + K_OFF[i][1]; if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && b[rr * 8 + cc] === kg) return true; }
    var bq = by === 'w' ? 'BQ' : 'bq', rq = by === 'w' ? 'RQ' : 'rq';
    for (d = 0; d < 4; d++) { rr = r + B_DIR[d][0]; cc = c + B_DIR[d][1]; while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) { p = b[rr * 8 + cc]; if (p !== '.') { if (bq.indexOf(p) >= 0) return true; break; } rr += B_DIR[d][0]; cc += B_DIR[d][1]; } }
    for (d = 0; d < 4; d++) { rr = r + R_DIR[d][0]; cc = c + R_DIR[d][1]; while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) { p = b[rr * 8 + cc]; if (p !== '.') { if (rq.indexOf(p) >= 0) return true; break; } rr += R_DIR[d][0]; cc += R_DIR[d][1]; } }
    return false;
  }
  function pseudo(s) {
    var b = s.b, me = s.turn, op = me === 'w' ? 'b' : 'w', out = [], sq, p, r, c, i, d, rr, cc, t, tp;
    for (sq = 0; sq < 64; sq++) {
      p = b[sq]; if (p === '.' || col(p) !== me) continue;
      r = sq >> 3; c = sq & 7; var u = p.toUpperCase();
      if (u === 'P') {
        var dir = me === 'w' ? -1 : 1, start = me === 'w' ? 6 : 1, last = me === 'w' ? 0 : 7, nr = r + dir;
        function add(to, flag) { if (nr === last) { 'QRBN'.split('').forEach(function (x) { out.push({ from: sq, to: to, promo: x, flag: flag }); }); } else out.push({ from: sq, to: to, flag: flag }); }
        if (nr >= 0 && nr < 8) {
          if (b[nr * 8 + c] === '.') { add(nr * 8 + c); if (r === start && b[(r + 2 * dir) * 8 + c] === '.') out.push({ from: sq, to: (r + 2 * dir) * 8 + c, flag: 'dbl' }); }
          [-1, 1].forEach(function (dc) { cc = c + dc; if (cc < 0 || cc > 7) return; t = nr * 8 + cc; tp = b[t]; if (tp !== '.' && col(tp) === op) add(t, 'cap'); else if (t === s.ep) add(t, 'ep'); });
        }
      } else if (u === 'N' || u === 'K') {
        var offs = u === 'N' ? N_OFF : K_OFF;
        for (i = 0; i < 8; i++) { rr = r + offs[i][0]; cc = c + offs[i][1]; if (rr < 0 || rr > 7 || cc < 0 || cc > 7) continue; t = rr * 8 + cc; tp = b[t]; if (tp === '.' || col(tp) === op) out.push({ from: sq, to: t, flag: tp === '.' ? '' : 'cap' }); }
        if (u === 'K') {
          if (me === 'w' && sq === 60) {
            if (s.cas.indexOf('K') >= 0 && b[61] === '.' && b[62] === '.' && b[63] === 'R' && !attacked(b, 60, op) && !attacked(b, 61, op) && !attacked(b, 62, op)) out.push({ from: 60, to: 62, flag: 'castle' });
            if (s.cas.indexOf('Q') >= 0 && b[59] === '.' && b[58] === '.' && b[57] === '.' && b[56] === 'R' && !attacked(b, 60, op) && !attacked(b, 59, op) && !attacked(b, 58, op)) out.push({ from: 60, to: 58, flag: 'castle' });
          }
          if (me === 'b' && sq === 4) {
            if (s.cas.indexOf('k') >= 0 && b[5] === '.' && b[6] === '.' && b[7] === 'r' && !attacked(b, 4, op) && !attacked(b, 5, op) && !attacked(b, 6, op)) out.push({ from: 4, to: 6, flag: 'castle' });
            if (s.cas.indexOf('q') >= 0 && b[3] === '.' && b[2] === '.' && b[1] === '.' && b[0] === 'r' && !attacked(b, 4, op) && !attacked(b, 3, op) && !attacked(b, 2, op)) out.push({ from: 4, to: 2, flag: 'castle' });
          }
        }
      } else {
        var dirs = u === 'B' ? B_DIR : u === 'R' ? R_DIR : B_DIR.concat(R_DIR);
        for (d = 0; d < dirs.length; d++) { rr = r + dirs[d][0]; cc = c + dirs[d][1]; while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) { t = rr * 8 + cc; tp = b[t]; if (tp === '.') out.push({ from: sq, to: t, flag: '' }); else { if (col(tp) === op) out.push({ from: sq, to: t, flag: 'cap' }); break; } rr += dirs[d][0]; cc += dirs[d][1]; } }
      }
    }
    return out;
  }
  function make(s, m) {
    var b = s.b.slice(), p = b[m.from], me = s.turn, cas = s.cas, ep = -1, cap = b[m.to] !== '.' || m.flag === 'ep';
    b[m.from] = '.'; b[m.to] = p;
    if (m.flag === 'ep') b[m.to + (me === 'w' ? 8 : -8)] = '.';
    if (m.flag === 'castle') { if (m.to === 62) { b[63] = '.'; b[61] = 'R'; } else if (m.to === 58) { b[56] = '.'; b[59] = 'R'; } else if (m.to === 6) { b[7] = '.'; b[5] = 'r'; } else { b[0] = '.'; b[3] = 'r'; } }
    if (m.promo) b[m.to] = me === 'w' ? m.promo : m.promo.toLowerCase();
    if (m.flag === 'dbl') ep = (m.from + m.to) >> 1;
    if (p === 'K') cas = cas.replace('K', '').replace('Q', ''); if (p === 'k') cas = cas.replace('k', '').replace('q', '');
    [[56, 'Q'], [63, 'K'], [0, 'q'], [7, 'k']].forEach(function (x) { if (m.from === x[0] || m.to === x[0]) cas = cas.replace(x[1], ''); });
    return { b: b, turn: me === 'w' ? 'b' : 'w', cas: cas, ep: ep, half: (p.toUpperCase() === 'P' || cap) ? 0 : s.half + 1, full: s.full + (me === 'b' ? 1 : 0) };
  }
  function kingSq(b, c) { return b.indexOf(c === 'w' ? 'K' : 'k'); }
  function inCheck(s) { return attacked(s.b, kingSq(s.b, s.turn), s.turn === 'w' ? 'b' : 'w'); }
  function legal(s) {
    var me = s.turn, op = me === 'w' ? 'b' : 'w';
    return pseudo(s).filter(function (m) { var ns = make(s, m); return !attacked(ns.b, kingSq(ns.b, me), op); });
  }
  function status(s) {
    var l = legal(s);
    if (!l.length) return inCheck(s) ? 'mate' : 'stalemate';
    if (s.half >= 100) return 'draw50';
    var pcs = s.b.filter(function (x) { return x !== '.' && x.toUpperCase() !== 'K'; });
    if (!pcs.length || (pcs.length === 1 && 'NBnb'.indexOf(pcs[0]) >= 0)) return 'material';
    return inCheck(s) ? 'check' : 'ok';
  }
  var VAL = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
  function evaluate(s) {
    var sc = 0, i, p, u, r, c, cen;
    for (i = 0; i < 64; i++) {
      p = s.b[i]; if (p === '.') continue; u = p.toUpperCase(); r = i >> 3; c = i & 7;
      cen = 3.5 - Math.max(Math.abs(c - 3.5), Math.abs(r - 3.5)) + 0; // 0..3 makin ke tengah
      var v = VAL[u] + (u === 'N' || u === 'B' ? cen * 8 : u === 'P' ? cen * 3 + (isW(p) ? (6 - r) : (r - 1)) * 4 : u === 'Q' ? cen : 0);
      sc += isW(p) ? v : -v;
    }
    return sc;
  }
  function order(s, ms) {
    return ms.sort(function (a, b) {
      var va = (s.b[a.to] !== '.' ? VAL[s.b[a.to].toUpperCase()] * 10 - VAL[s.b[a.from].toUpperCase()] : 0) + (a.promo ? 800 : 0);
      var vb = (s.b[b.to] !== '.' ? VAL[s.b[b.to].toUpperCase()] * 10 - VAL[s.b[b.from].toUpperCase()] : 0) + (b.promo ? 800 : 0);
      return vb - va;
    });
  }
  function search(s, depth, alpha, beta) {
    var ms = legal(s);
    if (!ms.length) return inCheck(s) ? (s.turn === 'w' ? -99999 - depth : 99999 + depth) : 0;
    if (depth === 0) return evaluate(s);
    order(s, ms);
    var i, v, best;
    if (s.turn === 'w') { best = -Infinity; for (i = 0; i < ms.length; i++) { v = search(make(s, ms[i]), depth - 1, alpha, beta); if (v > best) best = v; if (best > alpha) alpha = best; if (alpha >= beta) break; } }
    else { best = Infinity; for (i = 0; i < ms.length; i++) { v = search(make(s, ms[i]), depth - 1, alpha, beta); if (v < best) best = v; if (best < beta) beta = best; if (alpha >= beta) break; } }
    return best;
  }
  function bestMove(s, depth) {
    var ms = order(s, legal(s)); if (!ms.length) return null;
    if (depth <= 0) return ms[Math.floor(Math.random() * ms.length)];
    var best = null, bv = s.turn === 'w' ? -Infinity : Infinity, i, v;
    for (i = 0; i < ms.length; i++) {
      v = search(make(s, ms[i]), depth - 1, -Infinity, Infinity) + (Math.random() - .5) * 6;
      if (s.turn === 'w' ? v > bv : v < bv) { bv = v; best = ms[i]; }
    }
    return best;
  }
  function perft(s, d) { if (d === 0) return 1; var ms = legal(s), n = 0, i; if (d === 1) return ms.length; for (i = 0; i < ms.length; i++) n += perft(make(s, ms[i]), d - 1); return n; }
  function fromFEN(fen) {
    var parts = fen.split(' '), b = [];
    parts[0].split('/').forEach(function (row) { row.split('').forEach(function (ch) { if (/\d/.test(ch)) for (var k = 0; k < +ch; k++) b.push('.'); else b.push(ch); }); });
    var ep = parts[3] && parts[3] !== '-' ? (8 - +parts[3][1]) * 8 + 'abcdefgh'.indexOf(parts[3][0]) : -1;
    return { b: b, turn: parts[1], cas: parts[2] === '-' ? '' : parts[2], ep: ep, half: +parts[4] || 0, full: +parts[5] || 1 };
  }
  root.Chess = { newGame: newGame, legal: legal, make: make, status: status, inCheck: inCheck, bestMove: bestMove, perft: perft, fromFEN: fromFEN, col: col, attacked: attacked };
  if (typeof module !== 'undefined') module.exports = root.Chess;
})(typeof window !== 'undefined' ? window : globalThis);
