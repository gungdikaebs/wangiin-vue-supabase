# Wangiin Decant

Wangiin adalah platform e-commerce yang berfokus pada penjualan parfum *decant* premium. Platform ini dirancang dengan antarmuka yang modern, minimalis, dan elegan untuk memberikan pengalaman belanja (*fragrance journey*) yang mewah bagi pelanggan.

Setiap parfum dijual dalam beberapa ukuran decant eksklusif: **2 ML, 5 ML, dan 10 ML**.

## 🚀 Tech Stack

Aplikasi ini dibangun menggunakan teknologi web modern:

- **Frontend Framework:** Vue 3 (Composition API) + Vite
- **Styling:** Vanilla CSS & Tailwind CSS (Custom Design System)
- **State Management:** Pinia
- **Routing:** Vue Router
- **Backend & Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email & Google OAuth)
- **Icons:** Lucide Vue Next

## 📋 Gambaran Sistem

Sistem ini memiliki arsitektur E-Commerce *Full-Stack* yang dibagi menjadi beberapa alur (*flow*) utama:

### 1. Customer Flow
- **Katalog Produk:** Pelanggan dapat menjelajahi koleksi parfum berdasarkan kategori (Woody, Floral, Fresh, Sweet) dan mencari berdasarkan nama atau *notes* aroma.
- **Detail Parfum:** Halaman edukasi yang menampilkan piramida aroma (*Top, Middle, Base Notes*) dan deskripsi lengkap.
- **Sistem Keranjang:** Laci keranjang (*Cart Drawer*) yang cerdas dan persisten untuk menyimpan pilihan decant sebelum *checkout*.
- **Customer Dashboard:** Area privat (*Protected Route*) bagi pelanggan yang sudah mendaftar untuk melihat riwayat pesanan mereka.

### 2. Admin Flow
Admin memiliki akses ke *Dashboard* khusus yang terisolasi dari antarmuka publik:
- **Product Management:** Sistem CRUD penuh (Create, Read, Update, Delete) yang terhubung langsung ke Supabase untuk mengelola katalog parfum beserta harga varian ukurannya.
- **Order Management:** Memantau pesanan masuk dan mengubah status pengiriman. *(Dalam Pengembangan)*
- **Statistik Bisnis:** Ringkasan total penjualan dan pelanggan baru.

### 3. Keamanan & Database
Data diamankan menggunakan **Row Level Security (RLS)** bawaan Supabase:
- Relasi tabel kompleks memisahkan data inti produk (`products`) dengan harga/ukuran (`product_variants`).
- Pelanggan hanya dapat melihat struk/riwayat pesanan milik mereka sendiri.
- Hanya akun yang memiliki nilai `role = 'admin'` di tabel `profiles` yang diizinkan untuk masuk ke layar Admin Dashboard dan memodifikasi katalog.

## 🛠 Instalasi & Menjalankan Lokal

1. Kloning repositori ini.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env` dan masukkan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:5173` di peramban Anda.
