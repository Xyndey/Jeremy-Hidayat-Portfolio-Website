"""Logika inti Kasir Mini (tanpa GUI) dengan SQLite. Dipisah supaya mudah diuji."""
import sqlite3
from datetime import datetime

PRODUK_AWAL = [('Nasi Goreng', 15000), ('Mie Goreng', 13000), ('Ayam Goreng', 14000), ('Roti Bakar', 8000),
               ('Kopi', 6000), ('Es Teh', 4000), ('Air Mineral', 3000), ('Keripik', 5000)]


class Kasir:
    def __init__(self, path='kasir.db'):
        self.db = sqlite3.connect(path)
        self.db.execute('CREATE TABLE IF NOT EXISTS produk(id INTEGER PRIMARY KEY, nama TEXT UNIQUE, harga INTEGER)')
        self.db.execute('CREATE TABLE IF NOT EXISTS penjualan(id INTEGER PRIMARY KEY, waktu TEXT, total INTEGER, bayar INTEGER)')
        self.db.execute('CREATE TABLE IF NOT EXISTS item(penjualan_id INTEGER, nama TEXT, harga INTEGER, qty INTEGER)')
        if self.db.execute('SELECT COUNT(*) FROM produk').fetchone()[0] == 0:
            self.db.executemany('INSERT INTO produk(nama, harga) VALUES(?, ?)', PRODUK_AWAL)
        self.db.commit()

    def produk(self):
        return self.db.execute('SELECT id, nama, harga FROM produk ORDER BY id').fetchall()

    def tambah_produk(self, nama, harga):
        nama = nama.strip()
        if not nama or harga <= 0:
            raise ValueError('Nama wajib diisi dan harga harus lebih dari 0')
        self.db.execute('INSERT INTO produk(nama, harga) VALUES(?, ?)', (nama, int(harga)))
        self.db.commit()

    @staticmethod
    def hitung_total(keranjang):
        """keranjang: daftar (nama, harga, qty)."""
        return sum(h * q for _, h, q in keranjang)

    def bayar(self, keranjang, uang):
        total = self.hitung_total(keranjang)
        if total <= 0:
            raise ValueError('Keranjang masih kosong')
        if uang < total:
            raise ValueError('Uang yang diterima kurang Rp%s' % format(total - uang, ','))
        cur = self.db.execute('INSERT INTO penjualan(waktu, total, bayar) VALUES(?, ?, ?)',
                              (datetime.now().isoformat(timespec='seconds'), total, uang))
        self.db.executemany('INSERT INTO item VALUES(?, ?, ?, ?)', [(cur.lastrowid, n, h, q) for n, h, q in keranjang])
        self.db.commit()
        return {'id': cur.lastrowid, 'total': total, 'kembalian': uang - total}

    def omzet_hari_ini(self):
        hari = datetime.now().date().isoformat()
        n, t = self.db.execute("SELECT COUNT(*), COALESCE(SUM(total), 0) FROM penjualan WHERE waktu LIKE ?", (hari + '%',)).fetchone()
        return n, t

    def struk(self, id_penjualan):
        waktu, total, bayar = self.db.execute('SELECT waktu, total, bayar FROM penjualan WHERE id=?', (id_penjualan,)).fetchone()
        baris = ['KASIR MINI', waktu, '-' * 24]
        for n, h, q in self.db.execute('SELECT nama, harga, qty FROM item WHERE penjualan_id=?', (id_penjualan,)):
            baris.append('%s x%d  Rp%s' % (n, q, format(h * q, ',')))
        baris += ['-' * 24, 'Total    Rp%s' % format(total, ','), 'Tunai    Rp%s' % format(bayar, ','),
                  'Kembali  Rp%s' % format(bayar - total, ','), '', 'Terima kasih!']
        return '\n'.join(baris)
