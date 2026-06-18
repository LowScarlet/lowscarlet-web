"use client";

import Image from "next/image";
import { FaRegFilePdf, FaStar } from "react-icons/fa";
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
import { useEffect, useState } from "react";
import { Counter } from "../utils/Counter";
import { AppConfigMap } from "@/db/queries/config";

const projects = [
  { href: "/projects/webs", title: "Web Applications" },
  { href: "/projects/games", title: "Game Developments" },
  { href: "/projects/iot", title: "IoT & Hardware" },
];

/* ANIMATION */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

const { nextJs, expressJs, drizzleOrm } = techs;

export default function MainContent() {
  const pathname = usePathname();
  const [config, setConfig] = useState<AppConfigMap | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfigAndLikes = async () => {
      try {
        setLoading(true);

        const [resConfig, resLikes] = await Promise.all([
          fetch("/api/config"),
          fetch("/api/likes"),
        ]);

        if (!resConfig.ok) {
          throw new Error("Failed to fetch config");
        }

        const dataConfig = await resConfig.json();
        setConfig(dataConfig);

        if (resLikes.ok) {
          const dataLikes = await resLikes.json();
          setLikesCount(dataLikes.totalLikes);
        }
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchConfigAndLikes();

    const handleLikesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === 'number') {
        setLikesCount(customEvent.detail);
      }
    };

    window.addEventListener('social-likes-updated', handleLikesUpdate);
    return () => {
      window.removeEventListener('social-likes-updated', handleLikesUpdate);
    };
  }, []);

  const social_media = [
    { href: config?.SOCIAL_GITHUB || 'https://github.com/LowScarlet', icon: <FiGithub className='text-2xl' /> },
    { href: config?.SOCIAL_INSTAGRAM || 'https://www.instagram.com/lowscarl3t', icon: <FiInstagram className='text-2xl' /> },
    { href: config?.SOCIAL_LINKEDIN || 'https://www.linkedin.com/in/tegar-maulana-fahreza-04615a221', icon: <BiLogoLinkedin className='text-2xl' /> },
    { href: config?.SOCIAL_EMAIL ? (config.SOCIAL_EMAIL.startsWith('mailto:') ? config.SOCIAL_EMAIL : 'mailto:' + config.SOCIAL_EMAIL) : 'mailto:tegarmaulanafahreza.email@gmail.com', icon: <FiMail className='text-2xl' /> },
    { href: config?.CV_ATS_URL || '/resume_ats.pdf', icon: <FaRegFilePdf className='text-2xl' /> },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 bg-[#101010] px-8 py-10 sm:min-w-lg max-w-md h-full"
    >
      {/* PROFILE */}
      <motion.div variants={item}>
        <div className="flex items-center">
          <div className="group grow">
            <Link href={!(pathname === '/dashboard') ? "/dashboard" : '/'} className="group flex space-x-2 w-fit text-start cursor-pointer">
              <div className="bg-linear-to-r from-pink-500 to-violet-500 p-0.5 rounded-full">
                <div className="group-hover:opacity-90 rounded-full w-12 h-12 overflow-hidden transition duration-300">

                  <Image
                    width={100}
                    height={100}
                    src={"/pp.png"}
                    alt={"/pp.png"}
                    className="object-cover"
                  />

                </div>
              </div>

              <div>
                <h1 className="font-bold text-gray-700 dark:text-white text-base">
                  Tegar Maulana Fahreza
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  <FiGithub className="inline" /> LowScarlet
                </p>
              </div>
            </Link>
          </div>

          {/* LIKE BUTTON */}
          <Link
            href="/social"
            scroll={false}
            className="group flex flex-col justify-center items-center rounded-full w-12 h-12 text-pink-500 dark:text-violet-400 cursor-pointer"
          >
            <motion.div
              initial="rest"
              animate="rest"
              whileHover="hover"
              variants={{
                rest: { x: 0 },
                hover: {
                  x: [0, -3, 3, -3, 3, 0],
                  transition: { duration: 0.4 },
                },
              }}
            >
              <GoHeart className="group-hover:hidden text-2xl" />
              <GoHeartFill className="hidden group-hover:inline text-2xl" />
            </motion.div>
            <h1 className="font-bold text-xs text-center">
              {loading || error ? 0 : <Counter value={likesCount} />}
            </h1>
          </Link>
        </div>
      </motion.div>

      {/* ABOUT */}
      <motion.div variants={item} className="space-y-4 text-gray-700 dark:text-gray-400 text-xl">
        <h2 className="font-bold">
          I make{" "}
          <TypeAnimation
            className="bg-clip-text bg-linear-to-r from-pink-500 to-violet-500 text-transparent text-2xl"
            preRenderFirstString={true}
            sequence={[
              'websites', 1000,
              'frontends', 1000,
              'backends', 1000,
              'apps', 1000,
            ]}
            speed={40}
            repeat={Infinity}
          />
        </h2>

        <p>
          I’m Tegar, an Indonesian web developer with a deep passion for technology. I enjoy crafting functional and visually appealing websites.
        </p>

        <p>
          Currently working in a small and messing project with{" "}
          <Badge title={nextJs.title} icon={nextJs.icon} href={nextJs.link} />,{" "}
          <Badge title={expressJs.title} icon={expressJs.icon} href={expressJs.link} />,{" "}
          <Badge title={drizzleOrm.title} icon={drizzleOrm.icon} href={drizzleOrm.link} /> & some other tooling.
        </p>

        {/* SOCIAL */}
        <div className="flex flex-row gap-3 mt-8 py-2">
          {social_media.map((itemSocial, index) => (
            <motion.div key={index} variants={item}>
              <Link
                target="_blank"
                href={itemSocial.href}
                className="flex items-center gap-2.5 bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-900 px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 transition duration-300"
              >
                {itemSocial.icon}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* PROJECTS */}
      <motion.div variants={item}>
        <h1 className="flex items-center space-x-2 font-bold text-xl">
          <FaStar />
          <span>Featured Projects</span>
        </h1>

        <div className="mt-2">
          {projects.map((itemProject) => {
            const isActive = pathname === itemProject.href;

            return (
              <motion.div key={itemProject.href} variants={item}>
                <Link
                  href={isActive ? "/" : itemProject.href}
                  scroll={false}
                  className={cn(
                    "flex justify-between items-center px-1 py-2 w-full text-lg cursor-pointer",
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  <span className="flex items-center space-x-2">
                    <MdOutlineKeyboardArrowRight className="text-2xl" />
                    <span>{itemProject.title}</span>
                  </span>

                  <AiOutlineLink className="text-2xl" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}