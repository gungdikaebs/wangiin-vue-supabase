# Database Schema (Supabase)

## 1. public.profiles
**Fungsi:** Menyimpan profil pengguna yang tersinkronisasi otomatis dengan `auth.users` Supabase. Menentukan *Role-Based Access Control* (RBAC).

- `id` (uuid, PK) -> referensi ke `auth.users.id`
- `email` (text)
- `role` (text) -> default: 'customer'. Bisa diubah menjadi 'admin' secara manual di Supabase untuk memberi akses Dashboard Admin.
- `created_at` (timestamp)

## 2. public.categories
**Fungsi:** Mengelompokkan produk berdasarkan jenis aromanya (contoh: Woody, Floral, Fresh, Sweet).

- `id` (uuid, PK)
- `name` (text) -> contoh: 'Woody'
- `slug` (text, Unique) -> contoh: 'woody'
- `created_at` (timestamp)

## 3. public.brands
**Fungsi:** Menyimpan daftar merek parfum (contoh: HMNS, Afnan, Mykonos, Dior).

- `id` (uuid, PK)
- `name` (text, Unique)
- `slug` (text, Unique)
- `classification` (text) -> Pasar/Tipe (contoh: 'Local', 'Designer', 'Niche', 'Middle Eastern')
- `created_at` (timestamp)

## 4. public.products
**Fungsi:** Menyimpan informasi dasar dari parfum (tanpa menyertakan harga atau ukuran decant).

- `id` (uuid, PK)
- `brand_id` (uuid, FK, Nullable) -> referensi ke `public.brands.id`
- `name` (text)
- `slug` (text, Unique)
- `subtitle` (text) -> Catatan singkat aroma
- `description` (text)
- `top_notes` (text)
- `middle_notes` (text)
- `base_notes` (text)
- `is_new` (boolean) -> Flag untuk badge 'BARU'
- `image_url` (text) -> Menyimpan link gambar produk
- `created_at` (timestamp)

## 5. public.product_categories
**Fungsi:** Tabel penghubung (*Junction Table*) untuk mencatat relasi banyak-ke-banyak (*Many-to-Many*) antara produk dan kategori.

- `product_id` (uuid, PK, FK) -> referensi ke `public.products.id`
- `category_id` (uuid, PK, FK) -> referensi ke `public.categories.id`

## 6. public.product_variants
**Fungsi:** Karena aplikasi ini berfokus pada "Decant" parfum, setiap produk dipecah harganya berdasarkan ukuran mililiter (ml).

- `id` (uuid, PK)
- `product_id` (uuid, FK) -> referensi ke `public.products.id`
- `size` (text) -> Wajib bernilai: '2 ML', '5 ML', atau '10 ML'
- `price` (numeric) -> Harga untuk ukuran decant tersebut
- `stock` (integer)
- `created_at` (timestamp)

## 7. public.orders
**Fungsi:** Menyimpan detail transaksi (Checkout) baik untuk pengguna terdaftar maupun Guest Checkout.

- `id` (uuid, PK)
- `customer_id` (uuid, FK, Nullable) -> referensi ke `public.profiles.id`. Jika null, artinya ini *Guest Checkout*.
- `order_number` (text, Unique) -> ID unik pesanan (contoh: WGN-10023)
- `status` (text) -> 'pending', 'processing', 'shipped', 'completed', 'cancelled'
- `total_amount` (numeric) -> Total pembayaran (termasuk ongkir)
- `shipping_cost` (numeric) -> default 25000
- `full_name` (text) -> Info pengiriman
- `email` (text) -> Info pengiriman
- `phone` (text) -> Info pengiriman
- `address` (text) -> Info pengiriman
- `city` (text) -> Info pengiriman
- `postal_code` (text) -> Info pengiriman
- `payment_status` (text) -> 'unpaid', 'paid'
- `payment_method` (text) -> e.g. 'qris', 'bank_transfer'
- `created_at` (timestamp)

## 8. public.order_items
**Fungsi:** Menyimpan rincian keranjang belanja di dalam setiap pesanan.

- `id` (uuid, PK)
- `order_id` (uuid, FK) -> referensi ke `public.orders.id`
- `product_id` (uuid, FK) -> referensi ke `public.products.id`
- `variant_id` (uuid, FK) -> referensi ke `public.product_variants.id`
- `quantity` (integer) -> Jumlah yang dibeli
- `price_at_time` (numeric) -> Merekam harga pasti produk *saat transaksi terjadi* (agar riwayat tagihan tidak berubah walau harga produk dinaikkan di masa depan).
- `created_at` (timestamp)

---

## Row Level Security (RLS) Rules

1. **Admin (`role = 'admin'`):** Memiliki hak akses penuh (INSERT, UPDATE, DELETE, SELECT) pada semua tabel.
2. **Customer (`role = 'customer'`):** 
   - Bisa membaca (SELECT) kategori, merek (brand), produk, varian, dan relasi kategori.
   - Bisa membuat (INSERT) pesanan baru (`orders` & `order_items`).
   - Hanya bisa membaca (SELECT) `orders` dan `order_items` milik mereka sendiri (di mana `customer_id` cocok dengan akun mereka).
3. **Guest (Belum Login):**
   - Bisa membaca (SELECT) katalog produk, kategori, dan merek (brand).
   - Bisa membuat (INSERT) pesanan baru.

---

## Supabase Storage (Buckets)

### 1. `products`
**Fungsi:** Menyimpan gambar botol/parfum yang diunggah oleh admin melalui dashboard. URL publik dari gambar ini akan disimpan ke dalam kolom `image_url` pada tabel `public.products`.

**Storage RLS Policies:**
- **Public Access:** Mengizinkan siapa saja (Guest, Customer, Admin) untuk melihat/membaca (SELECT) gambar di bucket ini.
- **Admin Management:** Mengizinkan operasi modifikasi (INSERT, UPDATE, DELETE) pada bucket `products` agar admin bisa mengunggah dan menghapus gambar parfum dari *dashboard*.

---

## SQL Scripts (Untuk Setup di Supabase)

Jika Anda perlu membuat atau mereset tabel baru, Anda bisa menjalankan *query* SQL berikut di menu **SQL Editor** Supabase Anda:

```sql
-- 1. Buat tabel brands
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    classification TEXT DEFAULT 'Local',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Set up RLS untuk brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admin can do all on brands" ON public.brands FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. Tambahkan kolom brand_id ke tabel products (jika belum ada)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL;

-- 3. Hapus kolom classification dari products (karena dipindah ke brands)
ALTER TABLE public.products DROP COLUMN IF EXISTS classification;

-- 4. Hapus kolom category_id dari products jika sudah ada
ALTER TABLE public.products DROP COLUMN IF EXISTS category_id;

-- 5. Buat tabel product_categories untuk Many-to-Many
CREATE TABLE IF NOT EXISTS public.product_categories (
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- 6. Set up RLS untuk product_categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product_categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Admin can do all on product_categories" ON public.product_categories FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 6. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending',
    total_amount NUMERIC NOT NULL,
    shipping_cost NUMERIC DEFAULT 25000,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    payment_status TEXT DEFAULT 'unpaid',
    payment_method TEXT DEFAULT 'manual_transfer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Set up RLS untuk orders and order_items
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policy untuk Admin (Akses penuh)
CREATE POLICY "Admin can do all on orders" ON public.orders FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Admin can do all on order_items" ON public.order_items FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Policy untuk Customer (Hanya baca milik sendiri)
CREATE POLICY "Customer can view own orders" ON public.orders FOR SELECT USING (
  auth.uid() = customer_id
);
CREATE POLICY "Customer can view own order_items" ON public.order_items FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid())
);

-- Policy untuk Insert (Bisa dilakukan siapa saja, termasuk Guest)
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
```
