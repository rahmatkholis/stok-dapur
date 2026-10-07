# Instruksi untuk AI yang melanjutkan Stok Dapur

## Kondisi project

Ini source editable untuk versi 1 yang dipulihkan. Pengguna membatalkan pembaruan besar setelah audit. Pemulihan ini mempertahankan UI, flow, login lokal, dan penyimpanan baseline. Source pasca-audit versi 2 tidak dipakai.

Source asli ZIP lama berada di legacy/; source aplikasi terkini berada di src/. Perubahan terbaru yang tidak ada di ZIP dipulihkan dari runtime baseline. Jangan mengklaim seluruh source terkini merupakan source asli terakhir.

## Mulai bekerja

1. Baca README.md, docs/SOURCE-RECOVERY.md, docs/ARCHITECTURE.md, dan docs/PARITY-RESULTS.json.
2. Gunakan branch main sebagai acuan source. Branch restore-editable-source menyimpan pekerjaan pemulihan; main dahulu hanya mengarsipkan runtime build.
3. Jalankan npm ci, npm run dev, dan npm test. Gunakan akun uji terpisah.
4. Kerjakan fitur yang diminta dalam branch baru dari source ini.

## Perubahan

- Edit src/, bukan dist/, baseline/, atau legacy/.
- Build biasa tidak mengambil kode aplikasi dari baseline/ atau legacy/. React dan ReactDOM dipasang sebagai dependensi npm.
- scripts/recover-baseline.mjs adalah alat pemulihan referensi satu kali. Jangan menjalankannya pada source yang sudah diedit karena akan mengganti file source hasil pemulihan. Gunakan checkout kerja terpisah bila harus memeriksa reproduksi pemulihan.
- Pengguna meminta kartu inventori sederhana. Kartu sekarang memakai ringkasan produk dan detail batch yang dapat dibuka. Pertahankan cakupan perubahan tampilan inventori; jangan melakukan redesign halaman lain atau mengubah transaksi tanpa instruksi terkait.
- Jika pengguna meminta perbaikan bug, perubahan hasil uji terhadap baseline dapat disengaja. Jelaskan kasus yang berubah dan tambah pengujian perilaku hasil perbaikannya; jangan mengubah baseline untuk menyembunyikan perbedaan.
- Jangan mengunggah localStorage pribadi, akun/kata sandi lokal, token, atau kredensial ke repository atau layanan AI.
- Publish website memerlukan cakupan tugas penerbitan tersendiri. Pemulihan source ini tidak mengganti website yang online.
- Laporkan perubahan sebelum/sesudah beserta contoh flow. Nyatakan hanya pengujian yang benar-benar dijalankan dan jangan mengklaim bebas bug 100%.

## Catatan keterbacaan

Komponen, banyak fungsi, props, dan state utama sudah bernama jelas. Beberapa helper dan variabel lokal masih memakai simbol singkat dari hasil pemulihan. docs/SOURCE-SYMBOLS.json memetakan simbol baseline ke nama dan file source. Rapikan bertahap sesuai cakupan kerja, disertai pengujian.
