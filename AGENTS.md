# Instruksi untuk AI berikutnya

## Acuan pengguna

Pengguna adalah pemilik Stok Dapur. Ia ingin memakai AI untuk melanjutkan pengembangan di luar ChatGPT. Ia membatalkan pembaruan besar setelah audit dan meminta kembali ke versi 1. Tampilan inventori di versi ini memakai pengelompokan produk/batch; pengguna meminta penjelasan dan menyatakan ingin tampilan sederhana, tetapi belum memerintahkan implementasi penyederhanaannya.

## Sebelum bekerja

1. Baca README.md, docs/ARCHITECTURE.md, dan docs/BASELINE.json.
2. Jalankan `python3 scripts/verify_baseline.py` untuk memeriksa kondisi awal.
3. Jalankan server HTTP lokal dari dist. Gunakan akun uji terpisah untuk percobaan.

## Batas perubahan

- Baseline adalah versi 1 yang dipulihkan, bukan versi 2 pasca-audit yang dibatalkan.
- Source React/TSX asli tidak tersedia dalam paket. Jangan mengklaim bahwa kode hasil build merupakan source asli.
- Jangan melakukan redesign, migrasi login, perubahan penyimpanan, atau rekonstruksi besar tanpa instruksi pengguna yang mencakup perubahan tersebut.
- Jika pengguna meminta perubahan tertentu, kerjakan dalam branch terpisah dan jelaskan sebelum/sesudah beserta contoh flow.
- Jangan mengubah file baseline atau checksum untuk menutupi perbedaan. Jika aplikasi diubah, jelaskan bahwa pemeriksaan baseline akan mendeteksi perubahan.
- Jangan mengunggah data localStorage, akun/kata sandi lokal, token, atau kredensial ke repository.
- Membuat commit/push source tidak berarti pengguna mengizinkan perubahan website yang online. Hosting dilakukan dalam pekerjaan terpisah sesuai instruksi pengguna.
- Jangan mengklaim bebas bug 100%. Laporkan pengujian yang benar-benar dijalankan dan yang belum diuji.

## Struktur kerja

`dist/assets/index-B7Irxm4D.js` memuat runtime React dan kode aplikasi. `dist/assets/index-f4AJOdmn.css` memuat tampilan. `dist/index.html` adalah entry point; alamat asset memakai path absolut dari root sehingga harus disajikan melalui HTTP, bukan dibuka langsung sebagai file.

Untuk fitur yang diminta, uji happy flow, input salah, perubahan filter, reload, dan persistensi data yang relevan. Pertahankan perilaku di luar cakupan permintaan.
