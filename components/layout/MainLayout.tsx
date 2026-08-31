'use client'

import { Hanken_Grotesk } from "next/font/google";
import { useEffect } from "react";
import { IconContext } from "react-icons";
import dynamic from "next/dynamic";

const BrandBackground = dynamic(() => import("./BrandBackground"), { ssr: false });
const EasterEggs = dynamic(() => import("../utils/EasterEggs"), { ssr: false });

const hanken_grotesk = Hanken_Grotesk({ subsets: ['latin'] });

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    fetch("/api/visitor");
  }, []);
  return (
    <html lang="en">
      <body className={hanken_grotesk.className + ' bg-[#101010] relative min-h-screen'}>
        <IconContext.Provider value={{ attr: { "aria-hidden": "true", "aria-label": "icon" } }}>
          <BrandBackground />
          <EasterEggs />
          <div className="flex justify-center w-full min-h-screen text-white">
            {children}
          </div>
        </IconContext.Provider>
        {/* <SecondaryContent /> */}
      </body>
    </html>
  );
}

