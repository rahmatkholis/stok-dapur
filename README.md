# Stok Dapur — source yang dapat dikembangkan

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

168/168 skenario audit menghasilkan status yang sama antara baseline dan source. Kedua versi memiliki 136 skenario PASS dan 32 temuan FAIL yang sudah ada. Kesamaan hasil ini berarti pemulihan source mempertahankan perilaku, **bukan** bahwa semua bug sudah diperbaiki.

25 pemeriksaan tambahan lulus: kesamaan DOM, field, dan data pada fixture uji; stylesheet; input build; serta bukti bahwa mengedit App.jsx benar-benar mengubah UI hasil build. Ini pengujian JSDOM, bukan verifikasi visual pada seluruh perangkat/browser.

## Asal source

Source ZIP lama benar-benar tersedia, tetapi tidak berisi seluruh fitur versi sekarang. Karena itu, project menggunakan pemulihan gabungan. Nama komponen, banyak fungsi, props, dan state App sudah dibuat jelas; sebagian nama variabel lokal hasil pemulihan masih singkat. Source ini bisa dikembangkan, tetapi tidak diklaim identik secara tekstual dengan source asli terakhir yang tidak tersedia. Detail di docs/SOURCE-RECOVERY.md.

## Data dan penerbitan

Data pengguna tetap memakai localStorage browser. Project tidak membawa data inventori pribadi, kata sandi pengguna, atau kredensial hosting. Mengembangkan atau mengunggah source tidak menerbitkan perubahan pada website yang online. Source utama berada di branch **main** pada https://github.com/rahmatkholis/stok-dapur. Branch restore-editable-source menyimpan riwayat pekerjaan pemulihan.

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
