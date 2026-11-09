"""Back-end Absensi Digital: Python 3 murni (http.server + SQLite). Jalankan: python server.py"""
import csv, io, json, os, sqlite3, sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', 'projects'))
DB = os.environ.get('ABSENSI_DB', os.path.join(HERE, 'absensi.db'))
PORT = int(os.environ.get('PORT', 3002))
STATUS = ('Hadir', 'Izin', 'Sakit', 'Alpa')
MIME = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png'}

def db():
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    c.execute('CREATE TABLE IF NOT EXISTS students(name TEXT PRIMARY KEY)')
    c.execute('CREATE TABLE IF NOT EXISTS attendance(student TEXT, date TEXT, status TEXT, PRIMARY KEY(student, date))')
    if c.execute('SELECT COUNT(*) FROM students').fetchone()[0] == 0:
        c.executemany('INSERT INTO students VALUES(?)', [(n,) for n in 'Andi Budi Citra Dewi Eko Fajar Gita Hana Irfan Joko'.split()])
        c.commit()
    return c

class H(BaseHTTPRequestHandler):
    def _json(self, code, obj):
        data = json.dumps(obj).encode()
        self.send_response(code); self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(data))); self.end_headers(); self.wfile.write(data)
    def _body(self):
        n = min(int(self.headers.get('Content-Length') or 0), 100000)
        try: return json.loads(self.rfile.read(n) or b'{}')
        except ValueError: return {}
    def do_GET(self):
        u = urlparse(self.path); p = u.path; A = '/absensi/api'
        if p == A + '/health': return self._json(200, {'ok': True})
        if p == A + '/students':
            with db() as c: return self._json(200, [r['name'] for r in c.execute('SELECT name FROM students ORDER BY rowid')])
        if p == A + '/attendance':
            d = parse_qs(u.query).get('date', [''])[0]
            with db() as c: return self._json(200, {r['student']: r['status'] for r in c.execute('SELECT * FROM attendance WHERE date=?', (d,))})
        if p == A + '/export.csv':
            out = io.StringIO(); w = csv.writer(out); w.writerow(['Nama', 'Tanggal', 'Status'])
            with db() as c:
                for r in c.execute('SELECT student,date,status FROM attendance ORDER BY date,student'): w.writerow(list(r))
            data = out.getvalue().encode()
            self.send_response(200); self.send_header('Content-Type', 'text/csv; charset=utf-8')
            self.send_header('Content-Disposition', 'attachment; filename="rekap-absensi.csv"'); self.end_headers(); return self.wfile.write(data)
        if p.startswith(A): return self._json(404, {'error': 'Endpoint tidak ada'})
        return self._static(p)
    def do_POST(self):
        if urlparse(self.path).path == '/absensi/api/students':
            name = str(self._body().get('name', '')).strip()[:40]
            if not name: return self._json(400, {'error': 'Nama wajib diisi'})
            with db() as c: c.execute('INSERT OR IGNORE INTO students VALUES(?)', (name,))
            return self._json(201, {'ok': True})
        self._json(404, {'error': 'Endpoint tidak ada'})
    def do_PUT(self):
        if urlparse(self.path).path == '/absensi/api/attendance':
            b = self._body(); s, d, st = b.get('student'), b.get('date'), b.get('status')
            if st not in STATUS or not s or not d: return self._json(400, {'error': 'Data tidak valid'})
            with db() as c: c.execute('INSERT OR REPLACE INTO attendance VALUES(?,?,?)', (s, d, st))
            return self._json(200, {'ok': True})
        self._json(404, {'error': 'Endpoint tidak ada'})
    def do_DELETE(self):
        p = urlparse(self.path).path; pre = '/absensi/api/students/'
        if p.startswith(pre):
            n = unquote(p[len(pre):])
            with db() as c:
                c.execute('DELETE FROM students WHERE name=?', (n,)); c.execute('DELETE FROM attendance WHERE student=?', (n,))
            return self._json(200, {'ok': True})
        self._json(404, {'error': 'Endpoint tidak ada'})
    def _static(self, p):
        if p.endswith('/'): p += 'index.html'
        f = os.path.normpath(os.path.join(ROOT, p.lstrip('/')))
        if not f.startswith(ROOT) or os.sep + 'server' + os.sep in f or not os.path.isfile(f):
            self.send_response(404); self.end_headers(); return self.wfile.write(b'Tidak ditemukan')
        data = open(f, 'rb').read()
        self.send_response(200); self.send_header('Content-Type', MIME.get(os.path.splitext(f)[1], 'application/octet-stream')); self.end_headers(); self.wfile.write(data)
    def log_message(self, *a): pass

if __name__ == '__main__':
    print(f'Absensi: http://localhost:{PORT}/absensi/')
    ThreadingHTTPServer(('', PORT), H).serve_forever()
