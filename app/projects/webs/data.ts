import { project_type } from "@/components/utils/ProjectType";
import { techs } from "@/components/utils/Techs";
import { FiGithub } from "react-icons/fi";
import { AiOutlineLink } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa";

export const projects = [
  {
    images: [
      '/test.png',
      '/pp.png',
    ],
    title: "Sistem Informasi Manajemen Kampus - International Career College Pekanbaru",
    description: `
Sistem Informasi Manajemen Kampus ini merupakan aplikasi yang dirancang untuk mendukung pengelolaan operasional akademik di **International Career College Pekanbaru** secara terintegrasi dan efisien. Sistem ini bertujuan untuk mempermudah proses administrasi serta meningkatkan akurasi dan aksesibilitas data akademik.

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
3. Mempermudah akses dan pengelolaan data akademik  
    `,
    tags: [
      project_type.finalProjectThesis,
      project_type.casualWebsite,
    ],
    techs: [
      techs.railway,
      techs.nextJs,
      techs.expressJs,
      techs.postgreSql,
    ],
    links: [
      {
        href: "https://github.com/LowScarlet",
        icon: FiGithub,
      },
      {
        href: "https://icc-demo.vercel.app",
        icon: AiOutlineLink,
      },
      {
        href: "https://wa.me/628123456789",
        icon: FaWhatsapp,
      },
    ],
    startDate: new Date(),
    releaseDate: new Date(),
    contributors: [
      'Tegar Maulana Fahreza',
      'Ahmed Aladin'
    ]
  },
];