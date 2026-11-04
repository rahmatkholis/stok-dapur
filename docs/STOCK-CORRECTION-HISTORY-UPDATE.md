# Koreksi stok dalam riwayat produk — 8 Oktober 2026

## Sebelum dan sesudah

Sebelumnya koreksi jumlah muncul sebagai kartu di menu Aktivitas, dan sebagai baris dalam riwayat produk. Data bukan dua salinan; kedua tampilan membaca satu entry dari activityLog.

Sekarang menu Aktivitas hanya menampilkan Dipakai dan Dibuang, termasuk masak yang tercatat sebagai pemakaian. Filter Koreksi dihapus. Jumlah Semua, pencarian, dan hasil kosong hanya mengikuti aktivitas harian tersebut.

Pada Detail Produk → Riwayat Pergerakan Stok → Perubahan terbaru, koreksi menggunakan kartu yang sama seperti kartu koreksi sebelumnya: alasan, waktu, jumlah sebelum → sesudah, tanggal kejadian, delta, serta status pembatalan/pembalikan. Mengetuk kartu membuka Detail Koreksi Stok di dalam alur produk. Tombol kembali dan pembatalan kembali ke riwayat produk, bukan daftar Aktivitas.

Pemakaian dan pembuangan tetap ditampilkan di riwayat produk karena merupakan pergerakan batch. Kegiatan tersebut juga terlihat di Aktivitas, memakai catatan yang sama. Koreksi lama langsung terbaca tanpa migrasi atau penggandaan. Store dan format data browser tidak diubah.

## Stok menjadi nol

Koreksi nol mengarsipkan batch sesuai transaksi yang sudah ada. Inventori kini menyediakan bagian Riwayat stok yang sudah habis ketika ada batch arsip yang mempunyai koreksi. Dari sana, pengguna dapat membuka riwayat dan memulihkan koreksi yang salah. Batch arsip tidak dihitung sebagai stok aktif, tidak menawarkan simpan metadata/pembuangan/koreksi baru, dan tetap mempunyai catatan asal.

## Contoh

Stok telur 10 buah → Perbaiki catatan stok → jumlah fisik 7, alasan Hasil timbang → riwayat produk menampilkan kartu Koreksi stok 10 → 7 buah, −3 buah. Aktivitas tidak memuat kartu ini. Bila koreksi salah: ketuk kartu → Batalkan Penyesuaian yang Salah → konfirmasi → stok kembali 10. Koreksi asli ditandai dibatalkan dan catatan pembalikan tetap tersimpan.

Pembatalan tetap dibatasi jika ada catatan lebih baru atau stok sudah berubah. Perubahan metadata yang belum disimpan juga tetap menghalangi pembukaan catatan terkait.

## Validasi

Delapan pengujian khusus lulus pada bundle produksi di JSDOM: catatan tunggal, filter Aktivitas, kartu koreksi lama/baru, pembatalan, stok nol/pemulihan, konflik catatan baru, perlindungan isian belum tersimpan, dan pemisahan batch. Tiga belas pengujian detail produk, dua belas inventori, dua puluh lima produksi, dan audit 168 skenario juga dijalankan. Pemeriksaan DOM Aktivitas mengikuti perubahan tiga filter; data dan target transaksi tetap diperiksa. Ini bukan pengujian layout pada perangkat nyata atau klaim bebas bug.

Audit pada lingkungan Australia/Sydney menghasilkan status baseline/source yang sama: 135 PASS dan 33 FAIL. Perbedaan dari catatan lama 136/32 adalah kasus E016 (tanggal Jakarta pukul 23.30), yang mengikuti timezone lingkungan. Store tidak diubah untuk menyembunyikan masalah tanggal tersebut; laporan menyertakan timezone agar pengulangan dapat ditafsirkan dengan benar.
