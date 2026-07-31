import React, { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

export default function Badge({
  title,
  icon,
  href,
  scale = 'normal'
}: {
  title: ReactNode,
  icon: ReactNode,
  href?: string,
  scale?: 'normal' | 'small'
}) {

  const baseClass =
    "inline-flex items-center bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 no-underline";

  const sizeClass = {
    normal: "px-2 py-1 text-sm leading-4 gap-1.5",
    small: "px-1.5 py-0.5 text-xs leading-3 gap-1",
  };

  const labelText = typeof title === "string" ? title : "Badge icon";

  const renderIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ "aria-label"?: string; "aria-hidden"?: string }>, {
        "aria-label": labelText,
        "aria-hidden": "true",
      })
    : icon;

  const content = (
    <>
      <span className="flex items-center">{renderIcon}</span>
      {title}
    </>
  );

  const className = clsx(baseClass, sizeClass[scale]);

  return href ? (
    <Link target="_blank" href={href} className={className}>
      {content}
    </Link>
  ) : (
    <span className={className}>
      {content}
    </span>
  );
}