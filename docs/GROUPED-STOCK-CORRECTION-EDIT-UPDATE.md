# Kartu stok gabungan dan edit koreksi — 8 Oktober 2026

## Sebelum dan sesudah

Sebelumnya setiap batch muncul sebagai kartu tersendiri, meskipun isinya sama. Sekarang kartu menampilkan jumlah gabungan jika Master Item, satuan, kategori, jenis/tanggal kedaluwarsa, dan lokasi sama. Tanggal penerimaan yang sudah tersedia boleh berbeda; stok bertanggal tersedia di masa depan dipisahkan dari stok tersedia dan dari tanggal masa depan lain. Identitas batch dan catatan pembelian tidak digabung dalam penyimpanan.

Contoh ayam 600 gram dan 400 gram dengan tanggal dan lokasi sama: dahulu dua kartu, sekarang satu kartu 1.000 gram. Jika tanggal atau lokasi berbeda, tetap dua kartu. Satuan kg dan gram tidak otomatis disatukan pada kartu, walaupun perhitungan resep dapat mengonversinya.

Detail kartu gabungan mempertahankan dua tab. Detail memuat informasi bersama dan total stok, diikuti daftar asal stok per penerimaan; bagian Diterima dari Belanja berada paling bawah. Setiap penerimaan menampilkan jumlah awal/beli, tanggal tersedia, sisa saat ini, tautan belanja, dan tombol untuk membuka halaman edit penerimaan tersebut. Riwayat menampilkan pergerakan terkait satu kali per catatan, termasuk aktivitas yang melibatkan beberapa penerimaan. Pembelian dari item belanja yang berbeda tetap dapat dikoreksi/dibatalkan sesuai proteksi sebelumnya. Pembatalan satu item belanja tetap mencakup seluruh penerimaan item tersebut, seperti perilaku sebelumnya.

Koreksi stok sebelumnya hanya dapat dilihat/dibatalkan. Kini koreksi aktif dapat diedit:

- Alasan dapat diperbarui tanpa mengubah stok.
- Jumlah setelah dapat diperbarui hanya jika tidak ada pergerakan stok yang dicatat setelahnya untuk batch yang sama dan jumlah saat ini masih sama dengan hasil koreksi. Pergerakan lebih baru yang dibatalkan juga mengunci angka koreksi lama.
- Jumlah sebelum, id, tanggal kejadian, dan waktu pencatatan asli dipertahankan. Koreksi yang dibatalkan dan catatan pembalikan tidak dapat diedit.
- Jumlah nol mengarsipkan stok; detail tetap dapat dibuka melalui Riwayat stok yang sudah habis. Edit berikutnya menjadi jumlah positif mengembalikannya ke inventori.
- Pengembalian jumlah tepat ke angka sebelum menggunakan pembatalan, agar pembalikan tersimpan jelas.
- Setiap edit menyimpan revisi alasan/hasil sebelumnya dan hasil baru beserta waktunya. Riwayat edit ada pada detail koreksi. Tidak dibuat kartu aktivitas duplikat.
- Simpan membaca ulang data, memeriksa versi koreksi, dan memeriksa pergerakan berikutnya. Data yang berubah saat editor terbuka tidak dapat ditimpa dengan jumlah lama.

## Contoh alur

1. Terima belanja ayam 600 gram dan 400 gram, kedaluwarsa/lokasi sama. Inventori menampilkan 1.000 gram.
2. Buka kartu: dua penerimaan tetap terlihat. Edit lokasi penerimaan 400 gram menjadi Kulkas; penerimaan 600 gram tetap Freezer dan kartu kembali terpisah.
3. Koreksi penerimaan 600 gram menjadi 550 gram. Buka Riwayat Pergerakan Stok, pilih kartu koreksi, lalu Edit Koreksi. Ubah hasil menjadi 540 gram. Total stok berkurang tambahan 10 gram; angka sebelum tetap 600 gram, dan revisi 550 → 540 tersimpan.
4. Jika sesudah koreksi sudah dipakai 100 gram, edit alasan masih tersedia. Angka hasil koreksi terkunci. Periksa jumlah fisik saat ini dan buat koreksi baru melalui Perbaiki catatan stok pada penerimaan yang bersangkutan.

Koreksi di detail gabungan tetap berlaku pada penerimaan yang ditunjukkan dalam detail koreksi. Ini tidak memperkenalkan koreksi jumlah fisik seluruh kartu sekaligus.

## Validasi dan batas

`npm test` menjalankan pembandingan 168 skenario baseline, 25 pemeriksaan produksi, 12 inventori, 13 detail produk, 8 riwayat koreksi, serta pengujian khusus grouping/edit. Hasil rinci pengujian baru berada pada GROUPED-STOCK-CORRECTION-EDIT-CHECKS.json. Perbandingan baseline mempertahankan temuan yang sudah ada; bukan sertifikasi bahwa seluruh aplikasi bebas bug. Pada lingkungan TZ=Australia/Sydney, baseline dan source masing-masing mencatat 135 PASS dan 33 temuan FAIL dengan status yang sama.

Pengujian menggunakan React production dalam JSDOM dan transaksi store. Layout, keyboard perangkat nyata, dan seluruh browser belum diperiksa secara visual. Tidak ada akun atau data inventori pribadi dalam fixture uji.
