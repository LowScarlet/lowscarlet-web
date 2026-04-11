import { project_type } from "@/components/utils/ProjectType";
import { techs } from "@/components/utils/Techs";
import { FiGithub } from "react-icons/fi";
import { AiOutlineLink } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa";

export const projects = [
  {
    title: "Sistem Informasi Akademik ICC Pekanbaru",
    description:
      "Platform manajemen akademik untuk mengelola data siswa, jadwal, nilai, dan administrasi secara terpusat.",
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
  },
  {
    title: "E-Commerce Dashboard Admin",
    description:
      "Dashboard admin untuk mengelola produk, pesanan, dan analitik penjualan dengan visualisasi data real-time.",
    tags: [
      project_type.casualWebsite,
    ],
    techs: [
      techs.nextJs,
      techs.expressJs,
      techs.postgreSql,
      techs.railway,
    ],
    links: [
      {
        href: "https://github.com/LowScarlet/ecommerce-dashboard",
        icon: FiGithub,
      },
      {
        href: "https://ecommerce-demo.vercel.app",
        icon: AiOutlineLink,
      },
    ],
  },
];