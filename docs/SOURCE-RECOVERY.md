# Pemulihan source Stok Dapur

## Keputusan berdasarkan ZIP

Dua file Aplikasi-Stok-Dapur-update-stok.zip dan Aplikasi-Stok-Dapur-update-stok(1).zip memiliki SHA-256 yang sama. Arsip tersebut berisi App.tsx, store.ts, types.ts, halaman TSX, CSS, dan konfigurasi build. ZIP ini menyediakan source asli versi lama.

Source lama memakai lima tujuan navigasi: Beranda, Inventori, Belanja, Pakai, dan Akun. Baseline terkini sudah memakai Resep, Aktivitas, Master Data, pengelompokan batch, ledger, koreksi, pembelian parsial, serta draft form. Memakai ZIP tanpa migrasi akan menghilangkan fitur terbaru.

Pemulihan dilakukan secara gabungan: pertahankan source TSX asli sebagai referensi dalam legacy/, gunakan struktur komponen dan istilahnya, lalu pulihkan logic/UI terbaru dari runtime yang sedang online. Ini lebih terukur daripada menulis ulang fitur berdasarkan perkiraan tampilan.

## Perubahan sebelum/sesudah

| Sebelum | Setelah |
| --- | --- |
| Repository berisi HTML dan bundle produksi | Ada entry point React, halaman JSX, komponen, store, stylesheet, dan build npm |
| Perubahan dilakukan dengan membongkar satu file build | Perubahan dapat dilakukan pada komponen/halaman yang relevan di src/ |
| React berada di bundle yang dipulihkan | React/ReactDOM menjadi dependensi npm yang dipasang dengan npm ci |
| Source ZIP lama belum tersedia di repository | Source TSX lama tersimpan dalam legacy/ dengan catatan asal dan checksum |
| Belum ada pengujian kesamaan terhadap hasil source | 168 skenario audit dan 25 pemeriksaan produksi tersedia |

## Contoh flow pengembangan

Untuk permintaan menyederhanakan kartu inventori, AI membaca src/components/InventoryProducts.jsx serta src/pages/InventoryPage.jsx, mengubah komponen yang relevan, menjalankan build dan uji flow inventori, lalu menjelaskan tampilan sebelum/sesudah. Transaksi stok tetap berada di src/lib/store.js; perubahan tampilan tidak perlu mengganti login atau penyimpanan.

Flow pengguna yang diuji tetap sama: Daftar/login lokal → lihat Inventori → tambah/edit metadata batch atau koreksi jumlah → catat pemakaian/masak → stok dan aktivitas tersimpan di browser. Pembelian belanja dan konsumsi resep memakai logic baseline yang sama.

## Validasi dan batas

- npm build berhasil dari src/; tidak memuat runtime arsip.
- 168/168 skenario memiliki status yang sama: 136 PASS dan 32 temuan FAIL pada kedua versi.
- 25 pemeriksaan produksi lulus, termasuk kesamaan markup DOM, field, persistensi pada fixture uji, normalisasi stylesheet, dan bukti edit source mengubah UI.
- Semua file runtime baseline dipertahankan dengan checksum awal.
- Pengujian menggunakan JSDOM; tidak menggantikan QA visual, perangkat nyata, atau pilot harian.
- Nama variabel lokal asli terbaru tidak dapat dipastikan dari build. Sebagian masih memakai nama hasil pemulihan yang singkat.
- Source terakhir versi terkini tidak diklaim pulih identik secara tekstual. Source terbaru di sini merupakan source yang direkonstruksi, dengan source asli lama disertakan sebagai referensi.

Tidak ada deployment website dalam pekerjaan ini. Data browser pengguna tidak diambil atau dipindahkan.
