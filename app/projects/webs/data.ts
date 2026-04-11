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
    title: "Sistem Informasi Akademik ICC Pekanbaru",
    description:
      "Platform manajemen akademik yang dirancang untuk mengelola seluruh aspek kegiatan pendidikan secara terpusat, mulai dari data siswa, pengaturan jadwal pelajaran, pengolahan nilai, hingga administrasi sekolah. Sistem ini membantu meningkatkan efisiensi operasional dengan menyediakan akses terintegrasi bagi guru, siswa, dan pihak administrasi, serta mendukung proses monitoring, pelaporan, dan pengambilan keputusan secara lebih cepat dan akurat dalam satu ekosistem digital yang mudah digunakan.",
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
    contributors: [
      'Tegar Maulana Fahreza',
      'Ahmed Aladin'
    ]
  },
];