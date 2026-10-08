# Arsitektur source versi 1

Aplikasi React lokal dengan source ES modules/JSX, build esbuild, dan stylesheet utility yang dipulihkan. Entry point src/main.jsx menggunakan App dari src/App.jsx dan memasang root dengan StrictMode, mengikuti pola entry point source TSX lama.

## Dependency dan modul

React dan ReactDOM 19.2.4 dipasang melalui npm agar versi runtime sesuai baseline. esbuild menghasilkan JavaScript, CSS, dan source map dari src/. Tidak ada backend, D1, cloud login, atau kode versi 2 dalam entry point ini.

App mengelola navigasi ke Beranda, Inventori, Belanja, Resep, Aktivitas, Akun, serta pembukaan master item. Halaman dan komponen berada dalam 22 modul hasil migrasi; main.jsx menjadi entry point tambahan. Store di src/lib/store.js mempertahankan transaksi dan validasi baseline.

## Data

Data akun/dapur memakai localStorage dengan kunci dapur_users dan dapur_session; draft dan log legacy memakai kunci tambahan baseline. Akun lokal baseline menyimpan field password lokal. Jangan membagikan dump penyimpanan ke GitHub atau AI. Data melekat pada origin dan browser, sehingga clone source tidak membawa data website.

## Style dan integrasi

src/styles/index.css berisi stylesheet baseline yang diformat agar dapat dibaca, ditambah style kartu inventori yang dibatasi dengan selector inventory-. Build menghasilkan assets/app.css. Font tetap berasal dari Google Fonts. public/webmcp.js adalah integrasi pembaca layar opsional; App mempertahankan integrasi read_kitchen_inventory bila document.modelContext tersedia.

## Referensi

baseline/v1 mempertahankan artefak aplikasi yang diaudit. legacy menyimpan file teks source TSX lama dan konfigurasi referensinya. File screenshot/aset gambar tak terpakai serta file lingkungan Figma tidak dibawa; legacy bukan project aktif. Checksum dan daftar source asli tersimpan di LEGACY-PROVENANCE.json.

Rekonstruksi dapat direproduksi oleh scripts/recover-baseline.mjs pada checkout terpisah, tetapi script tersebut tidak dipanggil oleh dev/build normal. Source yang sudah dikembangkan harus dipertahankan, bukan ditimpa ulang oleh script pemulihan.

## Riwayat lintas sumber

src/lib/stock-movements.js menormalisasi tampilan dari readBatchLedger dan activityLog untuk satu batch. StockHistoryCard menyajikan penerimaan, kegiatan, dan koreksi dengan format yang sama. Saldo direkonstruksi hanya saat urutan pencatatan dan angka tersimpan saling sesuai. Pembaca tidak menulis transaksi atau storage. ProductModal membuka penyesuaian fisik langsung melalui onAdjust; gateway pemilihan koreksi telah dihapus.
