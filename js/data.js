/* =========================================================
   DATA PORTOFOLIO: edit file ini untuk mengganti isi web.
   "repo" = nama repositori di github.com/Xyndey/<repo>. Kosong = tombol GitHub mengarah ke profil Xyndey.
   ========================================================= */
window.PORTFOLIO = {
  config: {
    github: "https://github.com/Xyndey",
    email: "",   // isi emailmu, contoh: "nama@gmail.com" (belum diisi)
    whatsapp: "6285891533569",
    instagram: "https://www.instagram.com/xyndeyyyyy",
    linkedin: "https://www.linkedin.com/in/jeremy-hidayat-93146a377",
    tiktok: "https://www.tiktok.com/@jeremyhidayat",
    facebook: "https://www.facebook.com/share/1BuM9xjG31/"
  },

  roles: ["Siswa RPL", "Web Developer", "UI/UX Enthusiast", "Game Dev Pemula"],

  profile: {
    name: "Jeremy Hidayat",
    kelas: "XII RPL 2",
    sekolah: "SMK Negeri 7 Batam",
    lokasi: "Batam, Kepulauan Riau",
    status: "PKL di bagian produksi",
    bio: [
      "Halo, saya Jeremy Hidayat, siswa kelas XII jurusan Rekayasa Perangkat Lunak (RPL 2) di SMK Negeri 7 Batam.",
      "Saya suka membuat aplikasi web yang rapi, cepat, dan enak dipakai. Saya juga tertarik pada desain antarmuka, game piksel 2D, dan tampilan 3D, karena di situ logika dan seni bertemu.",
      "Saat ini saya sedang menjalani PKL di PT Tera Tirta Batam Sejahtera (Oxyra Happy Hydration Era) di bagian produksi untuk menambah pengalaman kerja nyata."
    ]
  },

  pkl: {
    company: "PT Tera Tirta Batam Sejahtera / Oxyra Happy Hydration Era",
    brand: "OXYRA",
    tagline: "Pilihan Cerdas, Hidup Berkualitas",
    divisi: "Bagian Produksi",
    text: "Saat ini saya menjalani PKL di bagian produksi: belajar alur kerja produksi air minum dari persiapan sampai pengemasan dan menjaga mutunya. Di luar jam produksi, saya mengerjakan website Oxyra yang ada di daftar proyek.",
    logo: "assets/oxyra-logo.png"
  },

  stats: [
    { name: "HTML & CSS", value: 90 },
    { name: "JavaScript", value: 75 },
    { name: "PHP & Laravel", value: 70 },
    { name: "MySQL", value: 70 },
    { name: "Git & GitHub", value: 75 },
    { name: "UI/UX (Figma)", value: 65 },
    { name: "Tailwind CSS", value: 80 },
    { name: "TypeScript", value: 70 },
    { name: "React", value: 70 },
    { name: "Vue.js", value: 65 },
    { name: "Angular", value: 55 },
    { name: "Node.js", value: 60 },
    { name: "Supabase", value: 65 },
    { name: "PostgreSQL", value: 65 }
  ],

  inventory: [
    { n: "HTML5", i: "html" }, { n: "CSS3", i: "css" }, { n: "JavaScript", i: "js" },
    { n: "PHP", i: "php" }, { n: "Laravel", i: "laravel" }, { n: "MySQL", i: "mysql" },
    { n: "Git", i: "git" }, { n: "GitHub", i: "github" }, { n: "UI/UX Figma", i: "figma" },
    { n: "React", i: "react" }, { n: "TypeScript", i: "typescript" }, { n: "Tailwind CSS", i: "tailwind" }, { n: "Supabase", i: "supabase" }, { n: "PostgreSQL", i: "postgresql" }, { n: "Vue.js", i: "vue" }, { n: "Angular", i: "angular" }, { n: "Node.js", i: "nodejs" }
  ],

  categories: ["Semua", "3D", "Piksel", "2D", "Game", "AI & API"],

  projects: [
    { title: "Pixel Quest To-Do", slug: "quest-todo", cat: "Web", style: "Piksel",
      short: "To-do list yang mengubah tugas jadi quest dengan XP dan level.",
      desc: "Setiap quest punya tingkat: ringan 5 XP, sedang 10 XP, berat 20 XP. Setiap 50 XP kamu naik level dan gelarmu berubah. Quest bisa diubah, difilter, dan data tersimpan di browser.",
      features: ["Tambah, ubah, selesaikan, dan hapus quest", "Prioritas ringan, sedang, berat dengan XP berbeda", "Filter semua, aktif, selesai plus statistik", "Gelar level dan reset progres"],
      front: "HTML, CSS, JavaScript", back: "Tidak ada (localStorage)", stack: ["HTML", "CSS", "JavaScript"] },
    { title: "E-Kantin Sekolah", slug: "e-kantin", cat: "Web", style: "Piksel",
      short: "Pemesanan menu kantin lengkap dengan keranjang dan mode penjual.",
      desc: "Pilih menu, masukkan ke keranjang, lalu pesan dan dapatkan kode. Mode penjual bisa menandai pesanan yang sudah siap diambil.",
      features: ["Katalog menu dengan pencarian", "Keranjang dengan tombol tambah dan kurang plus catatan pesanan", "Kode pesanan unik dan status Diproses, Siap, Diambil", "Mode penjual: hapus pesanan dan rekap pendapatan"],
      front: "HTML, CSS, JavaScript", back: "Tidak ada (localStorage)", stack: ["HTML", "CSS", "JavaScript"] },
    { title: "Absensi Digital", slug: "absensi", cat: "Web", style: "Piksel",
      short: "Catat kehadiran siswa per tanggal dan unduh rekapnya sebagai CSV.",
      desc: "Tandai tiap siswa Hadir, Izin, Sakit, atau Alpa untuk tanggal yang dipilih. Ringkasan jumlah tampil otomatis dan rekap bisa diunduh untuk dibuka di Excel.",
      features: ["Status per siswa dan tanggal", "Tombol semua hadir dan pencarian siswa", "Persentase kehadiran per siswa", "Ekspor CSV"],
      front: "HTML, CSS, JavaScript", back: "Tidak ada (localStorage)", stack: ["HTML", "CSS", "JavaScript"] },
    { title: "Batam Explorer 3D", slug: "batam-explorer", cat: "Web", style: "3D",
      short: "Carousel 3D tempat wisata, belanja, dan kuliner Batam.",
      desc: "Putar carousel 3D untuk menjelajahi tempat menarik di Batam, filter kategori, cari lewat kata kunci, simpan favorit, dan buka lokasinya di Google Maps.",
      features: ["Carousel 3D dengan CSS transform", "Filter, pencarian, dan favorit", "Tautan ke Google Maps", "Navigasi keyboard"],
      front: "HTML, CSS 3D, JavaScript", back: "Tidak ada (localStorage)", stack: ["HTML", "CSS 3D", "JavaScript"] },
    { title: "Snake Retro", slug: "snake-retro", cat: "Game", style: "Piksel",
      short: "Game ular klasik dengan kecepatan bertahap dan rekor tersimpan.",
      desc: "Dibuat dengan HTML Canvas. Kecepatan naik seiring skor, rekor tersimpan di browser, dan bisa dimainkan dengan keyboard atau geser layar.",
      features: ["Kontrol keyboard, tombol arah di layar, dan geser", "Mode dinding tembus atau mematikan", "Tombol jeda dan efek suara 8-bit", "Rekor tersimpan"],
      front: "HTML Canvas, JavaScript", back: "Tidak ada (localStorage)", stack: ["JavaScript", "Canvas"] },
    { title: "Flappy Pixel", slug: "flappy-pixel", cat: "Game", style: "Piksel",
      short: "Burung piksel terbang melewati pipa dengan fisika gravitasi.",
      desc: "Menerapkan game loop, gravitasi, deteksi tabrakan, dan gambar sprite langsung di canvas tanpa file gambar.",
      features: ["Tiga tingkat kesulitan", "Medali perunggu, perak, emas", "Jeda dengan tombol P dan efek suara", "Rekor tersimpan"],
      front: "HTML Canvas, JavaScript", back: "Tidak ada (localStorage)", stack: ["JavaScript", "Canvas"] },
    { title: "Cuaca 3D", slug: "cuaca-3d", cat: "AI & API", style: "3D",
      short: "Cuaca terkini dan ramalan 5 hari dengan adegan berlapis 3D.",
      desc: "Ketik nama kota untuk melihat suhu, kelembapan, angin, dan ramalan 5 hari. Latar berubah menurut siang, malam, dan hujan, dan adegan bergerak mengikuti kursor.",
      features: ["Pencarian kota dengan riwayat", "Tombol lokasi saya", "Ramalan 5 hari dan ganti °C/°F", "Latar siang, malam, hujan dengan efek 3D"],
      front: "HTML, CSS 3D, JavaScript", back: "API publik Open-Meteo (REST)", stack: ["JavaScript", "CSS 3D", "REST API"] },
    { title: "Kasir Mini", slug: "kasir-mini", cat: "Web", style: "Piksel",
      short: "Kasir sederhana dengan kembalian, struk, dan omzet harian.",
      desc: "Pilih produk, masukkan uang yang diterima, lalu sistem menghitung kembalian dan membuat struk yang bisa dicetak. Riwayat dan omzet hari ini tersimpan di browser.",
      features: ["Keranjang, diskon persen, dan kembalian", "Tombol uang pas dan pecahan cepat", "Struk siap cetak dan omzet harian", "Riwayat transaksi dengan ekspor CSV"],
      front: "HTML, CSS, JavaScript", back: "Tidak ada (localStorage)", stack: ["HTML", "CSS", "JavaScript"] },
    { title: "Habit Tracker", slug: "habit-tracker", cat: "Web", style: "Piksel",
      short: "Lacak kebiasaan harian dengan streak. Bisa dipasang seperti aplikasi.",
      desc: "Tandai kebiasaan yang sudah dilakukan hari ini dan jaga streak beruntunmu. Berupa PWA, jadi bisa dipasang di layar utama ponsel dan dibuka tanpa internet.",
      features: ["Streak harian dan rekor streak terbaik", "Persentase 30 hari dan progres hari ini", "Ganti nama kebiasaan (klik dua kali)", "PWA: bisa dipasang dan offline"],
      front: "HTML, CSS, JavaScript, PWA", back: "Tidak ada (localStorage)", stack: ["JavaScript", "PWA", "Service Worker"] },

    { title: "Catur 3D", slug: "catur-3d", cat: "Game", style: "3D",
      short: "Catur dengan papan 3D, aturan lengkap, dan lawan komputer.",
      desc: "Papan 3D dibuat murni dengan CSS transform dan bisa diputar. Aturan lengkap: rokade, en passant, promosi, skak, skakmat, dan pat. Mesin catur diuji dengan perft dan punya 4 tingkat lawan.",
      features: ["Papan 3D yang bisa diputar dan dimiringkan", "Rokade, en passant, dan promosi", "Lawan komputer 4 tingkat", "Urungkan langkah dan daftar langkah"],
      front: "HTML, CSS 3D transform, JavaScript", back: "Mesin catur dan AI minimax di browser", stack: ["JavaScript", "CSS 3D", "Minimax"] },
    { title: "JerAI: Asisten AI", slug: "web-ai", cat: "AI & API", style: "3D",
      short: "Chatbot portofolio dengan orb 3D, bisa memakai Claude API lewat Vercel.",
      desc: "JerAI menghubungkan satu halaman chat ke banyak AI lewat fungsi serverless di Vercel. Kunci API disimpan di server (file .env atau Environment Variables), tidak pernah ke browser. Penyedia yang belum diisi kuncinya otomatis nonaktif, dan JerAI tetap menjawab dari data portofolio.",
      features: ["Pilih Claude, ChatGPT, Gemini, DeepSeek, Blackbox, atau Grok", "Mode bandingkan: pertanyaan sama ke semua AI aktif", "Mode Tentang Jeremy atau Umum, jawaban lokal bila offline", "Riwayat tersimpan, salin, ulangi, dan unduh .txt", "Lampiran: kamera, foto, file teks/kode, dan plugin (waktu, kalkulator, Wikipedia, cuaca, data portofolio)", "Mikrofon (suara ke teks) dan Think harder (menalar lalu memeriksa ulang)"],
      front: "HTML, CSS 3D, JavaScript", back: "Vercel Serverless Function (Node.js) + Claude API", stack: ["JavaScript", "Node.js", "Claude API"] },

    { title: "Oxyra: Hidup Berkualitas", slug: "oxyra", repo: "oxyra-website", cat: "Web", style: "2D",
      short: "Toko air minum premium Oxyra dengan keranjang, voucher, dan checkout.",
      desc: "Website Oxyra dengan katalog produk, keranjang, voucher, checkout, dan riwayat pesanan. Login dengan username/email, daftar akun, dan lupa username/email/password; blog, galeri, FAQ, kontak, laporan, pengaturan, dan pencarian. Data tersimpan di browser (demo statis, email dan pembayaran disimulasikan). Akun demo: demo / Demo1234. Kode PHP asli ada di repositori GitHub.",
      features: ["Katalog, keranjang, voucher, dan checkout", "Login, daftar, dan pemulihan akun", "Blog, galeri, FAQ, kontak, dan laporan", "Pengaturan tema gelap dan ukuran huruf"],
      front: "HTML, CSS, JavaScript", back: "Tidak ada (localStorage); PHP + MySQL di repositori", stack: ["JavaScript", "CSS", "PHP", "MySQL"] },



    { title: "Pustaka Nusantara (Perpustakaan)", slug: "perpustakaan", repo: "perpustakaan", cat: "Web", style: "2D",
      short: "Perpustakaan digital: katalog buku, keranjang pinjam, checkout, dan denda otomatis.",
      desc: "Cari buku, masukkan ke keranjang pinjam (maksimal 3 buku, 7 hari), checkout peminjaman, lihat denda keterlambatan, dan tampilkan kartu anggota digital. Akun demo: demo / Demo1234 (pengguna) dan admin / Admin1234 (admin). Data tersimpan di browser pada mode demo, atau di Supabase (PostgreSQL) bila dikonfigurasi.",
      features: ["Katalog, pencarian, dan keranjang pinjam", "Denda keterlambatan otomatis", "Login pengguna/admin dan pemulihan akun", "Blog, galeri, FAQ, kontak, laporan, pengaturan"],
      front: "React 18, TypeScript, Tailwind CSS, Vite", back: "Supabase (PostgreSQL) atau localStorage; skema MySQL tersedia", stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "MySQL"] },
    { title: "RentGo Batam (Rental Mobil)", slug: "rental-mobil", repo: "rental-mobil", cat: "Web", style: "2D",
      short: "Sewa mobil online: pilih armada, atur tanggal, sopir, voucher, dan checkout.",
      desc: "Pilih mobil, tentukan tanggal, lokasi jemput, dan opsi sopir, pakai voucher BATAM10, lalu checkout dan pantau pesanan. Akun demo: demo / Demo1234 (pengguna) dan admin / Admin1234 (admin). Data tersimpan di browser pada mode demo, atau di Supabase (PostgreSQL) bila dikonfigurasi.",
      features: ["8 armada dengan hitung biaya otomatis", "Opsi sopir, lokasi jemput, dan voucher", "Dasbor admin: katalog, pesanan, pengguna", "Blog, galeri, FAQ, kontak, laporan"],
      front: "React 18, TypeScript, Tailwind CSS, Vite", back: "Supabase (PostgreSQL) atau localStorage; skema MySQL tersedia", stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "MySQL"] },
    { title: "JurusanKu (Jurusan Kuliah)", slug: "jurusan-kuliah", repo: "jurusan-kuliah", cat: "Web", style: "2D",
      short: "Jelajahi 10 jurusan, ikuti tes minat, dan kirim daftar pilihan ke konselor.",
      desc: "Lihat prospek karier, gaji awal, dan lama studi tiap jurusan, ikuti tes minat, simpan sampai 3 pilihan, lalu ajukan konsultasi. Akun demo: demo / Demo1234 (pengguna) dan admin / Admin1234 (admin). Data tersimpan di browser pada mode demo, atau di Supabase (PostgreSQL) bila dikonfigurasi.",
      features: ["10 jurusan dengan data prospek", "Tes minat dengan rekomendasi jurusan", "Daftar pilihan dan pengajuan konsultasi", "Login, blog, galeri, FAQ, laporan"],
      front: "React 18, TypeScript, Tailwind CSS, Vite", back: "Supabase (PostgreSQL) atau localStorage; skema MySQL tersedia", stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "MySQL"] },
    { title: "BelajarKu (Flashcard & Latihan Soal)", slug: "belajar", repo: "belajar", cat: "Web", style: "2D",
      short: "Flashcard, latihan soal berpembahasan, dan rencana belajar mingguan.",
      desc: "Hafalkan dengan flashcard interaktif, uji pemahaman lewat latihan soal 6 mata pelajaran, simpan skor, dan aktifkan rencana belajar. Akun demo: demo / Demo1234 (pengguna) dan admin / Admin1234 (admin). Data tersimpan di browser pada mode demo, atau di Supabase (PostgreSQL) bila dikonfigurasi.",
      features: ["Flashcard balik kartu dan penanda hafal", "Latihan soal dengan pembahasan dan skor", "Rencana belajar lewat checkout", "Hasil tersimpan di halaman Hasil Laporan"],
      front: "React 18, TypeScript, Tailwind CSS, Vite", back: "Supabase (PostgreSQL) atau localStorage; skema MySQL tersedia", stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "MySQL"] },
    { title: "Bankira Digital (Bank)", slug: "bank", repo: "bank", cat: "Web", style: "2D",
      short: "Perbankan digital demo: produk, pengajuan, transfer, mutasi, dan simulasi cicilan.",
      desc: "Ajukan produk bank, transfer antar-nasabah dengan PIN, lihat mutasi (unduh CSV), dan hitung cicilan kredit atau hasil deposito. Seluruh data fiktif. Akun demo: demo / Demo1234 (pengguna) dan admin / Admin1234 (admin). Data tersimpan di browser pada mode demo, atau di Supabase (PostgreSQL) bila dikonfigurasi.",
      features: ["Transfer dan saldo (fungsi server di Supabase)", "Mutasi rekening dan ekspor CSV", "Simulasi kredit dan deposito", "Pengajuan produk lewat keranjang dan checkout"],
      front: "React 18, TypeScript, Tailwind CSS, Vite", back: "Supabase (PostgreSQL) atau localStorage; skema MySQL tersedia", stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "MySQL"] },
    { title: "Ruang BK (Bimbingan Konseling)", slug: "bk", repo: "bk", cat: "Web", style: "2D",
      short: "Jadwal konseling, laporan anonim, check-in suasana hati, dan tes gaya belajar.",
      desc: "Pilih layanan konseling, jadwalkan sesi, kirim laporan secara anonim, catat suasana hati harian, dan kenali gaya belajar. Akun demo: demo / Demo1234 (pengguna) dan admin / Admin1234 (admin). Data tersimpan di browser pada mode demo, atau di Supabase (PostgreSQL) bila dikonfigurasi.",
      features: ["Jadwal konseling lewat keranjang dan checkout", "Laporan anonim dan pelacak status", "Check-in suasana hati dengan grafik", "Tes gaya belajar"],
      front: "React 18, TypeScript, Tailwind CSS, Vite", back: "Supabase (PostgreSQL) atau localStorage; skema MySQL tersedia", stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "MySQL"] },

    { title: "TaskFlow (Kanban)", slug: "task-flow", repo: "task-flow", cat: "Web", style: "2D",
      short: "Papan kanban drag & drop untuk mengatur tugas.",
      desc: "Papan kanban dengan tiga kolom, drag & drop, prioritas, tenggat, pencarian, dan bar progres. Data tersimpan di browser.",
      features: ["Drag & drop antar kolom", "Prioritas dan tenggat (lewat tenggat ditandai)", "Pencarian dan bar progres", "Mode gelap otomatis"],
      front: "Vue 3 (Composition API), TypeScript, Tailwind CSS, Vite", back: "localStorage", stack: ["Vue.js", "TypeScript", "Tailwind CSS"] },
    { title: "KasirWarung (POS)", slug: "kasir-warung", repo: "kasir-warung", cat: "Web", style: "2D",
      short: "Kasir warung: pilih menu, diskon, bayar, cetak struk.",
      desc: "Aplikasi kasir dengan katalog menu, keranjang, diskon persen, hitung kembalian, riwayat hari ini, dan struk yang bisa dicetak.",
      features: ["Keranjang dan diskon persen", "Kembalian otomatis dan tombol uang pas", "Struk cetak", "Riwayat transaksi harian"],
      front: "Vue 3, TypeScript, Tailwind CSS, Vite", back: "localStorage", stack: ["Vue.js", "TypeScript", "Tailwind CSS"] },
    { title: "DuitKu (Keuangan Pribadi)", slug: "duit-ku", repo: "duit-ku", cat: "Web", style: "2D",
      short: "Catat pemasukan dan pengeluaran dengan grafik donat dan anggaran.",
      desc: "Pencatat keuangan dengan filter bulan, ringkasan saldo, diagram donat pengeluaran per kategori (SVG), batas anggaran, dan ekspor CSV.",
      features: ["Diagram donat SVG", "Anggaran bulanan dengan peringatan", "Filter bulan dan ekspor CSV", "Kategori pemasukan/pengeluaran"],
      front: "Vue 3, TypeScript, Tailwind CSS, Vite", back: "localStorage", stack: ["Vue.js", "TypeScript", "Tailwind CSS"] },
    { title: "PollingKelas (Polling Real-time)", slug: "polling-kelas", repo: "polling-kelas", cat: "Web", style: "2D",
      short: "Buat polling dan lihat hasil langsung, dengan Supabase Realtime.",
      desc: "Polling dengan satu suara per pemilih, hasil persentase langsung, dan sinkron antar-tab (mode demo) atau antar-perangkat (Supabase).",
      features: ["Satu suara per pemilih (constraint unik di PostgreSQL)", "Pembaruan real-time", "Mode demo tanpa konfigurasi", "Skema SQL + RLS siap pakai"],
      front: "Vue 3, TypeScript, Tailwind CSS, Supabase JS", back: "Supabase (PostgreSQL + Realtime) atau localStorage", stack: ["Vue.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"] },
    { title: "QuizKode (Kuis Pemrograman)", slug: "quiz-kode", repo: "quiz-kode", cat: "Web", style: "2D",
      short: "Kuis JavaScript, HTML/CSS, dan Git dengan timer dan pembahasan.",
      desc: "Kuis tiga topik dengan timer 20 detik per soal, pembahasan tiap jawaban, tinjauan hasil, dan skor terbaik tersimpan.",
      features: ["3 topik, 15 soal berpembahasan", "Timer per soal", "Tinjauan jawaban dan skor terbaik", "Signals dan control flow Angular 18"],
      front: "Angular 18 (standalone, signals), TypeScript, Tailwind CSS", back: "localStorage", stack: ["Angular", "TypeScript", "Tailwind CSS"] },
    { title: "DashboardToko (Dasbor Penjualan)", slug: "dashboard-toko", repo: "dashboard-toko", cat: "Web", style: "2D",
      short: "Dasbor penjualan dengan grafik batang, tabel, urut, dan ekspor CSV.",
      desc: "Dasbor dengan KPI, grafik batang SVG per bulan, produk terlaris, tabel transaksi dengan pencarian, pengurutan, paginasi, dan ekspor CSV.",
      features: ["KPI dan grafik batang SVG", "Tabel: cari, urut, paginasi", "Filter periode 3/6/12 bulan", "Ekspor CSV"],
      front: "Angular 18, TypeScript, Tailwind CSS", back: "Data contoh acak (seed tetap)", stack: ["Angular", "TypeScript", "Tailwind CSS"] },
    { title: "FocusTimer (Pomodoro)", slug: "focus-timer", repo: "focus-timer", cat: "Web", style: "2D",
      short: "Timer Pomodoro dengan daftar tugas dan statistik mingguan.",
      desc: "Timer fokus/istirahat dengan cincin progres, tugas aktif, hitung pomodoro per tugas, statistik 7 hari, dan durasi yang dapat diatur.",
      features: ["Cincin progres SVG dan bunyi notifikasi", "Tugas aktif dengan hitung pomodoro", "Statistik 7 hari", "Durasi dapat diatur"],
      front: "React 18, TypeScript, Tailwind CSS, Vite", back: "localStorage", stack: ["React", "TypeScript", "Tailwind CSS"] },
    { title: "CatatanKu (Catatan Markdown)", slug: "catatan-ku", repo: "catatan-ku", cat: "Web", style: "2D",
      short: "Catatan Markdown dengan tag, pencarian, sematkan, dan ekspor.",
      desc: "Editor catatan dengan pratinjau Markdown (parser aman tanpa dangerouslySetInnerHTML), tag, pencarian, sematkan, dan ekspor .md.",
      features: ["Parser Markdown aman", "Tag, pencarian, dan sematkan", "Ekspor .md", "Hitung kata"],
      front: "React 18, TypeScript, Tailwind CSS, Vite", back: "localStorage", stack: ["React", "TypeScript", "Tailwind CSS"] },
    { title: "ChatRuang (Obrolan Real-time)", slug: "chat-ruang", repo: "chat-ruang", cat: "Web", style: "2D",
      short: "Obrolan multi-ruang real-time dengan Supabase Realtime.",
      desc: "Obrolan dengan tiga ruang, pembatas kecepatan kirim, pembaruan real-time lewat Supabase (PostgreSQL) atau antar-tab pada mode demo.",
      features: ["3 ruang obrolan", "Real-time (Supabase / BroadcastChannel)", "Batas kirim dan panjang pesan", "Skema SQL + RLS siap pakai"],
      front: "React 18, TypeScript, Tailwind CSS, Supabase JS", back: "Supabase (PostgreSQL + Realtime) atau localStorage", stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"] },
    { title: "Pendek.in (Pemendek URL)", slug: "pendek-in", repo: "pendek-in", cat: "Web", style: "2D",
      short: "Pemendek URL dengan REST API Node.js + Express + PostgreSQL.",
      desc: "Pemendek tautan: alias kustom, pengalihan 302, hitung klik, token pemilik untuk hapus, validasi URL (hanya http/https), dan pembatas laju. Demo statis memakai localStorage.",
      features: ["REST API Express + uji integrasi", "PostgreSQL (atau memori)", "Validasi URL dan pembatas laju", "Demo statis otomatis tanpa server"],
      front: "HTML, JavaScript, Tailwind CSS", back: "Node.js, Express, PostgreSQL (pg)", stack: ["Node.js", "Express", "PostgreSQL", "Tailwind CSS", "JavaScript"] },
    { title: "Album Lagu: Level Up", slug: "album-lagu", cat: "Musik", style: "3D",
      short: "Album 6 lagu chiptune orisinal dengan carousel 3D dan visualizer.",
      desc: "Semua nada dibuat langsung oleh kode lewat Web Audio API, jadi tidak memakai rekaman atau lirik milik orang lain. Ada pemutar lengkap, piringan hitam 3D, dan visualizer.",
      features: ["6 lagu instrumental orisinal dengan carousel 3D dan visualizer", "Tempel tautan Spotify atau YouTube Music untuk memutar lewat pemutar resmi", "Koleksi tersimpan di browser dan pencarian cepat ke Spotify dan YouTube Music", "Acak, ulang, posisi lagu, dan pintasan keyboard"],
      front: "HTML, CSS 3D, JavaScript", back: "Web Audio API (nada dibuat oleh kode)", stack: ["JavaScript", "Web Audio", "CSS 3D"] }
  ],

  /* PRESTASI & PENGALAMAN. "image" boleh diisi alamat gambar (https://...) atau file di assets/prestasi/.
     Entri bertanda sample:true hanyalah CONTOH: ganti dengan prestasi aslimu, lalu hapus sample:true. */
  prestasi: [
    { title: "29 proyek web dirilis", year: "2026", place: "Portofolio pribadi", text: "Membangun dan merilis 29 proyek: game piksel, 3D, aplikasi web React + TypeScript, dan sistem dengan login, keranjang, serta dasbor admin.", image: "assets/prestasi/proyek.svg" },
    { title: "Peserta PKL industri", year: "2026", place: "PT Tera Tirta Batam Sejahtera / Oxyra", text: "Terpilih menjalani Praktik Kerja Lapangan di bagian produksi sebuah perusahaan air minum.", image: "assets/prestasi/pkl.svg" },
    { title: "Nama lomba / penghargaan", year: "2025", place: "Penyelenggara", text: "Contoh: Juara 2 Lomba Web Design tingkat kota. Isi dengan prestasi asli (lomba, olimpiade, sertifikat, beasiswa).", image: "assets/prestasi/contoh1.svg", sample: true },
    { title: "Sertifikat kompetensi", year: "2025", place: "Lembaga penerbit", text: "Contoh: Sertifikat Dasar Pemrograman Web. Tambahkan foto sertifikat lewat field image.", image: "assets/prestasi/contoh2.svg", sample: true }
  ],
  pengalaman: [
    { role: "Praktik Kerja Lapangan (PKL), Bagian Produksi", org: "PT Tera Tirta Batam Sejahtera / Oxyra Happy Hydration Era", when: "2026 – sekarang", text: "Mempelajari alur produksi air minum dari persiapan sampai pengemasan dan menjaga mutu. Di luar jam produksi mengerjakan website Oxyra.", image: "assets/oxyra-logo.png", current: true },
    { role: "Siswa Rekayasa Perangkat Lunak (RPL)", org: "SMK Negeri 7 Batam", when: "2024 – sekarang", text: "Belajar pemrograman web, basis data, dan UI/UX; mengerjakan proyek kelas dan portofolio pribadi.", image: "assets/prestasi/sekolah.svg" },
    { role: "Web Developer (proyek pribadi)", org: "Mandiri", when: "2024 – sekarang", text: "Membuat 29 proyek memakai HTML, CSS, JavaScript, PHP, Laravel, MySQL, React, TypeScript, Tailwind CSS, Supabase, dan PostgreSQL.", image: "assets/prestasi/proyek.svg" }
  ],

  journey: [
    { when: "2024", title: "Masuk SMK Negeri 7 Batam", text: "Memulai jurusan Rekayasa Perangkat Lunak dan belajar dasar pemrograman." },
    { when: "2025", title: "Kelas XI", text: "Belajar web dinamis, basis data, dan mengerjakan proyek-proyek kelas." },
    { when: "2026", title: "Kelas XII dan PKL", text: "Sedang PKL di bagian produksi PT Tera Tirta Batam Sejahtera / Oxyra Happy Hydration Era, sambil menyiapkan portofolio ini.", current: true }
  ],

  achievements: [
    { id: "start", icon: "🎮", title: "Pemain baru", text: "Menekan tombol mulai." },
    { id: "explore", icon: "🧭", title: "Penjelajah", text: "Membuka semua bagian halaman." },
    { id: "hunter", icon: "🔍", title: "Pemburu proyek", text: "Membuka detail 3 proyek." },
    { id: "snake", icon: "🐍", title: "Jago ular", text: "Mencetak 5 poin di mini game." },
    { id: "night", icon: "🌙", title: "Pengguna malam", text: "Mengganti tema siang dan malam." },
    { id: "konami", icon: "🕹️", title: "Kode rahasia", text: "Memasukkan kode Konami." }
  ]
};

// Nilai turunan: gambar sampul dan link demo mengikuti slug
var C_GH = window.PORTFOLIO.config.github;
window.PORTFOLIO.projects.forEach(function (p) {
  p.image = "assets/projects/" + p.slug + ".png";
  p.demo = "projects/" + p.slug + "/index.html";
  p.repo = p.repo ? C_GH + "/" + p.repo : "";
});
