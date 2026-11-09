// Fungsi serverless Vercel untuk JerAI: meneruskan percakapan ke ChatGPT, Claude, Gemini,
// DeepSeek, Blackbox, atau Grok. Semua kunci API HANYA ada di server (Environment Variables
// di dashboard Vercel, atau file .env saat `vercel dev`). Kunci tidak pernah dikirim ke browser.
//
//   GET  /api/chat  -> { providers: { claude: true, openai: false, ... } }  (hanya status, tanpa kunci)
//   POST /api/chat  -> { provider, mode, messages:[{role,content}] }  =>  { reply, provider }

const SYSTEM_PORTFOLIO = `Kamu adalah JerAI, asisten di website portofolio Jeremy Hidayat. Jawab dalam bahasa Indonesia, ramah, singkat (maksimal 4 kalimat), dan jangan mengarang fakta.
Fakta tentang Jeremy: siswa kelas XII RPL 2 (Rekayasa Perangkat Lunak) di SMK Negeri 7 Batam; sedang menjalani PKL di PT Tera Tirta Batam Sejahtera / Oxyra Happy Hydration Era di bagian produksi. GitHub: Xyndey.
Proyek: Pixel Quest To-Do, E-Kantin Sekolah, Absensi Digital, Batam Explorer 3D, Snake Retro, Flappy Pixel, Cuaca 3D, Kasir Mini, Habit Tracker, Catur 3D, JerAI: Asisten AI, Oxyra: Hidup Berkualitas, Pustaka Nusantara (Perpustakaan), RentGo Batam (Rental Mobil), JurusanKu (Jurusan Kuliah), BelajarKu (Flashcard & Latihan Soal), Bankira Digital (Bank), Ruang BK (Bimbingan Konseling), TaskFlow (Kanban), KasirWarung (POS), DuitKu (Keuangan Pribadi), PollingKelas (Polling Real-time), QuizKode (Kuis Pemrograman), DashboardToko (Dasbor Penjualan), FocusTimer (Pomodoro), CatatanKu (Catatan Markdown), ChatRuang (Obrolan Real-time), Pendek.in (Pemendek URL), Album Lagu: Level Up.
Teknologi: HTML, CSS, JavaScript, PHP, Laravel, MySQL, Git, GitHub, UI/UX Figma, Tailwind CSS, TypeScript, React, Vue.js, Angular, Node.js, Supabase, PostgreSQL.
Jika ditanya hal di luar fakta ini tentang Jeremy, katakan kamu tidak tahu. Untuk pertanyaan umum (pelajaran, pemrograman), bantu dengan jawaban singkat dan benar.`;

const THINK = {
  draft: ' Pikirkan masalah ini langkah demi langkah secara mendalam. Tulis analisis singkat lalu jawabanmu.',
  final: ' Kamu sedang memeriksa ulang jawaban sebelumnya. Cari kesalahan, asumsi keliru, atau hal yang terlewat, lalu tulis JAWABAN FINAL yang sudah diperbaiki tanpa menyebut proses pemeriksaan.'
};
const IMG_RE = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/;

const SYSTEM_GENERAL = 'Kamu adalah JerAI, asisten AI serbaguna. Jawab dalam bahasa Indonesia kecuali diminta lain. Jelas, akurat, ringkas. Untuk kode, pakai blok kode. Jika tidak yakin, katakan terus terang.';

// Nama model bisa diganti lewat environment variable karena penyedia sering merilis/mengganti model.
const PROVIDERS = {
  claude:   { name: 'Claude',   keyEnv: 'ANTHROPIC_API_KEY', modelEnv: 'ANTHROPIC_MODEL', model: 'claude-haiku-5-5', kind: 'anthropic' },
  openai:   { name: 'ChatGPT',  keyEnv: 'OPENAI_API_KEY',    modelEnv: 'OPENAI_MODEL',    model: 'gpt-5.5',          kind: 'openai',  url: 'https://api.openai.com/v1/chat/completions',   tokenField: 'max_completion_tokens' },
  gemini:   { name: 'Gemini',   keyEnv: 'GEMINI_API_KEY',    modelEnv: 'GEMINI_MODEL',    model: 'gemini-2.5-flash', kind: 'gemini' },
  deepseek: { name: 'DeepSeek', keyEnv: 'DEEPSEEK_API_KEY',  modelEnv: 'DEEPSEEK_MODEL',  model: 'deepseek-chat',    kind: 'openai',  vision: false, url: 'https://api.deepseek.com/chat/completions',    tokenField: 'max_tokens' },
  blackbox: { name: 'Blackbox', keyEnv: 'BLACKBOX_API_KEY',  modelEnv: 'BLACKBOX_MODEL',  model: 'blackboxai/openai/gpt-5.5', kind: 'openai', url: 'https://api.blackbox.ai/chat/completions', tokenField: 'max_tokens' },
  grok:     { name: 'Grok',     keyEnv: 'XAI_API_KEY',       modelEnv: 'XAI_MODEL',       model: 'grok-4.7',         kind: 'openai',  url: 'https://api.x.ai/v1/chat/completions',         tokenField: null }
};

// Pembatas sederhana per IP (per instance serverless): 20 permintaan per menit.
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter(t => now - t < 60000);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 500) for (const [k, v] of hits) if (!v.some(t => now - t < 60000)) hits.delete(k);
  return arr.length > 20;
}

async function callProvider(id, system, msgs, think) {
  const p = PROVIDERS[id], key = process.env[p.keyEnv], model = process.env[p.modelEnv] || p.model, MAX = think ? 3500 : 1500;
  system += THINK[think] || '';
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 28000);
  try {
    let r, data;
    if (p.kind === 'anthropic') {
      r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', signal: ctl.signal,
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: MAX, system, messages: msgs.map(m => m.images ? { role: m.role, content: m.images.map(i => ({ type: 'image', source: { type: 'base64', media_type: i.mime, data: i.data } })).concat([{ type: 'text', text: m.content }]) } : { role: m.role, content: m.content }) })
      });
      data = await r.json();
      if (!r.ok) throw new Error('status ' + r.status);
      return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    }
    if (p.kind === 'gemini') {
      r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent', {
        method: 'POST', signal: ctl.signal,
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: msgs.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }].concat((m.images || []).map(i => ({ inlineData: { mimeType: i.mime, data: i.data } }))) })),
          generationConfig: { maxOutputTokens: MAX }
        })
      });
      data = await r.json();
      if (!r.ok) throw new Error('status ' + r.status);
      const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
      return parts.map(x => x.text || '').join('').trim();
    }
    // OpenAI-compatible: ChatGPT, DeepSeek, Blackbox, Grok
    const body = { model, messages: [{ role: 'system', content: system }].concat(msgs.map(m => m.images ? { role: m.role, content: [{ type: 'text', text: m.content }].concat(m.images.map(i => ({ type: 'image_url', image_url: { url: 'data:' + i.mime + ';base64,' + i.data } }))) } : { role: m.role, content: m.content })) };
    if (p.tokenField) body[p.tokenField] = MAX;
    r = await fetch(p.url, {
      method: 'POST', signal: ctl.signal,
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + key },
      body: JSON.stringify(body)
    });
    data = await r.json();
    if (!r.ok) throw new Error('status ' + r.status);
    return ((data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '').trim();
  } finally { clearTimeout(timer); }
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const send = (code, obj) => { res.statusCode = code; res.end(JSON.stringify(obj)); };

  if (req.method === 'GET') {
    const status = {};
    Object.keys(PROVIDERS).forEach(id => { status[id] = !!process.env[PROVIDERS[id].keyEnv]; });
    return send(200, { providers: status });
  }
  if (req.method !== 'POST') return send(405, { error: 'Gunakan metode POST' });

  const ip = String((req.headers['x-forwarded-for'] || '').split(',')[0] || (req.socket && req.socket.remoteAddress) || 'x').trim();
  if (limited(ip)) return send(429, { error: 'Terlalu banyak permintaan. Coba lagi sebentar lagi.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // Kompatibel dengan versi lama: tanpa "provider" dipakai Claude.
  const id = typeof body.provider === 'string' ? body.provider : 'claude';
  if (!Object.prototype.hasOwnProperty.call(PROVIDERS, id)) return send(400, { error: 'Penyedia AI tidak dikenal' });
  if (!process.env[PROVIDERS[id].keyEnv]) return send(501, { error: PROVIDERS[id].name + ' belum aktif: ' + PROVIDERS[id].keyEnv + ' belum diatur di server.' });

  const raw = (Array.isArray(body.messages) ? body.messages : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim()).slice(-12);
  let imgCount = 0;
  const msgs = raw.map((m, i) => {
    const o = { role: m.role, content: m.content.slice(0, i === raw.length - 1 || m.images ? 16000 : 4000) };
    if (m.role === 'user' && Array.isArray(m.images)) {
      const list = [];
      for (const u of m.images.slice(0, 3)) { const mt = typeof u === 'string' && u.length < 2000000 && IMG_RE.exec(u); if (mt && imgCount < 3) { list.push({ mime: mt[1], data: mt[2] }); imgCount++; } }
      if (list.length) o.images = list;
    }
    return o;
  });
  if (imgCount && PROVIDERS[id].vision === false) return send(400, { error: PROVIDERS[id].name + ' belum mendukung gambar. Pilih Claude, ChatGPT, Gemini, atau Grok.' });
  const think = body.think === 'draft' || body.think === 'final' ? body.think : '';
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return send(400, { error: 'Pesan tidak valid' });
  // Beberapa penyedia menolak riwayat yang diawali pesan asisten.
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();

  const system = body.mode === 'general' ? SYSTEM_GENERAL : SYSTEM_PORTFOLIO;
  try {
    const reply = await callProvider(id, system, msgs, think);
    return send(200, { reply: reply || 'Maaf, aku belum bisa menjawab itu.', provider: id });
  } catch (e) {
    return send(502, { error: PROVIDERS[id].name + ' sedang bermasalah atau kuncinya tidak valid. Coba penyedia lain.' });
  }
};
