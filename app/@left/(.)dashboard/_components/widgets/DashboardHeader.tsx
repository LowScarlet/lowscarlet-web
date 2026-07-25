'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { FaRegFolder, FaLock, FaLockOpen } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";

interface DashboardHeaderProps {
  isAdmin: boolean;
  onLogout: () => Promise<void>;
}

export default function DashboardHeader({
  isAdmin,
  onLogout,
}: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center p-6 shrink-0">
      <h1 className="flex items-center space-x-2">
        <FaRegFolder />
        <span>Dashboard</span>
      </h1>

      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => {
            if (isAdmin) {
              onLogout();
            } else {
              router.push("/auth", { scroll: false });
            }
          }}
          className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 flex items-center p-1"
          aria-label={isAdmin ? "Logout Admin" : "Login Admin"}
          title={isAdmin ? "Logout Admin" : "Login Admin"}
        >
          {isAdmin ? <FaLockOpen className="text-lg text-green-400" /> : <FaLock className="text-lg" />}
        </button>

        <button
          onClick={() => window.location.reload()}
          aria-label="Refresh page"
          className="cursor-pointer"
        >
          <LuExpand />
        </button>

        <Link scroll={false} href="/" aria-label="Close dashboard">
          <IoMdClose className="text-2xl" />
        </Link>
      </div>
    </div>
  );
}
