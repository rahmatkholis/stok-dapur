# Sesuaikan stok langsung dan riwayat lintas sumber — 8 Oktober 2026

## Sebelum dan sesudah

Sebelumnya Perbaiki catatan stok membuka pilihan jumlah fisik, kesalahan pembelian, dan catatan terkait. Sekarang tombol Sesuaikan stok langsung membuka jumlah fisik sekarang dan alasan. Stok tercatat ditampilkan sebagai field read-only. Jumlah akhir harus berbeda, minimal nol, maksimal empat angka desimal; alasan wajib diisi. Selisih tetap dihitung dan dicatat oleh transaksi koreksi yang sudah ada.

Riwayat Pergerakan Stok sekarang menyatukan penerimaan Belanja, stok awal manual, pemakaian/pembuangan Aktivitas, serta Koreksi dalam format kartu yang sama. Setiap kartu memuat perubahan bertanda +/−, jenis pergerakan, nama kegiatan/alasan, stok sebelum–sesudah jika dapat dijelaskan, waktu pencatatan, dan sumber. Ketuk kartu Belanja untuk membuka belanja terkait, Aktivitas untuk membuka kegiatan terkait, atau Koreksi untuk membuka detail koreksi/pembatalannya. Informasi asal tetap paling bawah tab Detail.

Kartu diurutkan menurut pencatatan transaksi, terbaru lebih dahulu. Jika tanggal kejadian atau tanggal tersedia berbeda dari tanggal pencatatan, tanggal tersebut ditampilkan terpisah. Aktivitas yang dicatat kemudian dengan tanggal lampau tidak dipindahkan ke sebelum hitung fisik sehingga tidak menimbulkan rangkaian saldo yang salah.

readStockMovements adalah pembaca untuk tampilan. Ia memakai id transaksi dan id batch asli; penerimaan bukan transaksi activityLog tambahan. Tidak ada migrasi, perubahan stok, penggabungan kartu inventori, maupun fitur edit koreksi yang sebelumnya di-undo. Satu kartu inventori tetap mewakili satu batch.

## Kebenaran angka

Rangkaian saldo dibentuk dari jumlah asal dan pergerakan dalam urutan pencatatan. Saldo ditampilkan hanya jika jumlah awal diketahui, satuan cocok, angka valid, setiap angka sebelum/hasil hitung fisik sesuai rangkaian, dan saldo akhir sama dengan stok tersimpan. Jika tidak, saldo hasil inferensi ditandai Belum diketahui. Angka sebelum/hasil koreksi yang memang disimpan dapat ditampilkan jika satuannya cocok. Satuan historis berbeda menampilkan jumlah dalam satuan catatan tersebut, tanpa memberi saldo dalam satuan baru.

Koreksi yang dibatalkan dan pembalikannya tetap terlihat; bila keduanya tersedia, keduanya menjelaskan perubahan lalu pengembalian stok. Catatan dibatalkan tanpa pembalikan tidak dipakai untuk menambah/mengurangi saldo rekonstruksi. Detail pembatalan dan proteksi transaksi lebih baru tetap menggunakan aturan sebelumnya. Draft metadata yang belum disimpan menghalangi penyesuaian dan pembukaan sumber terkait.

## Contoh alur

Apel Fuji tercatat 69 buah. Buka kartu, pilih Riwayat Pergerakan Stok, tekan Sesuaikan stok, isi 65 buah dan alasan Hasil hitung ulang, lalu Simpan Penyesuaian. Inventori menjadi 65 buah. Buka riwayat: kartu menampilkan −4 buah · Koreksi stok, Hasil hitung ulang, Stok 69 → 65 buah, dan sumber Koreksi.

Pada produk yang diterima dari Belanja, kartu Stok masuk memperlihatkan jumlah penerimaan dan nama kegiatan belanja. Catatan pembelian yang keliru dibuka melalui kartu ini atau asal pembelian di Detail. Pemakaian/pembuangan yang salah dibuka melalui kartu Aktivitas. Koreksi sebelumnya yang salah dibuka melalui kartu Koreksi untuk menggunakan pembatalan sesuai proteksi yang berlaku.

## Validasi

Pengujian baru tersimpan pada STOCK-MOVEMENTS-CHECKS.json. Pemeriksaan produksi, inventori, detail produk, dan riwayat koreksi tetap dijalankan. Audit pembanding 168 skenario memakai akses UI baru untuk source dan akses lama untuk baseline, dengan assertion transaksi yang sama; baseline runtime tidak diubah. Pada TZ=Australia/Sydney, keduanya tetap memiliki 135 PASS dan 33 temuan FAIL yang sudah ada, tanpa perbedaan status.

Pengujian memakai production React/JSDOM dan fixture khusus. Layout pada perangkat nyata belum diverifikasi. Perubahan ini tidak mengklaim seluruh aplikasi bebas bug atau memperbaiki semua temuan audit lama.
