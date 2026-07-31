import { db } from "..";
import { projects } from "../schema";

export async function seedProjects() {
  try {
    const existing = await db.select({ id: projects.id }).from(projects).limit(1);
    if (existing.length > 0) {
      return;
    }

    await db.insert(projects).values({
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
      startDate: new Date(),
      releaseDate: new Date(),
    });

    console.log("[Seeder] Successfully seeded initial sample project");
  } catch (error) {
    console.error("[Seeder] Failed to seed database:", error);
  }
}
