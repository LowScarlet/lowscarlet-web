'use client'

import { useState } from "react";
import { FaLock, FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginForm({
  isStandalone = false,
}: {
  isStandalone?: boolean;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setLoginError(data.message || "Invalid password");
      }
    } catch (e) {
      console.error(e);
      setLoginError("Failed to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full justify-between">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-800/40 shrink-0">
        <h1 className="flex items-center space-x-2 font-bold text-white text-lg">
          <FaLock className="text-violet-500 animate-pulse" />
          <span>Admin Authentication</span>
        </h1>

        {!isStandalone && (
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
            title="Close"
          >
            <IoMdClose className="text-2xl" />
          </button>
        )}
      </div>

      {/* Form Body */}
      <div className="p-8 flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex p-4 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-2xl mb-2">
              <FaLock />
            </div>
            <p className="text-sm text-gray-400">
              Please enter the admin password to access dashboard privileges and modify settings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Enter Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-gray-600 text-sm"
              />
            </div>

            {loginError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg"
              >
                {loginError}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative bg-linear-to-r from-pink-500 to-violet-500 text-white font-bold py-2.5 rounded-lg hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 text-sm flex justify-center items-center cursor-pointer shadow-lg shadow-violet-500/20"
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin text-lg" />
              ) : (
                "Authenticate"
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-neutral-800/20 shrink-0 text-center">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-400 transition">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
}