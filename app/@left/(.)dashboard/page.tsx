'use client'

import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { FaBlog, FaCode, FaRegFolder, FaUsers } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SiReaddotcv } from "react-icons/si";
import { GrUpdate } from "react-icons/gr";
import { IoWarningOutline } from "react-icons/io5";
import { MdWork } from "react-icons/md";

const blogs = [
  {
    image: '/test.png',
    title: 'Build Modern Web',
    desc: 'Exploring modern web development with Next.js and Tailwind.',
  },
  {
    image: '/pp.png',
    title: 'UI & Animation',
    desc: 'Creating smooth UI and micro-interactions with Framer Motion.',
  },
];

const commits = [
  {
    message: "feat: add dashboard layout",
    date: "2026-04-12",
  },
  {
    message: "fix: improve mobile responsiveness",
    date: "2026-04-11",
  },
  {
    message: "style: refine UI spacing",
    date: "2026-04-10",
  },
  {
    message: "feat: add blog carousel",
    date: "2026-04-09",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function LeftPanel() {

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (blogs.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % blogs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="flex items-center space-x-2">
          <FaRegFolder />
          <span>Dashboard</span>
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer"
          >
            <LuExpand />
          </button>

          <Link scroll={false} href="/">
            <IoMdClose className="text-2xl" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 px-6 py-2 overflow-y-auto text-gray-400 grow">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-linear-to-r from-pink-500 to-violet-500 px-4 py-2 rounded-xl overflow-hidden font-bold text-white"
        >
          {/* glow effect */}
          <div className="absolute inset-0 bg-white/10 opacity-30 blur-xl" />

          <h1 className="z-10 relative flex items-center space-x-2">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
            >
              <IoWarningOutline />
            </motion.span>

            <span>
              Sorry, the website is currently under development
            </span>
          </h1>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {/* STATS */}
          <div className="gap-3 grid grid-cols-2">

            <motion.div
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="relative bg-neutral-800 p-4 rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-pink-500/10 to-violet-500/10" />

              <div className="z-10 relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-400 text-xs">Visitors</h2>
                  <FaUsers className="text-pink-400 text-sm" />
                </div>
                <p className="mt-1 font-bold text-white text-xl">1,284</p>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="relative bg-neutral-800 p-4 rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10" />

              <div className="z-10 relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-400 text-xs">Projects</h2>
                  <FaCode className="text-blue-400 text-sm" />
                </div>
                <p className="mt-1 font-bold text-white text-xl">12</p>
              </div>
            </motion.div>

          </div>

          {/* STATUS */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="flex justify-between items-center bg-neutral-800 p-4 rounded-xl"
          >
            <div>
              <h2 className="text-gray-400 text-xs">Status</h2>
              <p className="font-medium text-green-400">Available for work</p>
            </div>

            <div className="flex items-center gap-2 text-green-400">
              <span className="bg-green-400 rounded-full w-2 h-2 animate-pulse" />
              <MdWork />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="flex items-center space-x-2 font-bold text-white text-xl">
            <motion.span
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <SiReaddotcv />
            </motion.span>
            <span>My Curriculum Vitae</span>
          </h1>

          <div className="flex gap-2">
            {/* ATS */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex-1">
              <Link
                href="/cv-ats.pdf"
                target="_blank"
                className="block relative bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg overflow-hidden font-medium text-sm text-center transition"
              >
                {/* subtle shine */}
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition" />
                ATS Version
              </Link>
            </motion.div>

            {/* CREATIVE */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex-1">
              <Link
                href="/cv-creative.pdf"
                target="_blank"
                className="block relative bg-linear-to-r from-pink-500 to-violet-500 px-4 py-2 rounded-lg overflow-hidden font-medium text-white text-sm text-center"
              >
                {/* glow pulse */}
                <span className="absolute inset-0 bg-white/20 opacity-30 blur-lg" />
                Creative
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="flex items-center space-x-2 font-bold text-white text-xl">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <FaBlog />
            </motion.span>
            <span>My Blog</span>
          </h1>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="group relative rounded-2xl w-full aspect-16/6 overflow-hidden"
          >

            {/* IMAGE */}
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={blogs[index].image}
                  alt="blog cover"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-700"
                />
              </motion.div>
            </AnimatePresence>

            {/* GRADIENT + GLOW */}
            <div className="z-10 absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />

            {/* TEXT */}
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bottom-0 z-20 absolute p-4 text-white"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-bold text-lg"
                >
                  {blogs[index].title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-300 text-sm line-clamp-2"
                >
                  {blogs[index].desc}
                </motion.p>
              </motion.div>
            </AnimatePresence>

          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          <h1 className="flex items-center space-x-2 font-bold text-white text-xl">
            <motion.span
              initial={{ rotate: -15, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <GrUpdate />
            </motion.span>
            <span>My Website Commit History</span>
          </h1>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="space-y-3 bg-neutral-800 p-4 rounded-xl"
          >
            {commits.map((commit, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ x: 4 }}
                className="group flex items-start gap-3 transition"
              >

                {/* DOT */}
                <div className="relative mt-1">
                  <span className="inline-flex absolute bg-green-400 opacity-75 blur-[2px] rounded-full w-2 h-2" />
                  <span className="block relative bg-green-400 rounded-full w-2 h-2 group-hover:scale-125 transition" />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col">
                  <span className="text-white group-hover:text-green-400 text-sm transition">
                    {commit.message}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(commit.date).toLocaleDateString()}
                  </span>
                </div>

              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}