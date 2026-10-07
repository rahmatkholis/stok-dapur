# Kartu inventori ringkas — 7 Oktober 2026

## Sebelum dan sesudah

Sebelumnya ringkasan produk berisi nama, kategori, total, jumlah batch, informasi filter, serta perhitungan stok resep; seluruh kartu batch dan ikon edit selalu tampil di bawahnya. Pada produk dengan satu batch, jumlah stok tampil dua kali.

Sekarang satu kartu menggunakan disclosure HTML details/summary. Nama dan jumlah menjadi informasi utama. Lokasi, tanggal singkat untuk satu batch, serta status penting ditampilkan di bawahnya. Tanda + menunjukkan rincian dapat dibuka; tanda − menunjukkan kartu sedang terbuka. Rincian menampilkan tanggal lengkap dan tombol Edit stok atau Edit batch. Kategori dan informasi konversi hanya muncul dalam rincian. Tidak ada angka perhitungan resep di kartu inventori.

## Flow

- Satu batch ayam 600 gram di freezer dengan tanggal 2 Oktober: ringkasan menampilkan Ayam, 600 gram, Freezer, 2 Okt 2026, dan Tanggal terlewat. Ketuk kartu lalu Edit stok untuk membuka form lama.
- Dua batch ayam 600 dan 400 gram: ringkasan menampilkan 1.000 gram dan 2 batch. Jika hanya satu batch melewati tanggal, status berbunyi Sebagian melewati tanggal. Buka rincian untuk memilih batch yang akan diedit.
- Filter Kulkas: ringkasan hanya menjumlahkan batch yang cocok dengan filter. Bila sebagian batch tersembunyi, tampil 1 dari 2 batch; rincian menyebutkan total seluruh stok. Lokasi dan status ringkasan mengikuti batch yang cocok agar informasi tidak bercampur.
- Stok habis: ringkasan menampilkan 0 dan Stok habis; tanggal lama tidak menimbulkan peringatan seolah-olah masih ada bahan.
- Batch tanpa tanggal/lokasi: menggunakan Tanggal belum diisi dan Tanpa lokasi. Satuan yang tidak bisa dikonversi tetap ditampilkan sebagai jumlah terpisah.

## Cakupan dan verifikasi

Store/transaksi, struktur localStorage, login, perhitungan resep, dan halaman lain tetap menggunakan baseline versi 1. Kartu yang sama digunakan di halaman produk dan rincian kategori.

Empat skenario audit UI diperbarui agar memeriksa jumlah dan pembukaan edit pada kedua bentuk UI; assertion stok dan transaksi tidak dilemahkan. Pemeriksaan produksi membandingkan DOM di luar inventori serta field/data inventori, karena DOM inventori memang berubah. Pemeriksaan CSS memastikan bagian stylesheet lama tidak berubah. Uji khusus inventori meliputi disclosure, filter, edit batch yang tepat, penyimpanan metadata, koreksi stok, dan navigasi resep.

Pengujian otomatis memakai JSDOM dan tidak memverifikasi layout melalui browser/perangkat nyata. 32 temuan baseline tetap ada; perubahan ini tidak memperbaiki semua bug aplikasi.
