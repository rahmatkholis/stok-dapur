# Detail produk — 8 Oktober 2026

## Sebelum dan sesudah

Sebelumnya mengetuk kartu batch membuka popup Edit Produk. Asal pembelian, total pemakaian/pembuangan/penyesuaian, dan perubahan stok berada bersama di bagian Asal dan perubahan stok di atas field.

Sekarang kartu membuka halaman Detail Produk. Tombol kembali memulihkan daftar inventori beserta pencarian/filter yang masih aktif. Halaman ini menggunakan shadow dan sudut kartu aplikasi tanpa outline dekoratif.

- Tab **Detail** memuat nama produk, kategori, jumlah, satuan, tanggal stok tersedia, informasi kedaluwarsa, dan lokasi penyimpanan. Informasi **Diterima dari Belanja** berada paling bawah, dengan tautan pembelian terkait. Untuk batch manual atau lama, asalnya tetap ditampilkan dengan jujur.
- Tab **Riwayat Pergerakan Stok** memuat ringkasan Dipakai, Dibuang, Penyesuaian, stok sekarang, perubahan terbaru, dan tautan aktivitas. Perbaiki catatan stok, Hapus Produk, dan Buang Stok berada di tab ini.
- Form produk menggunakan satu combobox untuk pencarian dan pilihan nama bahan. Pengetikan saja tidak menjadi pemilihan bahan. Memilih opsi mengisi kategori/satuan. Nama duplikat dibedakan dengan satuan; item arsip tidak dapat dipilih sebagai stok baru.

Aturan data tidak berubah: identitas bahan, satuan, dan jumlah pada batch existing tetap dilindungi. Jumlah dikoreksi lewat transaksi penyesuaian. Nama produk pada stok baru dapat dicari/dipilih dalam satu field; pada batch existing nama tetap terkunci agar riwayat tidak berpindah bahan. Mengubah master bahan dilakukan lewat Data Master.

## Contoh alur

Inventori → ketuk batch ayam 400 gram → Detail → ubah lokasi ke Freezer → pindah ke Riwayat Pergerakan Stok untuk melihat pemakaian → kembali ke Detail → Simpan Perubahan. Jumlah dan riwayat tetap sama; hanya lokasi batch tersebut berubah.

Untuk koreksi: Inventori → kartu batch → Riwayat Pergerakan Stok → Perbaiki catatan stok → Jumlah fisik berbeda → isi jumlah nyata dan alasan → Simpan Penyesuaian.

Pindah tab mempertahankan isian. Tombol kembali meminta konfirmasi ketika perubahan belum disimpan. Membuka catatan terkait juga diblokir sampai perubahan disimpan atau dibatalkan.

## Validasi

13 pengujian khusus halaman, tab, tautan pembelian/aktivitas, perlindungan draft, simpan batch tertentu, combobox, dan keyboard lulus pada production bundle di JSDOM. 12 pengujian inventori dan 25 pemeriksaan produksi lulus. Sebanyak 168 hasil audit tetap sesuai baseline: 136 PASS dan 32 temuan FAIL lama. Pengujian audit UI menyesuaikan langkah dengan halaman/tab/combobox baru tanpa mengubah target validasi stok atau baseline.

Ini pengujian DOM dan transaksi, bukan pengujian visual browser/perangkat nyata. Tidak ada klaim bebas bug. Navigasi masih menggunakan pola view aplikasi yang ada, bukan perombakan router aplikasi.
