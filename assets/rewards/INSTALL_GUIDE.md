# Panduan Penggantian Gambar Reward

## File yang telah dibuat:
1. `1.svg` - Diskon Rp 100.000 Tagihan
2. `2.svg` - Steker Pintar
3. `3.svg` - Audit Energi 
4. `4.svg` - Paket Lampu LED
5. `5.svg` - Diskon Rp 250.000 Tagihan
6. `6.svg` - Terminal Listrik Pintar

## Untuk mengganti dengan gambar PNG:
1. Siapkan gambar PNG dengan nama `1.png`, `2.png`, `3.png`, dst.
2. Pastikan ukuran gambar minimal 400x300px (rasio 4:3)
3. Simpan di folder `assets/rewards/`
4. Sistem akan otomatis menggunakan PNG jika tersedia, SVG sebagai fallback

## Fallback Hierarchy:
1. `{id}.png` (gambar utama)
2. `{id}.svg` (gambar fallback)
3. Icon FontAwesome (fallback terakhir)

## Contoh Gambar yang Direkomendasikan:
- **Diskon**: Gambar tagihan listrik dengan badge diskon
- **Steker Pintar**: Foto produk smart plug
- **Audit Energi**: Ilustrasi audit atau grafik energi
- **Lampu LED**: Foto set lampu LED
- **Terminal Listrik**: Foto power strip pintar

Modal sekarang akan menampilkan gambar dengan benar berdasarkan ID reward!
