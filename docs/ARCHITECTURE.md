# Arsitektur baseline

## Jenis aplikasi

Single-page application React dengan JavaScript/CSS produksi yang sudah dibundel. Dapat disajikan melalui hosting statis atau server HTTP lokal. Tidak memerlukan backend/D1 untuk versi ini.

## Layar utama

- Beranda
- Inventori, termasuk pengelompokan produk dan batch stok
- Belanja dan aktivitas belanja
- Resep
- Aktivitas bahan
- Akun dan master data

Autentikasi aplikasi pada baseline ini bersifat lokal di browser. Tab Daftar membuat akun lokal; bukan login platform ChatGPT.

## Berkas runtime

- dist/index.html: entry point.
- dist/assets/index-B7Irxm4D.js: bundle aplikasi dan runtime React.
- dist/assets/index-f4AJOdmn.css: stylesheet produksi; font eksternal Google Fonts.
- dist/favicon.svg: ikon situs.
- dist/webmcp.js: integrasi pembaca layar yang hanya berjalan jika document.modelContext tersedia; tanpa API tersebut aplikasi statis tetap dapat berjalan.

## Persistensi

localStorage menggunakan kunci `dapur_users` untuk akun/data dan `dapur_session` untuk sesi lokal. Akun lokal memuat field password, sehingga backup seluruh localStorage dapat mengandung kata sandi. Jangan memasukkannya ke GitHub atau konteks AI.

Data melekat pada browser dan origin. localhost, domain lama, dan domain hosting baru memiliki ruang penyimpanan terpisah. Export source ini tidak mengambil data pengguna dari browser mana pun.

## Apa yang tidak tersedia

Source komponen asli, konfigurasi build asli, serta source map asli tidak ada pada baseline Git versi 1. Tidak ada klaim bahwa folder src asli dapat dipulihkan sempurna dari bundle. Source versi 2 yang ditolak tidak disertakan sebagai aplikasi aktif.

Konfigurasi hosting akun ChatGPT tidak disertakan karena tujuan paket ini adalah portabilitas source/runtime. Memasang hosting baru tidak mengubah deployment yang lama.
