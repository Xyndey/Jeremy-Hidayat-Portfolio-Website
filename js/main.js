/* =========================================================
   Portofolio Jeremy Hidayat — logika interaktif
   ========================================================= */
(function () {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Penyimpanan aman ---------- */
  const store = {
    get(k, f) { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* abaikan */ } }
  };

  /* ---------- Efek suara 8-bit ---------- */
  let soundOn = store.get("jh-sound", false);
  let actx = null;
  function beep(freq, dur, type, delay) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime + (delay || 0);
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type || "square";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(t); o.stop(t + dur);
    } catch (e) { /* abaikan */ }
  }
  const sfx = {
    click() { beep(520, 0.07); },
    coin() { beep(988, 0.07); beep(1319, 0.18, "square", 0.07); },
    over() { beep(330, 0.15, "sawtooth"); beep(220, 0.15, "sawtooth", 0.15); beep(110, 0.3, "sawtooth", 0.3); },
    unlock() { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.12, "square", i * 0.09)); }
  };
  const soundBtn = $("#soundBtn");
  function paintSound() {
    soundBtn.textContent = soundOn ? "🔊" : "🔇";
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.title = soundOn ? "Matikan suara" : "Nyalakan suara";
  }
  soundBtn.addEventListener("click", () => { soundOn = !soundOn; store.set("jh-sound", soundOn); paintSound(); sfx.click(); });
  paintSound();
  document.addEventListener("click", (e) => { if (e.target.closest("[data-sfx], .btn, .filters button, .icon-btn")) sfx.click(); });

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
  }

  /* ---------- Lencana ---------- */
  let unlocked = store.get("jh-awards", []);
  function renderAwards() {
    $("#awardList").innerHTML = D.achievements.map((a) => {
      const on = unlocked.includes(a.id);
      return `<li class="award pixel-box ${on ? "on" : "locked"}">
        <div class="award__icon" aria-hidden="true">${a.icon}</div>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.text)}</p>
        <span class="sr">${on ? "Terbuka" : "Terkunci"}</span>
      </li>`;
    }).join("");
  }
  function unlock(id) {
    if (unlocked.includes(id)) return;
    unlocked.push(id);
    store.set("jh-awards", unlocked);
    const a = D.achievements.find((x) => x.id === id);
    if (a) { toast(`Lencana terbuka: ${a.title}`); sfx.unlock(); }
    renderAwards();
  }

  /* ---------- Layar pembuka ---------- */
  const loader = $("#loader");
  const fill = $("#loaderFill");
  const startBtn = $("#startBtn");
  function closeLoader() {
    loader.classList.add("done");
    try { sessionStorage.setItem("jh-seen", "1"); } catch (e) { /* abaikan */ }
    unlock("start");
  }
  if (sessionStorage.getItem("jh-seen")) {
    loader.classList.add("done");
  } else {
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + 8 + Math.random() * 14);
      fill.style.width = p + "%";
      if (p >= 100) { clearInterval(iv); startBtn.hidden = false; startBtn.focus(); }
    }, reduceMotion ? 20 : 140);
    startBtn.addEventListener("click", closeLoader);
  }

  /* ---------- Tema siang / malam ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeBtn");
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    themeBtn.textContent = t === "night" ? "🌙" : "☀️";
    themeBtn.title = t === "night" ? "Ganti ke tema siang" : "Ganti ke tema malam";
    const m = $('meta[name="theme-color"]');
    if (m) m.content = t === "night" ? "#1b1630" : "#6cc6f7";
  }
  setTheme(store.get("jh-theme", "night"));
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "night" ? "day" : "night";
    setTheme(next); store.set("jh-theme", next); unlock("night");
  });

  /* ---------- Efek ketik ---------- */
  const typed = $("#typed");
  (function typing() {
    const words = D.roles;
    if (reduceMotion) { typed.textContent = words[0]; return; }
    let w = 0, c = 0, del = false;
    function tick() {
      const word = words[w];
      typed.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; return setTimeout(tick, 300); }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 90);
    }
    tick();
  })();

  /* ---------- Foto: versi piksel ---------- */
  (function pixelPhoto() {
    const img = $("#photo"), cv = $("#photoPixel"), wrap = $("#photoWrap");
    function draw() {
      const n = 40;
      cv.width = n; cv.height = n;
      const ctx = cv.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, n, n);
      // kuantisasi warna agar terasa 16-bit
      try {
        const d = ctx.getImageData(0, 0, n, n);
        for (let i = 0; i < d.data.length; i += 4) {
          d.data[i] = Math.round(d.data[i] / 48) * 48;
          d.data[i + 1] = Math.round(d.data[i + 1] / 48) * 48;
          d.data[i + 2] = Math.round(d.data[i + 2] / 48) * 48;
        }
        ctx.putImageData(d, 0, 0);
      } catch (e) { /* abaikan */ }
    }
    if (img.complete) draw(); else img.addEventListener("load", draw);
    wrap.tabIndex = 0;
    wrap.setAttribute("role", "button");
    wrap.setAttribute("aria-label", "Tampilkan versi piksel foto");
    const toggle = () => wrap.classList.toggle("px");
    wrap.addEventListener("click", toggle);
    wrap.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  })();

  /* ---------- Render konten ---------- */
  const P = D.profile;
  $("#bio").innerHTML = P.bio.map((t) => `<p>${esc(t)}</p>`).join("");
  $("#sheet").innerHTML = [
    ["Nama", P.name], ["Kelas", P.kelas], ["Sekolah", P.sekolah],
    ["Lokasi", P.lokasi], ["Status", P.status]
  ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  $("#stats").innerHTML = D.stats.map((s) => `
    <div class="stat">
      <div class="stat__top"><span>${esc(s.name)}</span><span>${s.value}/100</span></div>
      <div class="bar" role="img" aria-label="${esc(s.name)} ${s.value} dari 100"><span data-w="${s.value}"></span></div>
    </div>`).join("");
  $("#inventory").innerHTML = D.inventory.map((i) => `<li class="item" tabindex="0"><span class="item__tile"><img src="assets/tech/${esc(i.i)}.svg" alt="" width="48" height="48" loading="lazy"></span><span class="item__name">${esc(i.n)}</span></li>`).join("");

  $("#timeline").innerHTML = D.journey.map((j) => `
    <li class="pixel-box panel ${j.current ? "current" : ""}">
      <p class="timeline__when">${esc(j.when)}</p>
      <h3>${esc(j.title)}</h3>
      <p>${esc(j.text)}</p>
    </li>`).join("");

  $("#xpList").innerHTML = D.pengalaman.map((x) => `
    <li class="pixel-box panel xp ${x.current ? "current" : ""}">
      <img class="xp__img" src="${esc(x.image)}" alt="${esc(x.org)}" loading="lazy" width="96" height="96">
      <div><p class="timeline__when">${esc(x.when)}${x.current ? " · sekarang" : ""}</p><h3>${esc(x.role)}</h3><p class="xp__org">${esc(x.org)}</p><p>${esc(x.text)}</p></div>
    </li>`).join("");
  $("#prList").innerHTML = D.prestasi.map((p) => `
    <li class="pixel-box pr">
      <img class="pr__img" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" width="320" height="200">
      <div class="pr__body">${p.sample ? '<span class="pr__tag">Contoh, ganti dengan data asli</span>' : ""}<p class="timeline__when">${esc(p.year)} · ${esc(p.place)}</p><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>
    </li>`).join("");

  const C = D.config;
  const ICON = (n) => `<img class="ico" src="assets/icons/${n}.svg" alt="" width="32" height="32">`;
  const social = [["github", "GitHub", C.github], ["linkedin", "LinkedIn", C.linkedin], ["instagram", "Instagram", C.instagram], ["tiktok", "TikTok", C.tiktok], ["facebook", "Facebook", C.facebook]].filter((x) => x[2]);
  const socialHtml = social.map(([n, t, h]) => `<li><a href="${esc(h)}" target="_blank" rel="noopener" aria-label="${t}" title="${t}">${ICON(n)}</a></li>`).join("");
  $("#heroSocial").innerHTML = socialHtml; $("#footSocial").innerHTML = socialHtml;
  const links = social.map(([n, t, h]) => [ICON(n), t === "GitHub" ? "GitHub: Xyndey" : t, h]);
  if (C.whatsapp) links.unshift(['<span class="ico ico--emoji" aria-hidden="true">💬</span>', "WhatsApp", "https://wa.me/" + C.whatsapp]);
  if (C.email) links.unshift(['<span class="ico ico--emoji" aria-hidden="true">✉️</span>', "Email", "mailto:" + C.email]);
  $("#links").innerHTML = links.map(([i, t, h]) => `<li><a href="${esc(h)}" target="_blank" rel="noopener">${i}<span>${esc(t)}</span></a></li>`).join("");
  const K = D.pkl;
  $("#pkl").innerHTML = `<div class="pkl__logo"><img src="${esc(K.logo)}" alt="Logo ${esc(K.brand)}" width="160" height="200"></div>
    <div class="pkl__text"><p class="status"><span class="status__dot"></span> Quest saat ini</p><p class="pkl__role">${esc(K.divisi)}</p><h3>PKL di ${esc(K.company)}</h3><p>${esc(K.text)}</p><p class="pkl__tag">${esc(K.tagline)}</p>
    <a class="btn btn--gold" href="projects/oxyra/index.html" data-sfx>Lihat website Oxyra</a></div>`;
  $("#year").textContent = new Date().getFullYear();

  renderAwards();

  /* ---------- Proyek: filter, cari, modal ---------- */
  let activeCat = "Semua", query = "";
  const grid = $("#projectGrid");
  const filtersEl = $("#filters");

  filtersEl.innerHTML = D.categories.map((c, i) => {
    const n = c === "Semua" ? D.projects.length : D.projects.filter((p) => p.cat === c || p.style === c).length;
    return `<button role="tab" aria-selected="${i === 0}" data-cat="${esc(c)}">${esc(c)} (${n})</button>`;
  }).join("");

  function renderProjects() {
    const q = query.trim().toLowerCase();
    const list = D.projects.map((p, i) => ({ p, i })).filter(({ p }) =>
      (activeCat === "Semua" || p.cat === activeCat || p.style === activeCat) &&
      (!q || (p.title + " " + p.short + " " + p.stack.join(" ") + " " + p.cat + " " + p.style).toLowerCase().includes(q))
    );
    grid.innerHTML = list.map(({ p, i }) => `
      <button class="proj" data-i="${i}" aria-haspopup="dialog">
        <div class="proj__thumb">
          <img src="${esc(p.image)}" alt="Gambar proyek ${esc(p.title)}" loading="lazy" width="480" height="270">
          <span class="chip proj__cat style-${esc(p.style)}">${esc(p.style)}</span>
        </div>
        <div class="proj__body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.short)}</p>
          <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        </div>
      </button>`).join("");
    $("#count").textContent = `Menampilkan ${list.length} dari ${D.projects.length} proyek`;
    $("#empty").hidden = list.length > 0;
  }
  filtersEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-cat]");
    if (!b) return;
    activeCat = b.dataset.cat;
    $$("button", filtersEl).forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    renderProjects();
  });
  $("#search").addEventListener("input", (e) => { query = e.target.value; renderProjects(); });
  renderProjects();

  const modal = $("#modal");
  let lastFocus = null;
  const opened = new Set(store.get("jh-opened", []));
  function openModal(i) {
    const p = D.projects[i];
    lastFocus = document.activeElement;
    $("#mImg").src = p.image; $("#mImg").alt = "Gambar proyek " + p.title;
    $("#mTitle").textContent = p.title;
    $("#mCat").textContent = p.style + " · " + p.cat;
    $("#mTech").innerHTML = `<div><dt>Front-end</dt><dd>${esc(p.front)}</dd></div><div><dt>Back-end</dt><dd>${esc(p.back)}</dd></div>`;
    $("#mDesc").textContent = p.desc;
    $("#mFeat").innerHTML = p.features.map((f) => `<li>${esc(f)}</li>`).join("");
    $("#mStack").innerHTML = p.stack.map((s) => `<li>${esc(s)}</li>`).join("");
    const demo = $("#mDemo"), repo = $("#mRepo");
    if (p.demo) { demo.href = p.demo; demo.removeAttribute("aria-disabled"); demo.textContent = "Lihat demo"; }
    else { demo.removeAttribute("href"); demo.setAttribute("aria-disabled", "true"); demo.textContent = "Demo segera hadir"; }
    repo.href = p.repo || D.config.github;
    repo.textContent = p.repo ? "Kode di GitHub" : "GitHub saya";
    repo.title = repo.href;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("#mClose").focus();
    sfx.coin();
    opened.add(i); store.set("jh-opened", Array.from(opened));
    if (opened.size >= 3) unlock("hunter");
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  grid.addEventListener("click", (e) => { const c = e.target.closest(".proj"); if (c) openModal(+c.dataset.i); });
  $("#mClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") { // jaga fokus tetap di dalam modal
      const f = $$("button, a[href]", modal).filter((x) => !x.hasAttribute("hidden"));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Efek miring 3D pada kartu ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest && e.target.closest(".proj, #photoWrap, .pkl");
      if (!el) return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${(-y * 9).toFixed(2)}deg) rotateY(${(x * 11).toFixed(2)}deg) translateZ(8px)`;
    });
    document.addEventListener("pointerout", (e) => {
      const el = e.target.closest && e.target.closest(".proj, #photoWrap, .pkl");
      if (el && !el.contains(e.relatedTarget)) el.style.transform = "";
    });
  }

  /* ---------- Navigasi ---------- */
  const burger = $("#burger"), menu = $("#menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  }
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  const toTop = $("#toTop");
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  window.addEventListener("scroll", () => { toTop.hidden = window.scrollY < 600; }, { passive: true });

  /* ---------- Pengamat bagian: sorot menu, isi bar, lencana ---------- */
  const visited = new Set(store.get("jh-visited", []));
  const sections = $$("[data-section]");
  const navLinks = $$("a", menu);
  const seenObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.id;
      navLinks.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
      if (id === "skills") $$("#stats .bar span").forEach((s) => { s.style.width = s.dataset.w + "%"; });
      visited.add(id);
      store.set("jh-visited", Array.from(visited));
      if (sections.every((s) => visited.has(s.id))) unlock("explore");
    });
  }, { threshold: 0.35 });
  sections.forEach((s) => seenObs.observe(s));

  /* ---------- Formulir kontak ---------- */
  const form = $("#form"), err = $("#formErr");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = form.nama.value.trim(), kontak = form.kontak.value.trim(), pesan = form.pesan.value.trim();
    if (!nama || !kontak || pesan.length < 10) {
      err.hidden = false;
      err.textContent = !nama ? "Isi nama kamu dulu." : !kontak ? "Isi email atau nomor WhatsApp supaya saya bisa membalas." : "Pesan terlalu pendek. Tulis minimal 10 karakter.";
      return;
    }
    err.hidden = true;
    const body = `Halo Jeremy, saya ${nama}.\n\n${pesan}\n\nKontak saya: ${kontak}`;
    if (C.email) {
      window.location.href = `mailto:${C.email}?subject=${encodeURIComponent("Pesan dari portofolio: " + nama)}&body=${encodeURIComponent(body)}`;
    } else if (C.whatsapp) {
      window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(body)}`, "_blank", "noopener");
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(body).then(() => toast("Pesan disalin. Tempel di kontak yang kamu pilih."), () => toast("Salin gagal. Pilih dan salin pesan secara manual."));
    } else {
      toast("Email dan WhatsApp belum diatur di js/data.js.");
    }
    sfx.coin();
    form.reset();
  });

  /* ---------- Mini game Snake ---------- */
  (function snake() {
    const cv = $("#snake"), ctx = cv.getContext("2d");
    const N = 16, S = cv.width / N;
    let body, dir, next, apple, score, timer, running = false;
    let best = store.get("jh-best", 0);
    $("#best").textContent = best;

    function spawn() {
      do { apple = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
      while (body.some((b) => b.x === apple.x && b.y === apple.y));
    }
    function cell(x, y, color) { ctx.fillStyle = color; ctx.fillRect(x * S + 1, y * S + 1, S - 2, S - 2); }
    function draw(msg) {
      ctx.fillStyle = "#0e1a14"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#14281e";
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if ((i + j) % 2) ctx.fillRect(i * S, j * S, S, S);
      if (body) {
        cell(apple.x, apple.y, "#ff5d8f");
        body.forEach((b, i) => cell(b.x, b.y, i === 0 ? "#b8ff8f" : "#5ad66f"));
      }
      if (msg) {
        ctx.fillStyle = "#000a"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = "#ffc83d"; ctx.font = "16px 'Press Start 2P', monospace"; ctx.textAlign = "center";
        msg.split("\n").forEach((l, i) => ctx.fillText(l, cv.width / 2, cv.height / 2 + i * 28 - 8));
      }
    }
    function end() {
      running = false; clearInterval(timer);
      if (score > best) { best = score; store.set("jh-best", best); $("#best").textContent = best; }
      sfx.over();
      draw("Game over");
      $("#playBtn").textContent = "Main lagi";
    }
    function step() {
      dir = next;
      const h = { x: body[0].x + dir.x, y: body[0].y + dir.y };
      if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || body.some((b) => b.x === h.x && b.y === h.y)) return end();
      body.unshift(h);
      if (h.x === apple.x && h.y === apple.y) {
        score++; $("#score").textContent = score; sfx.coin();
        if (score >= 5) unlock("snake");
        spawn();
        clearInterval(timer); timer = setInterval(step, Math.max(60, 140 - score * 6));
      } else body.pop();
      draw();
    }
    function start() {
      body = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
      dir = next = { x: 1, y: 0 }; score = 0; $("#score").textContent = 0;
      spawn(); running = true; draw();
      clearInterval(timer); timer = setInterval(step, 140);
      $("#playBtn").textContent = "Ulangi";
    }
    function turn(name) {
      const m = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[name];
      if (!m || !running) return;
      if (m.x === -dir.x && m.y === -dir.y) return; // tidak boleh berbalik
      next = m;
    }
    $("#playBtn").addEventListener("click", start);
    $$(".dpad button").forEach((b) => b.addEventListener("click", () => turn(b.dataset.dir)));
    const keys = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
    document.addEventListener("keydown", (e) => {
      if (!running || !modal.hidden) return;
      const d = keys[e.key];
      if (d) { e.preventDefault(); turn(d); }
    });
    let sx, sy;
    cv.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    cv.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
      turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    }, { passive: true });
    // jeda otomatis jika arcade keluar dari layar
    new IntersectionObserver((en) => { if (!en[0].isIntersecting && running) end(); }, { threshold: 0 }).observe(cv);
    draw("Tekan Main");
  })();

  /* ---------- Kode Konami ---------- */
  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kpos = 0;
  document.addEventListener("keydown", (e) => {
    kpos = e.key === konami[kpos] ? kpos + 1 : (e.key === konami[0] ? 1 : 0);
    if (kpos === konami.length) {
      kpos = 0;
      document.body.classList.toggle("rainbow");
      unlock("konami");
      toast("Mode pelangi aktif. Masukkan kode lagi untuk mematikan.");
    }
  });
})();
