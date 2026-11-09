// Frontend dua mode: memakai REST API Express bila tersedia, jika tidak memakai localStorage (demo statis).
const $ = s => document.querySelector(s)
const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const ALPHABET = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const rnd = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => ALPHABET[b % ALPHABET.length]).join('')
const TOKENS = 'pendekin:tokens', DEMO = 'pendekin:links'
const tokens = () => { try { return JSON.parse(localStorage.getItem(TOKENS) || '{}') } catch { return {} } }
const validUrl = raw => { try { const u = new URL(raw.trim()); return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null } catch { return null } }

let api = false
async function detect() { try { const r = await fetch('health', { headers: { accept: 'application/json' } }); const j = await r.json(); api = j.ok === true; return j.storage } catch { api = false; return null } }

const demo = {
  list: () => { try { return JSON.parse(localStorage.getItem(DEMO) || '[]') } catch { return [] } },
  save: l => localStorage.setItem(DEMO, JSON.stringify(l)),
}
const shortUrl = slug => api ? `${location.origin}/${slug}` : `${location.href.split('#')[0]}#${slug}`

async function listLinks() { if (api) return (await fetch('api/links')).json(); return demo.list() }
async function createLink(url, slug) {
  if (api) { const r = await fetch('api/links', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url, slug }) }); const j = await r.json(); if (!r.ok) throw new Error(j.error); const t = tokens(); t[j.slug] = j.ownerToken; localStorage.setItem(TOKENS, JSON.stringify(t)); return j }
  if (slug && !/^[A-Za-z0-9_-]{3,32}$/.test(slug)) throw new Error('Alias 3–32 karakter (huruf, angka, - atau _).')
  const all = demo.list(); let s = slug; if (s) { if (all.some(l => l.slug === s)) throw new Error('Alias sudah dipakai.') } else { do s = rnd(); while (all.some(l => l.slug === s)) }
  const l = { slug: s, url, clicks: 0, createdAt: new Date().toISOString() }; demo.save([l, ...all]); return l
}
async function removeLink(slug) {
  if (api) { const r = await fetch('api/links/' + encodeURIComponent(slug), { method: 'DELETE', headers: { 'x-owner-token': tokens()[slug] || '' } }); if (!r.ok) throw new Error((await r.json()).error); return }
  demo.save(demo.list().filter(l => l.slug !== slug))
}

async function render() {
  const links = await listLinks(); $('#empty').classList.toggle('hidden', links.length > 0)
  $('#list').innerHTML = links.map(l => `<li class="card flex flex-wrap items-center gap-3 !p-4">
    <div class="min-w-0 flex-1"><a class="font-bold text-teal-600 hover:underline dark:text-teal-400" href="${esc(shortUrl(l.slug))}" target="_blank" rel="noopener">${esc(shortUrl(l.slug))}</a><p class="truncate text-xs text-slate-500">${esc(l.url)}</p></div>
    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-slate-800">${l.clicks} klik</span>
    <button class="btn-o" data-copy="${esc(shortUrl(l.slug))}">Salin</button><button class="btn-o !text-rose-600" data-del="${esc(l.slug)}" aria-label="Hapus ${esc(l.slug)}">Hapus</button></li>`).join('')
}
const showError = m => { const e = $('#error'); e.textContent = m; e.classList.toggle('hidden', !m) }

$('#form').addEventListener('submit', async e => {
  e.preventDefault(); showError('')
  const url = validUrl($('#url').value); if (!url) return showError('Masukkan URL yang valid (http:// atau https://).')
  $('#submit').disabled = true
  try {
    const l = await createLink(url, $('#slug').value.trim()); const s = shortUrl(l.slug)
    $('#result').classList.remove('hidden'); $('#result').innerHTML = `<p class="text-sm text-slate-500">Tautan pendekmu</p><p class="mt-1 break-all text-xl font-extrabold text-teal-600 dark:text-teal-400">${esc(s)}</p><div class="mt-3 flex gap-2"><button class="btn" data-copy="${esc(s)}">Salin tautan</button><a class="btn-o" href="${esc(s)}" target="_blank" rel="noopener">Buka</a></div>`
    $('#url').value = ''; $('#slug').value = ''; await render()
  } catch (er) { showError(er.message) }
  $('#submit').disabled = false
})
document.addEventListener('click', async e => {
  const c = e.target.closest('[data-copy]'); if (c) { try { await navigator.clipboard.writeText(c.dataset.copy); const t = c.textContent; c.textContent = 'Tersalin ✓'; setTimeout(() => (c.textContent = t), 1200) } catch { prompt('Salin tautan:', c.dataset.copy) } }
  const d = e.target.closest('[data-del]'); if (d && confirm('Hapus tautan ini?')) { try { await removeLink(d.dataset.del); await render() } catch (er) { showError(er.message) } }
})
// Mode demo: buka tautan pendek lewat hash (#alias)
function followHash() { const s = decodeURIComponent(location.hash.slice(1)); if (!s || api) return; const all = demo.list(), l = all.find(x => x.slug === s); if (l) { l.clicks++; demo.save(all); location.replace(l.url) } }

const storage = await detect()
if (!api) { $('#mode').classList.remove('hidden'); $('#mode').textContent = 'Mode demo: tautan disimpan di browser ini. Jalankan server Node.js (npm start) untuk API, pengalihan nyata, dan PostgreSQL.'; followHash(); addEventListener('hashchange', followHash) }
else if (storage === 'memory') { $('#mode').classList.remove('hidden'); $('#mode').textContent = 'Server berjalan dengan penyimpanan memori. Isi DATABASE_URL untuk PostgreSQL.' }
await render()
