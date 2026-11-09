"""Kasir Mini: aplikasi desktop (Tkinter + SQLite). Jalankan: python app.py
Tkinter sudah termasuk di instalasi Python untuk Windows dan macOS."""
import tkinter as tk
from tkinter import messagebox, simpledialog
from kasir_core import Kasir

BG, PANEL, CREAM, GOLD = '#1b1630', '#2a2352', '#fff4d6', '#ffc83d'


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title('Kasir Mini - Jeremy Hidayat')
        self.configure(bg=BG)
        self.geometry('820x520')
        self.kasir = Kasir()
        self.keranjang = {}  # nama -> [harga, qty]
        self._ui()
        self._muat_produk()
        self._segarkan()

    def _ui(self):
        fnt = ('Consolas', 12)
        kiri = tk.Frame(self, bg=BG)
        kiri.pack(side='left', fill='both', expand=True, padx=12, pady=12)
        tk.Label(kiri, text='Produk', bg=BG, fg=GOLD, font=('Consolas', 14, 'bold')).pack(anchor='w')
        self.grid_produk = tk.Frame(kiri, bg=BG)
        self.grid_produk.pack(fill='both', expand=True)
        tk.Button(kiri, text='+ Produk baru', command=self._produk_baru, bg=PANEL, fg=CREAM, font=fnt).pack(anchor='w', pady=6)
        kanan = tk.Frame(self, bg=PANEL)
        kanan.pack(side='right', fill='y', padx=12, pady=12)
        tk.Label(kanan, text='Transaksi', bg=PANEL, fg=GOLD, font=('Consolas', 14, 'bold')).pack(anchor='w', padx=10, pady=6)
        self.daftar = tk.Listbox(kanan, width=34, height=14, bg=BG, fg=CREAM, font=fnt, selectbackground=GOLD)
        self.daftar.pack(padx=10)
        self.lbl_total = tk.Label(kanan, text='Total Rp0', bg=PANEL, fg=CREAM, font=('Consolas', 14, 'bold'))
        self.lbl_total.pack(anchor='w', padx=10, pady=6)
        tk.Button(kanan, text='Kurangi item terpilih', command=self._kurangi, bg=PANEL, fg=CREAM, font=fnt).pack(padx=10, anchor='w')
        self.entry = tk.Entry(kanan, font=fnt)
        self.entry.pack(padx=10, pady=6, fill='x')
        tk.Label(kanan, text='Uang diterima', bg=PANEL, fg=CREAM, font=fnt).pack(anchor='w', padx=10)
        tk.Button(kanan, text='Bayar dan cetak struk', command=self._bayar, bg=GOLD, fg=BG, font=('Consolas', 12, 'bold')).pack(padx=10, pady=8, fill='x')
        self.lbl_omzet = tk.Label(kanan, text='', bg=PANEL, fg=CREAM, font=fnt)
        self.lbl_omzet.pack(padx=10, pady=4, anchor='w')

    def _muat_produk(self):
        for w in self.grid_produk.winfo_children():
            w.destroy()
        for i, (_, nama, harga) in enumerate(self.kasir.produk()):
            tk.Button(self.grid_produk, text='%s\nRp%s' % (nama, format(harga, ',')), width=14, height=3, bg=PANEL, fg=CREAM,
                      command=lambda n=nama, h=harga: self._tambah(n, h)).grid(row=i // 3, column=i % 3, padx=4, pady=4)

    def _tambah(self, nama, harga):
        self.keranjang.setdefault(nama, [harga, 0])[1] += 1
        self._segarkan()

    def _kurangi(self):
        pilih = self.daftar.curselection()
        if not pilih:
            return
        nama = list(self.keranjang)[pilih[0]]
        self.keranjang[nama][1] -= 1
        if self.keranjang[nama][1] <= 0:
            del self.keranjang[nama]
        self._segarkan()

    def _data(self):
        return [(n, h, q) for n, (h, q) in self.keranjang.items()]

    def _segarkan(self):
        self.daftar.delete(0, 'end')
        for n, h, q in self._data():
            self.daftar.insert('end', '%s x%d  Rp%s' % (n, q, format(h * q, ',')))
        self.lbl_total.config(text='Total Rp%s' % format(Kasir.hitung_total(self._data()), ','))
        jumlah, total = self.kasir.omzet_hari_ini()
        self.lbl_omzet.config(text='Hari ini: %d transaksi\nOmzet Rp%s' % (jumlah, format(total, ',')))

    def _bayar(self):
        try:
            hasil = self.kasir.bayar(self._data(), int(self.entry.get() or 0))
        except ValueError as e:
            messagebox.showwarning('Gagal', str(e))
            return
        messagebox.showinfo('Struk', self.kasir.struk(hasil['id']))
        self.keranjang.clear()
        self.entry.delete(0, 'end')
        self._segarkan()

    def _produk_baru(self):
        nama = simpledialog.askstring('Produk baru', 'Nama produk:', parent=self)
        harga = simpledialog.askinteger('Produk baru', 'Harga (Rp):', parent=self, minvalue=1)
        if nama and harga:
            try:
                self.kasir.tambah_produk(nama, harga)
                self._muat_produk()
            except Exception as e:
                messagebox.showwarning('Gagal', str(e))


if __name__ == '__main__':
    App().mainloop()
