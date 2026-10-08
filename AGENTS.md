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

- Kartu Perubahan terbaru harus ringkas: tipe, nama aktivitas/alasan, tanggal, jumlah perubahan, dan panah bila ada detail yang bisa dibuka. Jangan menambahkan kembali saldo sebelum/sesudah atau baris sumber terpisah pada kartu. Saldo tetap dipakai model untuk validasi. Pertahankan layout penting pada komponen dan versi aset produksi agar CSS lama tidak menumpuk teks.

- Sesuaikan stok membuka langsung form jumlah fisik/alasan. Riwayat produk menyatukan penerimaan Belanja dan pergerakan Aktivitas/Koreksi melalui pembaca readStockMovements, tanpa membuat transaksi duplikat. Saldo historis tidak boleh diinferensikan jika rangkaian tidak lengkap/konsisten; tampilkan Belum diketahui. Urutan mengikuti pencatatan, dengan tanggal kejadian terpisah jika berbeda. Lihat docs/STOCK-MOVEMENTS-UPDATE.md. Penggabungan kartu stok dan edit koreksi sudah di-undo; jangan menerapkannya kembali tanpa instruksi.

- Koreksi stok ditampilkan sebagai kartu di Perubahan terbaru pada riwayat produk, tidak dalam daftar/filter Aktivitas. Detail dan pembatalannya tetap dalam alur produk. Inventori menyediakan akses batch habis yang punya koreksi agar pemulihan tidak hilang. Store masih menggunakan satu catatan activityLog; jangan menggandakan atau menghapus sejarah. Lihat docs/STOCK-CORRECTION-HISTORY-UPDATE.md.

- Detail/edit batch sekarang menggunakan halaman dengan tab Detail dan Riwayat Pergerakan Stok. Asal stok berada paling atas Detail sebagai Stok awal / Dari belanja / Belum diketahui. Penerimaan belanja, koreksi dan perubahan stok berada di Riwayat. Stok awal adalah dasar saldo internal, bukan kartu riwayat; tanpa pergerakan tampil hanya keadaan kosong. Jangan menebak asal atau saldo data lama; stok seed yang cocok dapat menggunakan template awal. Pertahankan transaksi dan proteksi identitas/satuan batch. Lihat docs/PRODUCT-DETAIL-UPDATE.md.

- Edit src/, bukan dist/, baseline/, atau legacy/.
- Build biasa tidak mengambil kode aplikasi dari baseline/ atau legacy/. React dan ReactDOM dipasang sebagai dependensi npm.
- scripts/recover-baseline.mjs adalah alat pemulihan referensi satu kali. Jangan menjalankannya pada source yang sudah diedit karena akan mengganti file source hasil pemulihan. Gunakan checkout kerja terpisah bila harus memeriksa reproduksi pemulihan.
- Pengguna meminta kartu inventori sederhana. Setiap batch sekarang ditampilkan sebagai satu kartu mandiri dengan shadow tanpa border. Ketuk kartu langsung membuka form stok batch tersebut. Pertahankan cakupan perubahan tampilan inventori; jangan melakukan redesign halaman lain atau mengubah transaksi tanpa instruksi terkait.
- Jika pengguna meminta perbaikan bug, perubahan hasil uji terhadap baseline dapat disengaja. Jelaskan kasus yang berubah dan tambah pengujian perilaku hasil perbaikannya; jangan mengubah baseline untuk menyembunyikan perbedaan.
- Jangan mengunggah localStorage pribadi, akun/kata sandi lokal, token, atau kredensial ke repository atau layanan AI.
- Publish website memerlukan cakupan tugas penerbitan tersendiri. Pemulihan source ini tidak mengganti website yang online.
- Laporkan perubahan sebelum/sesudah beserta contoh flow. Nyatakan hanya pengujian yang benar-benar dijalankan dan jangan mengklaim bebas bug 100%.

## Catatan keterbacaan

Komponen, banyak fungsi, props, dan state utama sudah bernama jelas. Beberapa helper dan variabel lokal masih memakai simbol singkat dari hasil pemulihan. docs/SOURCE-SYMBOLS.json memetakan simbol baseline ke nama dan file source. Rapikan bertahap sesuai cakupan kerja, disertai pengujian.
