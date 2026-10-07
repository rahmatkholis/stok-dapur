# Kartu stok mandiri — 7 Oktober 2026

## Sebelum dan sesudah

Versi sebelumnya menyatukan beberapa batch dalam satu kartu produk. Jumlah total tampil pada ringkasan; pengguna membuka kartu lalu memilih batch dan tombol edit. Kartu menggunakan border tipis.

Sekarang setiap batch tampil sebagai satu tombol/kartu mandiri. Dua batch ayam 600 gram dan 400 gram tampil atas–bawah, masing-masing dengan nama, jumlah, lokasi, tanggal, dan statusnya sendiri. Tidak ada jumlah total gabungan, jumlah batch, kategori, atau perhitungan resep pada kartu. Ketuk kartu langsung membuka form stok batch tersebut yang sudah ada, beserta catatan asal/riwayat, koreksi, dan tindakan lainnya.

Visual mengikuti kartu lain: background var(--card), radius 1rem, shadow 0 2px 12px rgba(0,0,0,0.07), tanpa border dekoratif. Indikator fokus hanya muncul ketika memakai keyboard untuk menjaga aksesibilitas. Nama/jumlah dan metadata dapat membungkus pada layar sempit.

## Contoh flow

- Ayam 600 gram di freezer, tanggal 2 Oktober: satu kartu menampilkan Ayam, 600 gram, Freezer, 2 Okt 2026, dan Tanggal terlewat. Ketuk untuk membuka form batch tersebut.
- Ayam 400 gram di kulkas, tanggal 14 Oktober: kartu kedua menampilkan jumlah/lokasi/tanggal sendiri. Status tanggal terlewat kartu pertama tidak berlaku untuk kartu kedua.
- Filter Kulkas: hanya kartu batch di kulkas yang tampil. Filter tidak mengubah data atau perhitungan resep.
- Koreksi: ketuk kartu, pilih Perbaiki catatan stok, isi jumlah fisik dan alasan; batch terkait diperbarui dan koreksi tetap tercatat.
- Tiap batch mempertahankan satuan yang dicatat, misalnya 500 gram, 1 kg, atau 2 bungkus. Konversi untuk resep tetap dilakukan dalam store.

## Cakupan dan validasi

Store/transaksi, struktur localStorage, login, perhitungan resep, dan halaman lain tidak diubah. Kartu sama digunakan di halaman produk dan rincian kategori. Batch bahan sama tetap berdekatan sesuai urutan kelompok produk sebelumnya; tidak ada pembungkus kartu gabungan.

npm test berhasil: 12 uji inventori untuk kartu per batch, tanggal/jumlah, target edit, filter, metadata, koreksi, kategori, dan navigasi; 25 pemeriksaan produksi untuk halaman lain serta field/data inventori; 168 skenario audit menghasilkan status sama dengan baseline (136 PASS dan 32 temuan FAIL yang tetap ada). Helper audit mengenali kartu baru dan versi baseline tanpa mengubah assertion transaksi.

Pengujian memakai JSDOM; layout belum diverifikasi pada browser/perangkat nyata. Project tidak diklaim bebas bug.
