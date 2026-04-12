'use client'

import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (!pathname.includes('/projects')) {
    return null;
  }

  return (
    <>
      {/* Overlay (mobile & tablet < lg) */}
      <div className="lg:hidden z-40 fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Wrapper */}
      <div className="z-50 lg:static fixed inset-0 flex lg:flex justify-center items-center lg:items-start">

        <div
          className="lg:top-0 lg:sticky flex flex-col bg-[#090909] shadow-lg lg:shadow-none rounded-2xl lg:rounded-none w-[90%] lg:min-w-lg max-w-md lg:max-w-lg h-[90vh] lg:h-svh"
        >
          {children}
        </div>
      </div>
    </>
  );
}
