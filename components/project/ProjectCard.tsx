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
  contributors?: string[],
  isLast?: boolean;
};

export default function ProjectCard({
  images = [],
  title,
  description,
  tags,
  techs,
  links,
  contributors,
  isLast = false
}: ProjectProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="space-y-4">
      <div>
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
              <Image
                src={images[index]}
                alt="project image 16:9"
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <h1 className="mt-4 font-bold text-xl">{title}</h1>

        <div className="flex flex-wrap gap-2">
          {tags.map((item, i) => (
            <Badge
              key={i}
              title={item.title}
              icon={item.icon}
              href={item.link}
              scale="small"
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mt-2">{description}</p>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-6 py-2 overflow-x-auto">
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
        </div>

        {/* CONTRIBUTORS */}
        {contributors && contributors.length > 1 && (
          <div className="mt-4">
            <span className="font-medium text-sm">Contributors: </span>
            {contributors.length === 2
              ? `${contributors[0]} and ${contributors[1]}`
              : `${contributors.slice(0, -1).join(", ")} and ${contributors.at(-1)}`
            }
          </div>
        )}

        {/* TECH STACK */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="font-medium text-sm">Tech Stacks:</span>
          {techs.map((item, i) => (
            <Badge
              key={i}
              title={item.title}
              icon={item.icon}
              href={item.link}
            />
          ))}
        </div>

        {/* DIVIDER */}
        {!isLast && (
          <div className="pt-6">
            <div className="bg-neutral-200 dark:bg-neutral-700 w-full h-px" />
          </div>
        )}
      </div>
    </div>
  );
}