import { db } from "..";
import { projects } from "../schema";

export async function seedProjects() {
  try {
    const existing = await db.select({ id: projects.id }).from(projects).limit(1);
    if (existing.length > 0) {
      return;
    }

    await db.insert(projects).values([
      {
        title: "Sistem Informasi Manajemen Kampus - International Career College Pekanbaru",
        category: "webs",
        description: `Sistem Informasi Manajemen Kampus ini merupakan aplikasi yang dirancang untuk mendukung pengelolaan operasional akademik di **International Career College Pekanbaru** secara terintegrasi dan efisien. Sistem ini bertujuan untuk mempermudah proses administrasi serta meningkatkan akurasi dan aksesibilitas data akademik.

Aplikasi ini menyediakan berbagai fitur utama seperti manajemen data mahasiswa dan dosen, pengelolaan jadwal perkuliahan, sistem penilaian akademik, serta pengaturan mata kuliah. Selain itu, sistem dilengkapi dengan mekanisme **role-based access** sehingga setiap pengguna—baik admin, dosen, maupun mahasiswa—dapat mengakses fitur sesuai dengan peran masing-masing.

Pengembangan sistem ini menekankan pada kemudahan penggunaan, efisiensi dalam pengolahan data, serta struktur sistem yang fleksibel untuk pengembangan lebih lanjut. Sistem ini juga dirancang untuk membantu institusi dalam mengelola informasi akademik secara lebih terorganisir dan sistematis.

## Fitur Utama
1. Manajemen data mahasiswa dan dosen  
2. Pengelolaan jadwal perkuliahan  
3. Sistem penilaian dan input nilai  
4. Manajemen mata kuliah  
5. Role-based access (admin, dosen, mahasiswa)  

## Tujuan
1. Meningkatkan efisiensi operasional kampus  
2. Meminimalisir kesalahan administrasi  
3. Mempermudah akses dan pengelolaan data akademik`,
        images: [
          { no: 1, src: "/test.png" },
          { no: 2, src: "/pp.png" }
        ],
        tags: ["finalProjectThesis", "casualWebsite"],
        techs: ["railway", "nextJs", "expressJs", "postgreSql"],
        links: [
          { href: "https://github.com/LowScarlet", icon: "github" },
          { href: "https://icc-demo.vercel.app", icon: "link" },
          { href: "https://wa.me/628123456789", icon: "whatsapp" }
        ],
        contributors: ["Tegar Maulana Fahreza", "Ahmed Aladin"],
        startDate: new Date("2025-01-01"),
        releaseDate: new Date("2025-06-01"),
        displayOrder: 1,
      },
      {
        title: "Sistem Inventaris & Penjualan Sparepart Motor - Berkat Motor",
        category: "webs",
        description: `Sistem Inventaris dan Penjualan Sparepart Motor ini merupakan aplikasi yang dirancang untuk mendukung pengelolaan operasional toko sparepart dan bengkel motor secara terintegrasi dan efisien. Sistem ini bertujuan untuk mempermudah proses pengelolaan stok, transaksi penjualan, serta meningkatkan akurasi pencatatan data dan laporan keuangan.

Aplikasi ini menyediakan berbagai fitur utama seperti manajemen inventaris berbasis FIFO, transaksi penjualan sparepart, pencatatan servis motor, pengelolaan supplier, serta sistem pelaporan bisnis. Selain itu, sistem dilengkapi dengan teknologi pemindaian barcode dan asisten AI untuk membantu proses input data produk secara lebih cepat dan akurat.

Pengembangan sistem ini menekankan pada kemudahan penggunaan, efisiensi operasional, keamanan data melalui role-based access control (RBAC), serta kemampuan sistem dalam memberikan informasi stok dan laporan bisnis secara real-time. Sistem juga dirancang agar fleksibel untuk pengembangan fitur di masa mendatang.

## Fitur Utama

- Manajemen inventaris sparepart berbasis FIFO
- POS penjualan sparepart dan servis motor
- Pencatatan kartu stok (stock ledger)
- Pengelolaan supplier dan pembelian barang
- Scan barcode melalui kamera atau scanner
- Asisten AI untuk input data produk
- Pengaturan harga jual dan markup otomatis
- Retur pembelian supplier
- Role-based access (Admin, Manager, Kasir)
- Laporan penjualan, pembelian, stok, dan laba

## Tujuan

- Meningkatkan efisiensi operasional bengkel dan toko sparepart
- Meminimalisir kesalahan pencatatan stok dan transaksi
- Menjamin akurasi perhitungan HPP dan laba menggunakan metode FIFO
- Mempermudah proses input dan pengelolaan data produk
- Menyediakan laporan bisnis yang cepat dan akurat untuk pengambilan keputusan`,
        images: [
          {
            no: 1,
            src: "https://oag9fws5ivubotuq.public.blob.vercel-storage.com/berkat-motor-app.vercel.app_admin%20%282%29-4Ne2jZYVXtjmbtddOn0IlN8XpOfTmi.png"
          },
          {
            no: 2,
            src: "https://oag9fws5ivubotuq.public.blob.vercel-storage.com/berkat-motor-app.vercel.app_admin-yYoHmfKxycZsi5HBT0KGJlmgDMAmZ0.png"
          }
        ],
        tags: ["webApplication"],
        techs: ["nextJs", "drizzleOrm", "postgreSql", "vercel"],
        links: [
          { href: "https://wa.me/6281270634992", icon: "whatsapp" }
        ],
        contributors: ["Tegar Maulana Fahreza", "Berkat Motor Team"],
        startDate: new Date("2026-04-01"),
        releaseDate: new Date("2026-06-19"),
        location: "Indragiri Hulu, Indonesia",
        cvSubtitle: "Web Applications",
        cvHighlights: [
          "Developed a web-based cashier and sales management application using Next.js, PostgreSQL, and Tailwind CSS.",
          "Designed transaction management and sales analytics features that generated automated revenue reports and data visualizations for business monitoring.",
          "Integrated barcode scanning and Gemini AI API functionality to accelerate product identification and cashier operations."
        ],
        displayOrder: 2,
      },
      {
        title: "LowScarlet - Personal Developer Portfolio & Interactive Visitor Hub",
        category: "webs",
        description: `LowScarlet - Personal Developer Portfolio & Interactive Visitor Hub merupakan aplikasi web portofolio interaktif dan modern yang dirancang untuk menampilkan karya, perjalanan karir, keterampilan teknis, serta pengalaman proyek secara profesional dan visual yang menarik. Aplikasi ini dibangun menggunakan arsitektur Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, serta database Neon PostgreSQL dengan Drizzle ORM.

Aplikasi ini tidak hanya berfungsi sebagai portofolio statis, tetapi juga dilengkapi dengan Visitor Social Hub interaktif yang memungkinkan pengunjung memberikan apresiasi (likes), meninggalkan pesan/komentar secara real-time, melihat peta statistik pengunjung dunia (visitor map), serta mengunduh resume ATS dan Creative CV secara otomatis.

Pengembangan sistem ini menekankan pada estetika visual modern (dark mode, glassmorphism, micro-animations), kecepatan performa, kemudahan navigasi dengan Next.js Parallel & Intercepting Routes (modal side-drawer), serta integrasi manajemen konten dan proyek berbasis database.

## Fitur Utama

- Portfolio & Project Showcase dengan sistem filter kategorisasi interaktif
- Navigasi Parallel & Intercepting Routes untuk modal side-drawer (Projects, Social Hub, Profile) tanpa berpindah halaman
- Interactive Visitor Social Hub dengan fitur Global Likes, Buku Tamu/Komentar real-time, dan Peta Pengunjung Dunia
- Automatic Resume Generator (ekspor CV berformat ATS-compliant & Creative PDF)
- Interactive Media Player, Audio Hub, dan animasi Easter Eggs
- Dashboard Admin untuk manajemen proyek, pendidikan, pengalaman, sertifikasi, dan konfigurasi profil
- Responsive Layout & Fluid Micro-Animations menggunakan Framer Motion dan Tailwind CSS v4

## Tujuan

- Menyediakan platform portofolio profesional dan interaktif untuk merepresentasikan keahlian serta karya pengembang
- Meningkatkan keterlibatan (engagement) pengunjung melalui fitur sosial seperti buku tamu, likes, dan analytics pengunjung
- Memudahkan pembuatan dan ekspor resume standar ATS dan profil kreatif secara otomatis dan terintegrasi
- Mengimplementasikan praktik terbaik arsitektur web modern Next.js 16 (Parallel Routes, Intercepting Routes, Drizzle ORM, & Neon PostgreSQL)`,
        images: [
          { no: 1, src: "/screenshots/homepage.png" },
          { no: 2, src: "/screenshots/projects.png" }
        ],
        tags: ["webApplication", "casualWebsite"],
        techs: ["nextJs", "drizzleOrm", "postgreSql", "vercel"],
        links: [
          { href: "https://github.com/LowScarlet/lowscarlet-web", icon: "github" },
          { href: "https://lowscarlet.my.id", icon: "link" },
          { href: "https://wa.me/6281270634992", icon: "whatsapp" }
        ],
        contributors: ["Tegar Maulana Fahreza"],
        startDate: new Date("2026-01-15"),
        releaseDate: new Date("2026-07-31"),
        location: "Indragiri Hulu, Indonesia",
        cvSubtitle: "Web Applications",
        cvHighlights: [
          "Developed a full-stack personal portfolio and visitor social hub using Next.js 16 App Router, TypeScript, Tailwind CSS v4, and Neon PostgreSQL.",
          "Implemented Next.js Parallel & Intercepting Routes to deliver seamless side-drawer modal navigation, interactive visitor comment feeds, and real-time likes counter.",
          "Designed automated resume generation and PDF export engines for ATS-compliant CVs and interactive showcase layouts."
        ],
        displayOrder: 0,
      }
    ]);

    console.log("[Seeder] Successfully seeded initial sample project");
  } catch (error) {
    console.error("[Seeder] Failed to seed database:", error);
  }
}
