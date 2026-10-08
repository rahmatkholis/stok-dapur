# Stok Dapur — source yang dapat dikembangkan

Sesuaikan stok kini langsung membuka jumlah fisik dan alasan. Riwayat produk menyatukan Belanja, Aktivitas, dan Koreksi dalam kartu ringkas berisi tipe, nama kegiatan, tanggal, dan jumlah perubahan. Asal stok (Stok awal / Dari belanja) berada di atas Detail; stok awal tanpa perubahan memiliki riwayat kosong. Lihat docs/STOCK-MOVEMENTS-UPDATE.md dan jalankan npm run test:stock-movements.

Koreksi stok kini berada di riwayat produk, dengan kartu, detail, pembatalan, dan akses stok habis; menu Aktivitas hanya memuat kegiatan pemakaian/pembuangan. Lihat docs/STOCK-CORRECTION-HISTORY-UPDATE.md.

Pembaruan detail produk 8 Oktober 2026: editor batch menjadi halaman dengan tab Detail dan Riwayat Pergerakan Stok; form produk memakai combobox nama dalam satu field. Lihat docs/PRODUCT-DETAIL-UPDATE.md dan jalankan npm run test:product-detail.

Project React untuk versi 1 yang dipulihkan pada 7 Oktober 2026. Aplikasi aktif dibangun dari **src/**, menggunakan React dari npm. Source asli ZIP lama disimpan dalam **legacy/**, sementara perubahan yang hanya tersedia di website dipulihkan menjadi modul JavaScript dan JSX yang bisa diedit.

## Mulai

Prasyarat: Node.js 20 atau lebih baru dan npm.

```sh
npm ci
npm run dev
```

Buka http://localhost:5173. Setelah mengedit source, muat ulang halaman untuk melihat hasil build watch. Pada browser/origin baru, gunakan tab **Daftar** untuk membuat akun lokal. Data pada website lama tidak otomatis tersedia di localhost.

```sh
npm run build
npm test
npm run verify:baseline
```

`npm run build` menghasilkan dist/ dari src/. `npm test` membandingkan perilaku source dengan baseline dan memeriksa build produksi. Jangan edit dist/ sebagai source utama.

## Struktur

- **src/App.jsx**: navigasi, sesi, dan state aplikasi.
- **src/pages/**: Beranda, Inventori, Belanja, Resep, Aktivitas, Akun, Detail Kategori, dan Master Data.
- **src/components/**: form stok, penerimaan belanja, koreksi, ledger, pilihan bahan, dan navigasi.
- **src/lib/store.js**: akun lokal, data dapur, konversi satuan, transaksi stok, resep, dan belanja.
- **src/lib/drafts.jsx**: penyimpanan serta pemulihan draft form.
- **src/styles/index.css**: stylesheet versi sekarang dalam bentuk yang dapat dibaca.
- **legacy/**: source React/TypeScript asli dari ZIP lama, dipertahankan sebagai referensi dan bukan entry point aktif.
- **baseline/v1/**: arsip runtime versi 1 untuk pembandingan; tidak dimuat oleh aplikasi yang dibangun dari src/.
- **docs/**: asal source, peta simbol, hasil pengujian, dan batas verifikasi.
- **AGENTS.md**: instruksi untuk AI yang melanjutkan project.

## Hasil verifikasi

168/168 skenario audit menghasilkan status yang sama antara baseline dan source. Pada TZ=Australia/Sydney, kedua versi memiliki 135 skenario PASS dan 33 temuan FAIL yang sudah ada; pengujian waktu lokal dapat berbeda menurut timezone lingkungan. Kesamaan hasil ini berarti pemulihan source mempertahankan perilaku, **bukan** bahwa semua bug sudah diperbaiki.

25 pemeriksaan produksi lulus: kesamaan DOM di luar inventori, field dan data pada fixture uji, stylesheet dasar, input build, serta bukti bahwa mengedit App.jsx mengubah UI hasil build. Tampilan inventori diperiksa terpisah dengan npm run test:inventory. Ini pengujian JSDOM, bukan verifikasi visual pada seluruh perangkat/browser.

## Asal source

Source ZIP lama benar-benar tersedia, tetapi tidak berisi seluruh fitur versi sekarang. Karena itu, project menggunakan pemulihan gabungan. Nama komponen, banyak fungsi, props, dan state App sudah dibuat jelas; sebagian nama variabel lokal hasil pemulihan masih singkat. Source ini bisa dikembangkan, tetapi tidak diklaim identik secara tekstual dengan source asli terakhir yang tidak tersedia. Detail di docs/SOURCE-RECOVERY.md.

## Data dan penerbitan

Data pengguna tetap memakai localStorage browser. Project tidak membawa data inventori pribadi, kata sandi pengguna, atau kredensial hosting. Mengembangkan atau mengunggah source tidak menerbitkan perubahan pada website yang online. Repository berada di https://github.com/rahmatkholis/stok-dapur. Perubahan detail dan riwayat terbaru tersedia pada branch **product-detail-page**, melalui PR #4; main belum memuat perubahan tersebut. Branch restore-editable-source menyimpan riwayat pekerjaan pemulihan.

## Menyimpan salinan dan memakai AI lain

Unduh kode melalui Code → Download ZIP pada branch main, atau clone repository menggunakan GitHub dengan akun yang memiliki akses. ZIP kode tidak berisi data dapur pribadi, dependensi npm yang sudah terpasang, atau riwayat commit; gunakan git clone untuk menyimpan riwayat Git.

```sh
git clone https://github.com/rahmatkholis/stok-dapur.git
cd stok-dapur
npm ci
npm run dev
```

Setelah dependensi terpasang, aplikasi dapat dijalankan di komputer tersebut tanpa membuka ChatGPT. Tampilan memakai font Google Fonts; bila internet tidak tersedia, browser menggunakan font pengganti. Membuka index.html dengan klik ganda bukan cara menjalankan source React; gunakan server dev atau host hasil dist/.

AI lain perlu akses repository private melalui integrasi GitHub, atau salinan kode di editor/ZIP. Minta AI membaca README.md, AGENTS.md, serta docs/SOURCE-RECOVERY.md sebelum mengubah project. Jangan menjalankan ulang alat pemulihan untuk mengedit fitur.

Salinan ini adalah source yang dapat dikembangkan untuk baseline versi 1, bukan klaim bahwa source asli terakhir sudah diperoleh. Source asli terakhir dari project akun lama dan backup data browser tetap merupakan dua pekerjaan terpisah.

## Pembaruan kartu inventori — 7 Oktober 2026

Setiap batch kini tampil sebagai satu kartu mandiri: nama produk, jumlah batch tersebut, lokasi, tanggal, dan status yang perlu diperhatikan. Dua batch produk yang sama tampil atas–bawah dengan nama berulang, tanpa ringkasan total atau jumlah batch pada kartu. Ketuk kartu langsung membuka form stok batch tersebut. Kartu menggunakan shadow 0 2px 12px rgba(0,0,0,0.07), radius 1rem, dan tidak memakai border dekoratif. Filter tetap menyaring kartu yang cocok; unit setiap batch dipertahankan.

Perubahan ini tidak mengubah transaksi stok, perhitungan resep, login, atau struktur data browser. Validasi khusus tampilan tersedia di docs/INVENTORY-CHECKS.json dan penjelasan di docs/INVENTORY-UPDATE.md. Temuan bug baseline tetap dicatat terpisah; project tidak diklaim bebas bug.
