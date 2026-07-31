'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiUsers,
  FiGlobe,
  FiAward,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";
import WorldMap, { CountryStatItem } from "@/components/visitor/WorldMap";
import VisitorLeaderboard, { CityStatItem } from "@/components/visitor/VisitorLeaderboard";
import { Counter } from "@/components/utils/Counter";

export default function VisitorPage() {
  const [data, setData] = useState<{
    totalVisitors: number;
    totalCountries: number;
    topCountry: string | null;
    countryStats: CountryStatItem[];
    cityStats: CityStatItem[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/visitor/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
      setError("Failed to load visitor statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const topCountryItem = data?.countryStats?.find(
    (c) => c.country === data.topCountry
  ) || data?.countryStats?.[0];

  const globalCoveragePercent = data
    ? parseFloat(((data.totalCountries / 195) * 100).toFixed(1))
    : 0;

  return (
    <div className="relative flex flex-col w-full max-w-6xl mx-auto my-6 sm:my-10 px-4 sm:px-6 text-neutral-100 min-h-screen">
      {/* Background ambient glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation & Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-800 transition shadow-lg"
          >
            <FiArrowLeft className="text-lg" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text bg-linear-to-r from-white via-neutral-200 to-neutral-400 text-transparent tracking-tight">
              Visitor Map & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Interactive world map and country leaderboard distribution
            </p>
          </div>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition shadow-lg disabled:opacity-50"
        >
          <FiRefreshCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </motion.div>

      {/* KPI Stats Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
      >
        {/* Card 1: Total Visitors */}
        <div className="relative overflow-hidden bg-neutral-900/70 border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="absolute inset-0 bg-linear-to-r from-pink-500/10 to-violet-500/5" />
          <div className="relative z-10">
            <div className="flex justify-between items-center text-neutral-400 mb-2">
              <span className="text-xs font-semibold">Total Visitors</span>
              <FiUsers className="text-pink-400 text-base" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <Counter value={data?.totalVisitors || 0} />
              )}
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Unique IP visits tracked</p>
          </div>
        </div>

        {/* Card 2: Countries Count */}
        <div className="relative overflow-hidden bg-neutral-900/70 border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="absolute inset-0 bg-linear-to-r from-violet-500/10 to-cyan-500/5" />
          <div className="relative z-10">
            <div className="flex justify-between items-center text-neutral-400 mb-2">
              <span className="text-xs font-semibold">Countries</span>
              <FiGlobe className="text-violet-400 text-base" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <Counter value={data?.totalCountries || 0} />
              )}
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Nations represented</p>
          </div>
        </div>

        {/* Card 3: Top Country */}
        <div className="relative overflow-hidden bg-neutral-900/70 border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 to-pink-500/5" />
          <div className="relative z-10">
            <div className="flex justify-between items-center text-neutral-400 mb-2">
              <span className="text-xs font-semibold">Top Origin</span>
              <FiAward className="text-amber-400 text-base" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              {topCountryItem ? (
                <>
                  <span className="text-2xl">{topCountryItem.flag}</span>
                  <div className="min-w-0">
                    <p className="text-base sm:text-lg font-bold text-white truncate">
                      {topCountryItem.country}
                    </p>
                    <p className="text-[11px] text-amber-400 font-medium">
                      {topCountryItem.count} visitors ({topCountryItem.percentage}%)
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-500">None yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Global Coverage */}
        <div className="relative overflow-hidden bg-neutral-900/70 border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-blue-500/5" />
          <div className="relative z-10">
            <div className="flex justify-between items-center text-neutral-400 mb-2">
              <span className="text-xs font-semibold">Global Reach</span>
              <FiTrendingUp className="text-cyan-400 text-base" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {loading ? "..." : `${globalCoveragePercent}%`}
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Of 195 UN countries</p>
          </div>
        </div>
      </motion.div>

      {/* Main Map + Leaderboard Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1"
      >
        {/* World Map Component (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <WorldMap
            countryStats={data?.countryStats || []}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </div>

        {/* Country Leaderboard Component (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <VisitorLeaderboard
            countryStats={data?.countryStats || []}
            cityStats={data?.cityStats || []}
            totalVisitors={data?.totalVisitors || 0}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </div>
      </motion.div>
    </div>
  );
}
