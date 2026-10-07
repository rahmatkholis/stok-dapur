# Melanjutkan di AI lain

Repository: https://github.com/rahmatkholis/stok-dapur. Source editable berada di branch main; restore-editable-source menyimpan riwayat pemulihan.

## Melalui integrasi GitHub

Hubungkan akun GitHub pada AI pilihanmu bila didukung, pilih repository private stok-dapur dan branch main, lalu minta AI membaca README.md dan AGENTS.md sebelum bekerja. URL private saja tidak memberi AI akses tanpa autentikasi.

## Melalui editor lokal

```sh
git clone --branch main https://github.com/rahmatkholis/stok-dapur.git
cd stok-dapur
npm ci
npm run dev
```

Gunakan autentikasi GitHub sesuai fasilitas editor/CLI, tanpa menempel token atau password ke chat AI. AI dalam editor dapat mengedit source di folder project dan menjalankan build/test.

## Prompt awal

> Gunakan branch main. Baca README.md, AGENTS.md, dan docs/SOURCE-RECOVERY.md. Ini source Stok Dapur versi 1 yang dipulihkan. Jalankan aplikasi dan test lokal. Pertahankan tampilan serta flow saat ini sampai saya meminta perubahan tertentu. Source lama ada di legacy/, source aktif ada di src/.

Hosting dan data browser dipindahkan dalam pekerjaan terpisah bila diminta. Pengunggahan source ini tidak menerbitkan perubahan website.
