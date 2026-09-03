# 📘 BUKU PANDUAN PRAKTIKUM E-BUSINESS & CLOUD COMPUTING
## Membangun Platform E-Commerce Modern: Eden Healthy Market
### Arsitektur Full-Stack Jamstack, Cloudflare Pages, Edge Functions (Hono.js), Serverless SQL (D1), Midtrans Payment Gateway, & Edge AI (Workers AI / Gemini Flash)

> **Studi Kasus Nyata**: Eden Healthy Market — Kampus Universitas Klabat (UNKLAB), Airmadidi, Minahasa Utara  
> **Tujuan Pedagogis**: Melatih *Mental Model* Arsitektur Cloud Computing Modern & Mencegah *Cognitive Debt* bagi Mahasiswa Informatika / Sistem Informasi.

---

## 🧭 DAFTAR ISI
1. [Bab 1: Pengantar & Mental Model (Mengatasi Cognitive Debt)](#bab-1-pengantar--mental-model-mengatasi-cognitive-debt)
2. [Bab 2: Studi Kasus Transformasi Bisnis Eden Healthy Market](#bab-2-studi-kasus-transformasi-bisnis-eden-healthy-market)
3. [Bab 3: Prasyarat & Rekayasa Proyek (Vite + React + Tailwind)](#bab-3-prasyarat--rekayasa-proyek-vite--react--tailwind)
4. [Bab 4: Merancang Database Relasional di Edge (Cloudflare D1)](#bab-4-merancang-database-relasional-di-edge-cloudflare-d1)
5. [Bab 5: Membangun Serverless Backend API (Cloudflare Pages Functions + Hono)](#bab-5-membangun-serverless-backend-api-cloudflare-pages-functions--hono)
6. [Bab 6: Simulasi Payment Gateway Indonesia (Midtrans Snap)](#bab-6-simulasi-payment-gateway-indonesia-midtrans-snap)
7. [Bab 7: Mengintegrasikan Real AI ke Serverless Edge](#bab-7-mengintegrasikan-real-ai-ke-serverless-edge)
8. [Bab 8: Infrastructure as Code (wrangler.toml) & Deployment](#bab-8-infrastructure-as-code-wranglertoml--deployment)
9. [Bab 9: Panduan Troubleshooting & Debugging Mandiri](#bab-9-panduan-troubleshooting--debugging-mandiri)
10. [Bab 10: Tugas Praktikum & Uji Pemahaman Mandiri](#bab-10-tugas-praktikum--uji-pemahaman-mandiri)

---

## 🧠 BAB 1: PENGANTAR & MENTAL MODEL (MENGATASI COGNITIVE DEBT)

### 1.1 Bahaya Cognitive Debt di Era AI
Di era modern, Anda bisa meminta AI (ChatGPT, Gemini, Copilot, Antigravity) untuk membuatkan program toko online hanya dengan satu baris perintah. Kode tersebut bisa langsung berjalan. Namun, jika Anda tidak memahami:
* Mengapa file backend diletakkan di folder `/functions` dan bukan di `/src`?
* Bagaimana data mengalir dari klik tombol browser hingga tersimpan di database SQL edge?
* Mengapa kita tidak boleh menaruh API Key di file React?

Maka Anda sedang menumpuk **Cognitive Debt (Hutang Kognitif)**. Saat sistem mengalami error di production atau klien meminta fitur baru, Anda akan lumpuh secara teknis. Buku panduan ini dirancang untuk membongkar "kotak hitam" tersebut menjadi pemahaman arsitektur yang kokoh.

---

### 1.2 Peta Mental 4 Lapisan Arsitektur Edge Modern

Perhatikan diagram arsitektur berikut:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       LAPISAN 1: CLIENT BROWSER                         │
│  (src/ -> dist/ dikompilasi oleh Vite)                                  │
│  • React 18, Tailwind CSS, Lucide Icons                                 │
│  • Berjalan di HP / Laptop Pengguna (Chrome, Safari, Firefox)           │
│  • Mengelola Keranjang (Cart Drawer), Badge Stok, & Widget Chat AI      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                 HTTP Request: fetch('/api/products')
                 JSON Payload: POST /api/orders
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                  LAPISAN 2: SERVERLESS EDGE WORKER                      │
│  (functions/api/[[route]].ts menggunakan Hono.js)                       │
│  • Berjalan di 330+ kota di dunia pada jaringan Anycast Cloudflare      │
│  • Runtime: V8 Isolates (Bukan Docker / Linux Container)                │
│  • Zero Cold Start (<5 milidetik)                                       │
│  • Mengatur validasi order, pengurangan stok otomatis, & token Midtrans │
└──────────────────┬──────────────────────────────────┬───────────────────┘
                   │                                  │
      Internal SQL: env.DB               AI Inference: env.AI / Gemini
                   │                                  │
┌──────────────────▼───────────────┐ ┌────────────────▼───────────────────┐
│     LAPISAN 3: EDGE DATABASE     │ │       LAPISAN 4: EDGE AI ENGINE    │
│  (Cloudflare D1 - SQLite Edge)   │ │  • Cloudflare Workers AI (Llama)   │
│  • Database: eden-healthy-db     │ │  • Google Gemini Flash (3.6 / 3.8) │
│  • Menyimpan: Kategori, Produk,  │ │  • Menerima prompt yang sudah      │
│    Stok, Dietary Tags, & Orders  │ │    diinjeksi stok D1 real-time     │
└──────────────────────────────────┘ └───────────────────────────────────┘
```

#### Perbedaan Mendasar Monolith Tradisional vs Serverless Edge:

| Parameter | Arsitektur Tradisional (LAMP/XAMPP) | Arsitektur Modern (Cloudflare Edge) |
| :--- | :--- | :--- |
| **Server** | 1 Unit VPS / Server Fisik (misal di Jakarta) | Didistribusikan di 330+ data center global |
| **Cold Start** | Tidak ada, tapi memakan RAM konstan | 0 milidetik (V8 Isolate instan) |
| **Database** | MySQL Server terpusat (butuh koneksi TCP pool) | Cloudflare D1 (Serverless SQLite di edge) |
| **Biaya Skala Nol** | Tetap bayar sewa VPS bulanan | Gratis (Free tier 100rb request/hari) |
| **Keamanan** | Wajib patch OS Linux, firewall, port open | Zero maintenance OS, dilindungi DDoS Cloudflare |

---

## 🏪 BAB 2: STUDI KASUS BISNIS EDEN HEALTHY MARKET

Teknologi yang hebat adalah teknologi yang memecahkan masalah bisnis nyata (*Real Business Problem Transformation*).

### 2.1 Konteks Bisnis
* **Nama Usaha**: Eden Healthy Market
* **Lokasi Fisik**: Kompleks Kampus Universitas Klabat (UNKLAB), Jl. Arnold Mononutu, Airmadidi, Minahasa Utara, Sulawesi Utara 95371.
* **Jam Operasional**: 08:00 – 20:00 WITA.
* **Fokus Produk**: Makanan vegetarian, produk gandum utuh, granola artisan, minuman nabati (*oat milk*, *almond milk*), sayuran organik bebas pestisida, dan tempe non-GMO bungkus daun pisang.

### 2.2 Masalah Operasional Sebelum Digitalisasi
1. **Bottleneck WhatsApp Manual**: Admin toko menjawab pertanyaan satu-satu: *"Kak, oat milk masih ada stok?"*, *"Kak, tempenya habis belum?"*. Ini memakan waktu hingga 4 jam per hari.
2. **Ketiadaan Transparansi Gizi & Alergen**: Mahasiswa baru vegetarian atau penderita alergi susu sapi kesulitan mengetahui detail bahan.
3. **Pembayaran Terfragmentasi**: Pelanggan mengirimkan bukti transfer bank secara manual yang rawan penipuan atau lambat diverifikasi.

### 2.3 Solusi Teknis yang Diterapkan
* **Badge Ketersediaan Stok Real-Time**: Label visual dinamis (`In Stock`, `Low Stock (Sisa X)`, `Out of Stock`) yang terhubung langsung dengan tabel database D1.
* **Dual-Fulfillment Khusus Kampus**: 
  1. *Click & Collect*: Pesan online, ambil di counter toko kampus UNKLAB dalam 1 jam (Gratis ongkir).
  2. *Kurir Lokal*: Pengiriman ke asrama/kos sekitar Airmadidi (Gratis ongkir belanja $\ge$ Rp 150.000).
* **Payment Gateway Simulator (Midtrans Snap)**: Antarmuka standar industri dengan QRIS dinamis, Virtual Account bank nasional (BCA, Mandiri, BNI, BRI), dan verifikasi instan.
* **Edge AI Customer Support 24/7**: Chatbot yang membaca data D1 secara *real-time* untuk merekomendasikan menu sehat kepada mahasiswa UNKLAB.

---

## 💻 BAB 3: PRASYARAT & REKAYASA PROYEK

### 3.1 Perangkat Lunak yang Dibutuhkan
1. **Node.js**: Unduh versi LTS (v18.x atau v20.x) dari [nodejs.org](https://nodejs.org/). Cek di terminal:
   ```bash
   node -v
   npm -v
   ```
2. **Git**: Kontrol versi kode. Cek di terminal:
   ```bash
   git -v
   ```
3. **Akun Cloudflare**: Buat akun gratis di [dash.cloudflare.com](https://dash.cloudflare.com/).

---

### 3.2 Langkah Inisialisasi Proyek dari Nol

Jalankan perintah-perintah berikut di terminal Anda:

```bash
# 1. Buat scaffold proyek Vite + React + TypeScript
npm create vite@latest health-food -- --template react-ts

# 2. Masuk ke folder proyek
cd health-food

# 3. Install dependencies utama
npm install hono @hono/cloudflare-pages lucide-react

# 4. Install Tailwind CSS & Wrangler CLI
npm install -D tailwindcss postcss autoprefixer wrangler@latest

# 5. Buat konfigurasi Tailwind
npx tailwindcss init -p
```

### 3.3 Struktur File Proyek
Pastikan hierarki proyek Anda terorganisir seperti ini:
```text
health-food/
├── src/                    <-- FRONTEND (Kompilasi React -> dist/)
│   ├── components/         <-- Navbar, ProductGrid, Cart, Checkout, ChatWidget
│   ├── lib/api.ts          <-- Helper pemanggilan HTTP fetch ke /api/*
│   ├── types.ts            <-- Tipe TypeScript (Product, Order, Category)
│   ├── App.tsx             <-- State Management utama aplikasi
│   └── main.tsx            <-- Render DOM React
├── functions/              <-- BACKEND SERVERLESS (Cloudflare Pages Functions)
│   └── api/
│       └── [[route]].ts    <-- Hono.js Edge Router
├── schema.sql              <-- Skema pembuatan tabel D1
├── seed.sql                <-- Data awal 17 produk sehat
├── wrangler.toml           <-- Deklarasi Database D1 & Workers AI binding
└── package.json            <-- Konfigurasi build npm
```

---

## 🗄️ BAB 4: MERANCANG DATABASE RELASIONAL DI EDGE (CLOUDFLARE D1)

### 4.1 Mental Model Cloudflare D1
Cloudflare D1 adalah serverless database relasional berbasis **SQLite**. Mengapa SQLite?
* **Ringan & Cepat**: Tanpa overhead koneksi TCP yang berat seperti MySQL/PostgreSQL.
* **Didistribusikan di Edge**: Data dibaca sangat dekat dengan lokasi fisik pengguna (untuk Indonesia, dilayani node Singapura / Jakarta / Makassar).

---

### 4.2 Langkah Membuat Database via CLI

Buka terminal di root folder proyek Anda:
```bash
npx wrangler d1 create eden-healthy-db
```
Wrangler akan mengembalikan informasi seperti ini:
```toml
[[d1_databases]]
binding = "DB"
database_name = "eden-healthy-db"
database_id = "b4acc9d9-ce54-458b-a074-92ef9557f9d5"
```
> **Catatan Penting**: Simpan `database_id` yang dihasilkan ke dalam file `wrangler.toml` Anda!

---

### 4.3 Menulis Skema Database (`schema.sql`)
Buat file `schema.sql` di root proyek:

```sql
DROP TABLE IF EXISTS product_dietary_tags;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS dietary_tags;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  description TEXT
);

CREATE TABLE dietary_tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  badge_color TEXT NOT NULL
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  price INTEGER NOT NULL,
  unit TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  origin TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  allergens TEXT,
  nutritional_highlights TEXT,
  is_featured INTEGER DEFAULT 0,
  is_bundle INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_dietary_tags (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES dietary_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  fulfillment_type TEXT NOT NULL,
  pickup_time_slot TEXT,
  delivery_address TEXT,
  items_json TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'processing',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4.4 Menjalankan Migrasi & Mengisi Data Awal (Seeding)

> ⚠️ **Perangkap Pemula (Common Pitfall)**:  
> Jika Anda meng-copy isi file SQL ke browser Cloudflare D1 Console, baris pertama yang berisi komentar (`-- comment`) akan menyebabkan error `The request is malformed: Requests without any query are not supported`. **Selalu gunakan CLI untuk mengeksekusi file SQL!**

Jalankan di terminal:
```bash
# 1. Buat seluruh tabel di Cloudflare D1
npx wrangler d1 execute eden-healthy-db --remote --file=./schema.sql -y

# 2. Masukkan data awal produk
npx wrangler d1 execute eden-healthy-db --remote --file=./seed.sql -y

# 3. Verifikasi data berhasil masuk
npx wrangler d1 execute eden-healthy-db --remote --command="SELECT name, price, stock_quantity FROM products LIMIT 5;"
```

---

## ⚡ BAB 5: MEMBANGUN SERVERLESS BACKEND (HONO DI EDGE)

### 5.1 Mengapa Hono.js di Cloudflare Pages?
Di lingkungan serverless edge, framework berat seperti Express.js kurang cocok karena membutuhkan runtime Node.js penuh. **Hono.js** dibuat khusus untuk standar Web Fetch API (`Request` & `Response`) dengan ukuran hanya ~15KB dan performa eksekusi mendekati kecepatan native C++/V8.

### 5.2 Mengapa File Dinamai `functions/api/[[route]].ts`?
Sintaks tanda kurung siku ganda `[[route]].ts` adalah fitur **Wildcard Route** Cloudflare Pages. Artinya:
* `GET /api/categories`
* `GET /api/products`
* `POST /api/orders`
* `POST /api/chat`
Semuanya akan ditangkap oleh file ini secara efisien.

### 5.3 Implementasi Logika Backend Utama

Buka file `functions/api/[[route]].ts`:

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/cloudflare-pages';

type Bindings = {
  DB?: any;          // Terhubung ke Cloudflare D1
  AI?: any;          // Terhubung ke Cloudflare Workers AI
  GEMINI_API_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');
app.use('*', cors());

// 1. GET /api/products: Mengambil produk dengan filter kategori & stok
app.get('/products', async (c) => {
  const category = c.req.query('category');
  const inStockOnly = c.req.query('inStock') === 'true';

  if (c.env.DB) {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }
    if (inStockOnly) {
      query += ` AND p.stock_quantity > 0`;
    }

    const stmt = c.env.DB.prepare(query);
    const { results } = await stmt.bind(...params).all();
    return c.json({ success: true, count: results.length, data: results });
  }

  return c.json({ success: false, message: 'Database binding unavailable' }, 500);
});

// 2. POST /api/orders: Checkout & Pemotongan Stok Atomik
app.post('/orders', async (c) => {
  const body = await c.req.json();
  const { customer_name, customer_phone, items, fulfillment_type } = body;

  // Lakukan pemotongan stok secara otomatis di D1
  if (c.env.DB) {
    for (const item of items) {
      await c.env.DB.prepare(
        "UPDATE products SET stock_quantity = MAX(0, stock_quantity - ?) WHERE id = ?"
      ).bind(item.quantity, item.id).run();
    }
  }

  return c.json({
    success: true,
    message: 'Order created and stock updated!',
    order_id: 'ORD-' + Date.now(),
  });
});

export const onRequest = handle(app);
export default app;
```

---

## 💳 BAB 6: SIMULASI PAYMENT GATEWAY (MIDTRANS SNAP)

### 6.1 Mental Model Transaksi E-Commerce Indonesia
Di Indonesia, pelanggan tidak hanya membayar menggunakan kartu kredit, tetapi didominasi oleh **QRIS** dan **Bank Virtual Account**.

```
[Pelanggan di CheckoutModal]
            │
            ▼ 1. Klik 'Konfirmasi & Lanjut ke Pembayaran'
[Panggilan POST /api/midtrans/charge]
            │
            ▼ 2. Server mengembalikan Snap Token & Parameter QRIS / VA
[Tampilan MidtransSnapModal]
            │
            ▼ 3. Pelanggan memindai QRIS (Airmadidi/UNKLAB) atau menyalin VA
            │
            ▼ 4. Pelanggan mengklik 'Simulate Payment (Bayar Sekarang)'
[Panggilan POST /api/midtrans/simulate-payment]
            │
            ▼ 5. Status transaksi berubah dari 'pending' -> 'settlement'
[Tampilan OrderSuccessModal: Struk Digital Pengambilan di UNKLAB]
```

---

## 🤖 BAB 7: MENGINTEGRASIKAN REAL AI KE SERVERLESS EDGE

### 7.1 Mengapa AI Harus Diletakkan di Backend?
1. **Keamanan Kunci Rahasia**: API Key seperti `GEMINI_API_KEY` tidak boleh dibocorkan ke file JavaScript browser.
2. **Retrieval-Augmented Generation (RAG)**: AI tidak tahu stok toko Eden Healthy Market di UNKLAB hari ini. Oleh karena itu, backend kita mengambil data produk dari D1 terlebih dahulu, lalu menyuntikkannya ke prompt sistem:
   > *"Anda adalah CS Eden Healthy Market UNKLAB. Berikut stok riil hari ini: [Oats: 42 pcs, Tempe: 18 pcs]. Jawab pertanyaan pelanggan dengan ramah."*

---

### 7.2 Dua Jalur AI yang Diterapkan:

#### 1. Jalur Utama: Cloudflare Workers AI (100% Gratis Tanpa API Key)
* **Model**: `@cf/meta/llama-3.2-3b-instruct` (Meta Llama 3.2).
* **Kuota**: 10.000 Neurons/hari gratis ($\approx$ 1.280 percakapan per hari).
* **Eksekusi**: Berjalan langsung di jaringan GPU Cloudflare.

#### 2. Jalur Alternatif: Google Gemini Flash (3.6 / 3.8)
* Jika variabel rahasia `GEMINI_API_KEY` disetel, sistem akan memanggil API Google Gemini Flash generasi terbaru.

### 7.3 Kode Implementasi `/api/chat` di `functions/api/[[route]].ts`:

```typescript
app.post('/chat', async (c) => {
  const { message, history } = await c.req.json();

  // 1. Ambil data produk live dari D1 untuk grounding data
  const { results: products } = await c.env.DB.prepare(
    "SELECT name, price, stock_quantity FROM products WHERE stock_quantity > 0 LIMIT 15"
  ).all();

  const systemPrompt = `Anda adalah Customer Service pintar Eden Healthy Market di Universitas Klabat (UNKLAB).
Jam operasional: 08:00 - 20:00 WITA.
Stok toko saat ini: ${JSON.stringify(products)}.
Jawab pertanyaan pelanggan mengenai stok dan rekomendasi diet vegetarian secara singkat dan akurat.`;

  // 2. Jalankan Llama 3.2 via Cloudflare Workers AI
  if (c.env.AI) {
    try {
      const aiRes = await c.env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 400
      });

      if (aiRes?.response) {
        return c.json({ success: true, reply: aiRes.response, source: 'workers_ai_llama3' });
      }
    } catch (err) {
      console.warn('Workers AI error:', err);
    }
  }

  // 3. Fallback jika offline
  return c.json({
    success: true,
    reply: "Halo! Selamat datang di Eden Healthy Market UNKLAB. Silakan periksa katalog produk kami di atas!",
    source: "fallback"
  });
});
```

---

## 🛠️ BAB 8: INFRASTRUCTURE-AS-CODE (wrangler.toml) & DEPLOYMENT

### 8.1 Menghindari Kesalahan dengan `wrangler.toml`
Jangan menghubungkan database secara manual dengan mengklik dashboard setiap kali ada perubahan. Buat file `wrangler.toml` di root proyek:

```toml
name = "eden-healthy-market"
compatibility_date = "2024-09-23"
pages_build_output_dir = "dist"

# Binding Database D1
[[d1_databases]]
binding = "DB"
database_name = "eden-healthy-db"
database_id = "b4acc9d9-ce54-458b-a074-92ef9557f9d5"

# Binding Workers AI (Llama 3.2)
[ai]
binding = "AI"
```

---

### 8.2 Prosedur Kompilasi & Publikasi
Jalankan di terminal setiap kali ingin menerbitkan update:

```bash
# 1. Kompilasi TypeScript & Vite ke folder dist/
npm run build

# 2. Deploy ke Cloudflare Pages
npx wrangler pages deploy dist --project-name=eden-healthy-market --branch=main

# 3. Commit dan push ke GitHub
git add .
git commit -m "feat: deploy latest features"
git push origin main
```

Situs Anda langsung online di alamat:  
👉 `https://eden-healthy-market.pages.dev/`

---

### 8.3 Menghubungkan Automatic Deployment (CI/CD) dari GitHub

> ⚠️ **Mental Model Penting: Mengapa `git push` Belum Tentu Otomatis Men-deploy Web?**  
> Banyak mahasiswa mengira bahwa hanya dengan menjalankan `git push`, Cloudflare akan otomatis mengompilasi dan meng-update website mereka. **Ini adalah kesalahpahaman umum!**  
> 
> Saat kita menggunakan perintah `npx wrangler pages deploy`, Cloudflare menandai proyek tersebut sebagai **Direct Upload** (dikelola manual via CLI). Pada mode ini, Cloudflare **TIDAK mendengarkan (listen)** aktivitas commit baru di GitHub Anda.  
> 
> Agar setiap kali Anda menjalankan `git push origin main` Cloudflare langsung otomatis men-deploy web versi terbaru tanpa perlu mengetik perintah deploy manual di terminal, Anda harus mengaktifkan integrasi CI/CD.

Ada 2 metode standar industri yang dapat dipilih:

#### Metode A: Cloudflare Native Git Integration (Paling Direkomendasikan & Zero-Token)
Metode ini menghubungkan GitHub langsung ke build engine Cloudflare Pages melalui Cloudflare GitHub App:

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) ➔ **Workers & Pages**.
2. Klik **Create application** (atau **Create**) ➔ pilih tab **Pages** ➔ klik **Connect to Git**.
3. Pilih akun GitHub Anda dan pilih repositori `health-food`.
4. Konfigurasi Pengaturan Build:
   * **Project name**: misalnya `eden-market` *(atau hapus project direct upload lama jika ingin tetap menggunakan nama `eden-healthy-market`)*.
   * **Production branch**: `main`
   * **Framework preset**: `None` (atau `Vite`)
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
   * **Root directory**: *(kosongkan)*
5. Klik **Save and Deploy**.

**Keuntungan Metode A**:
* Setiap kali Anda menjalankan `git push origin main`, Cloudflare mendeteksi commit baru via webhook dan otomatis menjalankan `npm install && npm run build` di server Cloudflare dalam ~45 detik.
* Setiap Pull Request / cabang baru otomatis dibuatkan link **Preview Deployment** unik untuk testing sebelum digabung ke production.

---

#### Metode B: Menggunakan GitHub Actions Workflow (`.github/workflows/deploy.yml`)
Jika Anda ingin proses build dijalankan di runner virtual machine GitHub Actions (Ubuntu):

Buat file `.github/workflows/deploy.yml` di repositori Anda:
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Build & Deploy
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Project
        run: npm run build

      - name: Publish to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=eden-healthy-market --branch=main
```

> **Catatan Mahasiswa**: Untuk Metode B, Anda harus membuat Cloudflare API Token (di Cloudflare: *My Profile ➔ API Tokens ➔ Create Token ➔ Edit Cloudflare Workers*) dan menyimpannya di GitHub Repository (*Settings ➔ Secrets and variables ➔ Actions*).

---

## 🔍 BAB 9: PANDUAN TROUBLESHOOTING MANDIRI (DEBUGGING)

| Masalah / Gejala | Penyebab Sebenarnya | Solusi Teknis |
| :--- | :--- | :--- |
| **Error saat inject SQL**: `The request is malformed` | File SQL diawali baris komentar (`-- ...`) | Eksekusi file SQL melalui terminal dengan perintah `npx wrangler d1 execute --remote --file=...` |
| **Error AI 5028**: `Model deprecated` | Model lama (misal Llama 3.1) sudah tidak aktif | Ganti ID model ke model yang aktif, misalnya `@cf/meta/llama-3.2-3b-instruct` |
| **Secret Dashboard tidak terbaca saat deploy CLI** | Rahasia di Dashboard hanya diinjeksi saat build via GitHub | Masukkan secret via CLI: `npx wrangler pages secret put GEMINI_API_KEY --project-name=...` |
| **Data produk tidak muncul di frontend** | Lupa binding database `DB` | Pastikan `[[d1_databases]]` sudah ada di `wrangler.toml` dan nama binding huruf besar `DB` |

---

## 📝 BAB 10: TUGAS PRAKTIKUM & UJI PEMAHAMAN MANDIRI

Kerjakan tugas berikut secara mandiri untuk membuktikan penguasaan mental model Anda:

1. **Latihan Database**:  
   Gunakan terminal untuk menyisipkan 1 produk minuman herbal baru (misalnya: *"Kombucha Kunyit Asam Minahasa"*) seharga Rp 35.000 dengan stok 20 botol ke dalam tabel `products` di database D1 Anda. Refresh halaman web Anda dan pastikan produk tersebut langsung muncul!
2. **Latihan Prompt Engineering AI**:  
   Ubah `systemPrompt` di `functions/api/[[route]].ts` agar AI selalu mengakhiri percakapan dengan salam khas Manado: *"Makase banya, jangan lupa mampir ke counter Eden Market di kampus UNKLAB!"*. Uji di ChatWidget.
3. **Latihan Diagram Arsitektur**:  
   Gambarkan diagram alir (*data flow diagram*) di lembar kerja Anda yang menjelaskan siklus hidup pesanan: mulai dari pelanggan memilih produk, checkout Click & Collect, simulasi Midtrans, hingga stok di D1 terpotong secara otomatis.

---

> ℹ️ **Catatan Cakupan Proyek (Project Scope Note)**:  
> Implementasi yang dipelajari pada modul praktikum ini berfokus pada **fondasi teknis web-implementation** (arsitektur Full-Stack Edge Computing, Serverless API, Database D1, simulasi Payment Gateway, dan integrasi Edge AI).  
> Solusi ini merupakan bagian inti dari fungsionalitas sistem dan **belum mencakup** optimasi tingkat lanjut seperti:  
> • **SEO (Search Engine Optimization)** & riset kata kunci (*keywords*)  
> • **GEO (Generative Engine Optimization)** — optimasi konten dan struktur data agar dikutip & direferensikan oleh mesin pencari AI (ChatGPT Search, Perplexity, Google AI Overviews)  
> • **Meta Tags Mendalam & Structured Data** (Open Graph, Twitter Card, Schema.org JSON-LD Microdata)  
> • **Conversion Tracking & Web Analytics**

---

*Panduan Praktikum ini disusun untuk membimbing mahasiswa memahami komputasi modern tanpa Cognitive Debt.*  
*Eden Healthy Market — Universitas Klabat (UNKLAB) © 2026.*
