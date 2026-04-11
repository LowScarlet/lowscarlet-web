/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Badge from "@/components/utils/Badge";
import Link from "next/link";

type ProjectProps = {
  title: string;
  description: string;
  tags: any[];
  techs: any[];
  links: {
    href: string;
    icon: any;
  }[];
  isLast?: boolean;
};

export default function ProjectCard({
  title,
  description,
  tags,
  techs,
  links,
  isLast = false
}: ProjectProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="bg-amber-600 p-20 rounded-2xl" />
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

        {/* TECH STACK */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="font-medium text-sm">Techs:</span>
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