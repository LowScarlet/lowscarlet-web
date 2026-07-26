'use client';

import { motion, AnimatePresence } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

interface NameModalProps {
  isOpen: boolean;
  tempNameInput: string;
  onTempNameChange: (value: string) => void;
  onSubmit: (isGuest: boolean) => void;
  onClose: () => void;
}

export default function NameModal({
  isOpen,
  tempNameInput,
  onTempNameChange,
  onSubmit,
  onClose,
}: NameModalProps) {
  const isNameSet =
    typeof window !== "undefined" &&
    localStorage.getItem("visitor_name_set") === "true";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-xs bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-2xl relative"
          >
            {/* Close button - only show if name is already set */}
            {isNameSet && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-neutral-450 hover:text-white transition cursor-pointer"
              >
                <IoMdClose className="text-lg" />
              </button>
            )}

            <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto">
              <FiUser className="text-pink-400 text-lg" />
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-bold text-neutral-100">Set Display Name</h2>
              <p className="text-[10px] text-neutral-455 leading-relaxed px-1">
                Choose a name for your comments and likes, or select **Guest** to use your censored IP address.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your custom name..."
                value={tempNameInput}
                onChange={(e) => onTempNameChange(e.target.value)}
                maxLength={30}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tempNameInput.trim()) {
                    e.preventDefault();
                    onSubmit(false);
                  }
                }}
                className="w-full bg-neutral-950 border border-neutral-850 focus:border-violet-500 rounded-lg px-3 py-1.5 text-xs placeholder-neutral-500 focus:outline-hidden transition duration-200"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onSubmit(true)}
                  className="flex-1 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/20 text-neutral-300 text-[11px] font-semibold cursor-pointer transition duration-200"
                >
                  Guest
                </button>
                <button
                  type="button"
                  onClick={() => onSubmit(false)}
                  disabled={!tempNameInput.trim()}
                  className="flex-1 bg-linear-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 disabled:from-neutral-800 disabled:to-neutral-850 disabled:text-neutral-550 text-white text-[11px] font-semibold py-1.5 rounded-lg cursor-pointer transition duration-200 shadow-md shadow-violet-500/10"
                >
                  Save Name
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
