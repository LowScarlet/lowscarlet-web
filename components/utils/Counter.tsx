"use client";

import { formatNumber } from "@/libs/utils";
import { useSpring, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";

export function Counter({ value }: { value: number }) {
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 20,
  });

  const [display, setDisplay] = useState(0);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplay(Math.floor(latest));
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <>{formatNumber(display)}</>;
}