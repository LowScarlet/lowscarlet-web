'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { LuExpand } from "react-icons/lu";
import { FaUserCheck, FaSpinner } from "react-icons/fa";
import ProfileWebPage from "@/components/profile/ProfileWebPage";

export default function RightPanelProfile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cv")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile data");
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setData(json.data);
        } else {
          throw new Error(json.error || "Failed to fetch profile data");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to fetch profile data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="flex items-center space-x-2">
          <FaUserCheck />
          <span>Full Web Profile & Portfolio</span>
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            aria-label="Refresh page"
            className="cursor-pointer"
          >
            <LuExpand />
          </button>

          <Link scroll={false} href="/" aria-label="Close profile panel">
            <IoMdClose className="text-2xl" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-10 px-6 py-2 overflow-y-auto text-gray-400 grow">
        {loading ? (
          <div className="h-64 flex flex-col justify-center items-center gap-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
            <FaSpinner className="animate-spin text-pink-500 text-2xl" />
            <span className="text-xs text-gray-400 font-medium">Fetching Profile Data...</span>
          </div>
        ) : error ? (
          <div className="h-64 flex justify-center items-center text-xs text-red-400 bg-neutral-900/60 rounded-xl border border-neutral-800 p-4">
            {error}
          </div>
        ) : data ? (
          <ProfileWebPage data={data} />
        ) : null}
      </div>
    </>
  );
}
