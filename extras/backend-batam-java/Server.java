// Back-end Batam Explorer: Java murni (com.sun.net.httpserver), tanpa library tambahan.
// Jalankan dari folder ini:  java Server.java   (butuh JDK 11 atau lebih baru)
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

public class Server {
    static class Place {
        final String name, cat, icon, desc;
        Place(String n, String c, String i, String d) { name = n; cat = c; icon = i; desc = d; }
    }

    static final List<Place> PLACES = Arrays.asList(
        new Place("Jembatan Barelang", "Wisata", "🌉", "Rangkaian jembatan yang menghubungkan Batam dengan pulau-pulau di sekitarnya. Cocok untuk berfoto dan menikmati pemandangan laut."),
        new Place("Masjid Raya Batam", "Wisata", "🕌", "Masjid besar di pusat kota dengan arsitektur megah. Terbuka untuk dikunjungi di luar waktu ibadah."),
        new Place("Vihara Duta Maitreya", "Wisata", "🏯", "Vihara besar dengan patung dan taman yang tertata. Pengunjung diharapkan berpakaian sopan."),
        new Place("Pantai Nongsa", "Pantai", "🏖️", "Pantai di sisi timur Batam yang dekat dengan area resor. Enak untuk menikmati sore hari."),
        new Place("Mega Mall Batam Centre", "Belanja", "🛍️", "Pusat perbelanjaan di kawasan Batam Centre dengan banyak pilihan toko dan tempat makan."),
        new Place("Nagoya Hill Mall", "Belanja", "🏬", "Mal besar di kawasan Nagoya, tempat nongkrong dan belanja favorit warga."),
        new Place("Gonggong", "Kuliner", "🐚", "Siput laut rebus khas Kepulauan Riau, biasanya disajikan dengan sambal."),
        new Place("Otak-otak", "Kuliner", "🍢", "Olahan ikan berbumbu yang dibakar dalam daun kelapa. Cocok jadi oleh-oleh."),
        new Place("Mie Lendir", "Kuliner", "🍜", "Mi dengan kuah kental berbumbu yang populer sebagai sarapan di Batam.")
    );

    static final Path ROOT = Path.of("..", "..", "projects").toAbsolutePath().normalize();
    static final Path FAV = Path.of("favorites.txt");

    static String esc(String s) { return s.replace("\\", "\\\\").replace("\"", "\\\""); }

    static Set<String> favorites() throws IOException {
        if (!Files.exists(FAV)) return new LinkedHashSet<>();
        return new LinkedHashSet<>(Files.readAllLines(FAV, StandardCharsets.UTF_8));
    }

    static String placesJson(String cat, String q) {
        String needle = q.toLowerCase();
        return "[" + PLACES.stream()
            .filter(p -> (cat.isEmpty() || cat.equals("Semua") || p.cat.equals(cat)) && (p.name + " " + p.desc).toLowerCase().contains(needle))
            .map(p -> "{\"name\":\"" + esc(p.name) + "\",\"cat\":\"" + p.cat + "\",\"icon\":\"" + p.icon + "\",\"desc\":\"" + esc(p.desc) + "\"}")
            .collect(Collectors.joining(",")) + "]";
    }

    static Map<String, String> query(String raw) {
        Map<String, String> m = new HashMap<>();
        if (raw == null) return m;
        for (String kv : raw.split("&")) {
            int i = kv.indexOf('=');
            if (i > 0) m.put(kv.substring(0, i), URLDecoder.decode(kv.substring(i + 1), StandardCharsets.UTF_8));
        }
        return m;
    }

    static void send(HttpExchange ex, int code, String type, byte[] data) throws IOException {
        ex.getResponseHeaders().set("Content-Type", type);
        ex.sendResponseHeaders(code, data.length);
        ex.getResponseBody().write(data);
        ex.close();
    }

    static void json(HttpExchange ex, int code, String body) throws IOException {
        send(ex, code, "application/json; charset=utf-8", body.getBytes(StandardCharsets.UTF_8));
    }

    static String mime(String f) {
        if (f.endsWith(".html")) return "text/html; charset=utf-8";
        if (f.endsWith(".css")) return "text/css";
        if (f.endsWith(".js")) return "text/javascript";
        if (f.endsWith(".png")) return "image/png";
        if (f.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }

    static void handle(HttpExchange ex) throws IOException {
        String path = ex.getRequestURI().getPath(), A = "/batam-explorer/api";
        String method = ex.getRequestMethod();
        if (path.equals(A + "/health")) { json(ex, 200, "{\"ok\":true}"); return; }
        if (path.equals(A + "/places") && method.equals("GET")) {
            Map<String, String> q = query(ex.getRequestURI().getRawQuery());
            json(ex, 200, placesJson(q.getOrDefault("cat", ""), q.getOrDefault("q", ""))); return;
        }
        if (path.equals(A + "/favorites") && method.equals("GET")) {
            json(ex, 200, "[" + favorites().stream().map(n -> "\"" + esc(n) + "\"").collect(Collectors.joining(",")) + "]"); return;
        }
        if (path.startsWith(A + "/favorites/") && method.equals("POST")) {
            String name = URLDecoder.decode(path.substring((A + "/favorites/").length()), StandardCharsets.UTF_8);
            if (PLACES.stream().noneMatch(p -> p.name.equals(name))) { json(ex, 404, "{\"error\":\"Tempat tidak ditemukan\"}"); return; }
            Set<String> f = favorites();
            boolean now = f.add(name);
            if (!now) f.remove(name);
            Files.write(FAV, f, StandardCharsets.UTF_8);
            json(ex, 200, "{\"favorite\":" + now + "}"); return;
        }
        if (path.startsWith(A)) { json(ex, 404, "{\"error\":\"Endpoint tidak ada\"}"); return; }
        if (path.endsWith("/")) path += "index.html";
        Path file = ROOT.resolve(path.substring(1)).normalize();
        if (!file.startsWith(ROOT) || file.toString().contains(java.io.File.separator + "server" + java.io.File.separator) || !Files.isRegularFile(file)) {
            send(ex, 404, "text/plain; charset=utf-8", "Tidak ditemukan".getBytes(StandardCharsets.UTF_8)); return;
        }
        send(ex, 200, mime(file.toString()), Files.readAllBytes(file));
    }

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "3003"));
        HttpServer s = HttpServer.create(new InetSocketAddress(port), 0);
        s.createContext("/", ex -> {
            try { handle(ex); } catch (Exception e) { try { json(ex, 500, "{\"error\":\"Kesalahan server\"}"); } catch (IOException ignored) { } }
        });
        s.start();
        System.out.println("Batam Explorer: http://localhost:" + port + "/batam-explorer/");
    }
}
