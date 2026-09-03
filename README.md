# 🌱 Eden Healthy Market — Modern E-Commerce Platform

> **Full-Stack Edge Computing Solution**: Cloudflare Pages + Serverless Workers (Hono.js) + D1 SQL Database + Workers AI (Meta Llama 3.2) & Google Gemini Flash.  
> **Physical Store Location**: Universitas Klabat (UNKLAB) Campus Complex, Jl. Arnold Mononutu, Airmadidi, Minahasa Utara, North Sulawesi 95371.  
> **Operating Hours**: 08:00 – 20:00 WITA Daily.

> ℹ️ **Catatan Cakupan Implementasi (Project Scope Note)**:  
> Proyek ini berfokus pada **fondasi teknis web-implementation** (arsitektur Full-Stack Edge Computing, Serverless Edge API, Relational Database D1, simulasi Midtrans Payment Gateway, dan integrasi Edge AI).  
> Solusi ini merupakan bagian inti fungsionalitas aplikasi dan **belum mencakup** aspek optimasi pemasaran digital tingkat lanjut seperti:  
> • **SEO (Search Engine Optimization)** & riset kata kunci (*keywords*)  
> • **GEO (Generative Engine Optimization)** — optimasi konten agar dikutip dan direkomendasikan oleh mesin pencari AI (ChatGPT Search, Perplexity, Google AI Overviews)  
> • **Meta Tags Mendalam & Structured Data** (Open Graph, Twitter Card, Schema.org JSON-LD Microdata)  
> • **Conversion Tracking & Web Analytics**

---

## 🌐 Live Production Links

* **Production Storefront (Pages)**: [https://eden-healthy-market.pages.dev/](https://eden-healthy-market.pages.dev/)
* **Edge API Base (Workers)**: [https://eden-healthy-market.pages.dev/api/categories](https://eden-healthy-market.pages.dev/api/categories)
* **GitHub Repository**: [https://github.com/andrewtliem/health-food](https://github.com/andrewtliem/health-food)

---

## 📚 Dokumen Panduan Mahasiswa (Mencegah Cognitive Debt)

Untuk mahasiswa yang ingin mempelajari arsitektur ini langkah demi langkah:
* 📄 [**`PANDUAN_PRAKTIKUM_MAHASISWA.md`**](./PANDUAN_PRAKTIKUM_MAHASISWA.md) *(Format Markdown lengkap dengan diagram)*
* 📄 [**`PANDUAN_PRAKTIKUM_MAHASISWA.docx`**](./PANDUAN_PRAKTIKUM_MAHASISWA.docx) *(Format Microsoft Word siap dicetak / dibagikan)*

---

## 🏗️ Mental Model & Arsitektur Sistem

Sistem ini dibangun dengan arsitektur **Jamstack + Edge Computing**, memisahkan frontend statis dan backend serverless yang berjalan di 330+ kota di seluruh dunia.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LAPISAN 1: CLIENT BROWSER                       │
│  (src/ -> dist/ dikompilasi oleh Vite)                                 │
│  • React 18, TypeScript, Tailwind CSS, Lucide Icons                    │
│  • Cart Drawer dengan Free Delivery Threshold Meter (Rp 150.000)       │
│  • Badge Stok Real-Time (In Stock, Low Stock, Out of Stock)            │
│  • Widget Chat AI Mengambang (Ask Eden AI)                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                HTTP REST API Calls: fetch('/api/*')
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  LAPISAN 2: SERVERLESS EDGE BACKEND                    │
│  (functions/api/[[route]].ts menggunakan Hono.js)                      │
│  • Berjalan di Cloudflare Pages Functions (V8 Isolates, <5ms start)    │
│  • Wildcard routing [[route]].ts menangani semua /api/*                │
│  • Pengurangan stok otomatis saat pesanan dibuat                       │
│  • Tokenisasi transaksi & simulasi webhook Midtrans Snap               │
└─────────────────┬──────────────────────────────────┬───────────────────┘
                  │                                  │
     Internal SQL: env.DB               AI Inference: env.AI / Gemini
                  │                                  │
┌─────────────────▼───────────────┐ ┌────────────────▼───────────────────┐
│     LAPISAN 3: EDGE DATABASE    │ │       LAPISAN 4: EDGE AI ENGINE    │
│  (Cloudflare D1 - SQLite Edge)  │ │  • Cloudflare Workers AI (Llama)   │
│  • Database: eden-healthy-db    │ │  • Google Gemini Flash (3.6 / 3.8) │
│  • 5 Tabel Relasional:          │ │  • Mengambil stok D1 real-time     │
│    categories, products, tags,  │ │    sebelum memberi rekomendasi     │
│    product_tags, orders         │ │    makanan vegetarian ke customer  │
└─────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 🚀 Fitur Utama Solusi Bisnis

### 1. Eliminasi Pertanyaan Stok Manual
* Setiap produk memiliki badge stok visual:
  * 🟢 **In Stock**: Tersedia $\ge 6$ pcs.
  * 🟡 **Low Stock (Only X left)**: Stok kritis ($\le 5$ pcs).
  * 🔴 **Out of Stock**: Habis (tombol *Add to Basket* otomatis nonaktif).
* Stok berkurang secara atomik di database D1 setiap kali order berhasil diselesaikan.

### 2. Dual-Fulfillment Khusus UNKLAB
* **Click & Collect (Ambil di Toko UNKLAB)**: Gratis ongkos kirim. Pesanan disiapkan dalam 1 jam di counter kampus.
* **Local Courier Delivery**: Gratis ongkos kirim untuk pesanan minimal Rp 150.000 (di bawahnya dikenakan Rp 15.000).

### 3. Simulasi Midtrans Snap Payment Gateway
* Menghadirkan antarmuka modal checkout Midtrans Snap yang interaktif:
  * **QRIS**: Kode QR dinamis dengan identifikasi merchant Airmadidi/UNKLAB (`6008AIRMADIDI610595371`).
  * **Bank Virtual Account**: Nomor VA instan untuk BCA, Mandiri, BNI, dan BRI.
  * **GoPay & Credit Card**.
  * Dilengkapi tombol simulasi pembayaran (`Simulate Payment`) yang menembak webhook `/api/midtrans/simulate-payment` dan menerbitkan struk digital.

### 4. 24/7 AI Customer Assistant (Llama 3.2 & Gemini Flash)
* Mengambang di pojok kiri bawah (`Ask Eden AI`).
* **Cloudflare Workers AI (Default)**: Berjalan 100% gratis di GPU Cloudflare menggunakan model `@cf/meta/llama-3.2-3b-instruct` (tanpa API key).
* **Google Gemini Flash (Opsional)**: Terhubung otomatis jika variabel rahasia `GEMINI_API_KEY` dikonfigurasi.
* Dilengkapi proteksi **4-Layer Defense** terhadap serangan *Prompt Injection* dan *Jailbreak*.

### 5. Back-Office Portal & Order Management System (OMS)
* Antarmuka operasional internal khusus pengelola dan staf toko:
  * **Akses Terproteksi**: Modul Back-Office disembunyikan dari antarmuka etalase publik dan diamankan dengan verifikasi passcode rahasia yang terenkripsi.
  * **Order Management System (OMS)**: Pantau pesanan masuk secara real-time, detail nama & kontak pemesan, catatan antar/ambil di counter, dan perbarui status pesanan (*Processing* ➔ *Ready for Pickup* ➔ *Completed*).
  * **Inventori & Quick Restock**: Pemantauan stok dengan tombol restock cepat (`+1`, `+5`, `+10`) yang langsung memutasi database Cloudflare D1.
  * **Katalog Produk Baru**: Formulir penambahan menu makanan sehat baru langsung ke tabel SQL D1.
  * **Ringkasan Bisnis Live**: Rekapitulasi omzet kotor, jumlah pesanan aktif, rasio *Click & Collect* vs *Delivery*, dan peringatan stok kritis ($\le 5$ pcs).

---

## 🛠️ Panduan Menjalankan Proyek Secara Lokal

### Prasyarat
* Node.js (v18 atau v20 LTS)
* npm atau bun

### Instalasi & Menjalankan Dev Server
```bash
# 1. Kloning repositori
git clone https://github.com/andrewtliem/health-food.git
cd health-food

# 2. Pasang dependensi
npm install

# 3. Jalankan development server
npm run dev
```
Buka browser di `http://localhost:5173/` (atau port yang ditampilkan di terminal).

---

## 🗄️ Menyiapkan Database Cloudflare D1

```bash
# 1. Buat database D1 di akun Cloudflare Anda
npx wrangler d1 create eden-healthy-db

# 2. Catat database_id yang dihasilkan dan masukkan ke wrangler.toml

# 3. Eksekusi skema tabel relasional
npx wrangler d1 execute eden-healthy-db --remote --file=./schema.sql -y

# 4. Eksekusi data awal produk (17 item vegetarian & wholesome)
npx wrangler d1 execute eden-healthy-db --remote --file=./seed.sql -y

# 5. Uji apakah data sudah masuk
npx wrangler d1 execute eden-healthy-db --remote --command="SELECT name, price, stock_quantity FROM products LIMIT 5;"
```

---

## 🔐 Kebijakan Keamanan Kunci Rahasia (Security Policy)

> ⚠️ **PENTING: Jangan Pernah Meng-commit File Secret ke Git!**  
> Repositori ini telah dikonfigurasi dengan aturan `.gitignore` ketat yang memblokir `.env*`, `.dev.vars*`, file kunci privat (`*.key`, `*.pem`), dan token API.

### Cara Menyimpan Secret di Cloudflare Secara Aman:
Jika Anda ingin menggunakan Google Gemini Flash, masukkan kuncinya secara terenkripsi ke Cloudflare:

```bash
npx wrangler pages secret put GEMINI_API_KEY --project-name=eden-healthy-market
```
*(Paste API Key dari [Google AI Studio](https://aistudio.google.com/) saat diminta)*

---

## 🚀 Prosedur Deployment ke Cloudflare Pages

### Metode 1: Deploy Langsung via CLI (Wrangler)
```bash
# 1. Kompilasi TypeScript & Vite
npm run build

# 2. Publikasikan folder dist ke Cloudflare Pages
npx wrangler pages deploy dist --project-name=eden-healthy-market --branch=main
```

### Metode 2: Automatic Continuous Deployment (CI/CD) via GitHub
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) ➔ **Workers & Pages**.
2. Klik **Create application** ➔ pilih tab **Pages** ➔ klik **Connect to Git**.
3. Pilih repositori **`andrewtliem/health-food`**.
4. Set Build Command: `npm run build` dan Output Directory: `dist`.
5. Klik **Save and Deploy**.  
*(Setiap `git push origin main` berikutnya akan otomatis di-build dan di-deploy oleh Cloudflare)*.

---

## 📄 Struktur Repositori

```text
health-food/
├── src/                               <-- Frontend React 18 + Vite + Tailwind CSS
│   ├── components/                    <-- Navbar, Hero, ProductGrid, Cart, Checkout, ChatWidget
│   ├── data/mockData.ts               <-- Data fallback & konstanta kategori
│   ├── lib/api.ts                     <-- Client fetch helper untuk /api/*
│   ├── types.ts                       <-- Definisi TypeScript
│   └── App.tsx                        <-- Root application component
├── functions/api/[[route]].ts         <-- Serverless Edge API (Hono.js)
├── schema.sql                         <-- D1 SQLite schema (5 tabel relasional)
├── seed.sql                           <-- D1 SQLite seed data (17 produk)
├── wrangler.toml                      <-- Infrastructure-as-Code (D1 & Workers AI bindings)
├── PANDUAN_PRAKTIKUM_MAHASISWA.md     <-- Panduan praktikum lengkap (Markdown)
├── PANDUAN_PRAKTIKUM_MAHASISWA.docx   <-- Panduan praktikum lengkap (Microsoft Word)
├── .gitignore                         <-- Proteksi keamanan file rahasia
├── .env.example                       <-- Template variabel lingkungan aman
└── README.md                          <-- Dokumentasi proyek
```

