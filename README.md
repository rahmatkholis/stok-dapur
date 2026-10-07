# Stok Dapur — versi 1 yang dipulihkan

Paket portabel dari versi Stok Dapur yang sedang online setelah rollback pada 7 Oktober 2026. Versi ini menjadi acuan sebelum pembaruan pasca-audit yang dibatalkan pengguna.

## Jalankan di komputer

Prasyarat: Python 3. Tidak perlu npm install atau database server.

```sh
python3 -m http.server 8080 --directory dist
```

Buka http://localhost:8080. Pada Windows, jika `python3` tidak tersedia, gunakan `python` atau `py`. Jalankan perintah dari folder project ini, bukan dari `dist`.

Di browser/origin baru, gunakan tab **Daftar** untuk membuat akun lokal. Akun dari website lama tidak otomatis tersedia di localhost.

## Apa yang tersedia

- `dist/`: aplikasi produksi yang dapat dijalankan dengan server HTTP statis.
- `AGENTS.md`: instruksi kerja untuk AI yang melanjutkan project.
- `docs/ARCHITECTURE.md`: struktur, penyimpanan data, dan batas pemulihan source.
- `docs/TRANSFER-TO-GITHUB.md`: urutan pemindahan ke repository private dan pemakaian lintas AI.
- `docs/DATA-BACKUP.md`: pemisahan kode dari data pribadi pada browser.
- `docs/BASELINE.json`: identitas versi dan checksum berkas aplikasi.
- `scripts/verify_baseline.py`: pemeriksaan bahwa berkas aplikasi masih sama dengan baseline.

```sh
python3 scripts/verify_baseline.py
```

## Status source

Kode JavaScript/CSS di `dist` adalah hasil build produksi, bukan source React/TSX asli sebelum build. React sudah terkandung di bundle. Paket ini tidak mengklaim menyediakan proyek sumber asli yang hilang. File produksi dipertahankan byte demi byte; dokumentasi dan alat verifikasi ditambahkan di luarnya.

Untuk pengembangan yang lebih mudah, rekonstruksi source dapat dilakukan sebagai pekerjaan terpisah setelah persetujuan pengguna. Bandingkan perilakunya terhadap baseline, dan jangan mengganti aplikasi yang sedang online secara otomatis.

## Data dan hosting

Stok, resep, akun lokal, dan riwayat berada di localStorage browser. Paket ini tidak berisi data pribadi dari browser pengguna. Memindahkan kode tidak memindahkan data tersebut. Font menggunakan Google Fonts dan dapat bergantung pada jaringan.

Repository GitHub menyimpan project; menerbitkan website adalah tindakan terpisah. Paket ini tidak membawa konfigurasi atau kredensial deployment akun ChatGPT. Salinan website yang sekarang tetap tersedia di https://stok-dapur-kholis.rahmatkholis.chatgpt.site.
