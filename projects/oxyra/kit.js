/* ===== Site Kit — inti: util, penyimpanan, ikon, UI dasar =====
   Dipakai bersama oleh Rental Mobil, Perpustakaan, Oxyra, dan College Majors.
   Semua data tersimpan di browser (localStorage); tidak ada server. */
(function (W) {
  'use strict';
  var S = W.SITE; if (!S) { throw new Error('SITE belum didefinisikan'); }
  var K = W.K = { S: S, pages: {}, hooks: {} };

  /* ---------- util ---------- */
  K.$ = function (s, r) { return (r || document).querySelector(s); };
  K.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  K.esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  K.rp = function (n) { return 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID'); };
  K.uid = function (p) { return (p || 'id') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };
  K.fmtDate = function (d, long) { try { return new Date(d).toLocaleDateString('id-ID', long ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };
  K.fmtDT = function (d) { try { return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
  K.isoDate = function (d) { d = d || new Date(); var z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };
  K.addDays = function (iso, n) { var d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return K.isoDate(d); };
  K.diffDays = function (a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5); };
  K.debounce = function (f, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { f.apply(c, a); }, ms); }; };
  K.norm = function (t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  K.mask = function (email) { var p = String(email).split('@'); if (p.length < 2) return '***'; var n = p[0]; return n.slice(0, Math.min(2, n.length)) + '•••' + (n.length > 3 ? n.slice(-1) : '') + '@' + p[1]; };
  K.maskName = function (n) { n = String(n); return n.length <= 2 ? n[0] + '•' : n.slice(0, 2) + '•'.repeat(Math.max(2, n.length - 3)) + n.slice(-1); };
  K.clamp = function (n, a, b) { return Math.max(a, Math.min(b, n)); };
  K.readTime = function (t) { return Math.max(1, Math.round(String(t).split(/\s+/).length / 200)); };

  /* ---------- penyimpanan ---------- */
  var ns = S.key + ':';
  K.get = function (k, f) { try { var v = localStorage.getItem(ns + k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } };
  K.set = function (k, v) { try { localStorage.setItem(ns + k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  K.sget = function (k, f) { try { var v = sessionStorage.getItem(ns + k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } };
  K.sset = function (k, v) { try { sessionStorage.setItem(ns + k, JSON.stringify(v)); } catch (e) { } };
  K.del = function (k) { try { localStorage.removeItem(ns + k); sessionStorage.removeItem(ns + k); } catch (e) { } };

  /* ---------- ikon ---------- */
  var IC = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L20 7H6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 13.5A9 9 0 1 1 10.5 3a7 7 0 0 0 10.5 10.5z"/>',
    heart: '<path d="M12 21s-7-4.6-9.3-9.2C1 8.4 3 5 6.4 5c2 0 3.6 1.1 5.6 3.3C14 6.1 15.6 5 17.6 5 21 5 23 8.4 21.3 11.8 19 16.4 12 21 12 21z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h0"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    logout: '<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h0"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v5M12 18h0"/>',
    print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
    truck: '<path d="M2 6h11v10H2zM13 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14-4M4 4v4h4M4 13a8 8 0 0 0 14 4M20 20v-4h-4"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    gradcap: '<path d="M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>',
    drop: '<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.600 6-11 6-11z"/>'
  };
  K.icon = function (n, c) { return '<svg class="ic ' + (c || '') + '" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[n] || '') + '</svg>'; };
  K.i = K.icon;

  /* ---------- toast & modal ---------- */
  var tt;
  K.toast = function (msg, type) {
    var t = K.$('#k-toast');
    if (!t) { t = document.createElement('div'); t.id = 'k-toast'; t.className = 'k-toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.className = 'k-toast show ' + (type || '');
    t.innerHTML = (type === 'err' ? K.icon('alert') : type === 'ok' ? K.icon('check') : K.icon('info')) + '<span>' + K.esc(msg) + '</span>';
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 3200);
  };
  K.confirm = function (title, text, okLabel, danger) {
    return new Promise(function (res) {
      var m = document.createElement('div'); m.className = 'k-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
      m.innerHTML = '<div class="k-modal-box"><h3>' + K.esc(title) + '</h3><p>' + K.esc(text) + '</p><div class="k-row end"><button class="btn btn-ghost" data-r="0">Batal</button><button class="btn ' + (danger ? 'btn-danger' : 'btn-primary') + '" data-r="1">' + K.esc(okLabel || 'Ya') + '</button></div></div>';
      document.body.appendChild(m); var prev = document.activeElement; K.$('[data-r="1"]', m).focus();
      function done(v) { m.remove(); document.removeEventListener('keydown', key); if (prev && prev.focus) prev.focus(); res(v); }
      function key(e) { if (e.key === 'Escape') done(false); }
      m.addEventListener('click', function (e) { var b = e.target.closest('[data-r]'); if (b) done(b.dataset.r === '1'); else if (e.target === m) done(false); });
      document.addEventListener('keydown', key);
    });
  };

  /* ---------- hash (SHA-256 + salt) ---------- */
  K.hash = function (text) {
    if (W.crypto && crypto.subtle && W.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return x.toString(16).padStart(2, '0'); }).join(''); });
    }
    var h = 5381; for (var i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    return Promise.resolve('x' + (h >>> 0).toString(16));
  };
  K.salt = function () { try { return Array.prototype.map.call(crypto.getRandomValues(new Uint8Array(8)), function (x) { return x.toString(16).padStart(2, '0'); }).join(''); } catch (e) { return Math.random().toString(16).slice(2, 12); } };

  /* ---------- pengaturan tampilan ---------- */
  K.prefs = function () { return Object.assign({ theme: 'auto', font: 'md', motion: true, density: 'normal', notif: { promo: true, order: true, news: false } }, K.get('prefs', {})); };
  K.applyPrefs = function () {
    var p = K.prefs(), r = document.documentElement;
    var dark = p.theme === 'dark' || (p.theme === 'auto' && W.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    r.setAttribute('data-theme', dark ? 'dark' : 'light'); r.setAttribute('data-font', p.font); r.setAttribute('data-density', p.density);
    r.setAttribute('data-motion', p.motion ? 'on' : 'off');
  };
  K.setPref = function (k, v) { var p = K.prefs(); p[k] = v; K.set('prefs', p); K.applyPrefs(); };
  K.applyPrefs();
  if (W.matchMedia) { try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', K.applyPrefs); } catch (e) { } }
})(window);

/* ===== Site Kit — autentikasi: masuk, daftar, lupa username/email/password ===== */
(function (W) {
  'use strict';
  var K = W.K, S = K.S, esc = K.esc, I = K.icon;

  /* ---------- pengguna & sesi ---------- */
  K.users = function () { return K.get('users', []); };
  K.saveUsers = function (u) { K.set('users', u); };
  K.session = function () {
    var s = K.sget('session', null) || K.get('session', null);
    if (!s) return null;
    if (s.exp && s.exp < Date.now()) { K.del('session'); return null; }
    return s;
  };
  K.me = function () { var s = K.session(); if (!s) return null; return K.users().filter(function (u) { return u.id === s.uid; })[0] || null; };
  K.login = function (u, remember) {
    var s = { uid: u.id, exp: Date.now() + (remember ? 30 : 1) * 864e5, remember: !!remember };
    K.del('session'); if (remember) K.set('session', s); else K.sset('session', s);
    K.refreshChrome && K.refreshChrome();
  };
  K.logout = function () { K.del('session'); K.refreshChrome && K.refreshChrome(); };
  K.requireLogin = function (ctx, why) {
    if (K.me()) return true;
    K.toast(why || 'Silakan masuk dulu.', 'err');
    K.go('/login?next=' + encodeURIComponent(ctx.path + (ctx.rawQuery ? '?' + ctx.rawQuery : '')));
    return false;
  };

  /* akun demo agar fitur bisa langsung dicoba */
  K.seedUsers = function () {
    if (K.get('seeded', false)) return;
    var d = S.demoUser; if (!d) { K.set('seeded', true); return; }
    var salt = 'demo0001';
    K.hash(salt + d.password).then(function (h) {
      var us = K.users();
      if (!us.some(function (u) { return u.username === d.username; })) {
        us.push({ id: 'u-demo', name: d.name, username: d.username, email: d.email, phone: d.phone, salt: salt, hash: h, created: Date.now(), color: 0, role: 'user' });
        K.saveUsers(us);
      }
      K.set('seeded', true);
    });
  };

  K.validators = {
    username: function (v) { return /^[a-z0-9_.]{3,20}$/.test(v) ? '' : 'Username 3–20 karakter: huruf kecil, angka, titik, atau garis bawah.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Format email belum benar.'; },
    phone: function (v) { return /^(\+62|62|0)8[0-9]{8,12}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Nomor HP Indonesia, contoh 081234567890.'; },
    password: function (v) { return v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v) ? '' : 'Minimal 8 karakter dengan huruf dan angka.'; },
    name: function (v) { return v.trim().length >= 3 ? '' : 'Nama minimal 3 karakter.'; }
  };
  K.strength = function (p) {
    var s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(4, Math.max(p ? 1 : 0, s - (p.length < 8 ? 1 : 0)));
  };
  K.normPhone = function (p) { p = String(p || '').replace(/[\s-]/g, ''); if (p.indexOf('+62') === 0) p = '0' + p.slice(3); else if (p.indexOf('62') === 0) p = '0' + p.slice(2); return p; };

  /* ---------- komponen form ---------- */
  K.field = function (o) {
    var id = 'f-' + o.name, ic = o.icon ? '<span class="fi">' + I(o.icon) + '</span>' : '';
    var attrs = ' id="' + id + '" name="' + o.name + '" type="' + (o.type || 'text') + '"' + (o.value != null ? ' value="' + esc(o.value) + '"' : '') + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + (o.auto ? ' autocomplete="' + o.auto + '"' : '') + (o.req !== false ? ' required' : '') + (o.max ? ' maxlength="' + o.max + '"' : '') + (o.min != null ? ' min="' + o.min + '"' : '') + (o.pattern ? ' pattern="' + o.pattern + '"' : '') + (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') + (o.extra || '') + ' aria-describedby="' + id + '-h"';
    var input = o.type === 'textarea' ? '<textarea' + attrs.replace(' type="textarea"', '') + ' rows="' + (o.rows || 4) + '">' + esc(o.value || '') + '</textarea>'
      : o.type === 'select' ? '<select' + attrs.replace(' type="select"', '') + '>' + o.options.map(function (op) { var v = Array.isArray(op) ? op[0] : op, l = Array.isArray(op) ? op[1] : op; return '<option value="' + esc(v) + '"' + (String(v) === String(o.value) ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') + '</select>'
        : '<input' + attrs + '>';
    var eye = o.type === 'password' ? '<button type="button" class="fe" data-act="pw" aria-label="Tampilkan password" title="Tampilkan/sembunyikan">' + I('eye') + '</button>' : '';
    return '<div class="field' + (o.icon ? ' has-ic' : '') + '"><label for="' + id + '">' + esc(o.label) + (o.req === false ? ' <i>(opsional)</i>' : '') + '</label><div class="fw">' + ic + input + eye + '</div><small id="' + id + '-h" class="fh' + (o.hint ? '' : ' empty') + '">' + (o.hint ? esc(o.hint) : '') + '</small></div>';
  };
  K.setErr = function (form, name, msg) {
    var f = K.$('#f-' + name, form); if (!f) return; var w = f.closest('.field'), h = K.$('.fh', w);
    w.classList.toggle('bad', !!msg); f.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) { h.textContent = msg; h.classList.remove('empty'); } else if (!h.dataset.keep) { h.textContent = h.dataset.orig || ''; h.classList.toggle('empty', !h.dataset.orig); }
  };
  K.alertBox = function (type, html) { return '<div class="alert ' + type + '" role="' + (type === 'err' ? 'alert' : 'status') + '">' + I(type === 'err' ? 'alert' : type === 'ok' ? 'check' : 'info') + '<div>' + html + '</div></div>'; };
  K.authShell = function (title, sub, body, foot) {
    return '<section class="auth"><div class="auth-side"><div class="auth-art">' + (S.authArt || '') + '</div><h2>' + esc(S.authTitle || S.name) + '</h2><p>' + esc(S.authText || S.tagline) + '</p><ul class="auth-points">' + (S.authPoints || []).map(function (p) { return '<li>' + I('check') + esc(p) + '</li>'; }).join('') + '</ul></div><div class="auth-card"><h1>' + esc(title) + '</h1><p class="muted">' + sub + '</p>' + body + (foot ? '<div class="auth-foot">' + foot + '</div>' : '') + '</div></section>';
  };
  /* kotak surat simulasi (situs statis tidak mengirim email sungguhan) */
  K.mailbox = function (to, subject, bodyHtml) {
    return '<div class="mailbox" aria-label="Email simulasi"><div class="mb-bar"><span>' + I('mail') + ' Kotak masuk simulasi</span><em>Tidak ada email sungguhan yang dikirim</em></div><div class="mb-msg"><div class="mb-h"><b>Kepada:</b> ' + esc(to) + '<br><b>Dari:</b> ' + esc(S.name) + ' &lt;no-reply@' + esc(S.key) + '.demo&gt;<br><b>Subjek:</b> ' + esc(subject) + '</div><div class="mb-b">' + bodyHtml + '</div></div></div>';
  };
  function nextUrl(ctx) { var n = ctx.query.next; return n && n.charAt(0) === '/' && n.indexOf('//') !== 0 ? n : '/'; }
  function fails() { return K.get('fails', {}); }

  /* ---------- MASUK ---------- */
  K.pages.login = function (ctx) {
    if (K.me()) { K.go(nextUrl(ctx)); return { html: '' }; }
    var d = S.demoUser;
    var html = K.authShell('Masuk', 'Gunakan username atau email dan password akunmu.',
      '<form data-form="login" novalidate>' +
      '<div class="alert-slot"></div>' +
      K.field({ name: 'id', label: 'Username atau email', icon: 'user', auto: 'username', ph: 'contoh: ' + (d ? d.username : 'budi') + ' atau ' + (d ? d.email : 'budi@email.com') }) +
      K.field({ name: 'password', label: 'Password', type: 'password', icon: 'lock', auto: 'current-password', ph: 'Password kamu' }) +
      '<div class="k-row between"><label class="check"><input type="checkbox" name="remember" checked> <span>Ingat saya 30 hari</span></label><a href="#/forgot-password" class="link">Lupa password?</a></div>' +
      '<button class="btn btn-primary btn-block btn-lg" type="submit">Masuk ' + I('arrow') + '</button></form>' +
      '<div class="divider"><span>Lupa sesuatu?</span></div>' +
      '<div class="forgot-grid"><a class="btn btn-ghost" href="#/forgot-username">' + I('user') + ' Lupa username</a><a class="btn btn-ghost" href="#/forgot-email">' + I('mail') + ' Lupa email</a><a class="btn btn-ghost" href="#/forgot-password">' + I('lock') + ' Lupa password</a></div>' +
      (d ? '<div class="demo-box"><b>Akun demo</b><span>Username <code>' + esc(d.username) + '</code> · Password <code>' + esc(d.password) + '</code></span><button type="button" class="btn btn-sm btn-ghost" data-act="fill-demo">Isi otomatis</button></div>' : ''),
      'Belum punya akun? <a href="#/signup' + (ctx.rawQuery ? '?' + ctx.rawQuery : '') + '" class="link strong">Daftar gratis</a>');
    return { html: html, title: 'Masuk' };
  };
  K.forms = K.forms || {};
  K.forms.login = function (form, ctx) {
    var id = form.elements.id.value.trim().toLowerCase(), pw = form.password.value, slot = K.$('.alert-slot', form), btn = K.$('[type=submit]', form);
    slot.innerHTML = ''; K.setErr(form, 'id', ''); K.setErr(form, 'password', '');
    if (!id) { K.setErr(form, 'id', 'Isi username atau email.'); return; }
    if (!pw) { K.setErr(form, 'password', 'Isi password.'); return; }
    var f = fails(), rec = f[id] || { n: 0, until: 0 };
    if (rec.until > Date.now()) { slot.innerHTML = K.alertBox('err', 'Terlalu banyak percobaan gagal. Coba lagi dalam <b>' + Math.ceil((rec.until - Date.now()) / 1000) + ' detik</b>, atau pakai <a href="#/forgot-password" class="link">lupa password</a>.'); return; }
    btn.disabled = true;
    var u = K.users().filter(function (x) { return x.username === id || x.email === id; })[0];
    (u ? K.hash(u.salt + pw) : Promise.resolve(null)).then(function (h) {
      btn.disabled = false;
      if (!u || h !== u.hash) {
        rec.n++; if (rec.n >= 5) { rec.until = Date.now() + 30000; rec.n = 0; } f[id] = rec; K.set('fails', f);
        slot.innerHTML = K.alertBox('err', 'Username/email atau password salah.' + (rec.until ? ' Akses dikunci 30 detik.' : '')); return;
      }
      delete f[id]; K.set('fails', f);
      K.login(u, form.remember.checked); K.toast('Selamat datang, ' + u.name.split(' ')[0] + '!', 'ok'); K.go(nextUrl(ctx));
    });
  };

  /* ---------- DAFTAR ---------- */
  K.pages.signup = function (ctx) {
    if (K.me()) { K.go('/'); return { html: '' }; }
    var html = K.authShell('Buat akun', 'Gratis dan cepat. Data tersimpan di browser ini.',
      '<form data-form="signup" novalidate><div class="alert-slot"></div>' +
      K.field({ name: 'name', label: 'Nama lengkap', icon: 'user', auto: 'name', ph: 'Nama sesuai identitas' }) +
      '<div class="two">' + K.field({ name: 'username', label: 'Username', icon: 'user', auto: 'username', ph: 'budi.santoso', hint: 'Huruf kecil, angka, titik, _' }) + K.field({ name: 'phone', label: 'Nomor HP', icon: 'phone', type: 'tel', auto: 'tel', ph: '081234567890', inputmode: 'tel', hint: 'Dipakai untuk pemulihan akun' }) + '</div>' +
      K.field({ name: 'email', label: 'Email', type: 'email', icon: 'mail', auto: 'email', ph: 'nama@email.com' }) +
      K.field({ name: 'password', label: 'Password', type: 'password', icon: 'lock', auto: 'new-password', ph: 'Minimal 8 karakter', hint: 'Gunakan huruf dan angka.' }) +
      '<div class="meter" aria-hidden="true"><i></i><i></i><i></i><i></i></div><small class="meter-t muted"></small>' +
      K.field({ name: 'password2', label: 'Ulangi password', type: 'password', icon: 'lock', auto: 'new-password' }) +
      '<label class="check"><input type="checkbox" name="agree" required> <span>Saya setuju dengan <a href="#/faq" class="link">syarat penggunaan</a> dan kebijakan privasi.</span></label>' +
      '<button class="btn btn-primary btn-block btn-lg" type="submit">Daftar sekarang ' + I('arrow') + '</button></form>',
      'Sudah punya akun? <a href="#/login' + (ctx.rawQuery ? '?' + ctx.rawQuery : '') + '" class="link strong">Masuk</a>');
    return {
      html: html, title: 'Daftar', mount: function (root) {
        var pw = K.$('#f-password', root), m = K.$$('.meter i', root), t = K.$('.meter-t', root), names = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat'];
        pw.addEventListener('input', function () { var s = K.strength(pw.value); m.forEach(function (e, i) { e.className = i < s ? 's' + s : ''; }); t.textContent = pw.value ? 'Kekuatan: ' + names[s] : ''; });
      }
    };
  };
  K.forms.signup = function (form, ctx) {
    var v = { name: form.elements.name.value.trim(), username: form.username.value.trim().toLowerCase(), phone: form.phone.value.trim(), email: form.email.value.trim().toLowerCase(), password: form.password.value }, bad = false, slot = K.$('.alert-slot', form);
    ['name', 'username', 'phone', 'email', 'password'].forEach(function (k) { var e = K.validators[k](v[k]); K.setErr(form, k, e); if (e) bad = true; });
    var e2 = form.password2.value !== v.password ? 'Password tidak sama.' : ''; K.setErr(form, 'password2', e2); if (e2) bad = true;
    if (!form.agree.checked) { slot.innerHTML = K.alertBox('err', 'Centang persetujuan syarat penggunaan.'); bad = true; } else slot.innerHTML = '';
    if (bad) { var f = K.$('.field.bad input', form); if (f) f.focus(); return; }
    var us = K.users();
    if (us.some(function (u) { return u.username === v.username; })) { K.setErr(form, 'username', 'Username sudah dipakai.'); return; }
    if (us.some(function (u) { return u.email === v.email; })) { K.setErr(form, 'email', 'Email sudah terdaftar. Coba masuk.'); return; }
    var salt = K.salt();
    K.hash(salt + v.password).then(function (h) {
      var u = { id: K.uid('u-'), name: v.name, username: v.username, email: v.email, phone: K.normPhone(v.phone), salt: salt, hash: h, created: Date.now(), color: Math.floor(Math.random() * 6), role: 'user' };
      us.push(u); K.saveUsers(us); K.login(u, true); K.toast('Akun dibuat. Selamat datang!', 'ok');
      var n = ctx.query.next; K.go(n && n.charAt(0) === '/' ? n : '/');
    });
  };

  /* ---------- LUPA USERNAME ---------- */
  K.pages['forgot-username'] = function () {
    var html = K.authShell('Lupa username', 'Masukkan email akunmu. Kami kirim username ke email tersebut.',
      '<form data-form="forgot-username" novalidate><div class="alert-slot"></div>' + K.field({ name: 'email', label: 'Email terdaftar', type: 'email', icon: 'mail', auto: 'email', ph: 'nama@email.com' }) +
      '<button class="btn btn-primary btn-block btn-lg" type="submit">Kirim username</button></form><div class="result"></div>' + K.recoverLinks('username'),
      '<a href="#/login" class="link">' + I('back') + ' Kembali ke halaman masuk</a>');
    return { html: html, title: 'Lupa username' };
  };
  K.forms['forgot-username'] = function (form) {
    var em = form.email.value.trim().toLowerCase(), res = K.$('.result', form.parentNode), e = K.validators.email(em);
    K.setErr(form, 'email', e); if (e) return;
    var u = K.users().filter(function (x) { return x.email === em; })[0];
    if (!u) { res.innerHTML = K.alertBox('err', 'Tidak ada akun dengan email itu. Coba <a href="#/forgot-email" class="link">lupa email</a> atau <a href="#/signup" class="link">daftar akun baru</a>.'); return; }
    res.innerHTML = K.alertBox('ok', 'Username dikirim ke <b>' + esc(K.mask(em)) + '</b>.') +
      K.mailbox(em, 'Username akun ' + S.name, '<p>Halo ' + esc(u.name.split(' ')[0]) + ',</p><p>Username akunmu adalah:</p><p class="mb-code">' + esc(u.username) + '</p><p><a href="#/login" class="btn btn-primary btn-sm">Masuk sekarang</a></p>');
  };

  /* ---------- LUPA EMAIL ---------- */
  K.pages['forgot-email'] = function () {
    var html = K.authShell('Lupa email', 'Kami cocokkan username dan nomor HP untuk menampilkan email yang terdaftar (sebagian disamarkan).',
      '<form data-form="forgot-email" novalidate><div class="alert-slot"></div>' +
      K.field({ name: 'username', label: 'Username', icon: 'user', auto: 'username', ph: 'username kamu' }) + K.field({ name: 'phone', label: 'Nomor HP terdaftar', type: 'tel', icon: 'phone', auto: 'tel', ph: '081234567890', inputmode: 'tel' }) +
      '<button class="btn btn-primary btn-block btn-lg" type="submit">Cari email saya</button></form><div class="result"></div>' + K.recoverLinks('email'),
      '<a href="#/login" class="link">' + I('back') + ' Kembali ke halaman masuk</a>');
    return { html: html, title: 'Lupa email' };
  };
  K.forms['forgot-email'] = function (form) {
    var un = form.username.value.trim().toLowerCase(), ph = K.normPhone(form.phone.value), res = K.$('.result', form.parentNode);
    var e1 = un ? '' : 'Isi username.', e2 = K.validators.phone(ph); K.setErr(form, 'username', e1); K.setErr(form, 'phone', e2); if (e1 || e2) return;
    var u = K.users().filter(function (x) { return x.username === un && K.normPhone(x.phone) === ph; })[0];
    if (!u) { res.innerHTML = K.alertBox('err', 'Username dan nomor HP tidak cocok dengan akun mana pun. Coba <a href="#/forgot-username" class="link">lupa username</a>.'); return; }
    res.innerHTML = K.alertBox('ok', 'Email terdaftar untuk <b>' + esc(u.username) + '</b>:') + '<p class="mb-code big">' + esc(K.mask(u.email)) + '</p><p class="muted">Gunakan email ini atau username untuk masuk. Lupa password? <a href="#/forgot-password" class="link">Atur ulang di sini</a>.</p>';
  };

  /* ---------- LUPA PASSWORD ---------- */
  K.pages['forgot-password'] = function () {
    var html = K.authShell('Lupa password', 'Masukkan username atau email. Kami buat kode 6 digit untuk mengatur password baru.',
      '<form data-form="forgot-password" novalidate><div class="alert-slot"></div>' + K.field({ name: 'id', label: 'Username atau email', icon: 'user', auto: 'username' }) +
      '<button class="btn btn-primary btn-block btn-lg" type="submit">Kirim kode reset</button></form><div class="result"></div>' + K.recoverLinks('password'),
      '<a href="#/login" class="link">' + I('back') + ' Kembali ke halaman masuk</a>');
    return { html: html, title: 'Lupa password' };
  };
  K.forms['forgot-password'] = function (form) {
    var id = form.elements.id.value.trim().toLowerCase(), res = K.$('.result', form.parentNode);
    if (!id) { K.setErr(form, 'id', 'Isi username atau email.'); return; } K.setErr(form, 'id', '');
    var u = K.users().filter(function (x) { return x.username === id || x.email === id; })[0];
    if (!u) { res.innerHTML = K.alertBox('err', 'Akun tidak ditemukan. Periksa penulisan atau coba <a href="#/forgot-username" class="link">lupa username</a> / <a href="#/forgot-email" class="link">lupa email</a>.'); return; }
    var code = String(Math.floor(100000 + Math.random() * 900000)), r = K.get('resets', {}); r[u.id] = { code: code, exp: Date.now() + 10 * 60000, tries: 0 }; K.set('resets', r);
    res.innerHTML = K.alertBox('ok', 'Kode reset dikirim ke <b>' + esc(K.mask(u.email)) + '</b>. Berlaku 10 menit.') +
      K.mailbox(u.email, 'Kode reset password', '<p>Halo ' + esc(u.name.split(' ')[0]) + ', gunakan kode ini untuk mengatur password baru:</p><p class="mb-code big">' + code + '</p><p><a class="btn btn-primary btn-sm" href="#/reset?u=' + encodeURIComponent(u.id) + '">Masukkan kode &amp; password baru</a></p><p class="muted">Jika bukan kamu yang meminta, abaikan pesan ini.</p>');
  };
  K.pages.reset = function (ctx) {
    var uid = ctx.query.u, u = K.users().filter(function (x) { return x.id === uid; })[0];
    if (!u) return { html: K.authShell('Tautan tidak valid', 'Mulai lagi dari lupa password.', '<a class="btn btn-primary btn-block" href="#/forgot-password">Minta kode baru</a>') };
    var html = K.authShell('Atur password baru', 'Akun <b>' + esc(u.username) + '</b> (' + esc(K.mask(u.email)) + ')',
      '<form data-form="reset" data-uid="' + esc(u.id) + '" novalidate><div class="alert-slot"></div>' +
      K.field({ name: 'code', label: 'Kode 6 digit', icon: 'shield', ph: '123456', inputmode: 'numeric', max: 6, auto: 'one-time-code' }) +
      K.field({ name: 'password', label: 'Password baru', type: 'password', icon: 'lock', auto: 'new-password', hint: 'Minimal 8 karakter dengan huruf dan angka.' }) +
      K.field({ name: 'password2', label: 'Ulangi password baru', type: 'password', icon: 'lock', auto: 'new-password' }) +
      '<button class="btn btn-primary btn-block btn-lg" type="submit">Simpan password baru</button></form>', '<a href="#/forgot-password" class="link">Kirim ulang kode</a>');
    return { html: html, title: 'Reset password' };
  };
  K.forms.reset = function (form) {
    var uid = form.dataset.uid, r = K.get('resets', {}), rec = r[uid], slot = K.$('.alert-slot', form), code = form.code.value.trim(), pw = form.password.value;
    var eP = K.validators.password(pw); K.setErr(form, 'password', eP); var e2 = pw !== form.password2.value ? 'Password tidak sama.' : ''; K.setErr(form, 'password2', e2);
    if (eP || e2) return;
    if (!rec || rec.exp < Date.now()) { slot.innerHTML = K.alertBox('err', 'Kode kedaluwarsa. <a href="#/forgot-password" class="link">Minta kode baru</a>.'); return; }
    if (rec.code !== code) { rec.tries++; if (rec.tries >= 5) delete r[uid]; K.set('resets', r); slot.innerHTML = K.alertBox('err', 'Kode salah.' + (rec.tries >= 5 ? ' Kode dihanguskan, minta kode baru.' : '')); return; }
    var salt = K.salt();
    K.hash(salt + pw).then(function (h) {
      var us = K.users(); us.forEach(function (u) { if (u.id === uid) { u.salt = salt; u.hash = h; } }); K.saveUsers(us); delete r[uid]; K.set('resets', r); K.set('fails', {});
      K.toast('Password berhasil diganti. Silakan masuk.', 'ok'); K.go('/login');
    });
  };
  K.recoverLinks = function (cur) {
    var L = [['username', 'Lupa username'], ['email', 'Lupa email'], ['password', 'Lupa password']].filter(function (x) { return x[0] !== cur; });
    return '<div class="recover-links">' + L.map(function (x) { return '<a class="btn btn-ghost btn-sm" href="#/forgot-' + x[0] + '">' + x[1] + '</a>'; }).join('') + '</div>';
  };
})(window);

/* ===== Site Kit — katalog, favorit, keranjang, checkout, pesanan ===== */
(function (W) {
  'use strict';
  var K = W.K, S = K.S, esc = K.esc, I = K.icon, C = S.catalog || { mode: null, items: [] };
  K.acts = K.acts || {}; K.C = C;
  var MODE = C.mode, items = C.items || [];
  K.item = function (id) { return items.filter(function (x) { return String(x.id) === String(id); })[0]; };
  K.cats = function () { var s = []; items.forEach(function (x) { if (x.cat && s.indexOf(x.cat) < 0) s.push(x.cat); }); return s; };

  /* ---------- stok ---------- */
  K.stockOf = function (it) { var m = K.get('stock', {}); var v = m[it.id]; return v == null ? (it.stock == null ? 999 : it.stock) : v; };
  K.adjStock = function (id, d) { var m = K.get('stock', {}), it = K.item(id); if (!it) return; var cur = m[id] == null ? (it.stock == null ? 999 : it.stock) : m[id]; m[id] = Math.max(0, cur + d); K.set('stock', m); };

  /* ---------- thumbnail ---------- */
  K.thumb = function (it, cls) {
    if (it.img && it.emoji) return '<div class="art stack ' + (cls || '') + '"><span class="emo">' + it.emoji + '</span><img src="' + esc(it.img) + '" alt="' + esc(it.name) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div>';
    if (it.img) return '<img class="' + (cls || '') + '" src="' + esc(it.img) + '" alt="' + esc(it.name) + '" loading="lazy" decoding="async">';
    if (S.art) return '<div class="art ' + (cls || '') + '">' + S.art(it) + '</div>';
    return '<div class="art ' + (cls || '') + '"><span class="emo">' + (it.emoji || '📦') + '</span></div>';
  };
  K.stars = function (n) { n = n || 0; var f = Math.round(n); return '<span class="stars" aria-label="Rating ' + n + ' dari 5">' + '★'.repeat(f) + '<i>' + '★'.repeat(5 - f) + '</i></span>'; };

  /* ---------- favorit ---------- */
  K.wish = function () { return K.get('wish', []); };
  K.isWish = function (id) { return K.wish().indexOf(String(id)) >= 0; };
  K.acts.wish = function (el) {
    var id = String(el.dataset.id), w = K.wish(), i = w.indexOf(id);
    if (i >= 0) { w.splice(i, 1); K.toast('Dihapus dari ' + (S.wishLabel || 'favorit').toLowerCase()); } else { w.push(id); K.toast('Disimpan ke ' + (S.wishLabel || 'favorit').toLowerCase(), 'ok'); }
    K.set('wish', w); K.$$('[data-act="wish"][data-id="' + id + '"]').forEach(function (b) { b.classList.toggle('on', i < 0); b.setAttribute('aria-pressed', i < 0); }); K.refreshChrome();
  };
  K.heart = function (it) { var on = K.isWish(it.id); return '<button class="heart' + (on ? ' on' : '') + '" data-act="wish" data-id="' + esc(it.id) + '" aria-pressed="' + on + '" aria-label="Simpan ' + esc(it.name) + '">' + I('heart') + '</button>'; };

  /* ---------- kartu & katalog ---------- */
  K.card = function (it) {
    var st = K.stockOf(it), out = st <= 0;
    var price = (C.price !== false && it.price != null) ? '<div class="price">' + K.rp(it.price) + (C.unit ? ' <small>' + esc(C.unit) + '</small>' : '') + '</div>' : '';
    return '<article class="card item' + (out ? ' out' : '') + '"><a class="thumb" href="#/item/' + esc(it.id) + '" aria-label="Lihat ' + esc(it.name) + '">' + K.thumb(it) + (it.badge ? '<span class="badge b-accent">' + esc(it.badge) + '</span>' : '') + (out ? '<span class="badge b-dark">' + esc(C.outLabel || 'Habis') + '</span>' : '') + '</a>' + K.heart(it) +
      '<div class="card-b"><span class="eyebrow">' + esc(it.cat || '') + '</span><h3><a href="#/item/' + esc(it.id) + '">' + esc(it.name) + '</a></h3>' + (C.meta ? '<p class="muted sm">' + C.meta(it) + '</p>' : '') +
      '<div class="card-f">' + price + (MODE && MODE !== 'apply' ? '<button class="btn btn-sm btn-primary" data-act="quick-add" data-id="' + esc(it.id) + '"' + (out ? ' disabled' : '') + '>' + I('plus') + ' ' + esc(C.addLabel || 'Tambah') + '</button>' : '<a class="btn btn-sm btn-primary" href="#/item/' + esc(it.id) + '">Lihat detail</a>') + '</div></div></article>';
  };
  K.pages.catalog = function (ctx) {
    var q = ctx.query.q || '', cat = ctx.query.cat || '', sort = ctx.query.sort || 'default';
    var list = items.filter(function (x) { return (!cat || x.cat === cat) && (!q || K.norm([x.name, x.cat, x.desc, x.brand, x.author].join(' ')).indexOf(K.norm(q)) >= 0); });
    if (sort === 'low') list.sort(function (a, b) { return a.price - b.price; }); else if (sort === 'high') list.sort(function (a, b) { return b.price - a.price; }); else if (sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    var cats = K.cats();
    var html = K.pageHead(C.title, C.subtitle) + '<div class="wrap"><div class="toolbar"><div class="chips" role="group" aria-label="Kategori"><a class="chip' + (!cat ? ' on' : '') + '" href="#/catalog' + (q ? '?q=' + encodeURIComponent(q) : '') + '">Semua <em>' + items.length + '</em></a>' + cats.map(function (c) { return '<a class="chip' + (cat === c ? ' on' : '') + '" href="#/catalog?cat=' + encodeURIComponent(c) + (q ? '&q=' + encodeURIComponent(q) : '') + '">' + esc(c) + '</a>'; }).join('') + '</div>' +
      '<form class="tool-form" data-form="catalog-filter"><div class="fw mini"><span class="fi">' + I('search') + '</span><input type="search" name="q" value="' + esc(q) + '" placeholder="Cari di ' + esc((C.title || '').toLowerCase()) + '…" aria-label="Cari"></div>' +
      (C.price !== false ? '<select name="sort" aria-label="Urutkan"><option value="default"' + (sort === 'default' ? ' selected' : '') + '>Urutan awal</option><option value="low"' + (sort === 'low' ? ' selected' : '') + '>Harga terendah</option><option value="high"' + (sort === 'high' ? ' selected' : '') + '>Harga tertinggi</option><option value="name"' + (sort === 'name' ? ' selected' : '') + '>Nama A–Z</option></select>' : '<select name="sort" aria-label="Urutkan"><option value="default">Urutan awal</option><option value="name"' + (sort === 'name' ? ' selected' : '') + '>Nama A–Z</option></select>') + '<input type="hidden" name="cat" value="' + esc(cat) + '"></form></div>' +
      '<p class="muted sm result-n" role="status">' + list.length + ' ' + esc(C.noun || 'item') + ' ditemukan</p>' +
      (list.length ? '<div class="grid items">' + list.map(K.card).join('') + '</div>' : '<div class="empty">' + I('search') + '<h3>Tidak ada hasil</h3><p>Coba kata kunci lain atau <a href="#/catalog" class="link">lihat semua</a>.</p></div>') + '</div>';
    return { html: html, title: C.title };
  };
  K.forms['catalog-filter'] = function (f) {
    var p = []; if (f.q.value.trim()) p.push('q=' + encodeURIComponent(f.q.value.trim())); if (f.cat.value) p.push('cat=' + encodeURIComponent(f.cat.value)); if (f.sort.value !== 'default') p.push('sort=' + f.sort.value);
    K.go('/catalog' + (p.length ? '?' + p.join('&') : ''));
  };

  /* ---------- detail ---------- */
  K.pages.item = function (ctx) {
    var it = K.item(ctx.params[0]);
    if (!it) return K.notFound();
    var st = K.stockOf(it), out = st <= 0, rel = items.filter(function (x) { return x.cat === it.cat && x.id !== it.id; }).slice(0, 4);
    var rows = (C.specs ? C.specs(it) : []).filter(function (r) { return r[1] != null && r[1] !== ''; });
    var panel = '';
    if (MODE === 'buy') panel = '<div class="buybox"><div class="price xl">' + K.rp(it.price) + (C.unit ? ' <small>' + esc(C.unit) + '</small>' : '') + '</div><div class="qty-row"><label>Jumlah</label><div class="stepper"><button type="button" data-act="d-qty" data-d="-1" aria-label="Kurangi">' + I('minus') + '</button><input id="d-qty" type="number" value="1" min="1" max="' + Math.min(st, 99) + '" aria-label="Jumlah"><button type="button" data-act="d-qty" data-d="1" aria-label="Tambah">' + I('plus') + '</button></div></div><p class="muted sm" id="d-total"></p><div class="k-row"><button class="btn btn-primary btn-lg grow" data-act="detail-add" data-id="' + esc(it.id) + '"' + (out ? ' disabled' : '') + '>' + I('cart') + ' Tambah ke keranjang</button><button class="btn btn-ghost btn-lg" data-act="detail-buy" data-id="' + esc(it.id) + '"' + (out ? ' disabled' : '') + '>Beli sekarang</button></div></div>';
    else if (MODE === 'rent') panel = '<div class="buybox"><div class="price xl">' + K.rp(it.price) + ' <small>' + esc(C.unit || '/ hari') + '</small></div><div class="two">' + K.field({ name: 'start', label: 'Mulai sewa', type: 'date', value: K.isoDate(), min: K.isoDate(), extra: ' data-act-change="d-total"' }) + K.field({ name: 'days', label: 'Lama (hari)', type: 'number', value: 2, min: 1, max: C.maxDays || 30 }) + '</div><p class="d-total-box" id="d-total"></p><div class="k-row"><button class="btn btn-primary btn-lg grow" data-act="detail-add" data-id="' + esc(it.id) + '"' + (out ? ' disabled' : '') + '>' + I('cart') + ' Tambah ke keranjang</button><button class="btn btn-ghost btn-lg" data-act="detail-buy" data-id="' + esc(it.id) + '"' + (out ? ' disabled' : '') + '>Sewa sekarang</button></div></div>';
    else if (MODE === 'borrow') panel = '<div class="buybox"><p class="muted">Pinjam gratis untuk anggota. Maksimal ' + (C.maxItems || 3) + ' buku, ' + (C.maxDays || 7) + ' hari. Denda ' + K.rp(C.finePerDay || 0) + ' per hari jika terlambat.</p>' + K.field({ name: 'days', label: 'Lama pinjam (hari)', type: 'number', value: C.maxDays || 7, min: 1, max: C.maxDays || 7 }) + '<div class="k-row"><button class="btn btn-primary btn-lg grow" data-act="detail-add" data-id="' + esc(it.id) + '"' + (out ? ' disabled' : '') + '>' + I('cart') + ' ' + esc(C.addLabel || 'Masukkan ke keranjang') + '</button><button class="btn btn-ghost btn-lg" data-act="detail-buy" data-id="' + esc(it.id) + '"' + (out ? ' disabled' : '') + '>Pinjam sekarang</button></div></div>';
    else if (MODE === 'apply') panel = '<div class="buybox"><p class="muted">Tertarik dengan jurusan ini? Kirim minat dan pernyataan singkatmu. Kami simpan di daftar aplikasimu.</p><div class="k-row"><a class="btn btn-primary btn-lg grow" href="#/apply/' + esc(it.id) + '">' + I('send') + ' Ajukan minat</a></div></div>';
    var html = '<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Beranda</a>' + I('chev') + '<a href="#/catalog">' + esc(C.title) + '</a>' + I('chev') + '<span>' + esc(it.name) + '</span></nav>' +
      '<div class="detail"><div class="detail-media">' + K.thumb(it, 'big') + (it.badge ? '<span class="badge b-accent">' + esc(it.badge) + '</span>' : '') + '</div><div class="detail-info"><span class="eyebrow">' + esc(it.cat || '') + '</span><h1>' + esc(it.name) + '</h1>' + (it.rating ? '<p>' + K.stars(it.rating) + ' <span class="muted sm">' + it.rating + ' / 5</span></p>' : '') + '<p class="lead">' + esc(it.desc || '') + '</p>' +
      '<p>' + (out ? '<span class="pill bad">' + esc(C.outLabel || 'Habis') + '</span>' : '<span class="pill ok">' + (st < 900 ? esc(C.stockLabel ? C.stockLabel(st) : 'Stok ' + st) : 'Tersedia') + '</span>') + ' ' + K.heart(it) + '</p>' + panel + '</div></div>' +
      (rows.length ? '<section class="section-sm"><h2>Spesifikasi</h2><table class="spec"><tbody>' + rows.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table></section>' : '') +
      (it.long ? '<section class="section-sm"><h2>Tentang</h2><p>' + esc(it.long) + '</p></section>' : '') +
      (rel.length ? '<section class="section-sm"><h2>Mungkin kamu suka</h2><div class="grid items">' + rel.map(K.card).join('') + '</div></section>' : '') + '</div>';
    return {
      html: html, title: it.name, mount: function (root) {
        var upd = function () { var b = K.$('#d-total', root); if (!b) return; if (MODE === 'buy') { var q = +K.$('#d-qty', root).value || 1; b.textContent = 'Subtotal: ' + K.rp(q * it.price); } else if (MODE === 'rent') { var d = +K.$('#f-days', root).value || 1, s = K.$('#f-start', root).value; b.innerHTML = 'Total ' + d + ' hari: <b>' + K.rp(d * it.price) + '</b>' + (s ? '<br><span class="muted sm">Kembali ' + K.fmtDate(K.addDays(s, d)) + '</span>' : ''); } };
        root.addEventListener('input', upd); upd();
      }
    };
  };
  K.acts['d-qty'] = function (el) { var i = K.$('#d-qty'); i.value = K.clamp((+i.value || 1) + (+el.dataset.d), 1, +i.max || 99); i.dispatchEvent(new Event('input', { bubbles: true })); };
  function readDetail(id) {
    var it = K.item(id), l = { id: String(id), qty: 1, days: 1, start: K.isoDate() };
    if (MODE === 'buy') l.qty = K.clamp(+K.$('#d-qty').value || 1, 1, Math.max(1, Math.min(99, K.stockOf(it))));
    if (MODE === 'rent' || MODE === 'borrow') { l.days = K.clamp(+K.$('#f-days').value || 1, 1, C.maxDays || 30); }
    if (MODE === 'rent') l.start = K.$('#f-start').value || K.isoDate();
    return l;
  }
  K.acts['detail-add'] = function (el) { K.addToCart(readDetail(el.dataset.id)); };
  K.acts['detail-buy'] = function (el) { if (K.addToCart(readDetail(el.dataset.id), true)) K.go('/checkout'); };
  K.acts['quick-add'] = function (el) {
    var it = K.item(el.dataset.id); if (!it) return;
    K.addToCart({ id: String(it.id), qty: 1, days: MODE === 'borrow' ? (C.maxDays || 7) : MODE === 'rent' ? 1 : 1, start: K.isoDate() });
  };

  /* ---------- keranjang ---------- */
  K.cart = function () { return K.get('cart', []); };
  K.saveCart = function (c) { K.set('cart', c); K.refreshChrome(); };
  K.cartCount = function () { var c = K.cart(); return MODE === 'buy' ? c.reduce(function (s, l) { return s + l.qty; }, 0) : c.length; };
  K.addToCart = function (l, silent) {
    var it = K.item(l.id), c = K.cart(), ex = c.filter(function (x) { return x.id === l.id; })[0], st = K.stockOf(it);
    if (st <= 0) { K.toast('Maaf, stok habis.', 'err'); return false; }
    if (MODE === 'buy') { var tot = (ex ? ex.qty : 0) + l.qty; if (tot > st) { K.toast('Stok tersisa hanya ' + st + '.', 'err'); return false; } if (ex) ex.qty = tot; else c.push(l); }
    else {
      if (ex) { ex.days = l.days; ex.start = l.start; if (!silent) { K.toast('Pilihan diperbarui di keranjang.', 'ok'); } }
      else { if (MODE === 'borrow' && c.length >= (C.maxItems || 3)) { K.toast('Maksimal ' + (C.maxItems || 3) + ' ' + (C.noun || 'item') + ' per peminjaman.', 'err'); return false; } c.push(l); }
    }
    K.saveCart(c); if (!silent) K.toast(it.name + ' masuk keranjang.', 'ok'); return true;
  };
  K.cartLines = function () { return K.cart().map(function (l) { return { l: l, it: K.item(l.id) }; }).filter(function (x) { return x.it; }); };
  K.linePrice = function (it, l) { return MODE === 'buy' ? it.price * l.qty : MODE === 'rent' ? it.price * l.days : 0; };
  K.voucher = function () { var c = K.get('voucher', ''); return c && (C.vouchers || {})[c] ? c : ''; };
  K.calc = function (extra) {
    var ls = K.cartLines(), sub = ls.reduce(function (s, x) { return s + K.linePrice(x.it, x.l); }, 0), v = K.voucher(), disc = 0, vd = v ? C.vouchers[v] : null;
    if (vd && sub >= (vd.min || 0)) disc = vd.type === 'pct' ? Math.round(sub * vd.val / 100) : Math.min(sub, vd.val);
    var ship = extra && extra.ship || 0, ex = extra && extra.extras || 0;
    return { sub: sub, disc: disc, ship: ship, extras: ex, total: Math.max(0, sub - disc + ship + ex), voucher: disc ? v : '' };
  };
  K.pages.cart = function () {
    var ls = K.cartLines(), t = K.calc();
    var title = C.cartTitle || 'Keranjang';
    if (!ls.length) return { html: K.pageHead(title) + '<div class="wrap"><div class="empty">' + I('cart') + '<h3>' + esc(title) + ' masih kosong</h3><p>Yuk tambahkan ' + esc(C.noun || 'item') + ' dulu.</p><a class="btn btn-primary" href="#/catalog">Lihat ' + esc((C.title || '').toLowerCase()) + '</a></div></div>', title: title };
    var rows = ls.map(function (x) {
      var it = x.it, l = x.l, ctl = '';
      if (MODE === 'buy') ctl = '<div class="stepper sm"><button data-act="c-qty" data-id="' + esc(it.id) + '" data-d="-1" aria-label="Kurangi">' + I('minus') + '</button><span>' + l.qty + '</span><button data-act="c-qty" data-id="' + esc(it.id) + '" data-d="1" aria-label="Tambah">' + I('plus') + '</button></div>';
      else if (MODE === 'rent') ctl = '<div class="mini-fields"><label>Mulai<input type="date" value="' + esc(l.start) + '" min="' + K.isoDate() + '" data-act-change="c-start" data-id="' + esc(it.id) + '"></label><label>Hari<input type="number" min="1" max="' + (C.maxDays || 30) + '" value="' + l.days + '" data-act-change="c-days" data-id="' + esc(it.id) + '"></label></div>';
      else if (MODE === 'borrow') ctl = '<div class="mini-fields"><label>Lama (hari)<input type="number" min="1" max="' + (C.maxDays || 7) + '" value="' + l.days + '" data-act-change="c-days" data-id="' + esc(it.id) + '"></label></div>';
      return '<li class="cart-row"><a class="cr-img" href="#/item/' + esc(it.id) + '">' + K.thumb(it) + '</a><div class="cr-info"><a href="#/item/' + esc(it.id) + '" class="cr-name">' + esc(it.name) + '</a><span class="muted sm">' + esc(it.cat || '') + (MODE !== 'borrow' ? ' · ' + K.rp(it.price) + (C.unit ? ' ' + esc(C.unit) : '') : '') + '</span>' + ctl + '</div><div class="cr-price">' + (MODE === 'borrow' ? '<span class="pill ok">Gratis</span>' : '<b>' + K.rp(K.linePrice(it, l)) + '</b>') + '<button class="icon-btn" data-act="c-del" data-id="' + esc(it.id) + '" aria-label="Hapus ' + esc(it.name) + '">' + I('trash') + '</button></div></li>';
    }).join('');
    var v = K.voucher();
    var html = K.pageHead(title, ls.length + ' ' + (C.noun || 'item') + ' dipilih') + '<div class="wrap cart-grid"><ul class="cart-list card">' + rows + '</ul><aside class="summary card"><h2>Ringkasan</h2>' +
      (MODE === 'borrow' ? '<div class="sum-row"><span>Buku dipinjam</span><b>' + ls.length + ' / ' + (C.maxItems || 3) + '</b></div><div class="sum-row"><span>Biaya pinjam</span><b>Gratis</b></div><p class="muted sm">Denda ' + K.rp(C.finePerDay || 0) + '/hari/buku bila terlambat.</p>' :
        '<div class="sum-row"><span>Subtotal</span><b>' + K.rp(t.sub) + '</b></div>' + (t.disc ? '<div class="sum-row good"><span>Diskon (' + esc(t.voucher) + ')</span><b>− ' + K.rp(t.disc) + '</b></div>' : '') + '<div class="sum-row total"><span>Total sementara</span><b>' + K.rp(t.total) + '</b></div>' +
        (C.vouchers ? '<form class="voucher" data-form="voucher"><input name="code" placeholder="Kode voucher" value="' + esc(v) + '" aria-label="Kode voucher" autocapitalize="characters"><button class="btn btn-ghost btn-sm" type="submit">Pakai</button></form><p class="muted sm">Coba: ' + Object.keys(C.vouchers).map(function (k) { return '<code>' + esc(k) + '</code>'; }).join(', ') + '</p>' : '') +
        (MODE === 'buy' ? '<p class="muted sm">Ongkir dihitung saat checkout.</p>' : '')) +
      '<a class="btn btn-primary btn-block btn-lg" href="#/checkout">Lanjut ke checkout ' + I('arrow') + '</a><button class="btn btn-ghost btn-block" data-act="c-clear">Kosongkan ' + esc(title.toLowerCase()) + '</button></aside></div>';
    return { html: html, title: title };
  };
  K.acts['c-qty'] = function (el) { var c = K.cart(), l = c.filter(function (x) { return x.id === el.dataset.id; })[0], it = K.item(el.dataset.id); if (!l) return; var n = l.qty + (+el.dataset.d); if (n < 1) return; if (n > K.stockOf(it)) { K.toast('Stok tersisa ' + K.stockOf(it) + '.', 'err'); return; } l.qty = n; K.saveCart(c); K.render(); };
  K.acts['c-del'] = function (el) { K.saveCart(K.cart().filter(function (x) { return x.id !== el.dataset.id; })); K.toast('Dihapus dari keranjang.'); K.render(); };
  K.acts['c-clear'] = function () { K.confirm('Kosongkan keranjang?', 'Semua pilihan akan dihapus.', 'Kosongkan', true).then(function (ok) { if (ok) { K.saveCart([]); K.render(); } }); };
  K.changes = K.changes || {};
  K.changes['c-days'] = function (el) { var c = K.cart(), l = c.filter(function (x) { return x.id === el.dataset.id; })[0]; if (!l) return; l.days = K.clamp(+el.value || 1, 1, C.maxDays || 30); K.saveCart(c); K.render(); };
  K.changes['c-start'] = function (el) { var c = K.cart(), l = c.filter(function (x) { return x.id === el.dataset.id; })[0]; if (!l || !el.value) return; l.start = el.value; K.saveCart(c); K.render(); };
  K.forms.voucher = function (f) {
    var code = f.code.value.trim().toUpperCase(); if (!code) { K.set('voucher', ''); K.toast('Voucher dilepas.'); K.render(); return; }
    var v = (C.vouchers || {})[code]; if (!v) { K.toast('Kode voucher tidak dikenal.', 'err'); return; }
    var sub = K.calc().sub; if (sub < (v.min || 0)) { K.toast('Minimal belanja ' + K.rp(v.min) + ' untuk kode ini.', 'err'); return; }
    K.set('voucher', code); K.toast(v.label || 'Voucher dipakai.', 'ok'); K.render();
  };

  /* ---------- checkout ---------- */
  function radioCards(name, list, sel, fmt) {
    return '<div class="radio-cards" role="radiogroup">' + list.map(function (o, i) { return '<label class="rc"><input type="radio" name="' + name + '" value="' + esc(o.id) + '"' + (i === sel ? ' checked' : '') + '><span class="rc-b"><b>' + esc(o.name) + '</b><small>' + esc(fmt ? fmt(o) : (o.desc || '')) + '</small></span></label>'; }).join('') + '</div>';
  }
  K.pages.checkout = function (ctx) {
    if (!K.requireLogin(ctx, 'Masuk dulu untuk melanjutkan.')) return { html: '' };
    var ls = K.cartLines(); if (!ls.length) { K.go('/cart'); return { html: '' }; }
    var u = K.me(), t = K.calc(), html = '', pay = C.payments || [], ship = C.shipping || [];
    var form = '<form data-form="checkout" novalidate class="checkout-form"><div class="alert-slot"></div>';
    form += '<fieldset class="card"><legend>1. Data ' + (MODE === 'borrow' ? 'peminjam' : MODE === 'rent' ? 'penyewa' : 'penerima') + '</legend><div class="two">' + K.field({ name: 'cname', label: 'Nama lengkap', value: u.name, icon: 'user', auto: 'name' }) + K.field({ name: 'cphone', label: 'Nomor HP / WhatsApp', value: u.phone, icon: 'phone', type: 'tel', auto: 'tel' }) + '</div>' + K.field({ name: 'cemail', label: 'Email', value: u.email, icon: 'mail', type: 'email', auto: 'email' });
    if (MODE === 'rent') form += K.field({ name: 'nik', label: 'Nomor KTP (16 digit)', icon: 'doc', inputmode: 'numeric', max: 16, ph: '3171xxxxxxxxxxxx', hint: 'Untuk verifikasi penyewa. Hanya tersimpan di browser ini.' }) + K.field({ name: 'sim', label: 'Nomor SIM A', icon: 'doc', req: false, max: 20 });
    if (MODE === 'borrow') form += '<div class="two">' + K.field({ name: 'nis', label: 'NIS / No. anggota', icon: 'doc', max: 20, ph: 'contoh 12345' }) + K.field({ name: 'kelas', label: 'Kelas / jabatan', icon: 'book', max: 30, ph: 'XII RPL 2' }) + '</div>';
    form += '</fieldset>';
    if (MODE === 'buy') form += '<fieldset class="card"><legend>2. Alamat pengiriman</legend>' + K.field({ name: 'address', label: 'Alamat lengkap', type: 'textarea', rows: 3, icon: '', ph: 'Jalan, nomor rumah, RT/RW, kelurahan' }) + '<div class="two">' + K.field({ name: 'city', label: 'Kota / kecamatan', value: C.defaultCity || '', ph: 'Batam' }) + K.field({ name: 'zip', label: 'Kode pos', req: false, inputmode: 'numeric', max: 5 }) + '</div><h4>Pengiriman</h4>' + radioCards('ship', ship, 0, function (o) { return (o.price ? K.rp(o.price) : 'Gratis') + ' · ' + o.eta; }) + '</fieldset>';
    if (MODE === 'rent') form += '<fieldset class="card"><legend>2. Pengambilan &amp; tambahan</legend><div class="two">' + K.field({ name: 'pickup', label: 'Lokasi pengambilan', type: 'select', options: C.pickups || ['Kantor'] }) + K.field({ name: 'time', label: 'Jam ambil', type: 'time', value: '09:00' }) + '</div><h4>Layanan tambahan</h4>' + (C.extras || []).map(function (e) { return '<label class="check boxed"><input type="checkbox" name="extra" value="' + esc(e.id) + '"> <span><b>' + esc(e.name) + '</b> <small>' + K.rp(e.price) + (e.per === 'day' ? ' / hari' : ' / pesanan') + '</small><br><small class="muted">' + esc(e.desc || '') + '</small></span></label>'; }).join('') + '</fieldset>';
    if (MODE === 'borrow') form += '<fieldset class="card"><legend>2. Pengambilan buku</legend><div class="two">' + K.field({ name: 'start', label: 'Tanggal ambil', type: 'date', value: K.isoDate(), min: K.isoDate() }) + K.field({ name: 'pickup', label: 'Ambil di', type: 'select', options: C.pickups || ['Meja sirkulasi'] }) + '</div><label class="check boxed"><input type="checkbox" name="rules" required> <span>Saya setuju menjaga buku, mengembalikan tepat waktu, dan membayar denda ' + K.rp(C.finePerDay || 0) + '/hari jika terlambat.</span></label></fieldset>';
    if (pay.length) form += '<fieldset class="card"><legend>3. Pembayaran</legend>' + radioCards('pay', pay, 0) + '</fieldset>';
    form += K.field({ name: 'note', label: 'Catatan untuk kami', type: 'textarea', rows: 2, req: false, max: 200 });
    form += '<button class="btn btn-primary btn-lg btn-block" type="submit">' + esc(C.placeLabel || 'Buat pesanan') + ' ' + I('arrow') + '</button></form>';
    var sum = '<aside class="summary card sticky"><h2>Pesananmu</h2><ul class="mini-list">' + ls.map(function (x) { return '<li><span>' + esc(x.it.name) + '<small class="muted"> ' + (MODE === 'buy' ? '× ' + x.l.qty : MODE === 'rent' ? '· ' + x.l.days + ' hari' : '· ' + x.l.days + ' hari') + '</small></span><b>' + (MODE === 'borrow' ? 'Gratis' : K.rp(K.linePrice(x.it, x.l))) + '</b></li>'; }).join('') + '</ul><div id="sum-live">' + K.sumHtml(t) + '</div></aside>';
    html = K.pageHead(C.checkoutTitle || 'Checkout') + '<div class="wrap cart-grid">' + form + sum + '</div>';
    return {
      html: html, title: 'Checkout', mount: function (root) {
        var f = K.$('form.checkout-form', root), upd = function () { K.$('#sum-live', root).innerHTML = K.sumHtml(K.calc(K.extrasFrom(f))); };
        f.addEventListener('change', upd); upd();
      }
    };
  };
  K.extrasFrom = function (f) {
    var ship = 0, ex = 0, ls = K.cartLines();
    if (MODE === 'buy' && f.ship) { var so = (C.shipping || []).filter(function (s) { return s.id === f.ship.value; })[0]; ship = so ? so.price : 0; if (C.freeShipOver && K.calc().sub >= C.freeShipOver && so && so.price) ship = 0; }
    if (MODE === 'rent') { K.$$('input[name=extra]:checked', f).forEach(function (cb) { var e = (C.extras || []).filter(function (x) { return x.id === cb.value; })[0]; if (!e) return; ex += e.per === 'day' ? e.price * ls.reduce(function (s, x) { return s + x.l.days; }, 0) : e.price * ls.length; }); }
    return { ship: ship, extras: ex };
  };
  K.sumHtml = function (t) {
    if (MODE === 'borrow') return '<div class="sum-row total"><span>Biaya pinjam</span><b>Gratis</b></div>';
    return '<div class="sum-row"><span>Subtotal</span><b>' + K.rp(t.sub) + '</b></div>' + (t.disc ? '<div class="sum-row good"><span>Diskon</span><b>− ' + K.rp(t.disc) + '</b></div>' : '') + (MODE === 'buy' ? '<div class="sum-row"><span>Ongkir</span><b>' + (t.ship ? K.rp(t.ship) : 'Gratis') + '</b></div>' : '') + (MODE === 'rent' ? '<div class="sum-row"><span>Layanan tambahan</span><b>' + K.rp(t.extras) + '</b></div>' : '') + '<div class="sum-row total"><span>Total bayar</span><b>' + K.rp(t.total) + '</b></div>';
  };
  K.orderId = function () { var d = new Date(); return (C.idPrefix || 'ORD') + '-' + String(d.getFullYear()).slice(2) + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(); };
  K.forms.checkout = function (f) {
    var slot = K.$('.alert-slot', f), ls = K.cartLines(), u = K.me(), bad = false;
    var nm = f.cname.value.trim(), ph = K.normPhone(f.cphone.value), em = f.cemail.value.trim();
    var e1 = nm.length < 3 ? 'Isi nama lengkap.' : '', e2 = K.validators.phone(ph), e3 = K.validators.email(em); K.setErr(f, 'cname', e1); K.setErr(f, 'cphone', e2); K.setErr(f, 'cemail', e3); bad = !!(e1 || e2 || e3);
    if (MODE === 'rent') { var e4 = /^\d{16}$/.test(f.nik.value.trim()) ? '' : 'Nomor KTP harus 16 digit angka.'; K.setErr(f, 'nik', e4); bad = bad || !!e4; }
    if (MODE === 'borrow') { var e5 = f.nis.value.trim() ? '' : 'Isi NIS / nomor anggota.', e6 = f.kelas.value.trim() ? '' : 'Isi kelas / jabatan.'; K.setErr(f, 'nis', e5); K.setErr(f, 'kelas', e6); bad = bad || !!(e5 || e6); if (!f.rules.checked) { slot.innerHTML = K.alertBox('err', 'Setujui aturan peminjaman dulu.'); bad = true; } else slot.innerHTML = ''; }
    if (MODE === 'buy') { var e7 = f.address.value.trim().length < 8 ? 'Alamat belum lengkap.' : '', e8 = f.city.value.trim() ? '' : 'Isi kota.'; K.setErr(f, 'address', e7); K.setErr(f, 'city', e8); bad = bad || !!(e7 || e8); }
    if (bad) { var first = K.$('.field.bad input, .field.bad textarea', f); if (first) first.focus(); K.toast('Periksa kembali isian yang bertanda merah.', 'err'); return; }
    for (var i = 0; i < ls.length; i++) { if (K.stockOf(ls[i].it) < (MODE === 'buy' ? ls[i].l.qty : 1)) { slot.innerHTML = K.alertBox('err', esc(ls[i].it.name) + ' tidak cukup stok. Perbarui keranjang.'); return; } }
    var ex = K.extrasFrom(f), t = K.calc(ex), payId = f.pay ? f.pay.value : '', pay = (C.payments || []).filter(function (p) { return p.id === payId; })[0];
    var shipO = f.ship ? (C.shipping || []).filter(function (s) { return s.id === f.ship.value; })[0] : null, start = MODE === 'borrow' ? f.start.value || K.isoDate() : '';
    var o = {
      id: K.orderId(), uid: u.id, mode: MODE, created: Date.now(), total: t.total, sub: t.sub, disc: t.disc, ship: t.ship, extras: t.extras, voucher: t.voucher,
      lines: ls.map(function (x) { var s = MODE === 'borrow' ? start : x.l.start; return { id: x.it.id, name: x.it.name, price: x.it.price || 0, qty: x.l.qty, days: x.l.days, start: s, end: (MODE === 'rent' || MODE === 'borrow') ? K.addDays(s, x.l.days) : '', sub: K.linePrice(x.it, x.l) }; }),
      who: { name: nm, phone: ph, email: em, nik: MODE === 'rent' ? f.nik.value.trim() : '', nis: MODE === 'borrow' ? f.nis.value.trim() : '', kelas: MODE === 'borrow' ? f.kelas.value.trim() : '' },
      addr: MODE === 'buy' ? f.address.value.trim() + ', ' + f.city.value.trim() + (f.zip.value ? ' ' + f.zip.value : '') : '', pickup: f.pickup ? f.pickup.value : '', time: f.time ? f.time.value : '',
      shipName: shipO ? shipO.name : '', pay: pay ? pay.name : '', payId: payId, extrasList: K.$$('input[name=extra]:checked', f).map(function (c) { return c.value; }), note: f.note.value.trim(), log: [], sim: 0
    };
    o.status = MODE === 'borrow' ? 'Dipinjam' : (payId === 'cod' || payId === 'cash') ? (MODE === 'rent' ? 'Dikonfirmasi' : 'Diproses') : 'Menunggu pembayaran';
    o.log.push([Date.now(), 'Pesanan dibuat']);
    ls.forEach(function (x) { K.adjStock(x.it.id, MODE === 'buy' ? -x.l.qty : -1); });
    var all = K.get('orders', []); all.unshift(o); K.set('orders', all); K.set('cart', []); K.set('voucher', ''); K.refreshChrome();
    K.toast('Pesanan ' + o.id + ' berhasil dibuat!', 'ok'); K.go('/order/' + o.id + '?new=1');
  };

  /* ---------- pesanan ---------- */
  K.myOrders = function () { var u = K.me(); return u ? K.get('orders', []).filter(function (o) { return o.uid === u.id; }) : []; };
  K.statusClass = function (s) { return /selesai|dikembalikan|diterima/i.test(s) ? 'ok' : /batal|ditolak|terlambat/i.test(s) ? 'bad' : /menunggu|diajukan/i.test(s) ? 'warn' : 'info'; };
  K.late = function (o) { if (o.mode !== 'borrow' && o.mode !== 'rent') return { days: 0, fee: 0 }; if (!/Dipinjam|Berjalan|Diperpanjang/.test(o.status)) return { days: 0, fee: 0 }; var today = K.addDays(K.isoDate(), o.sim || 0), days = 0, fee = 0; o.lines.forEach(function (l) { var d = Math.max(0, K.diffDays(l.end, today)); days = Math.max(days, d); fee += d * (o.mode === 'borrow' ? (C.finePerDay || 0) : Math.round(l.price * (C.finePct || 0.2))); }); return { days: days, fee: fee }; };
  K.pages.orders = function (ctx) {
    if (!K.requireLogin(ctx)) return { html: '' };
    var list = K.myOrders(), f = ctx.query.s || '', ttl = C.ordersTitle || 'Pesanan saya';
    var shown = list.filter(function (o) { return !f || K.statusClass(o.status) === f; });
    var html = K.pageHead(ttl, list.length + ' catatan') + '<div class="wrap"><div class="chips">' + [['', 'Semua'], ['warn', 'Menunggu'], ['info', 'Berjalan'], ['ok', 'Selesai'], ['bad', 'Batal/Telat']].map(function (c) { return '<a class="chip' + (f === c[0] ? ' on' : '') + '" href="#/orders' + (c[0] ? '?s=' + c[0] : '') + '">' + c[1] + '</a>'; }).join('') + '</div>' +
      (shown.length ? '<div class="order-list">' + shown.map(function (o) { var lt = K.late(o); return '<a class="card order" href="#/order/' + esc(o.id) + '"><div><b>' + esc(o.id) + '</b><span class="muted sm">' + K.fmtDT(o.created) + '</span></div><div class="ol-items">' + o.lines.map(function (l) { return esc(l.name) + (o.mode === 'buy' ? ' ×' + l.qty : ''); }).join(', ') + '</div><div class="ol-r">' + (o.mode !== 'borrow' && o.mode !== 'apply' ? '<b>' + K.rp(o.total) + '</b>' : '') + '<span class="pill ' + K.statusClass(lt.days ? 'terlambat' : o.status) + '">' + esc(lt.days ? 'Terlambat ' + lt.days + ' hari' : o.status) + '</span></div></a>'; }).join('') + '</div>' : '<div class="empty">' + I('box') + '<h3>Belum ada catatan</h3><p>' + esc(C.ordersEmpty || 'Pesananmu akan tampil di sini.') + '</p><a class="btn btn-primary" href="#/catalog">Mulai dari ' + esc((C.title || '').toLowerCase()) + '</a></div>') + '</div>';
    return { html: html, title: ttl };
  };
  K.pages.order = function (ctx) {
    if (!K.requireLogin(ctx)) return { html: '' };
    var o = K.myOrders().filter(function (x) { return x.id === ctx.params[0]; })[0]; if (!o) return K.notFound();
    var lt = K.late(o), steps = (C.flow || {})[o.mode] || ['Dibuat', 'Selesai'], cur = steps.indexOf(o.status === 'Diproses' ? (steps.indexOf('Diproses') >= 0 ? 'Diproses' : o.status) : o.status);
    if (/Batal/.test(o.status)) cur = -1; if (o.status === 'Diperpanjang') cur = steps.indexOf('Dipinjam');
    var act = '';
    if (o.mode === 'buy') { if (o.status === 'Menunggu pembayaran') act = '<button class="btn btn-primary" data-act="o-pay" data-id="' + esc(o.id) + '">Saya sudah bayar</button><button class="btn btn-ghost" data-act="o-cancel" data-id="' + esc(o.id) + '">Batalkan</button>'; else if (o.status === 'Diproses') act = '<button class="btn btn-primary" data-act="o-done" data-id="' + esc(o.id) + '">Tandai diterima (demo)</button>'; }
    if (o.mode === 'rent') { if (o.status === 'Menunggu pembayaran') act = '<button class="btn btn-primary" data-act="o-pay" data-id="' + esc(o.id) + '">Saya sudah bayar</button><button class="btn btn-ghost" data-act="o-cancel" data-id="' + esc(o.id) + '">Batalkan</button>'; else if (o.status === 'Dikonfirmasi') act = '<button class="btn btn-primary" data-act="o-start" data-id="' + esc(o.id) + '">Mulai sewa (ambil mobil)</button><button class="btn btn-ghost" data-act="o-cancel" data-id="' + esc(o.id) + '">Batalkan</button>'; else if (o.status === 'Berjalan') act = '<button class="btn btn-primary" data-act="o-return" data-id="' + esc(o.id) + '">Kembalikan mobil</button><button class="btn btn-ghost" data-act="o-sim" data-id="' + esc(o.id) + '">Simulasi +1 hari (demo)</button>'; }
    if (o.mode === 'borrow') { if (/Dipinjam|Diperpanjang/.test(o.status)) act = '<button class="btn btn-primary" data-act="o-return" data-id="' + esc(o.id) + '">Kembalikan buku</button>' + (o.status === 'Dipinjam' ? '<button class="btn btn-ghost" data-act="o-extend" data-id="' + esc(o.id) + '">Perpanjang 3 hari</button>' : '') + '<button class="btn btn-ghost" data-act="o-sim" data-id="' + esc(o.id) + '">Simulasi +3 hari (demo)</button>'; }
    if (o.mode === 'apply' && o.status === 'Diajukan') act = '<button class="btn btn-ghost" data-act="o-cancel" data-id="' + esc(o.id) + '">Tarik pengajuan</button>';
    var money = o.mode === 'borrow' || o.mode === 'apply' ? '' : '<div class="sum-row"><span>Subtotal</span><b>' + K.rp(o.sub) + '</b></div>' + (o.disc ? '<div class="sum-row good"><span>Diskon ' + esc(o.voucher) + '</span><b>− ' + K.rp(o.disc) + '</b></div>' : '') + (o.mode === 'buy' ? '<div class="sum-row"><span>Ongkir (' + esc(o.shipName) + ')</span><b>' + (o.ship ? K.rp(o.ship) : 'Gratis') + '</b></div>' : '') + (o.extras ? '<div class="sum-row"><span>Layanan tambahan</span><b>' + K.rp(o.extras) + '</b></div>' : '') + (o.fine ? '<div class="sum-row bad"><span>Denda keterlambatan</span><b>' + K.rp(o.fine) + '</b></div>' : '') + '<div class="sum-row total"><span>Total</span><b>' + K.rp(o.total + (o.fine || 0)) + '</b></div>';
    var pinfo = o.status === 'Menunggu pembayaran' && o.payId ? '<div class="alert info">' + I('info') + '<div><b>Instruksi pembayaran (' + esc(o.pay) + ')</b><br>' + esc((C.payments.filter(function (p) { return p.id === o.payId; })[0] || {}).how || 'Lakukan pembayaran sesuai metode yang dipilih.') + '<br>Nominal: <b>' + K.rp(o.total) + '</b>. Ini simulasi: tidak ada transaksi sungguhan.</div></div>' : '';
    var html = '<div class="wrap narrow"><nav class="crumbs"><a href="#/orders">' + esc(C.ordersTitle || 'Pesanan saya') + '</a>' + I('chev') + '<span>' + esc(o.id) + '</span></nav>' +
      (ctx.query.new ? K.alertBox('ok', '<b>Terima kasih!</b> ' + esc(C.thanks || 'Pesananmu sudah kami catat.')) : '') +
      '<div class="invoice card" id="invoice"><header class="inv-h"><div><span class="eyebrow">' + esc(C.docLabel || 'Faktur') + '</span><h1>' + esc(o.id) + '</h1><span class="muted sm">' + K.fmtDT(o.created) + '</span></div><span class="pill ' + K.statusClass(lt.days ? 'terlambat' : o.status) + ' lg">' + esc(lt.days ? 'Terlambat ' + lt.days + ' hari' : o.status) + '</span></header>' +
      (steps.length > 2 && cur >= 0 ? '<ol class="steps">' + steps.map(function (s, i) { return '<li class="' + (i < cur ? 'done' : i === cur ? 'now' : '') + '"><i>' + (i < cur ? I('check') : i + 1) + '</i><span>' + esc(s) + '</span></li>'; }).join('') + '</ol>' : '') + pinfo +
      (lt.days ? K.alertBox('err', 'Terlambat <b>' + lt.days + ' hari</b>. Perkiraan denda: <b>' + K.rp(lt.fee) + '</b>.') : '') +
      '<table class="tbl"><thead><tr><th>' + esc(C.noun ? C.noun.charAt(0).toUpperCase() + C.noun.slice(1) : 'Item') + '</th><th>' + (o.mode === 'buy' ? 'Jumlah' : o.mode === 'apply' ? 'Status' : 'Periode') + '</th>' + (o.mode === 'borrow' || o.mode === 'apply' ? '' : '<th class="r">Harga</th>') + '</tr></thead><tbody>' + o.lines.map(function (l) { return '<tr><td data-l="' + esc(C.noun || 'Item') + '"><b>' + esc(l.name) + '</b></td><td data-l="' + (o.mode === 'buy' ? 'Jumlah' : 'Periode') + '">' + (o.mode === 'buy' ? l.qty + ' × ' + K.rp(l.price) : o.mode === 'apply' ? esc(o.status) : K.fmtDate(l.start) + ' → ' + K.fmtDate(l.end) + ' (' + l.days + ' hari)') + '</td>' + (o.mode === 'borrow' || o.mode === 'apply' ? '' : '<td class="r" data-l="Harga">' + K.rp(l.sub) + '</td>') + '</tr>'; }).join('') + '</tbody></table>' + '<div class="inv-cols"><div><h4>' + (o.mode === 'buy' ? 'Penerima' : o.mode === 'apply' ? 'Pemohon' : o.mode === 'rent' ? 'Penyewa' : 'Peminjam') + '</h4><p>' + esc(o.who.name) + '<br>' + esc(o.who.phone) + '<br>' + esc(o.who.email) + (o.who.nik ? '<br>KTP ' + esc(o.who.nik.slice(0, 4) + '••••••••' + o.who.nik.slice(-4)) : '') + (o.who.nis ? '<br>NIS ' + esc(o.who.nis) + ' · ' + esc(o.who.kelas) : '') + '</p>' + (o.addr ? '<h4>Alamat</h4><p>' + esc(o.addr) + '</p>' : '') + (o.pickup ? '<h4>Pengambilan</h4><p>' + esc(o.pickup) + (o.time ? ' · ' + esc(o.time) : '') + '</p>' : '') + (o.statement ? '<h4>Pernyataan</h4><p>' + esc(o.statement) + '</p>' : '') + (o.note ? '<h4>Catatan</h4><p>' + esc(o.note) + '</p>' : '') + '</div><div class="inv-sum">' + money + (o.pay ? '<p class="muted sm">Metode: ' + esc(o.pay) + '</p>' : '') + '</div></div>' +
      '<details class="log"><summary>Riwayat aktivitas</summary><ul>' + o.log.map(function (g) { return '<li><time>' + K.fmtDT(g[0]) + '</time> ' + esc(g[1]) + '</li>'; }).join('') + '</ul></details></div>' +
      '<div class="k-row wrap-r no-print">' + act + '<button class="btn btn-ghost" onclick="window.print()">' + I('print') + ' Cetak</button><a class="btn btn-ghost" href="#/orders">Semua catatan</a></div></div>';
    return { html: html, title: o.id };
  };
  function upd(id, fn) { var all = K.get('orders', []), o = all.filter(function (x) { return x.id === id; })[0]; if (!o) return; fn(o); K.set('orders', all); K.render(); K.refreshChrome(); }
  function log(o, t) { o.log.push([Date.now(), t]); }
  function release(o) { o.lines.forEach(function (l) { K.adjStock(l.id, o.mode === 'buy' ? l.qty : 1); }); }
  K.acts['o-pay'] = function (el) { upd(el.dataset.id, function (o) { o.status = o.mode === 'rent' ? 'Dikonfirmasi' : 'Diproses'; log(o, 'Pembayaran dikonfirmasi (simulasi)'); }); K.toast('Pembayaran dicatat.', 'ok'); };
  K.acts['o-cancel'] = function (el) { K.confirm('Batalkan?', 'Tindakan ini tidak dapat diurungkan.', 'Ya, batalkan', true).then(function (ok) { if (ok) { upd(el.dataset.id, function (o) { release(o); o.status = o.mode === 'apply' ? 'Ditarik' : 'Dibatalkan'; log(o, 'Dibatalkan oleh pengguna'); }); K.toast('Dibatalkan.'); } }); };
  K.acts['o-done'] = function (el) { upd(el.dataset.id, function (o) { o.status = 'Selesai'; log(o, 'Pesanan diterima'); }); K.toast('Pesanan selesai. Terima kasih!', 'ok'); };
  K.acts['o-start'] = function (el) { upd(el.dataset.id, function (o) { o.status = 'Berjalan'; log(o, 'Sewa dimulai'); }); K.toast('Selamat jalan!', 'ok'); };
  K.acts['o-return'] = function (el) { upd(el.dataset.id, function (o) { var lt = K.late(o); o.fine = lt.fee; release(o); o.status = o.mode === 'borrow' ? 'Dikembalikan' : 'Selesai'; log(o, 'Dikembalikan' + (lt.fee ? ' · denda ' + K.rp(lt.fee) : '')); }); K.toast('Terima kasih sudah mengembalikan.', 'ok'); };
  K.acts['o-extend'] = function (el) { upd(el.dataset.id, function (o) { o.lines.forEach(function (l) { l.end = K.addDays(l.end, 3); l.days += 3; }); o.status = 'Diperpanjang'; log(o, 'Diperpanjang 3 hari'); }); K.toast('Diperpanjang 3 hari.', 'ok'); };
  K.acts['o-sim'] = function (el) { upd(el.dataset.id, function (o) { o.sim = (o.sim || 0) + (o.mode === 'rent' ? 1 : 3); log(o, 'Simulasi waktu +' + (o.mode === 'rent' ? 1 : 3) + ' hari'); }); };

  /* ---------- apply (College Majors) ---------- */
  K.pages.apply = function (ctx) {
    var it = K.item(ctx.params[0]); if (!it) return K.notFound(); if (!K.requireLogin(ctx, 'Masuk dulu untuk mengajukan minat.')) return { html: '' };
    var u = K.me(), parts = u.name.split(' ');
    var html = K.pageHead('Ajukan minat: ' + it.name, 'Isi data singkat. Pengajuan tersimpan di akunmu.') + '<div class="wrap narrow"><form class="card pad" data-form="apply" data-id="' + esc(it.id) + '" novalidate><div class="alert-slot"></div><div class="two">' + K.field({ name: 'fn', label: 'Nama depan', value: parts[0], auto: 'given-name' }) + K.field({ name: 'ln', label: 'Nama belakang', value: parts.slice(1).join(' '), auto: 'family-name', req: false }) + '</div><div class="two">' + K.field({ name: 'cemail', label: 'Email', type: 'email', value: u.email }) + K.field({ name: 'cphone', label: 'Nomor HP', type: 'tel', value: u.phone }) + '</div><div class="two">' + K.field({ name: 'school', label: 'Asal sekolah', ph: 'SMK Negeri 7 Batam' }) + K.field({ name: 'gpa', label: 'Rata-rata nilai rapor', type: 'number', min: 0, max: 100, ph: '85', req: false }) + '</div>' + K.field({ name: 'statement', label: 'Mengapa tertarik dengan jurusan ini?', type: 'textarea', rows: 5, max: 600, hint: 'Minimal 30 karakter.' }) + '<div class="k-row end"><a class="btn btn-ghost" href="#/item/' + esc(it.id) + '">Batal</a><button class="btn btn-primary btn-lg" type="submit">' + I('send') + ' Kirim pengajuan</button></div></form></div>';
    return { html: html, title: 'Ajukan minat' };
  };
  K.forms.apply = function (f) {
    var it = K.item(f.dataset.id), u = K.me(), st = f.statement.value.trim(), e = st.length < 30 ? 'Tulis minimal 30 karakter.' : '', e2 = K.validators.phone(K.normPhone(f.cphone.value)), e3 = K.validators.email(f.cemail.value.trim());
    K.setErr(f, 'statement', e); K.setErr(f, 'cphone', e2); K.setErr(f, 'cemail', e3); if (e || e2 || e3) return;
    var dup = K.myOrders().some(function (o) { return o.mode === 'apply' && o.lines[0].id === it.id && !/Ditarik/.test(o.status); }); if (dup) { K.toast('Kamu sudah mengajukan jurusan ini.', 'err'); return; }
    var o = { id: K.orderId(), uid: u.id, mode: 'apply', created: Date.now(), total: 0, sub: 0, lines: [{ id: it.id, name: it.name, price: 0, qty: 1, days: 0, start: '', end: '', sub: 0 }], who: { name: (f.fn.value + ' ' + f.ln.value).trim(), phone: K.normPhone(f.cphone.value), email: f.cemail.value.trim() }, statement: st, note: 'Sekolah: ' + f.school.value.trim() + (f.gpa.value ? ' · Rata-rata ' + f.gpa.value : ''), status: 'Diajukan', log: [[Date.now(), 'Pengajuan dikirim']] };
    var all = K.get('orders', []); all.unshift(o); K.set('orders', all); K.toast('Pengajuan terkirim!', 'ok'); K.go('/order/' + o.id + '?new=1');
  };

  /* ---------- favorit ---------- */
  K.pages.wishlist = function () {
    var w = K.wish(), l = w.map(K.item).filter(Boolean), ttl = S.wishLabel || 'Favorit';
    return { html: K.pageHead(ttl, l.length + ' tersimpan') + '<div class="wrap">' + (l.length ? '<div class="grid items">' + l.map(K.card).join('') + '</div>' : '<div class="empty">' + I('heart') + '<h3>Belum ada ' + esc(ttl.toLowerCase()) + '</h3><p>Tekan ikon hati pada kartu untuk menyimpan.</p><a class="btn btn-primary" href="#/catalog">Jelajahi</a></div>') + '</div>', title: ttl };
  };
})(window);

/* ===== Site Kit — blog, galeri, tentang, FAQ, kontak, laporan, pengaturan, pencarian ===== */
(function (W) {
  'use strict';
  var K = W.K, S = K.S, esc = K.esc, I = K.icon;
  K.acts = K.acts || {}; K.changes = K.changes || {};

  K.pageHead = function (title, sub, extra) { return '<header class="page-head"><div class="wrap"><h1>' + esc(title || '') + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + (extra || '') + '</div></header>'; };
  K.sectionHead = function (eyebrow, title, sub, link) { return '<div class="sec-head"><div>' + (eyebrow ? '<span class="eyebrow">' + esc(eyebrow) + '</span>' : '') + '<h2>' + title + '</h2>' + (sub ? '<p class="muted">' + sub + '</p>' : '') + '</div>' + (link ? '<a class="btn btn-ghost btn-sm" href="' + link[0] + '">' + esc(link[1]) + ' ' + I('arrow') + '</a>' : '') + '</div>'; };
  K.notFound = function () { return { html: '<div class="wrap"><div class="empty big">' + I('search') + '<h1>404</h1><h3>Halaman tidak ditemukan</h3><p>Tautan yang kamu buka tidak ada atau sudah dipindahkan.</p><a class="btn btn-primary" href="#/">Kembali ke beranda</a></div></div>', title: 'Tidak ditemukan' }; };
  function hl(text, q) { var t = esc(text); if (!q) return t; var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'); return t.replace(re, '<mark>$1</mark>'); }

  /* ---------- BLOG ---------- */
  var BL = S.blog || [];
  K.pages.blog = function (ctx) {
    var cat = ctx.query.cat || '', q = ctx.query.q || '', cats = [];
    BL.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    var list = BL.filter(function (p) { return (!cat || p.cat === cat) && (!q || K.norm(p.title + ' ' + p.excerpt + ' ' + p.body.join(' ')).indexOf(K.norm(q)) >= 0); });
    var lk = K.get('likes', {});
    function card(p, big) { return '<article class="card post' + (big ? ' big' : '') + '"><a class="thumb" href="#/blog/' + p.id + '">' + (p.img ? '<img src="' + esc(p.img) + '" alt="" loading="lazy">' : '<div class="art" style="background:' + (p.bg || 'var(--brand)') + '"><span class="emo">' + (p.emoji || '📝') + '</span></div>') + '</a><div class="card-b"><span class="eyebrow">' + esc(p.cat) + '</span><h3><a href="#/blog/' + p.id + '">' + esc(p.title) + '</a></h3><p class="muted">' + esc(p.excerpt) + '</p><p class="meta sm muted">' + esc(p.author) + ' · ' + K.fmtDate(p.date) + ' · ' + K.readTime(p.body.join(' ')) + ' mnt baca · ' + I('heart') + ' ' + ((p.likes || 0) + ((lk[p.id] || {}).n || 0)) + '</p></div></article>'; }
    var html = K.pageHead(S.blogTitle || 'Blog', S.blogSub || 'Tips, cerita, dan kabar terbaru.') + '<div class="wrap"><div class="toolbar"><div class="chips"><a class="chip' + (!cat ? ' on' : '') + '" href="#/blog">Semua</a>' + cats.map(function (c) { return '<a class="chip' + (cat === c ? ' on' : '') + '" href="#/blog?cat=' + encodeURIComponent(c) + '">' + esc(c) + '</a>'; }).join('') + '</div><form class="tool-form" data-form="blog-q"><div class="fw mini"><span class="fi">' + I('search') + '</span><input type="search" name="q" value="' + esc(q) + '" placeholder="Cari artikel…" aria-label="Cari artikel"></div></form></div>' +
      (list.length ? (!cat && !q ? '<div class="post-feature">' + card(list[0], true) + '</div><div class="grid posts">' + list.slice(1).map(function (p) { return card(p); }).join('') + '</div>' : '<div class="grid posts">' + list.map(function (p) { return card(p); }).join('') + '</div>') : '<div class="empty">' + I('search') + '<h3>Artikel tidak ditemukan</h3><a class="link" href="#/blog">Lihat semua artikel</a></div>') + '</div>';
    return { html: html, title: S.blogTitle || 'Blog' };
  };
  K.forms['blog-q'] = function (f) { K.go('/blog' + (f.q.value.trim() ? '?q=' + encodeURIComponent(f.q.value.trim()) : '')); };
  K.pages.post = function (ctx) {
    var p = BL.filter(function (x) { return x.id === ctx.params[0]; })[0]; if (!p) return K.notFound();
    var lk = K.get('likes', {}), mine = (lk[p.id] || {}).me, n = (p.likes || 0) + ((lk[p.id] || {}).n || 0), me = K.me();
    var cm = K.get('comments', {})[p.id] || [], rel = BL.filter(function (x) { return x.id !== p.id; }).slice(0, 3);
    var html = '<div class="wrap narrow"><nav class="crumbs"><a href="#/blog">' + esc(S.blogTitle || 'Blog') + '</a>' + I('chev') + '<span>' + esc(p.cat) + '</span></nav><article class="article"><span class="eyebrow">' + esc(p.cat) + '</span><h1>' + esc(p.title) + '</h1><p class="meta muted">' + esc(p.author) + ' · ' + K.fmtDate(p.date, true) + ' · ' + K.readTime(p.body.join(' ')) + ' menit baca</p>' +
      (p.img ? '<img class="cover" src="' + esc(p.img) + '" alt="">' : '<div class="cover art" style="background:' + (p.bg || 'var(--brand)') + '"><span class="emo">' + (p.emoji || '📝') + '</span></div>') +
      '<div class="prose">' + p.body.map(function (t) { return t.indexOf('## ') === 0 ? '<h2>' + esc(t.slice(3)) + '</h2>' : '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
      '<div class="k-row article-tools"><button class="btn ' + (mine ? 'btn-primary' : 'btn-ghost') + '" data-act="like" data-id="' + p.id + '" aria-pressed="' + !!mine + '">' + I('heart') + ' <span>' + n + '</span> Suka</button><button class="btn btn-ghost" data-act="copy-link">' + I('share') + ' Salin tautan</button></div></article>' +
      '<section class="comments"><h2>Komentar <em>' + cm.length + '</em></h2>' + (me ? '<form data-form="comment" data-id="' + p.id + '"><div class="field"><label for="f-cm" class="sr">Komentar</label><div class="fw"><textarea id="f-cm" name="text" rows="3" maxlength="400" placeholder="Tulis komentar sebagai ' + esc(me.name) + '…" required></textarea></div></div><button class="btn btn-primary" type="submit">' + I('send') + ' Kirim</button></form>' : '<div class="alert info">' + I('info') + '<div><a class="link" href="#/login?next=' + encodeURIComponent('/blog/' + p.id) + '">Masuk</a> untuk ikut berkomentar.</div></div>') +
      '<ul class="cm-list">' + cm.map(function (c, i) { return '<li><span class="avatar sm c' + (c.color || 0) + '" aria-hidden="true">' + esc((c.name || '?')[0].toUpperCase()) + '</span><div><b>' + esc(c.name) + '</b> <time class="muted sm">' + K.fmtDT(c.t) + '</time><p>' + esc(c.text) + '</p>' + (me && me.id === c.uid ? '<button class="link sm" data-act="cm-del" data-id="' + p.id + '" data-i="' + i + '">Hapus</button>' : '') + '</div></li>'; }).join('') + '</ul></section>' +
      '<section class="section-sm"><h2>Baca juga</h2><div class="grid posts">' + rel.map(function (x) { return '<article class="card post"><div class="card-b"><span class="eyebrow">' + esc(x.cat) + '</span><h3><a href="#/blog/' + x.id + '">' + esc(x.title) + '</a></h3><p class="muted sm">' + esc(x.excerpt) + '</p></div></article>'; }).join('') + '</div></section></div>';
    return { html: html, title: p.title };
  };
  K.acts.like = function (el) { var lk = K.get('likes', {}), id = el.dataset.id, r = lk[id] || { n: 0, me: false }; r.me = !r.me; r.n += r.me ? 1 : -1; lk[id] = r; K.set('likes', lk); K.render(); };
  K.acts['copy-link'] = function () { var u = location.href; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { K.toast('Tautan disalin.', 'ok'); }, function () { K.toast('Salin manual dari bilah alamat.', 'err'); }); };
  K.forms.comment = function (f) {
    var me = K.me(), t = f.text.value.trim(); if (!me || t.length < 2) return; var all = K.get('comments', {}); (all[f.dataset.id] = all[f.dataset.id] || []).push({ uid: me.id, name: me.name, color: me.color, text: t, t: Date.now() }); K.set('comments', all); K.toast('Komentar terkirim.', 'ok'); K.render();
  };
  K.acts['cm-del'] = function (el) { var all = K.get('comments', {}), l = all[el.dataset.id] || []; l.splice(+el.dataset.i, 1); K.set('comments', all); K.render(); };

  /* ---------- GALERI ---------- */
  var GL = S.gallery || [];
  K.pages.gallery = function (ctx) {
    var cat = ctx.query.cat || '', cats = []; GL.forEach(function (g) { if (cats.indexOf(g.cat) < 0) cats.push(g.cat); });
    var list = GL.filter(function (g) { return !cat || g.cat === cat; });
    var html = K.pageHead(S.galleryTitle || 'Galeri', S.gallerySub || 'Momen dan koleksi pilihan.') + '<div class="wrap"><div class="chips"><a class="chip' + (!cat ? ' on' : '') + '" href="#/gallery">Semua <em>' + GL.length + '</em></a>' + cats.map(function (c) { return '<a class="chip' + (cat === c ? ' on' : '') + '" href="#/gallery?cat=' + encodeURIComponent(c) + '">' + esc(c) + '</a>'; }).join('') + '</div><div class="masonry">' + list.map(function (g, i) { return '<figure class="g-item" tabindex="0" role="button" data-act="lightbox" data-i="' + i + '" aria-label="Perbesar: ' + esc(g.cap) + '">' + gMedia(g) + '<figcaption><b>' + esc(g.cap) + '</b><span>' + esc(g.cat) + '</span></figcaption></figure>'; }).join('') + '</div></div>';
    K.galList = list;
    return { html: html, title: S.galleryTitle || 'Galeri' };
  };
  function gMedia(g, big) { if (g.img && g.emoji) return '<div class="g-art stack" style="background:' + (g.bg || 'var(--brand)') + ';aspect-ratio:' + (g.h || '4/3') + '"><span class="emo">' + g.emoji + '</span><img src="' + esc(g.img) + '" alt="' + esc(g.cap) + '" loading="lazy" referrerpolicy="no-referrer"></div>'; return g.img ? '<img src="' + esc(g.img) + '" alt="' + esc(g.cap) + '" loading="lazy"' + (g.h && !big ? ' style="aspect-ratio:' + g.h + '"' : '') + '>' : '<div class="g-art" style="background:' + (g.bg || 'var(--brand)') + ';' + (g.h ? 'aspect-ratio:' + g.h : '') + '">' + (g.svg || '<span class="emo">' + (g.emoji || '🖼️') + '</span>') + '</div>'; }
  var lbI = 0;
  function lbOpen(i) {
    var l = K.galList || []; if (!l.length) return; lbI = (i + l.length) % l.length; var g = l[lbI], box = K.$('#k-lb');
    if (!box) { box = document.createElement('div'); box.id = 'k-lb'; box.className = 'k-lb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); document.body.appendChild(box); }
    box.innerHTML = '<button class="lb-x" data-act="lb-close" aria-label="Tutup">' + I('x') + '</button><button class="lb-n prev" data-act="lb-go" data-d="-1" aria-label="Sebelumnya">' + I('back') + '</button><figure>' + gMedia(g, true) + '<figcaption><b>' + esc(g.cap) + '</b> · ' + esc(g.cat) + ' <span class="muted">(' + (lbI + 1) + '/' + l.length + ')</span></figcaption></figure><button class="lb-n next" data-act="lb-go" data-d="1" aria-label="Berikutnya">' + I('arrow') + '</button>';
    box.classList.add('on'); document.body.classList.add('noscroll'); K.$('.lb-x', box).focus();
  }
  K.acts.lightbox = function (el) { lbOpen(+el.dataset.i); };
  K.acts['lb-go'] = function (el) { lbOpen(lbI + (+el.dataset.d)); };
  K.acts['lb-close'] = function () { var b = K.$('#k-lb'); if (b) b.classList.remove('on'); document.body.classList.remove('noscroll'); };
  document.addEventListener('keydown', function (e) { var b = K.$('#k-lb'); if (b && b.classList.contains('on')) { if (e.key === 'Escape') K.acts['lb-close'](); else if (e.key === 'ArrowRight') lbOpen(lbI + 1); else if (e.key === 'ArrowLeft') lbOpen(lbI - 1); } else if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.g-item')) { e.preventDefault(); lbOpen(+e.target.dataset.i); } });

  /* ---------- TENTANG ---------- */
  K.pages.about = function () {
    var A = S.about || {}, html = K.pageHead(A.title || 'Tentang ' + S.name, A.lead || S.tagline) + '<div class="wrap"><section class="about-intro"><div class="prose">' + (A.text || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' + (A.art ? '<div class="about-art">' + A.art + '</div>' : '') + '</section>' +
      (A.stats ? '<section class="stats">' + A.stats.map(function (s) { return '<div><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('') + '</section>' : '') +
      (A.values ? '<section class="section-sm">' + K.sectionHead('Nilai kami', 'Yang kami pegang') + '<div class="grid cols3">' + A.values.map(function (v) { return '<div class="card pad feat"><div class="ico">' + I(v.icon || 'check') + '</div><h3>' + esc(v.title) + '</h3><p class="muted">' + esc(v.text) + '</p></div>'; }).join('') + '</div></section>' : '') +
      (A.timeline ? '<section class="section-sm">' + K.sectionHead('Perjalanan', 'Jejak langkah') + '<ol class="timeline">' + A.timeline.map(function (t) { return '<li><b>' + esc(t[0]) + '</b><p>' + esc(t[1]) + '</p></li>'; }).join('') + '</ol></section>' : '') +
      (A.team ? '<section class="section-sm">' + K.sectionHead('Tim', 'Orang di balik layar') + '<div class="grid cols4">' + A.team.map(function (m) { return '<div class="card pad team"><div class="avatar lg c' + (m.c || 0) + '">' + esc(m.emoji || m.name[0]) + '</div><h3>' + esc(m.name) + '</h3><p class="muted sm">' + esc(m.role) + '</p></div>'; }).join('') + '</div></section>' : '') +
      '<section class="cta-band"><div><h2>Ada pertanyaan?</h2><p>Tim kami siap membantu.</p></div><a class="btn btn-accent btn-lg" href="#/contact">Hubungi kami</a></section></div>';
    return { html: html, title: 'Tentang' };
  };

  /* ---------- FAQ ---------- */
  K.pages.faq = function (ctx) {
    var F = S.faq || [], cat = ctx.query.cat || '', q = ctx.query.q || '', cats = []; F.forEach(function (f) { if (cats.indexOf(f.cat) < 0) cats.push(f.cat); });
    var list = F.filter(function (f) { return (!cat || f.cat === cat) && (!q || K.norm(f.q + ' ' + f.a).indexOf(K.norm(q)) >= 0); });
    var html = K.pageHead('Pertanyaan umum (FAQ)', 'Jawaban cepat untuk hal yang sering ditanyakan.') + '<div class="wrap narrow"><form class="tool-form full" data-form="faq-q"><div class="fw"><span class="fi">' + I('search') + '</span><input type="search" name="q" value="' + esc(q) + '" placeholder="Cari pertanyaan…" aria-label="Cari pertanyaan"></div></form><div class="chips"><a class="chip' + (!cat ? ' on' : '') + '" href="#/faq">Semua</a>' + cats.map(function (c) { return '<a class="chip' + (cat === c ? ' on' : '') + '" href="#/faq?cat=' + encodeURIComponent(c) + '">' + esc(c) + '</a>'; }).join('') + '</div>' +
      (list.length ? '<div class="accordion">' + list.map(function (f, i) { return '<details class="acc"' + (q && i === 0 ? ' open' : '') + '><summary>' + hl(f.q, q) + I('down') + '</summary><div class="acc-b"><p>' + esc(f.a) + '</p><span class="pill">' + esc(f.cat) + '</span></div></details>'; }).join('') + '</div>' : '<div class="empty">' + I('help') + '<h3>Belum ada jawabannya</h3><p>Tanyakan langsung lewat halaman kontak.</p><a class="btn btn-primary" href="#/contact">Tanya kami</a></div>') +
      '<div class="cta-band slim"><div><h3>Belum menemukan jawabannya?</h3></div><a class="btn btn-accent" href="#/contact">Hubungi kami</a></div></div>';
    return { html: html, title: 'FAQ' };
  };
  K.forms['faq-q'] = function (f) { K.go('/faq' + (f.q.value.trim() ? '?q=' + encodeURIComponent(f.q.value.trim()) : '')); };

  /* ---------- KONTAK ---------- */
  K.pages.contact = function () {
    var c = S.contact || {}, me = K.me(), mine = me ? K.get('messages', []).filter(function (m) { return m.email === me.email; }) : [];
    var html = K.pageHead('Hubungi kami', 'Kirim pesan, kami balas secepatnya.') + '<div class="wrap contact-grid"><div class="contact-info">' +
      [['pin', 'Alamat', c.address], ['phone', 'Telepon / WhatsApp', c.phone], ['mail', 'Email', c.email], ['clock', 'Jam layanan', c.hours]].filter(function (x) { return x[2]; }).map(function (x) { return '<div class="card pad ci"><div class="ico">' + I(x[0]) + '</div><div><b>' + x[1] + '</b><p class="muted">' + esc(x[2]) + '</p></div></div>'; }).join('') +
      (c.map ? '<iframe class="map" title="Peta lokasi" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=' + (c.map[1] - .01) + '%2C' + (c.map[0] - .006) + '%2C' + (c.map[1] + .01) + '%2C' + (c.map[0] + .006) + '&layer=mapnik&marker=' + c.map[0] + '%2C' + c.map[1] + '"></iframe>' : '') + '</div>' +
      '<div><form class="card pad" data-form="contact" novalidate><h2>Kirim pesan</h2><div class="alert-slot"></div><div class="two">' + K.field({ name: 'cname', label: 'Nama', value: me ? me.name : '', icon: 'user' }) + K.field({ name: 'cemail', label: 'Email', type: 'email', value: me ? me.email : '', icon: 'mail' }) + '</div>' + K.field({ name: 'topic', label: 'Topik', type: 'select', options: c.topics || ['Pertanyaan umum', 'Kerja sama', 'Saran', 'Lainnya'] }) + K.field({ name: 'subject', label: 'Subjek', max: 80 }) + K.field({ name: 'msg', label: 'Pesan', type: 'textarea', rows: 5, max: 800, hint: 'Maksimal 800 karakter.' }) + '<button class="btn btn-primary btn-lg btn-block" type="submit">' + I('send') + ' Kirim pesan</button></form>' +
      (mine.length ? '<div class="card pad section-sm"><h3>Pesan terkirim</h3><ul class="plain">' + mine.slice(0, 5).map(function (m) { return '<li><b>' + esc(m.subject) + '</b> <span class="pill ok">' + esc(m.status) + '</span><br><span class="muted sm">' + K.fmtDT(m.t) + ' · tiket ' + esc(m.id) + '</span></li>'; }).join('') + '</ul></div>' : '') + '</div></div>';
    return { html: html, title: 'Kontak' };
  };
  K.forms.contact = function (f) {
    var n = f.cname.value.trim(), e = f.cemail.value.trim(), s = f.subject.value.trim(), m = f.msg.value.trim(), bad = false;
    var a = n.length < 3 ? 'Isi nama.' : '', b = K.validators.email(e), c = s.length < 3 ? 'Isi subjek.' : '', d = m.length < 10 ? 'Pesan minimal 10 karakter.' : '';
    K.setErr(f, 'cname', a); K.setErr(f, 'cemail', b); K.setErr(f, 'subject', c); K.setErr(f, 'msg', d); if (a || b || c || d) return;
    var all = K.get('messages', []), id = 'T' + Date.now().toString(36).toUpperCase().slice(-6); all.unshift({ id: id, name: n, email: e.toLowerCase(), topic: f.topic.value, subject: s, msg: m, t: Date.now(), status: 'Diterima' }); K.set('messages', all);
    K.$('.alert-slot', f).innerHTML = K.alertBox('ok', '<b>Pesan terkirim.</b> Nomor tiket <code>' + id + '</code>. Balasan akan dikirim ke ' + esc(e) + '.'); f.reset(); K.toast('Pesan terkirim.', 'ok'); K.$$('.fh', f).forEach(function (h) { h.classList.add('empty'); });
  };

  /* ---------- LAPORAN (report) ---------- */
  K.pages.report = function (ctx) {
    var me = K.me(), reps = me ? K.get('reports', []).filter(function (r) { return r.uid === me.id; }) : [], C = S.catalog || {}, orders = me ? K.myOrders() : [];
    var months = [], now = new Date(); for (var i = 5; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth() - i, 1); months.push({ k: d.getFullYear() + '-' + d.getMonth(), l: d.toLocaleDateString('id-ID', { month: 'short' }), n: 0, v: 0 }); }
    orders.forEach(function (o) { var d = new Date(o.created), k = d.getFullYear() + '-' + d.getMonth(), m = months.filter(function (x) { return x.k === k; })[0]; if (m) { m.n++; m.v += o.total || 0; } });
    var max = Math.max.apply(null, months.map(function (m) { return m.n; }).concat([1])), spent = orders.filter(function (o) { return !/Batal|Ditarik/.test(o.status); }).reduce(function (s, o) { return s + (o.total || 0) + (o.fine || 0); }, 0), active = orders.filter(function (o) { return /Menunggu|Diproses|Dikonfirmasi|Berjalan|Dipinjam|Diperpanjang|Diajukan/.test(o.status); }).length, fines = orders.reduce(function (s, o) { return s + (o.fine || 0); }, 0);
    var kpi = C.mode ? [[orders.length, S.reportLabels ? S.reportLabels[0] : 'Total transaksi'], [active, S.reportLabels ? S.reportLabels[1] : 'Sedang berjalan'], [C.mode === 'borrow' || C.mode === 'apply' ? K.wish().length : K.rp(spent), C.mode === 'borrow' ? 'Buku favorit' : C.mode === 'apply' ? 'Jurusan tersimpan' : 'Total pengeluaran'], [C.mode === 'borrow' ? K.rp(fines) : reps.length, C.mode === 'borrow' ? 'Denda dibayar' : 'Laporan dikirim']] : [[K.wish().length, 'Jurusan tersimpan'], [reps.length, 'Laporan dikirim']];
    var html = K.pageHead('Laporan', 'Ringkasan aktivitas dan kirim laporan masalah atau keluhan.') + '<div class="wrap">' +
      (me ? '<section><div class="kpis">' + kpi.map(function (k) { return '<div class="card kpi"><b>' + esc(k[0]) + '</b><span>' + esc(k[1]) + '</span></div>'; }).join('') + '</div>' +
        (C.mode ? '<div class="card pad chart"><div class="sec-head"><h3>Aktivitas 6 bulan terakhir</h3><div class="k-row"><button class="btn btn-ghost btn-sm" data-act="csv">' + I('download') + ' Unduh CSV</button><button class="btn btn-ghost btn-sm" onclick="window.print()">' + I('print') + ' Cetak</button></div></div><div class="bars" role="img" aria-label="Grafik jumlah transaksi per bulan">' + months.map(function (m) { return '<div class="bar"><span class="bv">' + m.n + '</span><i style="height:' + Math.max(4, m.n / max * 100) + '%"></i><span class="bl">' + m.l + '</span></div>'; }).join('') + '</div></div>' : '') + '</section>' :
        '<div class="alert info">' + I('info') + '<div>Masuk untuk melihat ringkasan aktivitasmu. Kamu tetap bisa mengirim laporan sebagai tamu. <a class="link" href="#/login?next=%2Freport">Masuk</a></div></div>') +
      '<div class="contact-grid"><form class="card pad" data-form="report" novalidate><h2>Kirim laporan</h2><div class="alert-slot"></div>' +
      (me ? '' : '<div class="two">' + K.field({ name: 'rname', label: 'Nama' }) + K.field({ name: 'remail', label: 'Email', type: 'email' }) + '</div>') +
      '<div class="two">' + K.field({ name: 'rtype', label: 'Jenis laporan', type: 'select', options: S.reportTypes || ['Masalah teknis', 'Keluhan layanan', 'Saran fitur', 'Penyalahgunaan', 'Lainnya'] }) + K.field({ name: 'prio', label: 'Prioritas', type: 'select', options: ['Rendah', 'Sedang', 'Tinggi'], value: 'Sedang' }) + '</div>' +
      (orders.length ? K.field({ name: 'ref', label: 'Terkait transaksi', type: 'select', req: false, options: [['', '— tidak ada —']].concat(orders.map(function (o) { return [o.id, o.id + ' · ' + o.lines[0].name]; })) }) : '') +
      K.field({ name: 'title', label: 'Judul singkat', max: 80 }) + K.field({ name: 'desc', label: 'Ceritakan masalahnya', type: 'textarea', rows: 5, max: 800, hint: 'Sertakan langkah yang kamu lakukan dan hasil yang muncul.' }) + K.field({ name: 'file', label: 'Lampiran (tangkapan layar)', type: 'file', req: false, extra: ' accept="image/*"', hint: 'Hanya nama berkas yang disimpan di demo ini.' }) +
      '<button class="btn btn-primary btn-lg btn-block" type="submit">' + I('flag') + ' Kirim laporan</button></form>' +
      '<div><div class="card pad"><h3>Laporan saya</h3>' + (reps.length ? '<ul class="rep-list">' + reps.map(function (r) { return '<li><div><b>' + esc(r.title) + '</b><span class="muted sm">' + esc(r.type) + ' · ' + K.fmtDT(r.t) + (r.ref ? ' · ' + esc(r.ref) : '') + '</span><p class="sm">' + esc(r.desc.slice(0, 120)) + (r.desc.length > 120 ? '…' : '') + '</p></div><div class="rep-r"><span class="pill ' + (r.prio === 'Tinggi' ? 'bad' : r.prio === 'Sedang' ? 'warn' : 'info') + '">' + esc(r.prio) + '</span><span class="pill ' + (r.status === 'Selesai' ? 'ok' : 'info') + '">' + esc(r.status) + '</span><button class="icon-btn" data-act="rep-del" data-id="' + r.id + '" aria-label="Hapus laporan">' + I('trash') + '</button></div></li>'; }).join('') + '</ul>' : '<p class="muted">' + (me ? 'Belum ada laporan.' : 'Masuk untuk melihat riwayat laporanmu.') + '</p>') + '</div></div></div></div>';
    return { html: html, title: 'Laporan' };
  };
  K.forms.report = function (f) {
    var me = K.me(), t = f.elements.title.value.trim(), d = f.desc.value.trim(), e1 = t.length < 4 ? 'Judul minimal 4 karakter.' : '', e2 = d.length < 15 ? 'Jelaskan minimal 15 karakter.' : '', bad = !!(e1 || e2);
    K.setErr(f, 'title', e1); K.setErr(f, 'desc', e2);
    if (!me) { var n = f.rname.value.trim(), em = f.remail.value.trim(), a = n.length < 3 ? 'Isi nama.' : '', b = K.validators.email(em); K.setErr(f, 'rname', a); K.setErr(f, 'remail', b); bad = bad || !!(a || b); }
    if (bad) return;
    var all = K.get('reports', []), id = 'R' + Date.now().toString(36).toUpperCase().slice(-6);
    all.unshift({ id: id, uid: me ? me.id : 'guest', who: me ? me.name : f.rname.value.trim(), type: f.rtype.value, prio: f.prio.value, ref: f.ref ? f.ref.value : '', title: t, desc: d, file: f.file.files[0] ? f.file.files[0].name : '', t: Date.now(), status: 'Baru' }); K.set('reports', all);
    K.toast('Laporan ' + id + ' terkirim. Terima kasih!', 'ok'); K.render();
  };
  K.acts['rep-del'] = function (el) { K.confirm('Hapus laporan?', 'Laporan ini akan dihapus dari daftar.', 'Hapus', true).then(function (ok) { if (ok) { K.set('reports', K.get('reports', []).filter(function (r) { return r.id !== el.dataset.id; })); K.render(); } }); };
  K.acts.csv = function () {
    var rows = [['ID', 'Tanggal', 'Status', 'Item', 'Total']].concat(K.myOrders().map(function (o) { return [o.id, K.isoDate(new Date(o.created)), o.status, o.lines.map(function (l) { return l.name; }).join(' | '), o.total + (o.fine || 0)]; }));
    K.download('laporan-' + S.key + '.csv', rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\n'), 'text/csv');
  };
  K.download = function (name, text, type) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); };

  /* ---------- PENGATURAN ---------- */
  K.pages.settings = function (ctx) {
    if (!K.requireLogin(ctx, 'Masuk untuk membuka pengaturan.')) return { html: '' };
    var me = K.me(), tab = ctx.query.tab || 'profile', p = K.prefs(), tabs = [['profile', 'Profil', 'user'], ['security', 'Keamanan', 'lock'], ['appearance', 'Tampilan', 'sun'], ['notif', 'Notifikasi', 'bell'], ['data', 'Data & akun', 'box']], body = '';
    if (tab === 'profile') body = '<form class="card pad" data-form="set-profile" novalidate><h2>Profil</h2><div class="alert-slot"></div><div class="avatar-pick"><span class="avatar lg c' + me.color + '">' + esc(me.name[0].toUpperCase()) + '</span><div role="radiogroup" aria-label="Warna avatar">' + [0, 1, 2, 3, 4, 5].map(function (c) { return '<label class="sw c' + c + '"><input type="radio" name="color" value="' + c + '"' + (me.color === c ? ' checked' : '') + '><span></span></label>'; }).join('') + '</div></div>' + K.field({ name: 'name', label: 'Nama lengkap', value: me.name }) + '<div class="two">' + K.field({ name: 'username', label: 'Username', value: me.username }) + K.field({ name: 'phone', label: 'Nomor HP', value: me.phone, type: 'tel' }) + '</div>' + K.field({ name: 'email', label: 'Email', value: me.email, type: 'email' }) + K.field({ name: 'bio', label: 'Bio singkat', type: 'textarea', rows: 3, req: false, max: 160, value: me.bio || '' }) + '<div class="k-row end"><button class="btn btn-primary" type="submit">Simpan perubahan</button></div></form>';
    if (tab === 'security') body = '<form class="card pad" data-form="set-pass" novalidate><h2>Ganti password</h2><div class="alert-slot"></div>' + K.field({ name: 'old', label: 'Password saat ini', type: 'password', auto: 'current-password' }) + K.field({ name: 'password', label: 'Password baru', type: 'password', auto: 'new-password', hint: 'Minimal 8 karakter dengan huruf dan angka.' }) + K.field({ name: 'password2', label: 'Ulangi password baru', type: 'password', auto: 'new-password' }) + '<div class="k-row end"><button class="btn btn-primary" type="submit">Ganti password</button></div></form><div class="card pad section-sm"><h3>Sesi</h3><p class="muted">Keluar dari akun ini di browser ini.</p><button class="btn btn-ghost" data-act="logout">' + I('logout') + ' Keluar</button></div>';
    if (tab === 'appearance') body = '<div class="card pad"><h2>Tampilan</h2>' + setRadio('theme', 'Tema', [['auto', 'Ikuti perangkat'], ['light', 'Terang'], ['dark', 'Gelap']], p.theme) + setRadio('font', 'Ukuran huruf', [['sm', 'Kecil'], ['md', 'Sedang'], ['lg', 'Besar']], p.font) + setRadio('density', 'Kerapatan', [['normal', 'Nyaman'], ['compact', 'Rapat']], p.density) + '<label class="switch"><input type="checkbox" data-act-change="pref-motion"' + (p.motion ? ' checked' : '') + '><span class="sw-t"></span><span><b>Animasi</b><small class="muted">Matikan untuk mengurangi gerak di layar.</small></span></label></div>';
    if (tab === 'notif') body = '<div class="card pad"><h2>Notifikasi</h2>' + [['order', 'Status pesanan', 'Kabar saat status berubah.'], ['promo', 'Promo & penawaran', 'Diskon dan voucher terbaru.'], ['news', 'Buletin', 'Artikel blog mingguan.']].map(function (n) { return '<label class="switch"><input type="checkbox" data-act-change="pref-notif" data-k="' + n[0] + '"' + (p.notif[n[0]] ? ' checked' : '') + '><span class="sw-t"></span><span><b>' + n[1] + '</b><small class="muted">' + n[2] + '</small></span></label>'; }).join('') + '<p class="muted sm">Demo statis: pengaturan tersimpan, tetapi tidak ada email yang dikirim.</p></div>';
    if (tab === 'data') body = '<div class="card pad"><h2>Data & akun</h2><div class="set-row"><div><b>Ekspor data saya</b><p class="muted sm">Unduh profil, pesanan, laporan, dan favorit dalam JSON.</p></div><button class="btn btn-ghost" data-act="export">' + I('download') + ' Ekspor</button></div><div class="set-row"><div><b>Kosongkan keranjang</b><p class="muted sm">' + K.cart().length + ' item di keranjang.</p></div><button class="btn btn-ghost" data-act="c-clear">Kosongkan</button></div><div class="set-row danger"><div><b>Reset data demo</b><p class="muted sm">Hapus semua data situs ini di browser dan mulai dari awal.</p></div><button class="btn btn-danger" data-act="reset-all">Reset</button></div><div class="set-row danger"><div><b>Hapus akun</b><p class="muted sm">Akun, pesanan, dan laporanmu dihapus permanen.</p></div><button class="btn btn-danger" data-act="del-account">Hapus akun</button></div></div>';
    var html = K.pageHead('Pengaturan', 'Kelola akun dan preferensimu.') + '<div class="wrap set-grid"><nav class="set-nav card" aria-label="Pengaturan">' + tabs.map(function (t) { return '<a class="' + (tab === t[0] ? 'on' : '') + '" href="#/settings?tab=' + t[0] + '">' + I(t[2]) + t[1] + '</a>'; }).join('') + '</nav><div>' + body + '</div></div>';
    return { html: html, title: 'Pengaturan' };
  };
  function setRadio(name, label, opts, cur) { return '<fieldset class="opt"><legend>' + label + '</legend><div class="seg">' + opts.map(function (o) { return '<label><input type="radio" name="' + name + '" value="' + o[0] + '"' + (cur === o[0] ? ' checked' : '') + ' data-act-change="pref-' + name + '"><span>' + o[1] + '</span></label>'; }).join('') + '</div></fieldset>'; }
  K.changes['pref-theme'] = function (el) { K.setPref('theme', el.value); K.refreshChrome(); };
  K.changes['pref-font'] = function (el) { K.setPref('font', el.value); };
  K.changes['pref-density'] = function (el) { K.setPref('density', el.value); };
  K.changes['pref-motion'] = function (el) { K.setPref('motion', el.checked); };
  K.changes['pref-notif'] = function (el) { var p = K.prefs(); p.notif[el.dataset.k] = el.checked; K.set('prefs', p); K.toast('Tersimpan.', 'ok'); };
  K.forms['set-profile'] = function (f) {
    var me = K.me(), v = { name: f.elements.name.value.trim(), username: f.username.value.trim().toLowerCase(), phone: f.phone.value.trim(), email: f.email.value.trim().toLowerCase() }, bad = false;
    ['name', 'username', 'phone', 'email'].forEach(function (k) { var e = K.validators[k](v[k]); K.setErr(f, k, e); if (e) bad = true; }); if (bad) return;
    var us = K.users(); if (us.some(function (u) { return u.id !== me.id && u.username === v.username; })) { K.setErr(f, 'username', 'Username sudah dipakai.'); return; } if (us.some(function (u) { return u.id !== me.id && u.email === v.email; })) { K.setErr(f, 'email', 'Email sudah dipakai.'); return; }
    us.forEach(function (u) { if (u.id === me.id) { u.name = v.name; u.username = v.username; u.phone = K.normPhone(v.phone); u.email = v.email; u.bio = f.bio.value.trim(); u.color = +(f.color.value || 0); } }); K.saveUsers(us); K.toast('Profil disimpan.', 'ok'); K.refreshChrome(); K.render();
  };
  K.forms['set-pass'] = function (f) {
    var me = K.me(), pw = f.password.value, e1 = f.old.value ? '' : 'Isi password saat ini.', e2 = K.validators.password(pw), e3 = pw !== f.password2.value ? 'Password tidak sama.' : '';
    K.setErr(f, 'old', e1); K.setErr(f, 'password', e2); K.setErr(f, 'password2', e3); if (e1 || e2 || e3) return;
    K.hash(me.salt + f.old.value).then(function (h) {
      if (h !== me.hash) { K.setErr(f, 'old', 'Password saat ini salah.'); return; }
      var salt = K.salt(); K.hash(salt + pw).then(function (nh) { var us = K.users(); us.forEach(function (u) { if (u.id === me.id) { u.salt = salt; u.hash = nh; } }); K.saveUsers(us); f.reset(); K.toast('Password diganti.', 'ok'); });
    });
  };
  K.acts.logout = function () { K.logout(); K.toast('Kamu sudah keluar.'); K.go('/'); };
  K.acts.export = function () { var me = K.me(); K.download('data-' + S.key + '-' + me.username + '.json', JSON.stringify({ profil: { name: me.name, username: me.username, email: me.email, phone: me.phone }, pesanan: K.myOrders(), laporan: K.get('reports', []).filter(function (r) { return r.uid === me.id; }), favorit: K.wish() }, null, 2), 'application/json'); };
  K.acts['reset-all'] = function () { K.confirm('Reset semua data demo?', 'Akun, pesanan, dan pengaturan di browser ini akan dihapus.', 'Reset', true).then(function (ok) { if (!ok) return; try { Object.keys(localStorage).filter(function (k) { return k.indexOf(S.key + ':') === 0; }).forEach(function (k) { localStorage.removeItem(k); }); sessionStorage.clear(); } catch (e) { } location.hash = '#/'; location.reload(); }); };
  K.acts['del-account'] = function () { K.confirm('Hapus akun?', 'Semua datamu dihapus permanen.', 'Hapus akun', true).then(function (ok) { if (!ok) return; var me = K.me(); K.saveUsers(K.users().filter(function (u) { return u.id !== me.id; })); K.set('orders', K.get('orders', []).filter(function (o) { return o.uid !== me.id; })); K.set('reports', K.get('reports', []).filter(function (r) { return r.uid !== me.id; })); K.logout(); K.toast('Akun dihapus.'); K.go('/'); }); };

  /* ---------- PENCARIAN ---------- */
  K.searchAll = function (q, lim) {
    var n = K.norm(q.trim()); if (!n) return { items: [], posts: [], faq: [], pages: [] };
    var has = function (t) { return K.norm(t).indexOf(n) >= 0; }, C = S.catalog || { items: [] };
    return {
      items: (C.items || []).filter(function (x) { return has([x.name, x.cat, x.desc, x.brand, x.author, x.tags].join(' ')); }).slice(0, lim || 99),
      posts: BL.filter(function (p) { return has(p.title + ' ' + p.excerpt + ' ' + p.cat); }).slice(0, lim || 99),
      faq: (S.faq || []).filter(function (f) { return has(f.q + ' ' + f.a); }).slice(0, lim || 99),
      pages: (S.nav || []).concat([['about', 'Tentang'], ['contact', 'Kontak'], ['report', 'Laporan'], ['faq', 'FAQ'], ['gallery', 'Galeri'], ['blog', 'Blog'], ['login', 'Masuk'], ['signup', 'Daftar'], ['settings', 'Pengaturan']]).filter(function (p) { return has(p[1]); }).filter(function (p, i, a) { return a.map(function (x) { return x[0]; }).indexOf(p[0]) === i; }).slice(0, 4)
    };
  };
  K.pages.search = function (ctx) {
    var q = ctx.query.q || '', r = K.searchAll(q), tot = r.items.length + r.posts.length + r.faq.length + r.pages.length, C = S.catalog || {};
    var html = K.pageHead('Hasil pencarian', q ? 'Untuk “' + esc(q) + '” · ' + tot + ' hasil' : 'Ketik sesuatu di kotak cari') + '<div class="wrap"><form class="tool-form full" data-form="search-page"><div class="fw"><span class="fi">' + I('search') + '</span><input type="search" name="q" value="' + esc(q) + '" placeholder="Cari ' + esc((C.noun || 'item')) + ', artikel, FAQ…" aria-label="Cari" autofocus></div></form>' +
      (q && !tot ? '<div class="empty">' + I('search') + '<h3>Tidak ada hasil untuk “' + esc(q) + '”</h3><p>Periksa ejaan atau gunakan kata yang lebih umum.</p></div>' : '') +
      (r.items.length ? '<section class="section-sm"><h2>' + esc(C.title || 'Produk') + ' <em>' + r.items.length + '</em></h2><div class="grid items">' + r.items.map(K.card).join('') + '</div></section>' : '') +
      (r.posts.length ? '<section class="section-sm"><h2>Blog <em>' + r.posts.length + '</em></h2><ul class="res-list">' + r.posts.map(function (p) { return '<li><a href="#/blog/' + p.id + '"><b>' + hl(p.title, q) + '</b><span class="muted">' + hl(p.excerpt, q) + '</span></a></li>'; }).join('') + '</ul></section>' : '') +
      (r.faq.length ? '<section class="section-sm"><h2>FAQ <em>' + r.faq.length + '</em></h2><ul class="res-list">' + r.faq.map(function (f) { return '<li><a href="#/faq?q=' + encodeURIComponent(q) + '"><b>' + hl(f.q, q) + '</b><span class="muted">' + hl(f.a.slice(0, 140), q) + '</span></a></li>'; }).join('') + '</ul></section>' : '') +
      (r.pages.length ? '<section class="section-sm"><h2>Halaman</h2><div class="chips">' + r.pages.map(function (p) { return '<a class="chip" href="#/' + p[0] + '">' + esc(p[1]) + '</a>'; }).join('') + '</div></section>' : '') + '</div>';
    return { html: html, title: 'Cari' };
  };
  K.forms['search-page'] = function (f) { K.go('/search?q=' + encodeURIComponent(f.q.value.trim())); };

  /* ---------- halaman legal ---------- */
  K.pages.terms = function () { return { title: 'Syarat penggunaan', html: K.pageHead('Syarat penggunaan', 'Berlaku untuk situs demo ' + esc(S.name)) + '<div class="wrap narrow prose"><p>Situs ini adalah proyek demonstrasi. Data yang kamu masukkan disimpan hanya di browser perangkatmu (localStorage) dan tidak dikirim ke server mana pun.</p><h2>Akun</h2><p>Jaga kerahasiaan password. Kamu bisa menghapus akun kapan saja di Pengaturan.</p><h2>Transaksi</h2><p>Pembayaran, pengiriman, dan email pada demo ini bersifat simulasi dan tidak melibatkan uang sungguhan.</p><h2>Konten</h2><p>Jangan mengunggah data pribadi nyata yang sensitif ke situs demo.</p></div>' }; };
  K.pages.privacy = function () { return { title: 'Privasi', html: K.pageHead('Kebijakan privasi', 'Cara data diperlakukan di ' + esc(S.name)) + '<div class="wrap narrow prose"><p>Tidak ada pelacak, iklan, atau pengiriman data ke pihak ketiga. Password disimpan sebagai hash SHA-256 bergaram di browsermu, bukan sebagai teks biasa.</p><p>Reset data demo di Pengaturan menghapus semuanya dari perangkat ini.</p></div>' }; };
})(window);

/* ===== Site Kit — kerangka situs, router, event, pencarian header ===== */
(function (W) {
  'use strict';
  var K = W.K, S = K.S, esc = K.esc, I = K.icon, C = S.catalog || { mode: null };
  K.acts = K.acts || {}; K.changes = K.changes || {}; K.forms = K.forms || {};

  var ROUTES = [
    [/^\/?$/, 'home'], [/^\/catalog$/, 'catalog'], [/^\/item\/(.+)$/, 'item'], [/^\/cart$/, 'cart'], [/^\/checkout$/, 'checkout'], [/^\/orders$/, 'orders'], [/^\/order\/(.+)$/, 'order'], [/^\/apply\/(.+)$/, 'apply'], [/^\/wishlist$/, 'wishlist'],
    [/^\/blog$/, 'blog'], [/^\/blog\/(.+)$/, 'post'], [/^\/gallery$/, 'gallery'], [/^\/about$/, 'about'], [/^\/faq$/, 'faq'], [/^\/contact$/, 'contact'], [/^\/report$/, 'report'], [/^\/settings$/, 'settings'], [/^\/search$/, 'search'],
    [/^\/login$/, 'login'], [/^\/signup$/, 'signup'], [/^\/forgot-username$/, 'forgot-username'], [/^\/forgot-email$/, 'forgot-email'], [/^\/forgot-password$/, 'forgot-password'], [/^\/reset$/, 'reset'], [/^\/terms$/, 'terms'], [/^\/privacy$/, 'privacy']
  ];
  function parse() {
    var h = location.hash.replace(/^#/, '') || '/', i = h.indexOf('?'), path = i < 0 ? h : h.slice(0, i), raw = i < 0 ? '' : h.slice(i + 1), q = {};
    raw.split('&').forEach(function (p) { if (!p) return; var kv = p.split('='); try { q[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')); } catch (e) { } });
    return { path: path, query: q, rawQuery: raw };
  }
  K.go = function (p) { var t = '#' + p; if (location.hash === t) K.render(); else location.hash = t; };

  var lastPath = '';
  K.render = function () {
    var ctx = parse(), name = null, params = [];
    for (var i = 0; i < ROUTES.length; i++) { var m = ctx.path.match(ROUTES[i][0]); if (m) { name = ROUTES[i][1]; params = m.slice(1).map(decodeURIComponent); break; } }
    ctx.params = params; ctx.name = name;
    var root = K.$('#app'), keep = ctx.path === lastPath, sy = W.scrollY, res;
    if (name === 'home' && !K.pages.home) K.pages.home = function () { return { html: S.home ? S.home(K) : K.pageHead(S.name, S.tagline), title: '' }; };
    try { res = name && K.pages[name] ? K.pages[name](ctx) : K.notFound(); } catch (e) { console.error(e); res = { html: '<div class="wrap"><div class="empty big">' + I('alert') + '<h3>Terjadi kesalahan</h3><p>' + esc(e.message) + '</p><a class="btn btn-primary" href="#/">Ke beranda</a></div></div>' }; }
    if (res.html === '' && !res.mount) return; /* sudah dialihkan */
    root.innerHTML = res.html; root.className = 'page page-' + (name || '404');
    document.title = (res.title ? res.title + ' · ' : '') + S.name;
    if (res.mount) res.mount(root, ctx);
    K.current = name || '404'; K.setActiveNav(); closeMenus();
    if (keep) W.scrollTo(0, sy); else { W.scrollTo(0, 0); var h1 = K.$('h1', root); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); } }
    lastPath = ctx.path; K.$$('.fh', root).forEach(function (h) { h.dataset.orig = h.textContent; });
  };
  K.setActiveNav = function () {
    var cur = K.current, map = { item: 'catalog', post: 'blog', cart: 'catalog', checkout: 'catalog', orders: 'orders', order: 'orders', apply: 'catalog' };
    K.$$('.nav a[data-r]').forEach(function (a) { var on = a.dataset.r === (map[cur] || cur); a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  };

  /* ---------- kerangka ---------- */
  function navHtml() { return (S.nav || []).map(function (n) { return '<li><a data-r="' + n[0] + '" href="#/' + (n[0] === 'home' ? '' : n[0]) + '">' + esc(n[1]) + '</a></li>'; }).join(''); }
  function actionsHtml() {
    var me = K.me(), dark = document.documentElement.getAttribute('data-theme') === 'dark', cc = K.cartCount ? K.cartCount() : 0, wc = K.wish().length, ttl = C.cartTitle || 'Keranjang';
    var h = '<button class="icon-btn" data-act="search-toggle" aria-label="Cari" aria-expanded="false" title="Cari ( / )">' + I('search') + '</button>' +
      '<button class="icon-btn" data-act="theme" aria-label="Ganti tema" title="Ganti tema">' + I(dark ? 'sun' : 'moon') + '</button>' +
      (S.catalog && S.catalog.items && S.catalog.items.length ? '<a class="icon-btn" href="#/wishlist" aria-label="' + esc(S.wishLabel || 'Favorit') + '" title="' + esc(S.wishLabel || 'Favorit') + '">' + I('heart') + (wc ? '<span class="cnt">' + wc + '</span>' : '') + '</a>' : '') +
      (C.mode && C.mode !== 'apply' ? '<a class="icon-btn" href="#/cart" aria-label="' + esc(ttl) + ', ' + cc + ' item" title="' + esc(ttl) + '">' + I('cart') + (cc ? '<span class="cnt">' + cc + '</span>' : '') + '</a>' : '');
    if (me) h += '<div class="um"><button class="avatar c' + me.color + '" data-act="user-menu" aria-haspopup="true" aria-expanded="false" aria-label="Menu akun ' + esc(me.name) + '">' + esc(me.name[0].toUpperCase()) + '</button><div class="menu" role="menu"><div class="menu-h"><b>' + esc(me.name) + '</b><span class="muted sm">@' + esc(me.username) + '</span></div><a role="menuitem" href="#/settings">' + I('sliders') + 'Pengaturan</a>' + (C.mode ? '<a role="menuitem" href="#/orders">' + I('box') + esc(C.ordersTitle || 'Pesanan saya') + '</a>' : '') + '<a role="menuitem" href="#/wishlist">' + I('heart') + esc(S.wishLabel || 'Favorit') + '</a><a role="menuitem" href="#/report">' + I('flag') + 'Laporan</a><button role="menuitem" data-act="logout">' + I('logout') + 'Keluar</button></div></div>';
    else h += '<a class="btn btn-ghost btn-sm hide-s" href="#/login">Masuk</a><a class="btn btn-primary btn-sm" href="#/signup">Daftar</a>';
    return h + '<button class="icon-btn burger" data-act="menu" aria-label="Menu" aria-expanded="false">' + I('menu') + '</button>';
  }
  K.refreshChrome = function () { var a = K.$('#k-actions'); if (a) a.innerHTML = actionsHtml(); var d = K.$('#k-drawer-auth'); if (d) d.innerHTML = drawerAuth(); };
  function drawerAuth() { return K.me() ? '<a href="#/settings">' + I('sliders') + ' Pengaturan</a><a href="#/orders">' + I('box') + ' ' + esc(C.ordersTitle || 'Pesanan saya') + '</a><button data-act="logout">' + I('logout') + ' Keluar</button>' : '<a href="#/login">' + I('user') + ' Masuk</a><a href="#/signup">' + I('plus') + ' Daftar</a><a href="#/forgot-password">' + I('lock') + ' Lupa password</a>'; }
  function build() {
    var c = S.contact || {}, root = K.$('#root') || document.body;
    root.innerHTML = '<a class="skip" href="#app" data-act="skip">Lewati ke konten</a>' + (S.topbar ? '<div class="topbar"><div class="wrap">' + S.topbar + '</div></div>' : '') +
      '<header class="site-h"><div class="wrap nav-wrap"><a class="brand" href="#/" aria-label="' + esc(S.name) + ' — beranda">' + (S.logo || '') + '<span>' + esc(S.name) + '</span></a><nav class="nav" aria-label="Utama"><ul>' + navHtml() + '</ul></nav><div class="actions" id="k-actions">' + actionsHtml() + '</div></div>' +
      '<div class="search-bar" id="k-search" hidden><div class="wrap"><form data-form="hsearch" role="search"><div class="fw big"><span class="fi">' + I('search') + '</span><input id="hs" type="search" name="q" placeholder="Cari ' + esc(C.noun || 'produk') + ', artikel, FAQ…" autocomplete="off" aria-label="Cari" aria-controls="k-sugg"><button type="button" class="icon-btn" data-act="search-toggle" aria-label="Tutup pencarian">' + I('x') + '</button></div></form><div class="sugg" id="k-sugg" role="listbox"></div></div></div></header>' +
      '<div class="drawer" id="k-drawer" hidden><nav aria-label="Menu seluler"><ul>' + navHtml() + '</ul><div id="k-drawer-auth" class="drawer-auth">' + drawerAuth() + '</div></nav></div>' +
      '<main id="app" tabindex="-1"></main>' +
      '<footer class="site-f"><div class="wrap f-grid"><div class="f-brand"><a class="brand" href="#/">' + (S.logo || '') + '<span>' + esc(S.name) + '</span></a><p>' + esc(S.footerText || S.tagline) + '</p>' + (c.phone ? '<p class="sm">' + I('phone') + ' ' + esc(c.phone) + '</p>' : '') + (c.email ? '<p class="sm">' + I('mail') + ' ' + esc(c.email) + '</p>' : '') + '</div>' +
      '<div><h4>Jelajahi</h4><ul>' + (S.nav || []).slice(0, 6).map(function (n) { return '<li><a href="#/' + (n[0] === 'home' ? '' : n[0]) + '">' + esc(n[1]) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>Bantuan</h4><ul><li><a href="#/faq">FAQ</a></li><li><a href="#/contact">Kontak</a></li><li><a href="#/report">Laporan</a></li><li><a href="#/terms">Syarat penggunaan</a></li><li><a href="#/privacy">Privasi</a></li></ul></div>' +
      '<div><h4>Akun</h4><ul><li><a href="#/login">Masuk</a></li><li><a href="#/signup">Daftar</a></li><li><a href="#/forgot-password">Lupa password</a></li><li><a href="#/forgot-username">Lupa username</a></li><li><a href="#/forgot-email">Lupa email</a></li><li><a href="#/settings">Pengaturan</a></li></ul></div></div>' +
      '<div class="f-bottom"><div class="wrap"><span>© ' + new Date().getFullYear() + ' ' + esc(S.name) + '. Proyek demo oleh Jeremy Hidayat.</span><span class="muted">Data tersimpan di browsermu · tanpa server</span></div></div></footer>';
  }

  /* ---------- pencarian header ---------- */
  function openSearch(on) {
    var b = K.$('#k-search'), t = K.$('[data-act="search-toggle"]'); if (!b) return; b.hidden = !on; if (t) t.setAttribute('aria-expanded', on);
    if (on) { var i = K.$('#hs'); i.focus(); i.select(); } else { K.$('#k-sugg').innerHTML = ''; }
  }
  K.acts['search-toggle'] = function () { openSearch(K.$('#k-search').hidden); };
  function suggest(q) {
    var box = K.$('#k-sugg'); q = q.trim(); if (!q) { box.innerHTML = ''; return; }
    var r = K.searchAll(q, 4), n = r.items.length + r.posts.length + r.faq.length;
    var li = function (href, ic, t, s) { return '<a role="option" href="' + href + '">' + I(ic) + '<span><b>' + esc(t) + '</b>' + (s ? '<small>' + esc(s) + '</small>' : '') + '</span></a>'; };
    box.innerHTML = n || r.pages.length ? (r.items.length ? '<h5>' + esc(C.title || 'Produk') + '</h5>' + r.items.map(function (x) { return li('#/item/' + x.id, 'tag', x.name, (x.cat || '') + (x.price ? ' · ' + K.rp(x.price) : '')); }).join('') : '') + (r.posts.length ? '<h5>Blog</h5>' + r.posts.map(function (p) { return li('#/blog/' + p.id, 'doc', p.title, p.cat); }).join('') : '') + (r.faq.length ? '<h5>FAQ</h5>' + r.faq.map(function (f) { return li('#/faq?q=' + encodeURIComponent(q), 'help', f.q, f.cat); }).join('') : '') + (r.pages.length ? '<h5>Halaman</h5>' + r.pages.map(function (p) { return li('#/' + p[0], 'arrow', p[1], ''); }).join('') : '') + '<a class="all" href="#/search?q=' + encodeURIComponent(q) + '">Lihat semua hasil untuk “' + esc(q) + '” ' + I('arrow') + '</a>' : '<p class="muted pad">Tidak ada saran untuk “' + esc(q) + '”.</p>';
  }
  K.forms.hsearch = function (f) { var q = f.q.value.trim(); openSearch(false); K.go('/search?q=' + encodeURIComponent(q)); };

  /* ---------- menu & tema ---------- */
  function closeMenus() { var d = K.$('#k-drawer'); if (d) { d.hidden = true; } var b = K.$('.burger'); if (b) b.setAttribute('aria-expanded', 'false'); K.$$('.um.open').forEach(function (u) { u.classList.remove('open'); }); var s = K.$('#k-search'); if (s && !s.hidden) openSearch(false); document.body.classList.remove('noscroll-m'); }
  K.acts.menu = function (el) { var d = K.$('#k-drawer'), on = d.hidden; d.hidden = !on; el.setAttribute('aria-expanded', on); document.body.classList.toggle('noscroll-m', on); };
  K.acts['user-menu'] = function (el) { var u = el.closest('.um'); u.classList.toggle('open'); el.setAttribute('aria-expanded', u.classList.contains('open')); };
  K.acts.theme = function () { var dark = document.documentElement.getAttribute('data-theme') === 'dark'; K.setPref('theme', dark ? 'light' : 'dark'); K.refreshChrome(); };
  K.acts.pw = function (el) { var inp = K.$('input', el.closest('.fw')), show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; el.innerHTML = I(show ? 'eyeoff' : 'eye'); el.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password'); };
  K.acts['fill-demo'] = function () { var d = S.demoUser, f = K.$('form[data-form=login]'); f.elements.id.value = d.username; f.password.value = d.password; K.toast('Akun demo terisi. Tekan Masuk.'); };
  K.acts.skip = function (el, e) { e.preventDefault(); var m = K.$('#app'); m.focus(); };

  /* ---------- delegasi event ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (el && K.acts[el.dataset.act]) { if (el.tagName !== 'INPUT') e.preventDefault(); K.acts[el.dataset.act](el, e); return; }
    if (!e.target.closest('.um')) K.$$('.um.open').forEach(function (u) { u.classList.remove('open'); });
    var lb = e.target.closest('#k-lb'); if (lb && e.target === lb) K.acts['lb-close']();
    if (e.target.closest('.sugg a') || e.target.closest('.drawer a') || e.target.closest('.menu a')) closeMenus();
  });
  document.addEventListener('submit', function (e) { var f = e.target.closest('form[data-form]'); if (!f) return; e.preventDefault(); var fn = K.forms[f.dataset.form]; if (fn) fn(f, parse()); });
  document.addEventListener('change', function (e) { var el = e.target.closest('[data-act-change]'); if (el && K.changes[el.dataset.actChange]) K.changes[el.dataset.actChange](el, e); });
  document.addEventListener('input', function (e) { if (e.target.id === 'hs') suggest.debounced(e.target.value); });
  suggest.debounced = K.debounce(suggest, 120);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenus(); }
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || '')) && !e.ctrlKey && !e.metaKey) { e.preventDefault(); openSearch(true); }
  });
  document.addEventListener('error', function (e) { var t = e.target; if (t && t.tagName === 'IMG' && !t.dataset.failed) { t.dataset.failed = '1'; t.style.display = 'none'; if (t.parentNode) t.parentNode.classList.add('img-fail'); } }, true);
  W.addEventListener('hashchange', K.render);

  function boot() { K.seedUsers(); build(); K.render(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window);

