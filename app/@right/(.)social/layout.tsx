'use client';

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = pathname === '/social';
  const isHome = pathname === '/';

  if (!isOpen && !isHome) {
    return null;
  }

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push("/", { scroll: false })}
            className="lg:hidden z-40 fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="z-50 lg:static fixed inset-0 flex justify-center items-center lg:items-start">
            <motion.div
              key="modal"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: -100,
                transition: {
                  duration: 0.15,
                  ease: "easeIn",
                },
              }}
              transition={{
                x: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
                opacity: { duration: 0.2 },
              }}
              className="lg:top-0 lg:sticky flex flex-col bg-[#090909] shadow-lg lg:shadow-none rounded-2xl lg:rounded-none w-[90%] lg:min-w-lg max-w-md lg:max-w-lg h-[90vh] lg:h-svh"
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
