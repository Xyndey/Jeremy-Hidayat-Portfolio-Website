# Extras: contoh back-end terpisah

Folder ini berisi back-end opsional dari versi awal. Demo di folder `projects/` **tidak** membutuhkannya.
Semua back-end menyajikan folder `projects/` dan menyediakan API di `/<nama-proyek>/api/...`.

| Folder | Bahasa | Jalankan | Buka |
|---|---|---|---|
| backend-e-kantin-node | Node.js | `node server.js` | http://localhost:3001/e-kantin/ |
| backend-flappy-node | Node.js | `node server.js` | http://localhost:3004/flappy-pixel/ |
| backend-absensi-python | Python 3 + SQLite | `python server.py` | http://localhost:3002/absensi/ |
| backend-batam-java | Java 11+ | `java Server.java` | http://localhost:3003/batam-explorer/ |
| desktop-kasir-python | Python + Tkinter + SQLite | `python app.py` | (aplikasi desktop) |

Jalankan perintah dari dalam masing-masing folder. API-nya bisa dicoba dengan curl atau Postman;
halaman demo di `projects/` berjalan sendiri dengan localStorage dan belum memanggil API ini.
Logika kasir diuji dengan `python -m unittest` di folder desktop-kasir-python.
