/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Badge from "@/components/utils/Badge";
import { formatDate } from "@/libs/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

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
  startDate: Date;
  releaseDate?: Date;
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
  startDate,
  releaseDate,
  isLast = false,
}: ProjectProps) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 180;
  const isLong = description.length > MAX_LENGTH;
  const shortText = description.slice(0, MAX_LENGTH) + "...";

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
                alt="project image"
                fill
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CONTENT */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* TITLE + TAGS */}
        <div>
          <motion.h1
            variants={item}
            className="mt-4 font-bold text-white text-xl"
          >
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
          <motion.div
            variants={item}
          >
            {/* COLLAPSED */}
            {!expanded && (
              <div className="dark:prose-invert mt-2 max-w-none prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    p: ({ children }) => (
                      <p className="inline text-gray-400 leading-relaxed">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {shortText}
                </ReactMarkdown>

                {isLong && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="inline ml-2 text-blue-400 text-sm hover:underline cursor-pointer"
                  >
                    Read more
                  </button>
                )}
              </div>
            )}

            {/* EXPANDED (pakai animasi) */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="dark:prose-invert mt-2 max-w-none prose">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        h2: ({ children }) => (
                          <h2 className="font-bold text-white text-xl">
                            {children}
                          </h2>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-400 leading-relaxed">
                            {children}
                          </p>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-400">{children}</li>
                        ),
                      }}
                    >
                      {description}
                    </ReactMarkdown>

                    {/* SHOW LESS di bawah */}
                    <button
                      onClick={() => setExpanded(false)}
                      className="mt-2 text-blue-400 text-sm hover:underline cursor-pointer"
                    >
                      Show less
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* LINKS */}
          <motion.div
            variants={item}
            className="flex gap-3 mt-6 py-2 overflow-x-auto"
          >
            {links.map(({ href, icon: Icon }, i) => (
              <Link
                key={i}
                target="_blank"
                href={href}
                className="flex justify-center items-center bg-neutral-50 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-900 px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 transition"
              >
                <Icon className="text-2xl" />
              </Link>
            ))}
          </motion.div>

          {/* DATE */}
          <motion.div variants={item} className="mt-4 text-sm">
            <span className="font-medium text-white">
              Development Date:{" "}
            </span>
            <span className="text-gray-400">
              {formatDate(startDate)} -{" "}
              {releaseDate ? formatDate(releaseDate) : "Present"}
            </span>
          </motion.div>

          {/* CONTRIBUTORS */}
          {contributors && contributors.length > 1 && (
            <motion.div variants={item} className="mt-4 text-sm">
              <span className="font-medium text-white">
                Contributors:{" "}
              </span>
              <span className="text-gray-400">
                {contributors.length === 2
                  ? `${contributors[0]} and ${contributors[1]}`
                  : `${contributors
                    .slice(0, -1)
                    .join(", ")} and ${contributors.at(-1)}`}
              </span>
            </motion.div>
          )}

          {/* TECH STACK */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-2 mt-4"
          >
            <span className="font-medium text-white text-sm">
              Tech Stacks:
            </span>
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