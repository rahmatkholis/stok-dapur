# Langkah pemindahan dan penggunaan lintas AI

## Status paket

Paket disiapkan dari versi 1 yang dipulihkan pada 7 Oktober 2026. Runtime dipertahankan, dokumentasi ditambahkan, dan checksum tersedia. Repository tujuan milik pengguna: https://github.com/rahmatkholis/stok-dapur, dengan visibilitas private. Periksa isi remote dan hasil verifikasi sebelum menganggap pemindahan selesai.

## Urutan pekerjaan

1. Pengguna memasang/menghubungkan GitHub di ChatGPT dan menyelesaikan login serta pemberian akses pada akun GitHub miliknya.
2. AI memeriksa akun yang terhubung dan kemampuan membuat repository/push. Jika kemampuan menulis tidak tersedia, gunakan jalur resmi yang didukung integrasi; jangan meminta pengguna menempel token atau kata sandi di chat.
3. AI memeriksa apakah repository bernama `stok-dapur` sudah ada. Jika ada, jangan menimpa project tersebut tanpa memahami isinya dan instruksi pengguna.
4. Buat repository **private** bernama `stok-dapur` jika nama tersedia.
5. Upload isi folder project (dist, docs, scripts, README.md, AGENTS.md, dan .gitignore), tanpa backup data pribadi atau kredensial. Root repository langsung berisi README.md, bukan folder pembungkus berlapis.
6. Verifikasi commit, daftar berkas, checksum, dan visibilitas private dari GitHub. Tag baseline `v1-audited` jika tersedia akses Git.
7. Berikan URL repository dan instruksi menjalankan. Jangan mengklaim upload selesai sebelum verifikasi remote berhasil.

## Melanjutkan dengan AI lain

- Jika AI mendukung koneksi GitHub, berikan akses ke repository private tersebut sesuai izin yang dibutuhkan.
- Jika AI bekerja di editor lokal, clone repository, buka folder project, dan minta AI membaca AGENTS.md.
- Jika AI hanya menerima unggahan file, berikan ZIP project atau file yang relevan. Tidak semua AI bisa membaca repository private hanya dari URL.

Prompt awal yang dapat dipakai:

> Baca README.md, AGENTS.md, dan docs/ARCHITECTURE.md. Ini Stok Dapur versi 1 yang dipulihkan. Periksa checksum baseline, jalankan aplikasi lokal, lalu jelaskan kondisi project. Tunggu instruksi fitur berikutnya sebelum mengubah UI, flow, login, atau penyimpanan data.

## Pengembangan setelah transfer

Buat branch untuk setiap perubahan, uji flow yang terdampak, jelaskan sebelum/sesudah, lalu gabungkan setelah review sesuai instruksi pengguna. Source yang rapi hasil rekonstruksi adalah pekerjaan terpisah, bukan sesuatu yang otomatis diperoleh dari upload GitHub.
