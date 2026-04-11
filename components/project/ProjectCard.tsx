/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Badge from "@/components/utils/Badge";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ProjectProps = {
  images: string[];
  title: string;
  description: string;
  tags: any[];
  techs: any[];
  links: {
    href: string;
    icon: any;
  }[];
  contributors?: string[];
  isLast?: boolean;
};

/* ANIMATION VARIANTS */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function ProjectCard({
  images = [],
  title,
  description,
  tags,
  techs,
  links,
  contributors,
  isLast = false,
}: ProjectProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="space-y-4">
      {/* IMAGE */}
      <div className="relative rounded-2xl w-full aspect-video overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full"
          >
            {images.length > 0 && (
              <Image
                src={images[index]}
                alt="project image 16:9"
                fill
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* TEXT CONTENT */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* TITLE + TAGS */}
        <div>
          <motion.h1 variants={item} className="mt-4 font-bold text-xl">
            {title}
          </motion.h1>

          <motion.div variants={item} className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Badge
                key={i}
                title={tag.title}
                icon={tag.icon}
                href={tag.link}
                scale="small"
              />
            ))}
          </motion.div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <motion.p variants={item} className="mt-2">
            {description}
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            variants={item}
            className="flex gap-3 mt-6 py-2 overflow-x-auto"
          >
            {links.map(({ href, icon: Icon }, i) => (
              <Link
                key={i}
                target="_blank"
                href={href}
                className="flex justify-center items-center bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-900 px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 transition duration-300"
              >
                <Icon className="text-2xl" />
              </Link>
            ))}
          </motion.div>

          {/* CONTRIBUTORS */}
          {contributors && contributors.length > 1 && (
            <motion.div variants={item} className="mt-4">
              <span className="font-medium text-sm">Contributors: </span>
              {contributors.length === 2
                ? `${contributors[0]} and ${contributors[1]}`
                : `${contributors.slice(0, -1).join(", ")} and ${contributors.at(-1)}`
              }
            </motion.div>
          )}

          {/* TECH STACK */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-2 mt-4"
          >
            <span className="font-medium text-sm">Tech Stacks:</span>
            {techs.map((tech, i) => (
              <Badge
                key={i}
                title={tech.title}
                icon={tech.icon}
                href={tech.link}
              />
            ))}
          </motion.div>

          {/* DIVIDER */}
          {!isLast && (
            <motion.div variants={item} className="pt-6">
              <div className="bg-neutral-200 dark:bg-neutral-700 w-full h-px" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}