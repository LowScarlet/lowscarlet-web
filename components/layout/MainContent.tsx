import Image from "next/image";
import { FaExpandAlt, FaRegFilePdf, FaStar } from "react-icons/fa";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { TypeAnimation } from "react-type-animation";
import Badge from "../utils/Badge";
import { FiGithub, FiInstagram, FiMail } from "react-icons/fi";
import { BiLogoLinkedin } from "react-icons/bi";
import { techs } from "../utils/Techs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/libs/utils";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { motion } from "framer-motion";

const social_media = [
  {
    href: 'https://github.com/LowScarlet',
    icon: <FiGithub className='text-2xl' />,
  },
  {
    href: 'https://www.instagram.com/lowscarl3t',
    icon: <FiInstagram className='text-2xl' />,
  },
  {
    href: 'https://www.linkedin.com/in/tegar-maulana-fahreza-04615a221',
    icon: <BiLogoLinkedin className='text-2xl' />,
  },
  {
    href: 'mailto:tegarmaulanafahreza.email@gmail.com',
    icon: <FiMail className='text-2xl' />,
  },
  {
    href: '/resume_ats.pdf',
    icon: <FaRegFilePdf className='text-2xl' />,
  },
]

const projects = [
  {
    href: "/projects/webs",
    title: "Web Applications"
  },
  {
    href: "/projects/androidApps",
    title: "Android Applications"
  },
  {
    href: "/projects/games",
    title: "Game Developments"
  }
];

export default function MainContent() {
  const pathname = usePathname();
  const { nextJs, expressJs, prismaOrm } = techs

  return (
    <div className="space-y-8 bg-[#101010] px-8 py-10 sm:min-w-lg max-w-sm h-full">
      <div>
        <div className="flex items-center space-x-2">
          <button className="group">
            <div className="relative hover:opacity-50 rounded-full w-12 h-12 overflow-hidden transition duration-300 ease-in-out">
              <Image width={100} height={100} quality={100} src={"/pp.png"} alt={"/pp.png"} />
              <div className="absolute inset-0 flex justify-center items-center">
                <FaExpandAlt className="opacity-0 group-hover:opacity-100 text-xl transition-opacity duration-300" />
              </div>
            </div>
          </button>
          <div className="grow">
            <h1 className="font-bold text-gray-700 dark:text-white text-base">
              Tegar Maulana Fahreza
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm"><FiGithub className="inline" /> LowScarlet</p>
          </div>
          <button className="group flex flex-col justify-center items-center rounded-full w-12 h-12 text-pink-500 dark:text-violet-400 transition cursor-pointer">

            <motion.div
              variants={{
                rest: { x: 0 },
                hover: {
                  x: [0, -3, 3, -3, 3, 0],
                  transition: { duration: 0.4 },
                },
              }}
              initial="rest"
              animate="rest"
              whileHover="hover"
            >
              <GoHeart className="group-hover:hidden text-2xl" />
              <GoHeartFill className="hidden group-hover:inline text-2xl" />
            </motion.div>

            <h1 className="font-bold text-xs text-center">
              100
            </h1>
          </button>
        </div>
      </div>
      <div className="space-y-4 text-gray-700 dark:text-gray-400 text-xl">
        <h2 className="font-bold">
          I make <TypeAnimation
            className="bg-clip-text bg-linear-to-r from-pink-500 to-violet-500 text-transparent text-2xl"
            preRenderFirstString={true}
            sequence={[
              'websites',
              1000,
              'frontends',
              1000,
              'backends',
              1000,
              'apps',
              1000,
            ]}
            speed={40}
            repeat={Infinity}
          />
        </h2>
        <p>
          I&lsquo;m Tegar, an Indonesian web developer with a deep passion for technology. I enjoy crafting functional and visually appealing websites.
        </p>
        <p>
          Currently working in a small and messing project with <Badge title={nextJs.title} icon={nextJs.icon} href={nextJs.link} />, <Badge title={expressJs.title} icon={expressJs.icon} href={expressJs.link} />, <Badge title={prismaOrm.title} icon={prismaOrm.icon} href={prismaOrm.link} /> & some other tooling.
        </p>
        <div className="flex flex-row gap-3 mt-8 py-2 overflow-x-auto">
          {social_media.map((item, index) => (
            <Link target="_blank" key={index} href={item.href} className="flex flex-row justify-start items-center gap-2.5 bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-900 px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 transition duration-300 ease-in-out">
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h1 className="flex items-center space-x-2 font-bold text-xl">
          <FaStar className="inline" />
          <span>Featured Projects</span>
        </h1>

        <div className="mt-2">
          {projects.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={isActive ? "/" : item.href}
                scroll={false}
                className={cn(
                  "flex justify-between items-center px-1 py-2 w-full text-lg cursor-pointer",
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <span className="flex items-center space-x-2">
                  <MdOutlineKeyboardArrowRight className="text-2xl" />
                  <span>{item.title}</span>
                </span>

                <AiOutlineLink className="text-2xl" />
              </Link>
            );
          })}
        </div>
      </div>
    </div >
  );
}