import unittest
from kasir_core import Kasir


class TestKasir(unittest.TestCase):
    def setUp(self):
        self.k = Kasir(':memory:')

    def test_total(self):
        self.assertEqual(Kasir.hitung_total([('A', 5000, 2), ('B', 3000, 1)]), 13000)

    def test_bayar_dan_kembalian(self):
        r = self.k.bayar([('Nasi Goreng', 15000, 1), ('Es Teh', 4000, 2)], 25000)
        self.assertEqual((r['total'], r['kembalian']), (23000, 2000))
        self.assertEqual(self.k.omzet_hari_ini(), (1, 23000))
        self.assertIn('Kembali  Rp2,000', self.k.struk(r['id']))

    def test_uang_kurang(self):
        with self.assertRaises(ValueError):
            self.k.bayar([('Kopi', 6000, 1)], 5000)

    def test_keranjang_kosong(self):
        with self.assertRaises(ValueError):
            self.k.bayar([], 1000)

    def test_tambah_produk(self):
        self.k.tambah_produk('Soto', 12000)
        self.assertEqual(len(self.k.produk()), 9)
        with self.assertRaises(ValueError):
            self.k.tambah_produk('', 1000)


if __name__ == '__main__':
    unittest.main()
