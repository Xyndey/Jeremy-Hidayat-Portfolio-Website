/* Oxyra: Hidup Berkualitas — konfigurasi & konten */
(function () {
  var P = function (id, cat, name, vol, price, unit, img, badge, desc) { return { id: id, cat: cat, name: name, vol: vol, price: price, unit: unit, img: img, badge: badge, desc: desc, stock: 40 + (id.length * 7) % 30, rating: 4.5 + (id.length % 5) / 10 }; };
  var G = 'assets/galon.jpg', M = 'assets/galon-mini.jpg', B = 'assets/botol.jpg';
  var items = [
    P('mineral', 'Galon Isi Ulang 19L', 'Air Mineral', 'Isi ulang galon 19 liter', 10000, '/ galon', 'assets/p-mineral.svg', 'Mineral', 'Air mineral murni yang segar untuk memenuhi kebutuhan hidrasi harian keluarga.'),
    P('hexagonal', 'Galon Isi Ulang 19L', 'Hexagonal Oxygen', 'Isi ulang galon 19 liter', 15000, '/ galon', 'assets/p-hexagonal.svg', 'Best seller', 'Kaya oksigen dengan struktur molekul heksagonal untuk penyerapan yang lebih baik.'),
    P('alkaline', 'Galon Isi Ulang 19L', 'Air Alkali (Alkaline)', 'Isi ulang galon 19 liter', 25000, '/ galon', G, 'Alkaline', 'Air beralkali dengan pH seimbang untuk menjaga tubuh tetap segar.'),
    P('terahertz', 'Galon Isi Ulang 19L', 'Air Terahertz', 'Isi ulang galon 19 liter', 50000, '/ galon', G, 'Ultra premium', 'Air premium Terahertz untuk hidrasi tingkat tertinggi.'),
    P('paket-hex', 'Paket Galon Baru', 'Hexagonal Oxygen + Galon', 'Galon baru Oxyra 19L + isi', 60000, '/ paket', G, 'Paket galon baru', 'Galon baru Oxyra 19 liter lengkap dengan isi Hexagonal Oxygen.'),
    P('paket-alk', 'Paket Galon Baru', 'Oxyra Alkaline + Galon', 'Galon baru Oxyra 19L + isi', 65000, '/ paket', 'assets/p-paket-alk.svg', 'Terfavorit', 'Galon baru Oxyra 19 liter dengan isi air Alkaline.'),
    P('paket-thz', 'Paket Galon Baru', 'Oxyra Terahertz + Galon', 'Galon baru Oxyra 19L + isi', 70000, '/ paket', G, 'Premium', 'Paket premium galon baru dengan isi air Terahertz.'),
    P('mini-5l', 'Galon Mini 5L', 'Oxyra Alkaline 5L', 'Galon mini praktis', 35000, '/ galon', M, 'Mini 5L', 'Galon mini praktis untuk meja kerja, kamar, atau perjalanan keluarga.'),
    P('botol-330', 'Kemasan Botol', 'Oxyra Alkaline 330ml', '1 dus (24 botol)', 60000, '/ dus', B, '330 ml', 'Botol mungil untuk acara, rapat, dan bekal anak sekolah.'),
    P('botol-500', 'Kemasan Botol', 'Oxyra Alkaline 500ml', '1 dus (24 botol)', 75000, '/ dus', 'assets/p-botol-500.svg', 'Favorit aktif', 'Ukuran favorit untuk olahraga dan aktivitas harian.'),
    P('botol-1l', 'Kemasan Botol', 'Oxyra Alkaline 1000ml', '1 dus (12 botol)', 100000, '/ dus', B, '1 liter', 'Botol 1 liter premium untuk kebutuhan hidrasi lebih banyak.')
  ];
  var post = function (id, title, cat, date, emoji, bg, excerpt, body) { return { id: id, title: title, cat: cat, date: date, author: 'Tim OXYRA', emoji: emoji, bg: bg, excerpt: excerpt, body: body, likes: 15 + id.length }; };
  window.SITE = {
    key: 'oxyra', name: 'OXYRA', tagline: 'Pilihan cerdas, hidup berkualitas.',
    logo: '<img src="assets/logo.jpg" alt="" width="34" height="34">',
    topbar: '<span>Antar setiap hari ke seluruh Batam · Gratis ongkir untuk belanja di atas Rp100.000</span><a href="#/catalog">Belanja sekarang</a>',
    footerText: 'OXYRA Happy Hydration Era: air minum premium dari Batam. Hexagonal Oxygen, Alkaline, dan Terahertz.',
    nav: [['home', 'Beranda'], ['catalog', 'Produk'], ['gallery', 'Galeri'], ['blog', 'Blog'], ['about', 'Tentang'], ['faq', 'FAQ'], ['contact', 'Kontak']],
    wishLabel: 'Favorit', blogTitle: 'Blog Hidrasi', blogSub: 'Tips minum air, gaya hidup aktif, dan kabar OXYRA.', galleryTitle: 'Galeri OXYRA', gallerySub: 'Toko, produk, dan momen Happy Hydration.',
    authTitle: 'Every Drop Has a Purpose', authText: 'Masuk untuk memesan galon, melacak pesanan, dan menyimpan produk favorit.', authPoints: ['Pesan galon & botol dari rumah', 'Antar setiap hari di Batam', 'Voucher khusus pelanggan'], authArt: '💧',
    demoUser: { name: 'Pelanggan Demo', username: 'demo', email: 'demo@oxyra.demo', phone: '081200000003', password: 'Demo1234' },
    contact: { address: 'Toko OXYRA, Batam, Kepulauan Riau (lihat Instagram @oxyrawater.id)', phone: '+62 812-0000-0000', email: 'halo@oxyra.demo', hours: 'Setiap hari 07.00–20.00 WIB', map: [1.1301, 104.0529], topics: ['Pertanyaan produk', 'Pesanan', 'Kemitraan / agen', 'Keluhan', 'Lainnya'] },
    reportTypes: ['Masalah pesanan', 'Kualitas produk', 'Pengantaran', 'Masalah situs', 'Saran', 'Lainnya'], reportLabels: ['Total pesanan', 'Pesanan aktif'],
    catalog: {
      mode: 'buy', title: 'Produk', subtitle: 'Air minum premium: galon isi ulang, paket galon baru, galon mini, dan botol.', noun: 'produk', addLabel: 'Tambah', cartTitle: 'Keranjang', ordersTitle: 'Pesanan saya', ordersEmpty: 'Pesananmu akan tampil di sini.', checkoutTitle: 'Checkout', placeLabel: 'Buat pesanan', docLabel: 'Faktur', idPrefix: 'OXY', thanks: 'Pesananmu tercatat. Selesaikan pembayaran agar segera kami antar.', defaultCity: 'Batam', freeShipOver: 100000,
      items: items, meta: function (p) { return p.vol; }, stockLabel: function (n) { return 'Stok ' + n; },
      specs: function (p) { return [['Kategori', p.cat], ['Kemasan', p.vol], ['Satuan', p.unit.replace('/ ', '')], ['Stok', K.stockOf(p)]]; },
      vouchers: { OXYRA10: { type: 'pct', val: 10, min: 50000, label: 'Diskon 10% terpasang' }, HIDRASI5K: { type: 'flat', val: 5000, min: 30000, label: 'Potongan Rp5.000 terpasang' }, GALONBARU: { type: 'flat', val: 15000, min: 120000, label: 'Potongan Rp15.000 terpasang' } },
      shipping: [{ id: 'ambil', name: 'Ambil di toko', price: 0, eta: 'Siap dalam 1 jam' }, { id: 'reguler', name: 'Antar reguler', price: 8000, eta: 'Hari ini (Batam)' }, { id: 'ekspres', name: 'Antar ekspres', price: 15000, eta: 'Maks. 2 jam' }],
      payments: [{ id: 'transfer', name: 'Transfer bank', desc: 'BCA / Mandiri / BNI', how: 'Transfer ke BCA 123-456-7890 a.n. OXYRA, lalu tekan “Saya sudah bayar”.' }, { id: 'qris', name: 'QRIS', desc: 'Semua dompet digital', how: 'Pindai QRIS yang dikirim kurir atau admin, lalu tekan “Saya sudah bayar”.' }, { id: 'cod', name: 'Bayar di tempat (COD)', desc: 'Tunai saat galon tiba' }],
      flow: { buy: ['Menunggu pembayaran', 'Diproses', 'Selesai'] }
    },
    home: function (K) {
      var I = K.icon, C = K.S.catalog, esc = K.esc;
      return '<section class="hero"><div class="wrap hero-in"><div><span class="eyebrow">Happy Hydration Era</span><h1>Pilihan cerdas, <em>hidup berkualitas.</em></h1><p class="lead">Air minum premium dari Batam: Hexagonal Oxygen, Alkaline, dan Terahertz. Setiap tetes membawa kesegaran, energi, dan kebahagiaan.</p><div class="k-row"><a class="btn btn-primary btn-lg" href="#/catalog">' + I('cart') + ' Pesan sekarang</a><a class="btn btn-ghost btn-lg" href="#/about">Tentang kami</a></div></div><div class="drop-stage" aria-hidden="true"><div class="cube"><div class="face"><img src="assets/logo.jpg" alt=""></div><div class="face back"><img src="assets/logo.jpg" alt=""></div></div></div></div></section>' +
        '<section class="section"><div class="wrap">' + K.sectionHead('Manifesto', 'Every Drop Has a <span style="color:var(--brand)">Purpose.</span>') + '<p class="quote">Kami tidak hanya menjual air minum. Kami membangun budaya baru: Happy Hydration, di mana setiap tetes air menjadi awal dari energi positif, gaya hidup aktif, dan hari yang lebih bahagia.</p><div class="act-grid" style="margin-top:30px">' + [['🏃', 'Running'], ['🏋️', 'Gym / Fitness'], ['🚴', 'Cycling'], ['💼', 'Office / Kerja'], ['👨‍👩‍👧', 'Family']].map(function (a) { return '<div><div class="e">' + a[0] + '</div><b>' + a[1] + '</b></div>'; }).join('') + '</div></div></section>' +
        '<section class="section alt"><div class="wrap">' + K.sectionHead('Produk', 'Pilihan terlaris', 'Harga dan stok langsung dari katalog.', ['#/catalog', 'Semua produk']) + '<div class="grid items">' + [items0(K)[1], items0(K)[5], items0(K)[9], items0(K)[0]].map(K.card).join('') + '</div></div></section>' +
        '<section class="section"><div class="wrap">' + K.sectionHead('Kenapa OXYRA', 'Dibuat untuk hidup yang bergerak') + '<div class="trust">' + [['drop', 'Hidrasi lebih baik', 'Kualitas premium, standar tinggi.'], ['truck', 'Antar setiap hari', 'Ke seluruh Batam.'], ['shield', 'Higienis', 'Galon bersih dan tersegel.'], ['tag', 'Harga jelas', 'Voucher untuk pelanggan.']].map(function (t) { return '<div><div class="ico">' + I(t[0]) + '</div><div><b>' + t[1] + '</b><p class="muted sm" style="margin:0">' + t[2] + '</p></div></div>'; }).join('') + '</div></div></section>' +
        '<section class="section alt"><div class="wrap">' + K.sectionHead('Testimoni', 'Kata pelanggan') + '<div class="grid cols3">' + [['OXYRA selalu jadi pilihan utama keluarga kami. Airnya terasa lebih segar, bersih, dan ringan di tenggorokan.', 'Keluarga Hendra', 'Batam Centre'], ['Setelah rutin minum Oxyra Alkaline, stamina saat lari pagi dan gym lebih terjaga. Botol 500ml praktis dibawa.', 'Rina S.', 'Happy Hydration Member'], ['Pengantaran selalu tepat waktu ke kantor kami di Nagoya. Galon bersih dan higienis.', 'Budi Hartono', 'Nagoya, Batam']].map(function (q) { return '<figure class="card quote-card" style="margin:0"><div class="stars">★★★★★</div><p>“' + esc(q[0]) + '”</p><footer><b>' + q[1] + '</b> · ' + q[2] + '</footer></figure>'; }).join('') + '</div><div class="cta-band"><div><h2>Siap minum lebih baik?</h2><p>Pakai kode <b>OXYRA10</b> untuk diskon 10% (min. Rp50.000).</p></div><a class="btn btn-accent btn-lg" href="#/catalog">Belanja</a></div></div></section>';
    },
    about: {
      title: 'Tentang OXYRA', lead: 'Happy Hydration Era: air premium untuk hidup yang bergerak.',
      text: ['OXYRA adalah merek air minum premium dari Batam dengan varian Hexagonal Oxygen, Alkaline, dan Terahertz dalam kemasan galon 19 liter, galon mini, dan botol.', 'Kami melayani isi ulang dan pengantaran harian ke rumah, kantor, dan komunitas olahraga. Setiap galon dibersihkan dan disegel sebelum dikirim.', 'Situs ini adalah demo toko online OXYRA karya Jeremy Hidayat, siswa RPL yang menjalani PKL di Oxyra Happy Hydration Era. Versi PHP + MySQL-nya memiliki panel admin, voucher, ongkir, dan unggah bukti bayar.'],
      art: '<img src="assets/g-toko.jpg" alt="Toko OXYRA" loading="lazy">',
      stats: [['11', 'Varian produk'], ['3', 'Jenis air premium'], ['Setiap hari', 'Pengantaran'], ['Batam', 'Area layanan']],
      values: [{ icon: 'drop', title: 'Kualitas', text: 'Proses dan standar tinggi pada setiap tetes.' }, { icon: 'truck', title: 'Pelayanan prima', text: 'Pengantaran tepat waktu dengan layanan ramah.' }, { icon: 'heart', title: 'Happy hydration', text: 'Minum air menjadi bagian dari kebahagiaan harian.' }],
      timeline: [['Mulai', 'Isi ulang air mineral di Batam.'], ['Berkembang', 'Varian Hexagonal Oxygen, Alkaline, dan Terahertz.'], ['Sekarang', 'Pesan online, antar harian, dan kemasan botol.']],
      team: [{ name: 'Produksi', role: 'Pengisian & kontrol kualitas', emoji: '🏭', c: 0 }, { name: 'Pengantaran', role: 'Kurir harian', emoji: '🚚', c: 1 }, { name: 'Layanan pelanggan', role: 'Pesanan & keluhan', emoji: '🎧', c: 3 }]
    },
    blog: [
      post('berapa-air', 'Berapa banyak air yang perlu kamu minum setiap hari?', 'Kesehatan', '2026-10-25', '💧', 'linear-gradient(135deg,#22c1c3,#2563eb)', 'Kebutuhan tiap orang berbeda; ini patokan sederhana untuk aktivitas harian.', ['Banyak panduan menyebut sekitar 2 liter per hari, tetapi kebutuhan berubah menurut berat badan, cuaca, dan aktivitas.', '## Tanda tubuh butuh air', 'Haus, urine berwarna pekat, mulut kering, atau mudah lelah.', '## Kebiasaan sederhana', 'Minum segelas setelah bangun, bawa botol sendiri, dan minum sedikit-sedikit sepanjang hari. Untuk kondisi kesehatan tertentu, ikuti saran dokter.']),
      post('alkaline-vs-mineral', 'Air mineral dan air alkaline: apa bedanya?', 'Edukasi', '2026-10-08', '🧪', 'linear-gradient(135deg,#e00080,#7c3aed)', 'Perbedaan pH dan kandungan, serta cara memilih sesuai kebutuhan.', ['Air mineral mengandung mineral alami dengan pH netral. Air alkaline memiliki pH di atas 7.', 'Pilihan terbaik tergantung selera dan kebiasaan. Yang terpenting adalah cukup minum dan memastikan sumber air bersih.']),
      post('hidrasi-olahraga', 'Hidrasi saat olahraga: sebelum, saat, dan sesudah', 'Gaya hidup', '2026-09-20', '🏃', 'linear-gradient(135deg,#f59e0b,#ef4444)', 'Jadwal minum sederhana untuk pelari, pesepeda, dan pengunjung gym.', ['Mulai minum 1–2 jam sebelum latihan, teguk kecil selama latihan, dan lengkapi setelahnya.', 'Botol 500ml adalah ukuran yang praktis dibawa saat olahraga.']),
      post('rawat-galon', 'Cara merawat galon agar tetap higienis', 'Tips', '2026-09-02', '🧼', 'linear-gradient(135deg,#0d9488,#22c55e)', 'Simpan di tempat teduh, bersihkan mulut galon, dan tutup rapat.', ['Letakkan galon jauh dari sinar matahari langsung dan bahan kimia.', 'Cuci tangan sebelum memasang galon dan bersihkan dispenser secara berkala.'])
    ],
    gallery: [
      { cap: 'Toko OXYRA', cat: 'Toko', img: 'assets/g-toko.jpg', h: '3/4' }, { cap: 'Kemasan botol', cat: 'Produk', img: 'assets/g-botol.jpg', h: '16/9' }, { cap: 'Galon 19 liter', cat: 'Produk', img: 'assets/g-galon.jpg', h: '16/9' }, { cap: 'Koleksi galon', cat: 'Produk', img: 'assets/g-koleksi.jpg', h: '9/16' },
      { cap: 'Pengantaran harian', cat: 'Layanan', emoji: '🚚', bg: 'linear-gradient(135deg,#e00080,#7c3aed)', h: '4/3' }, { cap: 'Komunitas lari', cat: 'Komunitas', emoji: '🏃', bg: 'linear-gradient(135deg,#22c1c3,#2563eb)', h: '1/1' }, { cap: 'Happy hydration', cat: 'Komunitas', emoji: '😊', bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', h: '4/3' }
    ],
    faq: [
      { cat: 'Pemesanan', q: 'Bagaimana cara memesan galon?', a: 'Pilih produk di halaman Produk, tambahkan ke keranjang, lalu checkout. Kamu perlu akun; daftar gratis dalam satu menit.' },
      { cat: 'Pemesanan', q: 'Apakah ada minimum pembelian?', a: 'Tidak ada minimum. Gratis ongkir untuk belanja di atas Rp100.000.' },
      { cat: 'Pengiriman', q: 'Ke mana saja pengantaran?', a: 'Seluruh Batam. Pilih ambil di toko, antar reguler (hari ini), atau antar ekspres (maks. 2 jam).' },
      { cat: 'Pengiriman', q: 'Jam berapa pengantaran dilakukan?', a: 'Setiap hari 07.00–20.00 WIB.' },
      { cat: 'Pembayaran', q: 'Metode pembayaran apa yang tersedia?', a: 'Transfer bank, QRIS, dan bayar di tempat (COD).' },
      { cat: 'Pembayaran', q: 'Bagaimana memakai voucher?', a: 'Masukkan kode di halaman keranjang. Contoh: OXYRA10 (diskon 10% min. Rp50.000) atau HIDRASI5K.' },
      { cat: 'Produk', q: 'Apa beda Hexagonal Oxygen, Alkaline, dan Terahertz?', a: 'Ketiganya varian air premium dengan karakter berbeda. Lihat deskripsi tiap produk dan pilih sesuai kebutuhan.' },
      { cat: 'Produk', q: 'Apakah galon bisa ditukar?', a: 'Isi ulang menukar galon kosong dengan galon terisi. Paket galon baru sudah termasuk galon.' },
      { cat: 'Akun', q: 'Saya lupa password, username, atau email.', a: 'Di halaman Masuk tersedia tombol Lupa password, Lupa username, dan Lupa email.' }
    ]
  };
  function items0(K) { return K.S.catalog.items; }
})();
