import React, { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  glowClass?: string;
}

const emptySubscribe = () => () => {};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  glowClass = "bg-linear-to-r from-pink-500 via-violet-500 to-blue-500",
}: ModalProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="z-[9999] fixed inset-0 flex justify-center items-center bg-black/75 backdrop-blur-sm px-4">
          {/* Backdrop Click */}
          <div className="absolute inset-0 cursor-default" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="z-10 relative w-full max-w-md md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-[#121212]/95 border border-neutral-800/80 shadow-2xl backdrop-blur-lg"
          >
            {/* Glow Header */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] z-20 ${glowClass}`} />

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800/40 shrink-0">
              <div className="font-bold text-white text-lg flex items-center gap-2">
                {title}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
              >
                <IoMdClose className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
