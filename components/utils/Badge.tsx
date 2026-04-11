"use client"

import { ReactNode } from "react";
import Link from "next/link";

export default function Badge({
  title,
  icon,
  href
}: {
  title: ReactNode,
  icon: ReactNode,
  href?: string,
}) {
  return (
    href ? (
      <Link target="_blank" href={href} className="inline-flex items-center bg-neutral-50 dark:bg-neutral-800 p-1 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 text-sm no-underline leading-4">
        <span className="pe-1">{icon}</span > {title}
      </Link>
    ) : (
      <span className="inline-flex items-center bg-neutral-50 dark:bg-neutral-800 p-1 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 text-sm no-underline leading-4">
        <span className="pe-1">{icon}</span > {title}
      </span >
    )
  )
}