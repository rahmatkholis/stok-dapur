# Aplikasi Stok Dapur — pembaruan stok

Versi ini melanjutkan kode Figma Make yang diunggah, dengan perubahan pada pembaruan stok.

## Perilaku

- Centang belanja membuka form penerimaan. Isi tanggal kedaluwarsa dan, bila diperlukan, lokasi penyimpanan; nama, kategori, jumlah, dan satuan terisi dari daftar belanja. Stok baru ditambahkan setelah disimpan.
- Setiap penerimaan menghasilkan stok tersendiri. Produk dengan nama sama tetapi tanggal kedaluwarsa berbeda tetap terpisah.
- Batal centang menarik kembali jumlah yang masuk dari penerimaan tersebut. Pembatalan ditolak bila stok pembelian sudah berkurang; koreksi aktivitas pemakaian/pembuangannya terlebih dahulu.
- Menghapus item dari daftar belanja hanya membersihkan daftar; stok yang sudah diterima tetap tersimpan.
- Menyimpan pemakaian/pembuangan mengurangi stok sekaligus menambahkan riwayat.
- Mengedit aktivitas menyesuaikan stok berdasarkan selisih jumlah lama dan baru, termasuk penambahan/penghapusan produk dari aktivitas.
- Menghapus aktivitas mengembalikan jumlah produk yang sebelumnya dipakai/dibuang, termasuk produk yang sudah habis.
- Perubahan yang melampaui stok ditolak. Kegagalan menyimpan tidak menghasilkan perubahan stok atau riwayat sebagian.
- Stok dan riwayat tersimpan di browser, seperti versi awal. Tidak ada perubahan ke penyimpanan server pada pembaruan ini.

## Data dari versi lama

Riwayat lama tetap dibaca dan dipindahkan ke dokumen penyimpanan yang sama dengan stok pada penulisan berikutnya. Jangan menghapus data browser saat memperbarui versi di alamat yang sama.

Produk yang habis pada versi lama mungkin sudah terhapus beserta tanggal kedaluwarsa dan lokasinya. Saat perlu mengembalikan stok tersebut, aplikasi meminta data yang hilang sebelum menyimpan perubahan; tanggal kedaluwarsa tidak ditebak.

Item belanja yang dicentang di versi lama belum pernah menambah stok. Membatalkan centang item tersebut tidak mengurangi inventori. Untuk memasukkannya ke stok, batal centang lalu lakukan penerimaan lewat form baru.

## Menjalankan proyek

Diuji menggunakan Node.js 24 dan pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Vite menampilkan alamat lokal. Port bawaan proyek adalah 8443.

```sh
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

`pnpm test` menjalankan 22 pengujian regresi stok, pemulihan, data lama, pembatalan, validasi, dan kegagalan penyimpanan. Pengujian memakai penyimpanan terisolasi dan tidak mengubah akun pengguna.

ZIP ini berisi kode proyek, bukan data akun di browser. Perubahan kode tidak otomatis memperbarui tautan aplikasi yang sudah dipublikasikan di Figma Make.
