'use client'

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOpen = pathname.includes("/auth");
  const isHome = pathname === "/";

  if (!isOpen && !isHome) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-80 bg-black/60 backdrop-blur-sm"
          />

          {/* Wrapper */}
          <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: 100,
                transition: {
                  duration: 0.15,
                  ease: "easeIn",
                },
              }}
              transition={{
                duration: 0.15,
                ease: "easeIn",
              }}
              className="flex h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-[#090909] shadow-lg"
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}