'use client'

import { Hanken_Grotesk } from "next/font/google";
import { useEffect } from "react";
import BrandBackground from "./BrandBackground";
import EasterEggs from "../utils/EasterEggs";
import CustomCursor from "../utils/CustomCursor";

const hanken_grotesk = Hanken_Grotesk({ subsets: ['latin'] })

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    fetch("/api/visitor");
  }, []);
  return (
    <html>
      <body className={hanken_grotesk.className + ' bg-[#101010] relative min-h-screen'}>
        <BrandBackground />
        <EasterEggs />
        <CustomCursor />
        <div className="flex justify-center w-full min-h-screen text-white">
          {children}
        </div>
        {/* <SecondaryContent /> */}
      </body>
    </html>
  );
}

